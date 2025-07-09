from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import asyncpg
import databutton as db
import json
from datetime import datetime, timedelta
from app.auth import AuthorizedUser
from app.libs.database import get_db_connection

router = APIRouter(prefix="/dashboard")

# Database connection
async def get_db():
    return await get_db_connection()

# Pydantic models
class DashboardStats(BaseModel):
    lessons_completed: int
    lessons_in_progress: int
    total_lessons: int
    categories_explored: int
    total_categories: int
    practice_sessions: int
    average_practice_score: float
    achievements_earned: int
    total_achievements: int
    current_learning_streak: int
    total_study_time_minutes: int
    bookmarked_lessons: int

class RecentActivity(BaseModel):
    id: int
    activity_type: str  # 'lesson_completed', 'practice_session', 'achievement_earned', 'lesson_started'
    title: str
    description: str
    timestamp: str
    metadata: Optional[Dict[str, Any]] = None

class QuickAction(BaseModel):
    action_type: str  # 'continue_lesson', 'start_next', 'practice_challenge', 'review_bookmark'
    title: str
    description: str
    target_url: str
    progress_percentage: Optional[int] = None
    estimated_time: Optional[int] = None

class Achievement(BaseModel):
    id: int
    name: str
    description: str
    icon: str
    reward_points: int
    is_earned: bool
    earned_at: Optional[str] = None
    progress_current: Optional[int] = None
    progress_target: Optional[int] = None

class RecommendedLesson(BaseModel):
    id: int
    title: str
    description: str
    category_name: str
    difficulty_level: str
    estimated_duration: int
    reason: str  # Why it's recommended
    learning_objectives: List[str]
    progress_status: str

class ProgressOverview(BaseModel):
    category_id: int
    category_name: str
    category_color: str
    category_icon: str
    total_lessons: int
    completed_lessons: int
    in_progress_lessons: int
    progress_percentage: float
    next_lesson_id: Optional[int] = None
    next_lesson_title: Optional[str] = None

class LearningStreak(BaseModel):
    current_streak: int
    longest_streak: int
    streak_goal: int
    last_activity_date: Optional[str] = None
    is_today_completed: bool
    days_this_week: List[bool]  # [Mon, Tue, Wed, Thu, Fri, Sat, Sun]

class DashboardData(BaseModel):
    stats: DashboardStats
    recent_activity: List[RecentActivity]
    quick_actions: List[QuickAction]
    achievements: List[Achievement]
    recommended_lessons: List[RecommendedLesson]
    progress_overview: List[ProgressOverview]
    learning_streak: LearningStreak

@router.get("/")
async def get_dashboard_data(user: AuthorizedUser) -> DashboardData:
    """Get comprehensive dashboard data for the user"""
    conn = await get_db()
    try:
        # Get basic stats
        stats = await get_user_stats(conn, user.sub)
        
        # Get recent activity
        recent_activity = await get_recent_activity(conn, user.sub)
        
        # Get quick actions
        quick_actions = await get_quick_actions(conn, user.sub)
        
        # Get achievements
        achievements = await get_user_achievements(conn, user.sub)
        
        # Get recommended lessons
        recommended_lessons = await get_recommended_lessons(conn, user.sub)
        
        # Get progress overview by category
        progress_overview = await get_progress_overview(conn, user.sub)
        
        # Get learning streak
        learning_streak = await get_learning_streak(conn, user.sub)
        
        return DashboardData(
            stats=stats,
            recent_activity=recent_activity,
            quick_actions=quick_actions,
            achievements=achievements,
            recommended_lessons=recommended_lessons,
            progress_overview=progress_overview,
            learning_streak=learning_streak
        )
    finally:
        await conn.close()

async def get_user_stats(conn, user_id: str) -> DashboardStats:
    """Get user statistics"""
    # Lesson stats
    lesson_stats = await conn.fetchrow(
        """
        SELECT 
            COUNT(CASE WHEN up.status = 'completed' THEN 1 END) as completed,
            COUNT(CASE WHEN up.status = 'in_progress' THEN 1 END) as in_progress,
            (SELECT COUNT(*) FROM lessons WHERE is_published = true) as total_lessons,
            COUNT(DISTINCT l.category_id) as categories_explored,
            (SELECT COUNT(*) FROM categories) as total_categories
        FROM user_progress up
        RIGHT JOIN lessons l ON up.lesson_id = l.id AND up.user_id = $1
        WHERE l.is_published = true
        """,
        user_id
    )
    
    # Practice stats
    practice_stats = await conn.fetchrow(
        "SELECT * FROM practice_stats WHERE user_id = $1",
        user_id
    )
    
    # Achievement stats
    achievement_stats = await conn.fetchrow(
        """
        SELECT 
            COUNT(ua.id) as earned,
            (SELECT COUNT(*) FROM achievements) as total
        FROM user_achievements ua
        WHERE ua.user_id = $1
        """,
        user_id
    )
    
    # Bookmark stats
    bookmark_count = await conn.fetchval(
        "SELECT COUNT(*) FROM user_bookmarks WHERE user_id = $1",
        user_id
    )
    
    return DashboardStats(
        lessons_completed=lesson_stats['completed'] or 0,
        lessons_in_progress=lesson_stats['in_progress'] or 0,
        total_lessons=lesson_stats['total_lessons'] or 0,
        categories_explored=lesson_stats['categories_explored'] or 0,
        total_categories=lesson_stats['total_categories'] or 0,
        practice_sessions=practice_stats['total_sessions'] if practice_stats else 0,
        average_practice_score=float(practice_stats['average_score']) if practice_stats else 0.0,
        achievements_earned=achievement_stats['earned'] or 0,
        total_achievements=achievement_stats['total'] or 0,
        current_learning_streak=practice_stats['current_streak_days'] if practice_stats else 0,
        total_study_time_minutes=(practice_stats['total_practice_time_minutes'] if practice_stats else 0) + 
                                (lesson_stats['completed'] or 0) * 15,  # Estimate 15 min per lesson
        bookmarked_lessons=bookmark_count or 0
    )

async def get_recent_activity(conn, user_id: str) -> List[RecentActivity]:
    """Get user's recent activity"""
    activities = []
    
    # Recent lesson completions
    lesson_completions = await conn.fetch(
        """
        SELECT up.completed_at, l.title, l.id
        FROM user_progress up
        JOIN lessons l ON up.lesson_id = l.id
        WHERE up.user_id = $1 AND up.status = 'completed' AND up.completed_at IS NOT NULL
        ORDER BY up.completed_at DESC
        LIMIT 5
        """,
        user_id
    )
    
    for completion in lesson_completions:
        activities.append(RecentActivity(
            id=len(activities),
            activity_type='lesson_completed',
            title=f"Completed: {completion['title']}",
            description="Great job finishing this lesson!",
            timestamp=completion['completed_at'].isoformat(),
            metadata={'lesson_id': completion['id']}
        ))
    
    # Recent practice sessions
    practice_sessions = await conn.fetch(
        """
        SELECT ps.created_at, ps.total_score, pc.title, pc.max_score, ps.challenge_id
        FROM practice_sessions ps
        JOIN practice_challenges pc ON ps.challenge_id = pc.id
        WHERE ps.user_id = $1
        ORDER BY ps.created_at DESC
        LIMIT 3
        """,
        user_id
    )
    
    for session in practice_sessions:
        score_pct = (session['total_score'] / session['max_score']) * 100 if session['max_score'] > 0 else 0
        activities.append(RecentActivity(
            id=len(activities),
            activity_type='practice_session',
            title=f"Practice: {session['title']}",
            description=f"Scored {session['total_score']}/{session['max_score']} ({score_pct:.0f}%)",
            timestamp=session['created_at'].isoformat(),
            metadata={'challenge_id': session['challenge_id'], 'score': session['total_score']}
        ))
    
    # Recent achievements
    recent_achievements = await conn.fetch(
        """
        SELECT ua.earned_at, a.name, a.description, a.icon
        FROM user_achievements ua
        JOIN achievements a ON ua.achievement_id = a.id
        WHERE ua.user_id = $1
        ORDER BY ua.earned_at DESC
        LIMIT 3
        """,
        user_id
    )
    
    for achievement in recent_achievements:
        activities.append(RecentActivity(
            id=len(activities),
            activity_type='achievement_earned',
            title=f"🏆 {achievement['name']}",
            description=achievement['description'],
            timestamp=achievement['earned_at'].isoformat(),
            metadata={'icon': achievement['icon']}
        ))
    
    # Sort all activities by timestamp
    activities.sort(key=lambda x: x.timestamp, reverse=True)
    return activities[:10]

async def get_quick_actions(conn, user_id: str) -> List[QuickAction]:
    """Get suggested quick actions for the user"""
    actions = []
    
    # Continue in-progress lesson
    in_progress = await conn.fetchrow(
        """
        SELECT l.id, l.title, up.progress_percentage, l.estimated_duration
        FROM user_progress up
        JOIN lessons l ON up.lesson_id = l.id
        WHERE up.user_id = $1 AND up.status = 'in_progress'
        ORDER BY up.last_accessed_at DESC
        LIMIT 1
        """,
        user_id
    )
    
    if in_progress:
        actions.append(QuickAction(
            action_type='continue_lesson',
            title=f"Continue: {in_progress['title']}",
            description=f"{in_progress['progress_percentage']}% complete",
            target_url=f"/lesson/{in_progress['id']}",
            progress_percentage=in_progress['progress_percentage'],
            estimated_time=in_progress['estimated_duration']
        ))
    
    # Start next recommended lesson
    next_lesson = await conn.fetchrow(
        """
        SELECT l.id, l.title, l.estimated_duration, c.name as category_name
        FROM lessons l
        JOIN categories c ON l.category_id = c.id
        LEFT JOIN user_progress up ON l.id = up.lesson_id AND up.user_id = $1
        WHERE l.is_published = true AND (up.status IS NULL OR up.status = 'not_started')
        ORDER BY c.order_index, l.order_index
        LIMIT 1
        """,
        user_id
    )
    
    if next_lesson:
        actions.append(QuickAction(
            action_type='start_next',
            title=f"Start: {next_lesson['title']}",
            description=f"Next lesson in {next_lesson['category_name']}",
            target_url=f"/lesson/{next_lesson['id']}",
            estimated_time=next_lesson['estimated_duration']
        ))
    
    # Practice challenge
    actions.append(QuickAction(
        action_type='practice_challenge',
        title="Practice Prompting",
        description="Test your skills in the practice playground",
        target_url="/practice-playground",
        estimated_time=15
    ))
    
    # Review bookmarks
    bookmark_count = await conn.fetchval(
        "SELECT COUNT(*) FROM user_bookmarks WHERE user_id = $1",
        user_id
    )
    
    if bookmark_count > 0:
        actions.append(QuickAction(
            action_type='review_bookmark',
            title="Review Bookmarks",
            description=f"{bookmark_count} saved lesson{'s' if bookmark_count != 1 else ''}",
            target_url="/lessons?filter=bookmarked"
        ))
    
    return actions

async def get_user_achievements(conn, user_id: str) -> List[Achievement]:
    """Get user achievements with progress"""
    achievements = await conn.fetch(
        """
        SELECT 
            a.id, a.name, a.description, a.icon, a.reward_points, a.criteria,
            ua.earned_at
        FROM achievements a
        LEFT JOIN user_achievements ua ON a.id = ua.achievement_id AND ua.user_id = $1
        ORDER BY 
            CASE WHEN ua.earned_at IS NOT NULL THEN 0 ELSE 1 END,
            ua.earned_at DESC,
            a.id
        """,
        user_id
    )
    
    result = []
    for achievement in achievements:
        # Calculate progress for unearned achievements
        progress_current = None
        progress_target = None
        
        if not achievement['earned_at'] and achievement['criteria']:
            criteria = achievement['criteria']
            # Parse JSON string if needed
            if isinstance(criteria, str):
                criteria = json.loads(criteria)
            
            if criteria.get('type') == 'lessons_completed':
                target = criteria.get('count', criteria.get('target', 1))  # Handle both count and target
                current = await conn.fetchval(
                    "SELECT COUNT(*) FROM user_progress WHERE user_id = $1 AND status = 'completed'",
                    user_id
                ) or 0
                progress_current = current
                progress_target = target
            elif criteria.get('type') == 'practice_sessions':
                target = criteria.get('count', criteria.get('target', 1))
                current = await conn.fetchval(
                    "SELECT total_sessions FROM practice_stats WHERE user_id = $1",
                    user_id
                ) or 0
                progress_current = current
                progress_target = target
        
        result.append(Achievement(
            id=achievement['id'],
            name=achievement['name'],
            description=achievement['description'],
            icon=achievement['icon'],
            reward_points=achievement['reward_points'],
            is_earned=achievement['earned_at'] is not None,
            earned_at=achievement['earned_at'].isoformat() if achievement['earned_at'] else None,
            progress_current=progress_current,
            progress_target=progress_target
        ))
    
    return result

async def get_recommended_lessons(conn, user_id: str) -> List[RecommendedLesson]:
    """Get personalized lesson recommendations"""
    recommendations = []
    
    # Recommend next lessons in current/next categories
    next_lessons = await conn.fetch(
        """
        SELECT 
            l.id, l.title, l.description, l.estimated_duration, l.learning_objectives,
            c.name as category_name, l.difficulty_level,
            COALESCE(up.status, 'not_started') as progress_status
        FROM lessons l
        JOIN categories c ON l.category_id = c.id
        LEFT JOIN user_progress up ON l.id = up.lesson_id AND up.user_id = $1
        WHERE l.is_published = true 
            AND (up.status IS NULL OR up.status IN ('not_started', 'in_progress'))
        ORDER BY c.order_index, l.order_index
        LIMIT 5
        """,
        user_id
    )
    
    for lesson in next_lessons:
        reason = "Continue your learning journey"
        if lesson['progress_status'] == 'in_progress':
            reason = "Pick up where you left off"
        elif lesson['difficulty_level'] == 'beginner':
            reason = "Perfect for building fundamentals"
        elif lesson['difficulty_level'] == 'intermediate':
            reason = "Ready for the next challenge"
        elif lesson['difficulty_level'] == 'advanced':
            reason = "Master advanced concepts"
        
        recommendations.append(RecommendedLesson(
            id=lesson['id'],
            title=lesson['title'],
            description=lesson['description'],
            category_name=lesson['category_name'],
            difficulty_level=lesson['difficulty_level'],
            estimated_duration=lesson['estimated_duration'],
            reason=reason,
            learning_objectives=lesson['learning_objectives'] or [],
            progress_status=lesson['progress_status']
        ))
    
    return recommendations

async def get_progress_overview(conn, user_id: str) -> List[ProgressOverview]:
    """Get progress overview by category"""
    categories = await conn.fetch(
        """
        SELECT 
            c.id, c.name, c.color, c.icon,
            COUNT(l.id) as total_lessons,
            COUNT(CASE WHEN up.status = 'completed' THEN 1 END) as completed_lessons,
            COUNT(CASE WHEN up.status = 'in_progress' THEN 1 END) as in_progress_lessons,
            (
                SELECT l2.id FROM lessons l2 
                LEFT JOIN user_progress up2 ON l2.id = up2.lesson_id AND up2.user_id = $1
                WHERE l2.category_id = c.id AND l2.is_published = true 
                    AND (up2.status IS NULL OR up2.status = 'not_started')
                ORDER BY l2.order_index LIMIT 1
            ) as next_lesson_id,
            (
                SELECT l2.title FROM lessons l2 
                LEFT JOIN user_progress up2 ON l2.id = up2.lesson_id AND up2.user_id = $1
                WHERE l2.category_id = c.id AND l2.is_published = true 
                    AND (up2.status IS NULL OR up2.status = 'not_started')
                ORDER BY l2.order_index LIMIT 1
            ) as next_lesson_title
        FROM categories c
        LEFT JOIN lessons l ON c.id = l.category_id AND l.is_published = true
        LEFT JOIN user_progress up ON l.id = up.lesson_id AND up.user_id = $1
        GROUP BY c.id, c.name, c.color, c.icon, c.order_index
        ORDER BY c.order_index
        """,
        user_id
    )
    
    result = []
    for category in categories:
        total = category['total_lessons'] or 0
        completed = category['completed_lessons'] or 0
        progress_pct = (completed / total * 100) if total > 0 else 0
        
        result.append(ProgressOverview(
            category_id=category['id'],
            category_name=category['name'],
            category_color=category['color'],
            category_icon=category['icon'],
            total_lessons=total,
            completed_lessons=completed,
            in_progress_lessons=category['in_progress_lessons'] or 0,
            progress_percentage=progress_pct,
            next_lesson_id=category['next_lesson_id'],
            next_lesson_title=category['next_lesson_title']
        ))
    
    return result

async def get_learning_streak(conn, user_id: str) -> LearningStreak:
    """Get user's learning streak information"""
    # Get recent activity to calculate streak
    recent_days = await conn.fetch(
        """
        SELECT DISTINCT DATE(created_at) as activity_date
        FROM (
            SELECT created_at FROM user_progress WHERE user_id = $1 AND status = 'completed'
            UNION
            SELECT created_at FROM practice_sessions WHERE user_id = $1
            UNION
            SELECT created_at FROM user_engagement WHERE user_id = $1
        ) activities
        WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
        ORDER BY activity_date DESC
        """,
        user_id
    )
    
    # Calculate current streak
    current_streak = 0
    today = datetime.now().date()
    streak_dates = [row['activity_date'] for row in recent_days]
    
    # Check if today has activity
    is_today_completed = today in streak_dates
    
    # Calculate streak from today backwards
    check_date = today
    if not is_today_completed:
        check_date = today - timedelta(days=1)
    
    while check_date in streak_dates:
        current_streak += 1
        check_date -= timedelta(days=1)
    
    # Calculate days of current week
    days_this_week = []
    monday = today - timedelta(days=today.weekday())
    for i in range(7):
        day = monday + timedelta(days=i)
        days_this_week.append(day in streak_dates)
    
    return LearningStreak(
        current_streak=current_streak,
        longest_streak=current_streak,  # For now, we'll use current as longest
        streak_goal=7,  # Weekly goal
        last_activity_date=streak_dates[0].isoformat() if streak_dates else None,
        is_today_completed=is_today_completed,
        days_this_week=days_this_week
    )

