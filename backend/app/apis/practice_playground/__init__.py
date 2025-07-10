import logging
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import asyncpg
import databutton as db
import json
from openai import AzureOpenAI
from app.auth import AuthorizedUser
from app.libs.database import get_db_connection
import datetime

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/practice")

# Database connection
async def get_db():
    return await get_db_connection()

# Azure OpenAI client
def get_openai_client():
    return AzureOpenAI(
        api_key=db.secrets.get("AZURE_OPENAI_API_KEY"),
        api_version="2024-02-01",
        azure_endpoint=db.secrets.get("AZURE_OPENAI_ENDPOINT"),
    )

# Pydantic models
class PracticeChallenge(BaseModel):
    id: int
    title: str
    description: str
    scenario_type: str
    difficulty_level: str
    context: str
    target_outcome: str
    template_prompt: Optional[str] = None
    scoring_criteria: Dict[str, Any]
    max_score: int
    time_limit_minutes: Optional[int] = None

class PromptSubmission(BaseModel):
    challenge_id: int
    user_prompt: str
    session_duration_seconds: Optional[int] = None

class PracticeSession(BaseModel):
    id: int
    challenge_id: int
    challenge_title: str
    user_prompt: str
    feedback: str # Renamed from ai_response
    total_score: int
    max_score: int
    scoring_breakdown: Dict[str, Any] # Renamed from scoring_details
    improvement_suggestions: List[str]
    submitted_at: str

class PortfolioItem(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    prompt_text: str
    ai_response: Optional[str] = None
    score: Optional[int] = None
    tags: List[str]
    is_favorite: bool
    is_public: bool
    created_at: str

class UserChallengeAnalytics(BaseModel):
    challenge_id: int
    user_id: str
    total_attempts: int
    average_score: float
    best_score: int
    first_attempt_date: Optional[str] = None
    last_attempt_date: Optional[str] = None
    scores_over_time: List[int]

class SaveToPortfolioRequest(BaseModel):
    session_id: int
    title: str
    description: Optional[str] = None
    tags: List[str] = []
    is_favorite: bool = False
    is_public: bool = False

class PracticeStats(BaseModel):
    total_sessions: int
    average_score: float
    best_score: int
    total_practice_time_minutes: int
    current_streak_days: int
    challenges_completed: int
    prompts_saved: int
    last_practice_date: Optional[str] = None

class LeaderboardEntry(BaseModel):
    user_id: str
    challenge_id: int
    challenge_title: str
    score: int
    rank_position: int
    achieved_at: str
    user_name: Optional[str] = None

class UserProfileUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None

@router.post("/profile")
async def update_user_profile(profile: UserProfileUpdate, user: AuthorizedUser):
    """Update user profile information with data from frontend"""
    conn = await get_db()
    try:
        await upsert_user_profile(conn, user, profile.name, profile.email)
        return {"success": True, "message": "Profile updated successfully"}
    except Exception as e:
        logger.error(f"Profile update failed for user: {user.sub}, error: {e}")
        raise
    finally:
        await conn.close()

@router.get("/challenges")
async def get_practice_challenges(difficulty: Optional[str] = None, scenario_type: Optional[str] = None) -> List[PracticeChallenge]:
    """Get practice challenges with optional filtering"""
    conn = await get_db()
    try:
        query = "SELECT * FROM practice_challenges WHERE is_active = true"
        params = []
        
        if difficulty:
            query += " AND difficulty_level = $" + str(len(params) + 1)
            params.append(difficulty)
        
        if scenario_type:
            query += " AND scenario_type = $" + str(len(params) + 1)
            params.append(scenario_type)
        
        query += " ORDER BY difficulty_level, id"
        
        rows = await conn.fetch(query, *params)
        
        challenges = []
        for row in rows:
            challenges.append(PracticeChallenge(
                id=row['id'],
                title=row['title'],
                description=row['description'],
                scenario_type=row['scenario_type'],
                difficulty_level=row['difficulty_level'],
                context=row['context'],
                target_outcome=row['target_outcome'],
                template_prompt=row['template_prompt'],
                scoring_criteria=row['scoring_criteria'] if isinstance(row['scoring_criteria'], dict) else json.loads(row['scoring_criteria']),
                max_score=row['max_score'],
                time_limit_minutes=row['time_limit_minutes']
            ))
        
        return challenges
    finally:
        await conn.close()

@router.post("/submit")
async def submit_prompt(body: PromptSubmission, user: AuthorizedUser) -> PracticeSession:
    """Submit a prompt for AI assessment and scoring"""
    conn = await get_db()
    try:        
        # Get challenge details
        challenge = await conn.fetchrow(
            "SELECT title, context, target_outcome, scoring_criteria, max_score FROM practice_challenges WHERE id = $1",
            body.challenge_id,
        )
        if not challenge:
            raise HTTPException(status_code=404, detail="Challenge not found")

        # Use Azure OpenAI for assessment
        client = get_openai_client()
        
        # Create a detailed prompt for the AI assessor
        assessment_prompt = f"""
You are an expert AI prompt engineering coach. Your task is to evaluate a user's submitted prompt based on a given challenge and provide clear, constructive feedback.

**Challenge Details:**
- **Title:** {challenge['title']}
- **Context:** {challenge['context']}
- **Target Outcome:** {challenge['target_outcome']}
- **Scoring Criteria:** {json.dumps(challenge['scoring_criteria'], indent=2)}

**User's Submitted Prompt:**
{body.user_prompt}

**Assessment Instructions:**
1.  **Analyze the user's prompt:** Carefully examine its structure, clarity, and how effectively it addresses the given challenge.
2.  **Evaluate against each criterion:** For each key in the `scoring_criteria` object, assign a score.
3.  **Provide detailed feedback:** For each criterion, explain your reasoning for the score. Be specific and constructive.
4.  **Offer improvement suggestions:** Provide a list of actionable tips or alternative phrasings to help the user improve their next attempt.
5.  **Calculate total score:** Sum the scores for all criteria.
6.  **Provide overall feedback:** Write a concise, encouraging summary of the prompt's strengths and key areas for improvement.
7.  **Format the output as a JSON object:** The output MUST be a valid JSON object. Do not include any text outside of the JSON structure.

**JSON Output Structure:**
{{
  "scoring_breakdown": {{
    "criterion_key_1": {{ "score": <number>, "feedback": "<string>" }},
    "criterion_key_2": {{ "score": <number>, "feedback": "<string>" }}
  }},
  "total_score": <number>,
  "overall_feedback": "<string>",
  "improvement_suggestions": [
    "<string>",
    "<string>"
  ]
}}
"""
        
        try:
            response = client.chat.completions.create(
                model="myvng-gpt4o-2ca9",
                messages=[
                    {"role": "system", "content": assessment_prompt},
                    {"role": "user", "content": "Please assess my prompt based on the provided criteria."}
                ],
                temperature=0.2,
                max_tokens=2000,
                response_format={"type": "json_object"}
            )
            
            assessment_result = json.loads(response.choices[0].message.content)
            
        except Exception as e:
            logger.error(f"Error calling OpenAI: {e}")
            raise ValueError("Failed to get assessment from AI")
        
        # Calculate total score
        total_score = assessment_result.get('total_score', 0)
        # Save session to database
        new_session_id = await conn.fetchval(
            """
            INSERT INTO practice_sessions (user_id, challenge_id, user_prompt, prompt_text, feedback, total_score, scoring_breakdown, improvement_suggestions, session_duration_seconds)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING id
            """,
            user.sub,
            body.challenge_id,
            body.user_prompt,
            body.user_prompt,  # Also populate prompt_text for backward compatibility
            assessment_result.get('overall_feedback'),
            total_score,
            json.dumps(assessment_result.get('scoring_breakdown', {})),
            json.dumps(assessment_result.get('improvement_suggestions', [])),
            body.session_duration_seconds
        )
        
        # Update user's practice stats
        await update_practice_stats(conn, user.sub, total_score)
        
        # Update leaderboard
        await update_leaderboard(conn, user.sub, body.challenge_id, new_session_id, total_score)
        
        # 4. Return the full session object
        return PracticeSession(
            id=new_session_id,
            challenge_id=body.challenge_id,
            challenge_title=challenge['title'],
            user_prompt=body.user_prompt,
            feedback=assessment_result.get('overall_feedback'),
            total_score=total_score,
            max_score=challenge['max_score'],
            scoring_breakdown=assessment_result.get('scoring_breakdown', {}),
            improvement_suggestions=assessment_result.get('improvement_suggestions', []),
            submitted_at=datetime.datetime.now().isoformat()
        )
    except Exception as e:
        logger.error(f"Error in submit_prompt: {e}")
        raise
    finally:
        await conn.close()

@router.get("/sessions", response_model=List[PracticeSession])
async def get_practice_sessions(user: AuthorizedUser, limit: int = 20) -> List[PracticeSession]:
    """Get user's practice sessions"""
    conn = await get_db()
    try:
        query = """
        SELECT 
            ps.id,
            ps.challenge_id,
            pc.title as challenge_title,
            ps.user_prompt,
            ps.feedback,
            ps.total_score,
            pc.max_score,
            ps.scoring_breakdown,
            ps.improvement_suggestions,
            ps.created_at
        FROM practice_sessions ps
        JOIN practice_challenges pc ON ps.challenge_id = pc.id
        WHERE ps.user_id = $1
        ORDER BY ps.created_at DESC
        LIMIT $2
        """
        
        rows = await conn.fetch(query, user.sub, limit)

        sessions = [
            PracticeSession(
                id=row['id'],
                challenge_id=row['challenge_id'],
                challenge_title=row['challenge_title'],
                user_prompt=row['user_prompt'],
                feedback=row['feedback'] if row['feedback'] else "",
                total_score=row['total_score'],
                max_score=row['max_score'],
                scoring_breakdown=json.loads(row['scoring_breakdown']) if row['scoring_breakdown'] else {},
                improvement_suggestions=json.loads(row['improvement_suggestions']) if row['improvement_suggestions'] else [],
                submitted_at=row['created_at'].isoformat()
            ) for row in rows
        ]
        return sessions
    finally:
        await conn.close()

@router.post("/portfolio")
async def save_to_portfolio(request: SaveToPortfolioRequest, user: AuthorizedUser) -> PortfolioItem:
    """Save a practice session to user's portfolio"""
    conn = await get_db()
    try:
        # Get session details
        session = await conn.fetchrow(
            "SELECT * FROM practice_sessions WHERE id = $1 AND user_id = $2",
            request.session_id, user.sub
        )
        
        if not session:
            raise ValueError("Session not found")
        
        # Save to portfolio
        portfolio_id = await conn.fetchval(
            """
            INSERT INTO prompt_portfolio 
            (user_id, session_id, title, description, prompt_text, ai_response, score, tags, is_favorite, is_public)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING id
            """,
            user.sub, request.session_id, request.title, request.description,
            session['user_prompt'], session['feedback'], session['total_score'],
            request.tags, request.is_favorite, request.is_public
        )
        
        # Update stats
        await conn.execute(
            "UPDATE practice_stats SET prompts_saved = prompts_saved + 1 WHERE user_id = $1",
            user.sub
        )
        
        return PortfolioItem(
            id=portfolio_id,
            title=request.title,
            description=request.description,
            prompt_text=session['user_prompt'],
            ai_response=session['feedback'],
            score=session['total_score'],
            tags=request.tags,
            is_favorite=request.is_favorite,
            is_public=request.is_public,
            created_at=datetime.datetime.now().isoformat()
        )
    finally:
        await conn.close()

@router.get("/portfolio")
async def get_portfolio(user: AuthorizedUser) -> List[PortfolioItem]:
    """Get user's prompt portfolio"""
    conn = await get_db()
    try:
        rows = await conn.fetch(
            "SELECT * FROM prompt_portfolio WHERE user_id = $1 ORDER BY created_at DESC",
            user.sub
        )
        
        portfolio = []
        for row in rows:
            portfolio.append(PortfolioItem(
                id=row['id'],
                title=row['title'],
                description=row['description'],
                prompt_text=row['prompt_text'],
                ai_response=row['ai_response'],
                score=row['score'],
                tags=row['tags'],
                is_favorite=row['is_favorite'],
                is_public=row['is_public'],
                created_at=row['created_at'].isoformat()
            ))
        
        return portfolio
    finally:
        await conn.close()

@router.get("/stats")
async def get_practice_stats(user: AuthorizedUser) -> PracticeStats:
    """Get user's practice statistics"""
    conn = await get_db()
    try:
        row = await conn.fetchrow(
            "SELECT * FROM practice_stats WHERE user_id = $1",
            user.sub
        )
        
        if not row:
            # Create initial stats record
            await conn.execute(
                "INSERT INTO practice_stats (user_id) VALUES ($1)",
                user.sub
            )
            return PracticeStats(
                total_sessions=0,
                average_score=0.0,
                best_score=0,
                total_practice_time_minutes=0,
                current_streak_days=0,
                challenges_completed=0,
                prompts_saved=0,
                last_practice_date=None
            )
        
        return PracticeStats(
            total_sessions=row['total_sessions'],
            average_score=float(row['average_score']),
            best_score=row['best_score'],
            total_practice_time_minutes=row['total_practice_time_minutes'],
            current_streak_days=row['current_streak_days'],
            challenges_completed=row['challenges_completed'],
            prompts_saved=row['prompts_saved'],
            last_practice_date=row['last_practice_date'].isoformat() if row['last_practice_date'] else None
        )
    finally:
        await conn.close()

# Helper function to ensure user profile is stored
async def upsert_user_profile(conn, user: AuthorizedUser, name: Optional[str] = None, email: Optional[str] = None):
    """Store or update user profile information in the database"""   
    # Use provided name if available, otherwise use JWT name, otherwise generate fallback
    if name:
        display_name = name
    elif user.name:
        display_name = user.name
    else:
        # Generate a fallback display name from user ID
        if len(user.sub) >= 8:
            display_name = f"User {user.sub[:8]}"
        else:
            display_name = f"User {user.sub}"
    
    # Use provided email if available, otherwise use JWT email
    profile_email = email or user.email
    try:
        result = await conn.execute(
            """
            INSERT INTO users (id, name, email, last_seen_at)
            VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
            ON CONFLICT (id) 
            DO UPDATE SET
                name = COALESCE($2, users.name),
                email = COALESCE($3, users.email),
                last_seen_at = CURRENT_TIMESTAMP,
                updated_at = CURRENT_TIMESTAMP
            """,
            user.sub, display_name, profile_email
        )
        
    except Exception as e:
        logger.error(f"Database error in upsert_user_profile: {e}")
        raise

@router.get("/leaderboard/{challenge_id}")
async def get_challenge_leaderboard(challenge_id: int, limit: int = 10, user: AuthorizedUser = None) -> List[LeaderboardEntry]:
    """Get leaderboard for a specific challenge"""
    conn = await get_db()
    try:
        query = """
        SELECT 
            le.user_id,
            le.challenge_id,
            pc.title as challenge_title,
            le.score,
            le.achieved_at,
            COALESCE(u.name, 'User ' || substring(le.user_id from 1 for 8)) as user_name
        FROM leaderboard_entries le
        JOIN practice_challenges pc ON le.challenge_id = pc.id
        LEFT JOIN users u ON le.user_id = u.id
        WHERE le.challenge_id = $1
        ORDER BY le.score DESC, le.achieved_at ASC
        LIMIT $2
        """
        
        rows = await conn.fetch(query, challenge_id, limit)
        
        leaderboard = []
        for i, row in enumerate(rows):
            leaderboard.append(LeaderboardEntry(
                user_id=row['user_id'],
                challenge_id=row['challenge_id'],
                challenge_title=row['challenge_title'],
                score=row['score'],
                rank_position=i + 1,
                achieved_at=row['achieved_at'].isoformat(),
                user_name=row['user_name']
            ))
        
        return leaderboard
        
    except Exception as e:
        logger.error(f"Error fetching leaderboard: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch leaderboard")
    finally:
        await conn.close()

@router.get("/analytics/challenge/{challenge_id}")
async def get_user_challenge_analytics(challenge_id: int, user: AuthorizedUser) -> UserChallengeAnalytics:
    """Get user's analytics for a specific challenge."""
    conn = await get_db()
    try:
        query = """
        SELECT
            COUNT(*) AS total_attempts,
            AVG(total_score) AS average_score,
            MAX(total_score) AS best_score,
            MIN(created_at) AS first_attempt_date,
            MAX(created_at) AS last_attempt_date,
            array_agg(total_score ORDER BY created_at) as scores_over_time
        FROM practice_sessions
        WHERE user_id = $1 AND challenge_id = $2;
        """
        row = await conn.fetchrow(query, user.sub, challenge_id)

        if not row or row['total_attempts'] == 0:
            return UserChallengeAnalytics(
                challenge_id=challenge_id,
                user_id=user.sub,
                total_attempts=0,
                average_score=0.0,
                best_score=0,
                scores_over_time=[]
            )

        return UserChallengeAnalytics(
            challenge_id=challenge_id,
            user_id=user.sub,
            total_attempts=row['total_attempts'],
            average_score=round(float(row['average_score']), 2) if row['average_score'] else 0.0,
            best_score=row['best_score'] or 0,
            first_attempt_date=row['first_attempt_date'].isoformat() if row['first_attempt_date'] else None,
            last_attempt_date=row['last_attempt_date'].isoformat() if row['last_attempt_date'] else None,
            scores_over_time=row['scores_over_time'] or []
        )
    finally:
        await conn.close()


# Helper functions
async def update_practice_stats(conn, user_id: str, score: int):
    """Update user practice statistics"""
    # Get current stats
    current_stats = await conn.fetchrow(
        "SELECT * FROM practice_stats WHERE user_id = $1",
        user_id
    )
    
    if current_stats:
        new_total_sessions = current_stats['total_sessions'] + 1
        new_average_score = ((current_stats['average_score'] * current_stats['total_sessions']) + score) / new_total_sessions
        new_best_score = max(current_stats['best_score'], score)
        new_total_time = current_stats['total_practice_time_minutes'] + (score // 60)
        
        await conn.execute(
            """
            UPDATE practice_stats SET
                total_sessions = $2,
                average_score = $3,
                best_score = $4,
                total_practice_time_minutes = $5,
                last_practice_date = CURRENT_DATE,
                updated_at = CURRENT_TIMESTAMP
            WHERE user_id = $1
            """,
            user_id, new_total_sessions, new_average_score, new_best_score, new_total_time
        )
    else:
        await conn.execute(
            """
            INSERT INTO practice_stats 
            (user_id, total_sessions, average_score, best_score, total_practice_time_minutes, last_practice_date)
            VALUES ($1, 1, $2, $3, $4, CURRENT_DATE)
            """,
            user_id, score, score, score // 60
        )

async def update_leaderboard(conn, user_id: str, challenge_id: int, session_id: int, score: int):
    """Update leaderboard entry for user and challenge, only if score is higher."""
    # First, get the current score for the user on this challenge, if it exists
    current_score_row = await conn.fetchrow(
        "SELECT score FROM leaderboard_entries WHERE user_id = $1 AND challenge_id = $2",
        user_id, challenge_id
    )

    # If the user is not on the leaderboard for this challenge, or their new score is higher
    if not current_score_row or score > current_score_row['score']:
        if current_score_row:
            # Update existing record
            await conn.execute(
                """
                UPDATE leaderboard_entries 
                SET session_id = $1, score = $2, achieved_at = CURRENT_TIMESTAMP
                WHERE user_id = $3 AND challenge_id = $4
                """,
                session_id, score, user_id, challenge_id
            )
        else:
            # Insert new record
            await conn.execute(
                """
                INSERT INTO leaderboard_entries (user_id, challenge_id, session_id, score, achieved_at)
                VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
                """,
                user_id, challenge_id, session_id, score
            )

