from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import databutton as db
from openai import AzureOpenAI

# --- API Router ---
router = APIRouter()


# --- Pydantic Models ---
class PromptPlaygroundRequest(BaseModel):
    prompt: str


# --- Azure OpenAI Client ---
def get_azure_openai_client():
    try:
        api_key = db.secrets.get("AZURE_OPENAI_API_KEY")
        azure_endpoint = db.secrets.get("AZURE_OPENAI_ENDPOINT")
        if not api_key or not azure_endpoint:
            raise ValueError("Azure OpenAI credentials are not fully configured.")

        return AzureOpenAI(
            api_key=api_key,
            api_version="2024-02-01",
            azure_endpoint=azure_endpoint,
        )
    except Exception as e:
        print(f"Error initializing Azure OpenAI client: {e}")
        return None


# --- Streaming Logic ---
async def generate_responses(prompt: str):
    """
    Asynchronously generates responses from the AI model and yields them chunk by chunk.
    """
    client = get_azure_openai_client()
    if not client:
        yield "Error: The AI service is not configured. Please contact support."
        return

    system_prompt = "You are a helpful AI assistant. The user is in a 'playground' environment, so feel free to be creative and helpful in your responses."

    try:
        response = client.chat.completions.create(
            model="myvng-gpt4o-2ca9",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": prompt},
            ],
            stream=True,
            temperature=0.7,
        )

        for chunk in response:
            if chunk.choices and chunk.choices[0].delta and chunk.choices[0].delta.content:
                yield chunk.choices[0].delta.content

    except Exception as e:
        print(f"An error occurred during AI generation: {e}")
        yield f"An unexpected error occurred: {e}"


# --- API Endpoint ---
@router.post("/playground", tags=["stream"])
async def run_prompt_playground(request: PromptPlaygroundRequest):
    """
    Accepts a user's prompt and streams a response from the AI model.
    This endpoint is designed for the open-ended prompt playground.
    """
    return StreamingResponse(generate_responses(request.prompt), media_type="text/plain")
