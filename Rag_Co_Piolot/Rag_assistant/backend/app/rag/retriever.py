from sentence_transformers import SentenceTransformer
from chromadb import PersistentClient

# Load embedding model
model = SentenceTransformer("all-MiniLM-L6-v2")

# Connect to ChromaDB
client = PersistentClient(path="chroma_db")
collection = client.get_collection("execuai_docs")


def retrieve_documents(query, top_k=5):
    """
    Retrieve the most relevant document chunks for a user query.
    """

    # Generate embedding for the query
    query_embedding = model.encode(query).tolist()

    # Search ChromaDB
    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=top_k
    )

    # Return retrieved chunks
    return results["documents"][0]