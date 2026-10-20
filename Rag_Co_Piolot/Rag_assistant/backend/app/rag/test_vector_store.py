from vector_store import add_documents, search_documents

chunks = [
    "ExecuAI is an AI-powered company assistant.",
    "RAG retrieves relevant document chunks using semantic search.",
    "Meeting summaries are stored for future retrieval."
]

print(add_documents(chunks))

results = search_documents(
    "How does RAG work?"
)

print(results)