from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import asyncpg
import databutton as db
from app.auth import AuthorizedUser
from app.libs.database import get_db_connection
import datetime
import json

router = APIRouter(prefix="/practice")

# Database connection
async def get_db():
    return await get_db_connection()

# Pydantic models
class UserChallengeStats(BaseModel):
    average_score: float
    best_score: int
    attempts: int
    recent_sessions: List["PracticeSession"]

class PracticeSession(BaseModel):
    id: int
    challenge_id: int
    user_prompt: str
    ai_response: Optional[str] = None
    total_score: int
    max_score: int
    scoring_details: Dict[str, Any] = {}
    submitted_at: str

@router.get("/analytics/challenge/{challenge_id}")
async def get_user_challenge_analytics(challenge_id: int, user: AuthorizedUser) -> UserChallengeStats:
    """Get user's analytics for a specific challenge"""
    conn = await get_db()
    try:
        # Get aggregate stats
        stats_query = """
        SELECT
            AVG(total_score) as average_score,
            MAX(total_score) as best_score,
            COUNT(id) as attempts
        FROM practice_sessions
        WHERE user_id = $1 AND challenge_id = $2
        """
        stats_row = await conn.fetchrow(stats_query, user.sub, challenge_id)

        if not stats_row or stats_row['attempts'] == 0:
            return UserChallengeStats(average_score=0, best_score=0, attempts=0, recent_sessions=[])

        # Get recent sessions
        sessions_query = """
        SELECT ps.*, pc.max_score
        FROM practice_sessions ps
        JOIN practice_challenges pc ON ps.challenge_id = pc.id
        WHERE ps.user_id = $1 AND ps.challenge_id = $2
        ORDER BY ps.created_at DESC
        LIMIT 5
        """
        sessions_rows = await conn.fetch(sessions_query, user.sub, challenge_id)
        recent_sessions = [
            PracticeSession(
                id=row['id'],
                challenge_id=row['challenge_id'],
                user_prompt=row['user_prompt'],
                ai_response=row['ai_response'],
                total_score=row['total_score'],
                max_score=row['max_score'],
                scoring_details=json.loads(row['scoring_details']) if row['scoring_details'] else {},
                submitted_at=row['created_at'].isoformat()
            ) for row in sessions_rows
        ]

        return UserChallengeStats(
            average_score=round(stats_row['average_score'], 2),
            best_score=stats_row['best_score'],
            attempts=stats_row['attempts'],
            recent_sessions=recent_sessions
        )
    finally:
        await conn.close()


