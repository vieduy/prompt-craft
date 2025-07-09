from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import asyncpg
import databutton as db
from app.auth import AuthorizedUser
import datetime
from app.libs.database import get_db_connection

router = APIRouter(prefix="/roadmaps")

# Database connection
async def get_db():
    return await get_db_connection()

# Pydantic Models
class Roadmap(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    target_audience: Optional[str] = None
    icon: Optional[str] = None
    estimated_duration_weeks: Optional[int] = None

class RoadmapItem(BaseModel):
    id: int
    roadmap_id: int
    item_type: str
    item_id: int
    order_index: int
    title: Optional[str] = None
    description: Optional[str] = None

class RoadmapDetail(Roadmap):
    items: List[RoadmapItem]

class UserRoadmapProgress(BaseModel):
    roadmap: Roadmap
    total_items: int
    completed_items: int
    current_item: Optional[RoadmapItem] = None

class UserRoadmap(BaseModel):
    id: int
    user_id: str
    roadmap_id: int
    status: str
    started_at: datetime.datetime
    completed_at: Optional[datetime.datetime] = None
    current_item_id: Optional[int] = None

# API Endpoints

@router.get("/", response_model=List[Roadmap])
async def get_all_roadmaps(conn: asyncpg.Connection = Depends(get_db)):
    """
    Retrieves a list of all available learning roadmaps.
    """
    try:
        rows = await conn.fetch("SELECT * FROM roadmaps ORDER BY id;")
        return [Roadmap(**row) for row in rows]
    finally:
        await conn.close()

@router.get("/my-roadmap", response_model=Optional[UserRoadmapProgress])
async def get_my_roadmap(user: AuthorizedUser, conn: asyncpg.Connection = Depends(get_db)):
    """
    Gets the active roadmap, progress, and current item for the authenticated user.
    """
    user_id = user.sub
    try:
        # Find the user's most recent active roadmap
        enrollment = await conn.fetchrow(
            "SELECT * FROM user_roadmaps WHERE user_id = $1 AND status = 'in_progress' ORDER BY started_at DESC LIMIT 1",
            user_id,
        )
        if not enrollment:
            return None

        # Get roadmap details
        roadmap_details = await conn.fetchrow("SELECT * FROM roadmaps WHERE id = $1", enrollment['roadmap_id'])

        # Get total and completed item counts
        counts = await conn.fetchrow(
            """
            SELECT
                COUNT(i.id) AS total_items,
                COUNT(p.id) AS completed_items
            FROM roadmap_items i
            LEFT JOIN user_roadmap_item_progress p ON i.id = p.roadmap_item_id AND p.user_roadmap_id = $2 AND p.is_completed = TRUE
            WHERE i.roadmap_id = $1
            """,
            enrollment['roadmap_id'],
            enrollment['id']
        )

        # Get current item details
        current_item = None
        if enrollment['current_item_id']:
            current_item_row = await conn.fetchrow("SELECT * FROM roadmap_items WHERE id = $1", enrollment['current_item_id'])
            if current_item_row:
                current_item = RoadmapItem(**current_item_row)

        return UserRoadmapProgress(
            roadmap=Roadmap(**roadmap_details),
            total_items=counts['total_items'],
            completed_items=counts['completed_items'],
            current_item=current_item,
        )
    finally:
        await conn.close()

@router.get("/{roadmap_id}", response_model=RoadmapDetail)
async def get_roadmap_details(roadmap_id: int, conn: asyncpg.Connection = Depends(get_db)):
    """
    Retrieves the details and items for a specific roadmap.
    """
    try:
        # Fetch roadmap details
        roadmap_row = await conn.fetchrow("SELECT * FROM roadmaps WHERE id = $1", roadmap_id)
        if not roadmap_row:
            raise HTTPException(status_code=404, detail="Roadmap not found")

        # Fetch roadmap items
        item_rows = await conn.fetch(
            "SELECT * FROM roadmap_items WHERE roadmap_id = $1 ORDER BY order_index",
            roadmap_id,
        )

        return RoadmapDetail(
            **roadmap_row,
            items=[RoadmapItem(**row) for row in item_rows]
        )
    finally:
        await conn.close()

@router.post("/{roadmap_id}/enroll")
async def enroll_in_roadmap(
    roadmap_id: int,
    user: AuthorizedUser,
    conn: asyncpg.Connection = Depends(get_db),
):
    """
    Enrolls the authenticated user in a specific roadmap.
    """
    user_id = user.sub
    try:
        async with conn.transaction():
            # Check if user is already enrolled
            existing_enrollment = await conn.fetchval(
                "SELECT id FROM user_roadmaps WHERE user_id = $1 AND roadmap_id = $2",
                user_id,
                roadmap_id,
            )
            if existing_enrollment:
                raise HTTPException(status_code=409, detail="User already enrolled in this roadmap.")

            # Find the first item in the roadmap
            first_item = await conn.fetchrow(
                "SELECT id FROM roadmap_items WHERE roadmap_id = $1 ORDER BY order_index ASC LIMIT 1",
                roadmap_id,
            )
            if not first_item:
                raise HTTPException(status_code=404, detail="Roadmap has no items to start.")

            # Create the enrollment record
            await conn.execute(
                """
                INSERT INTO user_roadmaps (user_id, roadmap_id, current_item_id)
                VALUES ($1, $2, $3)
                """,
                user_id,
                roadmap_id,
                first_item['id'],
            )
        return {"message": "Successfully enrolled in roadmap."}
    except asyncpg.exceptions.UniqueViolationError:
         raise HTTPException(status_code=409, detail="User already enrolled in this roadmap.")
    finally:
        await conn.close()


