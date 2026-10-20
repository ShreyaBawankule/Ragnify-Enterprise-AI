import os
from uuid import uuid4
from chromadb import PersistentClient
from sentence_transformers import SentenceTransformer
from rag.seed_knowledge_base import ensure_knowledge_base_seeded, KNOWLEDGE_BASE_SPEC

# Persistent ChromaDB stored relative to backend root
BASE_DIR = os.path.dirname(os.path.dirname(__file__))
CHROMA_PATH = os.path.join(BASE_DIR, "chroma_db")
client = PersistentClient(path=CHROMA_PATH)

collection = client.get_or_create_collection(name="ragnify_docs")

# SentenceTransformer embedding model (all-MiniLM-L6-v2)
model = SentenceTransformer("all-MiniLM-L6-v2")

# Seed authoritative RBAC enterprise documents on startup
try:
    ensure_knowledge_base_seeded(collection, model)
except Exception as e:
    print(f"Warning during ChromaDB KB seeding: {e}")


def is_role_allowed_for_meta(role: str, meta: dict) -> bool:
    """
    Enforce multi-tier Role-Based Access Control (RBAC) on document chunks:
    - INTERN: Only allowed access_tier == 'INTERN_PUBLIC' (Intern Handbook & Engineering Coding Guide).
              Strictly blocked from COMPANY_INTERNAL, MANAGER_RESTRICTED, HR_CONFIDENTIAL, and uploaded company PDFs.
    - EMPLOYEE: Allowed 'INTERN_PUBLIC' and 'COMPANY_INTERNAL'.
                Strictly blocked from 'MANAGER_RESTRICTED' and 'HR_CONFIDENTIAL'.
    - MANAGER: Allowed 'INTERN_PUBLIC', 'COMPANY_INTERNAL', and 'MANAGER_RESTRICTED'.
               Strictly blocked from 'HR_CONFIDENTIAL'.
    - HR / ADMIN: Full governance access across all tiers.
    """
    r = (role or "EMPLOYEE").upper()
    if r in ("HR", "ADMIN"):
        return True

    if not isinstance(meta, dict):
        return r in ("EMPLOYEE", "MANAGER")

    allowed_str = meta.get("allowed_roles", "")
    tier = meta.get("access_tier", "COMPANY_INTERNAL")

    if allowed_str:
        allowed_list = [x.strip().upper() for x in allowed_str.split(",") if x.strip()]
        return r in allowed_list

    if r == "INTERN":
        return tier in ("INTERN_PUBLIC", "INTERN_ONLY")
    if r == "EMPLOYEE":
        if tier == "INTERN_ONLY" or meta.get("filename") == "RAGNIFY_Internship_Handbook_2026.pdf":
            return False
        return tier in ("INTERN_PUBLIC", "COMPANY_INTERNAL")
    if r == "MANAGER":
        return tier in ("INTERN_PUBLIC", "INTERN_ONLY", "COMPANY_INTERNAL", "MANAGER_RESTRICTED")

    return False


def add_documents(
    chunks: list[str],
    filename: str = "",
    access_tier: str = "COMPANY_INTERNAL",
    allowed_roles: str = "EMPLOYEE,MANAGER,HR,ADMIN",
    category: str = "Uploaded Company Document"
) -> str:
    """Embed chunks and store them in ChromaDB with UUID-based IDs and RBAC metadata."""
    embeddings = model.encode(chunks).tolist()
    ids = [f"doc_{uuid4().hex}" for _ in chunks]

    metadatas = [
        {
            "filename": filename,
            "chunk_index": i,
            "access_tier": access_tier,
            "allowed_roles": allowed_roles,
            "category": category,
            "size_label": "1.2 MB"
        }
        for i, _ in enumerate(chunks)
    ]

    collection.add(
        documents=chunks,
        embeddings=embeddings,
        ids=ids,
        metadatas=metadatas
    )

    return "Documents added successfully"


def search_documents(query: str, n_results: int = 6, role: str = "EMPLOYEE") -> list[str]:
    """Retrieve top-n relevant chunks for a query filtered by the user's RBAC clearance."""
    res = search_documents_with_metadata(query=query, n_results=n_results, role=role)
    return [item["text"] for item in res]


def search_documents_with_metadata(query: str, n_results: int = 8, role: str = "EMPLOYEE") -> list[dict]:
    """
    Retrieve top relevant chunks + metadata, strictly filtering out documents
    that exceed the requester's role clearance level.
    """
    query_embedding = model.encode([query]).tolist()[0]
    total_count = collection.count()
    fetch_k = min(max(n_results * 3, 18), max(total_count, 1))

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=fetch_k
    )

    docs = results.get("documents", [[]])[0] if results else []
    metas = results.get("metadatas", [[]])[0] if results else []

    authorized_items = []
    for text, meta in zip(docs, metas):
        if not text or not text.strip():
            continue
        meta_dict = meta if isinstance(meta, dict) else {"filename": "Enterprise_Document.pdf"}
        if is_role_allowed_for_meta(role, meta_dict):
            authorized_items.append({
                "text": text,
                "metadata": meta_dict,
                "filename": meta_dict.get("filename", "Enterprise_Document.pdf"),
                "access_tier": meta_dict.get("access_tier", "COMPANY_INTERNAL")
            })
            if len(authorized_items) >= n_results:
                break

    return authorized_items


def get_indexed_documents_summary(role: str = "EMPLOYEE") -> dict:
    """
    Return the complete inventory of documents stored in ChromaDB, including
    chunk counts, RBAC classification badges, and whether the user's role can access each.
    """
    all_data = collection.get(include=["metadatas"])
    metas = all_data.get("metadatas") or []

    doc_map = {}
    spec_lookup = {d["filename"]: d for d in KNOWLEDGE_BASE_SPEC}

    for m in metas:
        meta = m if isinstance(m, dict) else {}
        fname = meta.get("filename") or "Unknown_Document.pdf"
        spec = spec_lookup.get(fname, {})
        tier = meta.get("access_tier") or spec.get("access_tier") or "COMPANY_INTERNAL"
        allowed = meta.get("allowed_roles") or spec.get("allowed_roles") or "EMPLOYEE,MANAGER,HR,ADMIN"
        cat = meta.get("category") or spec.get("category") or "Company Knowledge Document"
        size_lbl = meta.get("size_label") or spec.get("size_label") or "1.5 MB"

        if fname not in doc_map:
            doc_map[fname] = {
                "name": fname,
                "chunks": 0,
                "access_tier": tier,
                "allowed_roles": allowed,
                "category": cat,
                "size": size_lbl,
                "accessible": is_role_allowed_for_meta(role, {"access_tier": tier, "allowed_roles": allowed, "filename": fname})
            }
        doc_map[fname]["chunks"] += 1

    docs_list = sorted(doc_map.values(), key=lambda x: (not x["accessible"], x["name"]))
    accessible_docs = [d for d in docs_list if d["accessible"]]

    return {
        "collection": "ragnify_docs",
        "total_documents": len(docs_list),
        "accessible_documents_count": len(accessible_docs),
        "total_chunks": len(metas),
        "role": (role or "EMPLOYEE").upper(),
        "documents": docs_list
    }
