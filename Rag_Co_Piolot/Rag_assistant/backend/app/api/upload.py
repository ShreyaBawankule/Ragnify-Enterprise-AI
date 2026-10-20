import os
import shutil
from fastapi import APIRouter, UploadFile, File

from app.rag.document_loader import load_pdf
from app.rag.chunker import create_chunks
from app.rag.vector_store import add_documents

router = APIRouter()

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@router.post("/upload")
async def upload_document(file: UploadFile = File(...)):

    file_location = os.path.join(UPLOAD_FOLDER, file.filename)

    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Extract text from PDF
    text = load_pdf(file_location)

    # Split text into chunks
    chunks = create_chunks(text)

    # Store chunks and embeddings in ChromaDB
    add_documents(chunks)

    return {
        "filename": file.filename,
        "chunks_added": len(chunks),
        "message": "Document uploaded and indexed successfully"
    }