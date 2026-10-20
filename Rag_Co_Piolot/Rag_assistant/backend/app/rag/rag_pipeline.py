from app.rag.retriever import retrieve_documents
from app.rag.gemini_service import generate_answer


def ask_question(question):
    """
    Complete RAG Pipeline

    User Question
        ↓
    Retrieve Relevant Chunks
        ↓
    Build Context
        ↓
    Gemini
        ↓
    Final Answer
    """

    # Retrieve relevant document chunks
    retrieved_chunks = retrieve_documents(question)

    # Combine chunks into a single context
    context = "\n\n".join(retrieved_chunks)

    # Generate answer using Gemini
    answer = generate_answer(question, context)

    return answer