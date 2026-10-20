from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional

from services.ai_assistant_service import get_ai_assistant_response

router = APIRouter(
    prefix="/ai-assistant",
    tags=["AI Assistant"]
)


class ChatRequest(BaseModel):
    message: str
    role: Optional[str] = "EMPLOYEE"
    user_name: Optional[str] = "User"
    user_email: Optional[str] = ""
    history: Optional[List[dict]] = None


class ChatResponse(BaseModel):
    answer: str
    sources: List[str] = []
    download_url: Optional[str] = None
    file_type: Optional[str] = None
    file_name: Optional[str] = None
    suggested_actions: Optional[List[str]] = []


@router.post("/chat", response_model=ChatResponse)
def ai_assistant_chat(request: ChatRequest):
    """
    AI Assistant Endpoint with 3-Layer RBAC, Individual Employee Privacy,
    Live PostgreSQL Workforce Context, and PDF/PPT Report Generation.
    """
    if not request.message or not request.message.strip():
        raise HTTPException(
            status_code=400,
            detail="Please enter a question."
        )

    result = get_ai_assistant_response(
        user_message=request.message,
        user_role=request.role or "EMPLOYEE",
        user_name=request.user_name or "User",
        user_email=request.user_email or "",
        history=request.history,
        assistant_mode="AI"
    )

    return result
