from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import asyncpg
import databutton as db
import json
from app.auth import AuthorizedUser
from app.libs.database import get_db_connection

router = APIRouter(prefix="/lessons")

# Database connection
async def get_db():
    return await get_db_connection()

# Pydantic models
class Category(BaseModel):
    id: int
    name: str
    description: str
    icon: str
    color: str
    difficulty_level: str
    order_index: int
    lesson_count: Optional[int] = 0
    completed_lessons: Optional[int] = 0
    progress_percentage: Optional[float] = 0.0

class Lesson(BaseModel):
    id: int
    title: str
    description: str
    category_id: int
    difficulty_level: str
    estimated_duration: int
    preview_content: str
    learning_objectives: List[str]
    workplace_scenario: str
    order_index: int
    is_bookmarked: Optional[bool] = False
    progress_status: Optional[str] = "not_started"
    progress_percentage: Optional[int] = 0

class LessonProgress(BaseModel):
    lesson_id: int
    status: str
    progress_percentage: int

class Achievement(BaseModel):
    id: int
    name: str
    description: str
    icon: str
    reward_points: int
    is_earned: Optional[bool] = False
    earned_at: Optional[str] = None

class UserEngagement(BaseModel):
    lesson_id: int
    action: str
    metadata: Optional[Dict[str, Any]] = None

class UserStats(BaseModel):
    total_lessons_completed: int
    total_categories_explored: int
    current_streak: int
    total_points: int
    achievements_earned: int
    bookmarked_lessons: int

@router.get("/categories")
async def get_categories(user: AuthorizedUser) -> List[Category]:
    """Get all lesson categories with user progress"""
    conn = await get_db()
    try:
        # Get categories with lesson counts and user progress
        query = """
        SELECT 
            c.id, c.name, c.description, c.icon, c.color, 
            c.difficulty_level, c.order_index,
            COUNT(l.id) as lesson_count,
            COUNT(CASE WHEN up.status = 'completed' THEN 1 END) as completed_lessons
        FROM categories c
        LEFT JOIN lessons l ON c.id = l.category_id AND l.is_published = true
        LEFT JOIN user_progress up ON l.id = up.lesson_id AND up.user_id = $1
        GROUP BY c.id, c.name, c.description, c.icon, c.color, c.difficulty_level, c.order_index
        ORDER BY c.order_index
        """
        
        rows = await conn.fetch(query, user.sub)
        
        categories = []
        for row in rows:
            progress_percentage = 0.0
            if row['lesson_count'] > 0:
                progress_percentage = (row['completed_lessons'] / row['lesson_count']) * 100
            
            categories.append(Category(
                id=row['id'],
                name=row['name'],
                description=row['description'],
                icon=row['icon'],
                color=row['color'],
                difficulty_level=row['difficulty_level'],
                order_index=row['order_index'],
                lesson_count=row['lesson_count'],
                completed_lessons=row['completed_lessons'],
                progress_percentage=round(progress_percentage, 1)
            ))
        
        return categories
    finally:
        await conn.close()

@router.get("/categories/{category_id}/lessons")
async def get_lessons_by_category(category_id: int, user: AuthorizedUser) -> List[Lesson]:
    """Get lessons for a specific category with user progress"""
    conn = await get_db()
    try:
        query = """
        SELECT 
            l.id, l.title, l.description, l.category_id, l.difficulty_level,
            l.estimated_duration, l.preview_content, l.learning_objectives,
            l.workplace_scenario, l.order_index,
            COALESCE(up.status, 'not_started') as progress_status,
            COALESCE(up.progress_percentage, 0) as progress_percentage,
            CASE WHEN ub.id IS NOT NULL THEN true ELSE false END as is_bookmarked
        FROM lessons l
        LEFT JOIN user_progress up ON l.id = up.lesson_id AND up.user_id = $2
        LEFT JOIN user_bookmarks ub ON l.id = ub.lesson_id AND ub.user_id = $2
        WHERE l.category_id = $1 AND l.is_published = true
        ORDER BY l.order_index
        """
        
        rows = await conn.fetch(query, category_id, user.sub)
        
        lessons = []
        for row in rows:
            lessons.append(Lesson(
                id=row['id'],
                title=row['title'],
                description=row['description'],
                category_id=row['category_id'],
                difficulty_level=row['difficulty_level'],
                estimated_duration=row['estimated_duration'],
                preview_content=row['preview_content'],
                learning_objectives=row['learning_objectives'],
                workplace_scenario=row['workplace_scenario'],
                order_index=row['order_index'],
                is_bookmarked=row['is_bookmarked'],
                progress_status=row['progress_status'],
                progress_percentage=row['progress_percentage']
            ))
        
        return lessons
    finally:
        await conn.close()

@router.get("/recommendations")
async def get_personalized_recommendations(user: AuthorizedUser, limit: int = 6) -> List[Lesson]:
    """Get personalized lesson recommendations based on user progress and engagement"""
    conn = await get_db()
    try:
        # Algorithm: Recommend lessons from categories user has engaged with,
        # prioritizing next lessons in sequence and similar difficulty levels
        query = """
        WITH user_categories AS (
            SELECT DISTINCT l.category_id, COUNT(*) as engagement_count
            FROM user_engagement ue
            JOIN lessons l ON ue.lesson_id = l.id
            WHERE ue.user_id = $1
            GROUP BY l.category_id
        ),
        recommended_lessons AS (
            SELECT DISTINCT
                l.id, l.title, l.description, l.category_id, l.difficulty_level,
                l.estimated_duration, l.preview_content, l.learning_objectives,
                l.workplace_scenario, l.order_index,
                COALESCE(up.status, 'not_started') as progress_status,
                COALESCE(up.progress_percentage, 0) as progress_percentage,
                CASE WHEN ub.id IS NOT NULL THEN true ELSE false END as is_bookmarked,
                CASE 
                    WHEN uc.category_id IS NOT NULL THEN uc.engagement_count * 2
                    ELSE 1
                END as priority_score
            FROM lessons l
            LEFT JOIN user_categories uc ON l.category_id = uc.category_id
            LEFT JOIN user_progress up ON l.id = up.lesson_id AND up.user_id = $1
            LEFT JOIN user_bookmarks ub ON l.id = ub.lesson_id AND ub.user_id = $1
            WHERE l.is_published = true 
            AND (up.status IS NULL OR up.status = 'not_started')
            ORDER BY priority_score DESC, l.order_index
            LIMIT $2
        )
        SELECT * FROM recommended_lessons
        """
        
        rows = await conn.fetch(query, user.sub, limit)
        
        recommendations = []
        for row in rows:
            recommendations.append(Lesson(
                id=row['id'],
                title=row['title'],
                description=row['description'],
                category_id=row['category_id'],
                difficulty_level=row['difficulty_level'],
                estimated_duration=row['estimated_duration'],
                preview_content=row['preview_content'],
                learning_objectives=row['learning_objectives'],
                workplace_scenario=row['workplace_scenario'],
                order_index=row['order_index'],
                is_bookmarked=row['is_bookmarked'],
                progress_status=row['progress_status'],
                progress_percentage=row['progress_percentage']
            ))
        
        return recommendations
    finally:
        await conn.close()

@router.get("/achievements")
async def get_user_achievements(user: AuthorizedUser) -> List[Achievement]:
    """Get all achievements with user's earned status"""
    conn = await get_db()
    try:
        query = """
        SELECT 
            a.id, a.name, a.description, a.icon, a.reward_points,
            CASE WHEN ua.id IS NOT NULL THEN true ELSE false END as is_earned,
            ua.earned_at
        FROM achievements a
        LEFT JOIN user_achievements ua ON a.id = ua.achievement_id AND ua.user_id = $1
        ORDER BY a.id
        """
        
        rows = await conn.fetch(query, user.sub)
        
        achievements = []
        for row in rows:
            achievements.append(Achievement(
                id=row['id'],
                name=row['name'],
                description=row['description'],
                icon=row['icon'],
                reward_points=row['reward_points'],
                is_earned=row['is_earned'],
                earned_at=str(row['earned_at']) if row['earned_at'] else None
            ))
        
        return achievements
    finally:
        await conn.close()

@router.get("/stats")
async def get_user_stats(user: AuthorizedUser) -> UserStats:
    """Get user learning statistics"""
    conn = await get_db()
    try:
        # Get comprehensive user statistics
        stats_query = """
        WITH user_stats AS (
            SELECT 
                COUNT(CASE WHEN up.status = 'completed' THEN 1 END) as completed_lessons,
                COUNT(DISTINCT l.category_id) FILTER (WHERE up.status = 'completed') as categories_explored,
                COUNT(ub.id) as bookmarked_lessons
            FROM user_progress up
            RIGHT JOIN lessons l ON up.lesson_id = l.id
            LEFT JOIN user_bookmarks ub ON ub.user_id = up.user_id
            WHERE up.user_id = $1 OR up.user_id IS NULL
        ),
        achievement_stats AS (
            SELECT 
                COUNT(*) as achievements_earned,
                COALESCE(SUM(a.reward_points), 0) as total_points
            FROM user_achievements ua
            JOIN achievements a ON ua.achievement_id = a.id
            WHERE ua.user_id = $1
        )
        SELECT 
            COALESCE(us.completed_lessons, 0) as total_lessons_completed,
            COALESCE(us.categories_explored, 0) as total_categories_explored,
            COALESCE(us.bookmarked_lessons, 0) as bookmarked_lessons,
            COALESCE(ach.achievements_earned, 0) as achievements_earned,
            COALESCE(ach.total_points, 0) as total_points
        FROM user_stats us
        CROSS JOIN achievement_stats ach
        """
        
        row = await conn.fetchrow(stats_query, user.sub)
        
        # Calculate current streak (simplified - days with any lesson activity)
        streak_query = """
        SELECT COUNT(*) as streak
        FROM (
            SELECT DISTINCT DATE(created_at) as activity_date
            FROM user_engagement
            WHERE user_id = $1 
            AND created_at >= CURRENT_DATE - INTERVAL '30 days'
            ORDER BY activity_date DESC
        ) daily_activity
        """
        
        streak_row = await conn.fetchrow(streak_query, user.sub)
        current_streak = streak_row['streak'] if streak_row else 0
        
        return UserStats(
            total_lessons_completed=row['total_lessons_completed'],
            total_categories_explored=row['total_categories_explored'],
            current_streak=current_streak,
            total_points=row['total_points'],
            achievements_earned=row['achievements_earned'],
            bookmarked_lessons=row['bookmarked_lessons']
        )
    finally:
        await conn.close()

@router.post("/engagement")
async def track_engagement(engagement: UserEngagement, user: AuthorizedUser):
    """Track user engagement with lessons"""
    conn = await get_db()
    try:
        # Insert engagement record
        await conn.execute(
            """
            INSERT INTO user_engagement (user_id, lesson_id, action, metadata)
            VALUES ($1, $2, $3, $4)
            """,
            user.sub, engagement.lesson_id, engagement.action, engagement.metadata
        )
        
        # Check for new achievements
        await check_and_award_achievements(conn, user.sub)
        
        return {"success": True, "message": "Engagement tracked successfully"}
    finally:
        await conn.close()

@router.post("/progress")
async def update_lesson_progress(progress: LessonProgress, user: AuthorizedUser):
    """Update user's lesson progress"""
    conn = await get_db()
    try:
        # Upsert progress record
        await conn.execute(
            """
            INSERT INTO user_progress (user_id, lesson_id, status, progress_percentage, started_at, completed_at, last_accessed_at)
            VALUES ($1, $2, $3::text, $4, 
                CASE WHEN $3::text != 'not_started' THEN CURRENT_TIMESTAMP ELSE NULL END,
                CASE WHEN $3::text = 'completed' THEN CURRENT_TIMESTAMP ELSE NULL END,
                CURRENT_TIMESTAMP
            )
            ON CONFLICT (user_id, lesson_id)
            DO UPDATE SET
                status = $3::text,
                progress_percentage = $4,
                started_at = CASE 
                    WHEN user_progress.started_at IS NULL AND $3::text != 'not_started' 
                    THEN CURRENT_TIMESTAMP 
                    ELSE user_progress.started_at 
                END,
                completed_at = CASE 
                    WHEN $3::text = 'completed' AND user_progress.completed_at IS NULL 
                    THEN CURRENT_TIMESTAMP 
                    ELSE user_progress.completed_at 
                END,
                last_accessed_at = CURRENT_TIMESTAMP,
                updated_at = CURRENT_TIMESTAMP
            """,
            user.sub, progress.lesson_id, progress.status, progress.progress_percentage
        )
        
        # Track engagement
        await conn.execute(
            """
            INSERT INTO user_engagement (user_id, lesson_id, action, metadata)
            VALUES ($1, $2, $3, $4)
            """,
            user.sub, progress.lesson_id, 
            'complete' if progress.status == 'completed' else 'progress',
            json.dumps({"progress_percentage": progress.progress_percentage})
        )
        
        # Check for new achievements
        await check_and_award_achievements(conn, user.sub)
        
        return {"success": True, "message": "Progress updated successfully"}
    finally:
        await conn.close()

@router.post("/bookmark/{lesson_id}")
async def toggle_bookmark(lesson_id: int, user: AuthorizedUser):
    """Toggle bookmark status for a lesson"""
    conn = await get_db()
    try:
        # Check if bookmark exists
        existing = await conn.fetchrow(
            "SELECT id FROM user_bookmarks WHERE user_id = $1 AND lesson_id = $2",
            user.sub, lesson_id
        )
        
        if existing:
            # Remove bookmark
            await conn.execute(
                "DELETE FROM user_bookmarks WHERE user_id = $1 AND lesson_id = $2",
                user.sub, lesson_id
            )
            action = "unbookmark"
            is_bookmarked = False
        else:
            # Add bookmark
            await conn.execute(
                "INSERT INTO user_bookmarks (user_id, lesson_id) VALUES ($1, $2)",
                user.sub, lesson_id
            )
            action = "bookmark"
            is_bookmarked = True
        
        # Track engagement
        await conn.execute(
            """
            INSERT INTO user_engagement (user_id, lesson_id, action)
            VALUES ($1, $2, $3)
            """,
            user.sub, lesson_id, action
        )
        
        # Check for new achievements
        await check_and_award_achievements(conn, user.sub)
        
        return {
            "success": True, 
            "is_bookmarked": is_bookmarked,
            "message": f"Lesson {'bookmarked' if is_bookmarked else 'unbookmarked'} successfully"
        }
    finally:
        await conn.close()

async def check_and_award_achievements(conn, user_id: str):
    """Check and award achievements based on user activity"""
    # Get user stats for achievement checking
    stats = await conn.fetchrow(
        """
        SELECT 
            COUNT(CASE WHEN up.status = 'completed' THEN 1 END) as completed_lessons,
            COUNT(DISTINCT l.category_id) FILTER (WHERE up.status = 'completed') as categories_explored,
            COUNT(DISTINCT ue.lesson_id) FILTER (WHERE ue.action = 'preview') as previews,
            COUNT(ub.id) as bookmarks
        FROM user_progress up
        RIGHT JOIN lessons l ON up.lesson_id = l.id
        LEFT JOIN user_engagement ue ON ue.user_id = up.user_id
        LEFT JOIN user_bookmarks ub ON ub.user_id = up.user_id
        WHERE up.user_id = $1 OR up.user_id IS NULL
        """,
        user_id
    )
    
    # Check each achievement criteria
    achievement_checks = [
        (1, stats['completed_lessons'] >= 1),  # First Steps
        (3, stats['completed_lessons'] >= 5),  # Quick Learner (simplified)
        (5, stats['previews'] >= 10),  # Preview Master
        (6, stats['bookmarks'] >= 15),  # Bookworm
        (7, stats['completed_lessons'] >= 10),  # AI Apprentice
        (8, stats['categories_explored'] >= 5),  # AI Master
    ]
    
    for achievement_id, criteria_met in achievement_checks:
        if criteria_met:
            # Check if user already has this achievement
            existing = await conn.fetchrow(
                "SELECT id FROM user_achievements WHERE user_id = $1 AND achievement_id = $2",
                user_id, achievement_id
            )
            
            if not existing:
                # Award achievement
                await conn.execute(
                    "INSERT INTO user_achievements (user_id, achievement_id) VALUES ($1, $2)",
                    user_id, achievement_id
                )

