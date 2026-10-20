from uuid import uuid4

from chromadb import PersistentClient
from sentence_transformers import SentenceTransformer


client = PersistentClient(path="./chroma_db")

collection = client.get_or_create_collection(
    name="execuai_docs"
)

model = SentenceTransformer("all-MiniLM-L6-v2")


def add_documents(chunks):
    embeddings = model.encode(chunks).tolist()

    # Generate unique IDs for every chunk
    ids = [f"doc_{uuid4().hex}" for _ in chunks]

    collection.add(
        documents=chunks,
        embeddings=embeddings,
        ids=ids
    )

    return "Documents added successfully"


def search_documents(query, n_results=5):
    query_embedding = model.encode([query]).tolist()[0]

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=n_results
    )

    return results