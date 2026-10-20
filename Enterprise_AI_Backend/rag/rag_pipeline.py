from typing import List, Optional
from services.ai_assistant_service import get_ai_assistant_response


def ask_question(
    question: str,
    user_role: str = "EMPLOYEE",
    user_name: str = "User",
    user_email: str = "",
    history: Optional[List[dict]] = None,
    assistant_mode: str = "RAG"
) -> dict:
    """
    Complete RAG Pipeline with RBAC Document Filtering, Individual Employee Privacy,
    ChatGPT-Agent synthesis, and PDF/PPT Report generation.
    """
    return get_ai_assistant_response(
        user_message=question,
        user_role=user_role,
        user_name=user_name,
        user_email=user_email,
        history=history,
        assistant_mode=assistant_mode
    )
