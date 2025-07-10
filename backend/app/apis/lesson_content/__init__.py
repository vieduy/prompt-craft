from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional, Union, Dict, Any
import asyncpg
import databutton as db
import json
import os
from openai import AzureOpenAI
from app.auth import AuthorizedUser
from app.libs.database import get_db_connection

router = APIRouter(prefix="/lesson-content")


# Database connection
async def get_db():
    return await get_db_connection()


# Azure OpenAI client
def get_azure_openai_client():
    return AzureOpenAI(
        api_key=db.secrets.get("AZURE_OPENAI_API_KEY"),
        api_version="2024-02-01",
        azure_endpoint=db.secrets.get("AZURE_OPENAI_ENDPOINT")
    )


# Pydantic models
class LessonContentSection(BaseModel):
    id: int
    section_type: str
    order_index: int
    title: Optional[str] = None
    content: Optional[Union[str, Dict[str, Any]]] = None
    is_completed: bool = False


class LessonWithContent(BaseModel):
    id: int
    title: str
    description: str
    category_id: int
    difficulty_level: str
    estimated_duration: int
    learning_objectives: List[str]
    workplace_scenario: str
    order_index: int
    progress_status: str
    progress_percentage: int
    content_sections: List[LessonContentSection]


class ExerciseSubmission(BaseModel):
    lesson_id: int
    lesson_content_id: int
    submitted_prompt: str


class SubmissionResult(BaseModel):
    id: int
    score: int
    feedback: str


@router.get("/lessons/{lesson_id}", response_model=LessonWithContent)
async def get_lesson_with_content(lesson_id: int, user: AuthorizedUser) -> LessonWithContent:
    """Get a lesson with all its content sections and exercises"""
    conn = await get_db()
    try:
        # Get lesson basic info
        lesson_query = """
        SELECT 
            l.id, l.title, l.description, l.category_id, l.difficulty_level,
            l.estimated_duration, l.learning_objectives, l.workplace_scenario, l.order_index,
            COALESCE(up.status, 'not_started') as progress_status,
            COALESCE(up.progress_percentage, 0) as progress_percentage
        FROM lessons l
        LEFT JOIN user_progress up ON l.id = up.lesson_id AND up.user_id = $2
        WHERE l.id = $1
        """

        lesson_row = await conn.fetchrow(lesson_query, lesson_id, user.sub)
        if not lesson_row:
            raise HTTPException(status_code=404, detail="Lesson not found")

        # Get lesson content sections
        content_query = """
        SELECT lc.id, lc.section_type, lc.order_index, lc.title, lc.content, upc.is_completed
        FROM lesson_content lc
        LEFT JOIN user_progress_content upc ON lc.id = upc.lesson_content_id AND upc.user_id = $2
        WHERE lc.lesson_id = $1
        ORDER BY lc.order_index
        """

        content_rows = await conn.fetch(content_query, lesson_id, user.sub)
        content_sections = []
        for row in content_rows:
            content_data = row["content"]
            # If the content is a JSON string, parse it
            if isinstance(content_data, str):
                try:
                    content_data = json.loads(content_data)
                except json.JSONDecodeError:
                    pass  # Keep as string if not valid JSON

            content_sections.append(
                LessonContentSection(
                    id=row["id"],
                    section_type=row["section_type"],
                    order_index=row["order_index"],
                    title=row["title"],
                    content=content_data,
                    is_completed=row["is_completed"] or False,
                )
            )

        return LessonWithContent(
            id=lesson_row["id"],
            title=lesson_row["title"],
            description=lesson_row["description"],
            category_id=lesson_row["category_id"],
            difficulty_level=lesson_row["difficulty_level"],
            estimated_duration=lesson_row["estimated_duration"],
            learning_objectives=json.loads(lesson_row["learning_objectives"]) if os.getenv('DB_LOCAL') == 'True' else lesson_row["learning_objectives"],
            workplace_scenario=lesson_row["workplace_scenario"],
            order_index=lesson_row["order_index"],
            progress_status=lesson_row["progress_status"],
            progress_percentage=lesson_row["progress_percentage"],
            content_sections=content_sections,
        )
    finally:
        await conn.close()


@router.post("/exercises/submit", response_model=SubmissionResult)
async def submit_exercise(submission: ExerciseSubmission, user: AuthorizedUser) -> SubmissionResult:
    """Submit a practice exercise and get AI-powered assessment"""
    conn = await get_db()
    try:
        # Get exercise details from lesson_content
        exercise_query = """
        SELECT title, content
        FROM lesson_content
        WHERE id = $1 AND lesson_id = $2 AND section_type = 'practice_exercise'
        """

        exercise_row = await conn.fetchrow(exercise_query, submission.lesson_content_id, submission.lesson_id)
        if not exercise_row:
            raise HTTPException(status_code=404, detail="Practice exercise not found")

        exercise_details = json.loads(exercise_row["content"])
        exercise_scenario = exercise_details.get("scenario")

        # Get AI assessment
        ai_result = await assess_submission_with_ai(
            submission.submitted_prompt,
            exercise_row["title"],
            exercise_scenario,
        )

        # Store submission in the new submissions table
        submission_query = """
        INSERT INTO submissions 
        (user_id, lesson_id, lesson_content_id, submitted_prompt, score, feedback)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id
        """

        submission_id = await conn.fetchval(
            submission_query,
            user.sub,
            submission.lesson_id,
            submission.lesson_content_id,
            submission.submitted_prompt,
            ai_result["score"],
            ai_result["feedback"],
        )

        if not submission_id:
            raise HTTPException(status_code=500, detail="Failed to save submission")

        return SubmissionResult(
            id=submission_id,
            score=ai_result["score"],
            feedback=ai_result["feedback"],
        )
    finally:
        await conn.close()


async def assess_submission_with_ai(submitted_prompt: str, exercise_title: str, scenario: str) -> dict:
    """Use Azure OpenAI to assess user submission for a practice exercise"""
    client = get_azure_openai_client()

    assessment_prompt = f"""
You are an AI tutor assessing a student's practice exercise submission.

Exercise Title: "{exercise_title}"
Scenario: "{scenario}"

Student's Submitted Prompt:
"{submitted_prompt}"

Please assess the student's prompt based on the scenario. Evaluate its clarity, relevance to the task, and creativity.

Provide:
1. An overall score out of 100.
2. A short paragraph of constructive feedback (2-3 sentences) explaining the reasoning for the score, highlighting strengths and areas for improvement.

Respond ONLY with a valid JSON object in the following format:
{{
  "score": <score_0_to_100>,
  "feedback": "<feedback_paragraph>"
}}
"""

    try:
        response = client.chat.completions.create(
            model="myvng-gpt4o-2ca9",
            messages=[
                {
                    "role": "system",
                    "content": "You are an expert AI tutor providing concise, constructive feedback on prompt engineering exercises. Your response must be a valid JSON object and nothing else.",
                },
                {"role": "user", "content": assessment_prompt},
            ],
            temperature=0.4,
            max_tokens=500,
            response_format={"type": "json_object"},
        )

        ai_response = response.choices[0].message.content
        result = json.loads(ai_response)
        return result
    except Exception as e:
        print(f"AI assessment error: {e}")
        # Fallback assessment in case of API or parsing error
        return {
            "score": 75,
            "feedback": "There was an issue with the AI assessment, but your submission has been saved. Your prompt showed good effort. Keep practicing to refine your skills!",
        }


@router.get("/exercises/{exercise_id}/submissions", response_model=List[SubmissionResult])
async def get_user_submissions(exercise_id: int, user: AuthorizedUser) -> List[SubmissionResult]:
    """Get user's previous submissions for an exercise"""
    conn = await get_db()
    try:
        query = """
        SELECT id, score, feedback
        FROM submissions
        WHERE user_id = $1 AND lesson_content_id = $2
        ORDER BY submitted_at DESC
        LIMIT 5
        """

        rows = await conn.fetch(query, user.sub, exercise_id)

        return [SubmissionResult(id=row["id"], score=row["score"], feedback=row["feedback"]) for row in rows]
    finally:
        await conn.close()

