import os
import shutil
from typing import List, Optional

from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Query
from pydantic import BaseModel

from rag.document_loader import load_pdf
from rag.chunker import create_chunks
from rag.vector_store import add_documents, get_indexed_documents_summary
from rag.rag_pipeline import ask_question

router = APIRouter(
    prefix="/rag",
    tags=["RAG Assistant"]
)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


# ==========================================
# RAG CHAT
# ==========================================

class ChatRequest(BaseModel):
    question: str
    role: Optional[str] = "EMPLOYEE"
    user_name: Optional[str] = "User"
    user_email: Optional[str] = ""
    history: Optional[List[dict]] = None


class RagChatResponse(BaseModel):
    question: str
    answer: str
    sources: List[str] = []
    download_url: Optional[str] = None
    file_type: Optional[str] = None
    file_name: Optional[str] = None
    suggested_actions: Optional[List[str]] = []


@router.get("/documents")
def list_rag_documents(role: str = Query("EMPLOYEE", description="Requester role for RBAC filtering")):
    """
    Return the live inventory of documents stored in ChromaDB along with chunk counts
    and RBAC security clearance status for the given role.
    """
    return get_indexed_documents_summary(role=role)


@router.post("/chat", response_model=RagChatResponse)
def rag_chat(request: ChatRequest):
    """
    Ask a question against uploaded enterprise documents with multi-tier RBAC and individual employee privacy.
    """
    if not request.question or not request.question.strip():
        raise HTTPException(
            status_code=400,
            detail="Question cannot be empty."
        )

    res = ask_question(
        question=request.question,
        user_role=request.role or "EMPLOYEE",
        user_name=request.user_name or "User",
        user_email=request.user_email or "",
        history=request.history,
        assistant_mode="RAG"
    )

    return {
        "question": request.question,
        "answer": res.get("answer", ""),
        "sources": res.get("sources", []),
        "download_url": res.get("download_url"),
        "file_type": res.get("file_type"),
        "file_name": res.get("file_name"),
        "suggested_actions": res.get("suggested_actions", [])
    }


# ==========================================
# RAG UPLOAD
# ==========================================

@router.post("/upload")
async def rag_upload(
    file: UploadFile = File(...),
    access_tier: str = Form("COMPANY_INTERNAL"),
    role: str = Form("HR")
):
    """
    Upload a PDF, extract text, chunk it, embed it and store in ChromaDB with RBAC metadata.
    Interns are not permitted to upload documents to the Company RAG Vault.
    """
    if (role or "").upper() == "INTERN":
        raise HTTPException(
            status_code=403,
            detail="Intern accounts are not authorized to upload documents to the Company RAG Knowledge Vault."
        )

    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are supported."
        )

    file_location = os.path.join(UPLOAD_FOLDER, file.filename)

    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    text = load_pdf(file_location)

    if not text.strip():
        raise HTTPException(
            status_code=422,
            detail="Could not extract text from the PDF. The file may be scanned or image-only."
        )

    chunks = create_chunks(text)

    tier_map = {
        "INTERN_PUBLIC": "INTERN,EMPLOYEE,MANAGER,HR,ADMIN",
        "COMPANY_INTERNAL": "EMPLOYEE,MANAGER,HR,ADMIN",
        "MANAGER_RESTRICTED": "MANAGER,HR,ADMIN",
        "HR_CONFIDENTIAL": "HR,ADMIN"
    }
    allowed_roles = tier_map.get(access_tier, "EMPLOYEE,MANAGER,HR,ADMIN")

    add_documents(
        chunks,
        filename=file.filename,
        access_tier=access_tier,
        allowed_roles=allowed_roles
    )

    return {
        "filename": file.filename,
        "chunks_added": len(chunks),
        "access_tier": access_tier,
        "allowed_roles": allowed_roles,
        "message": "Document uploaded and indexed successfully with RBAC protection"
    }
