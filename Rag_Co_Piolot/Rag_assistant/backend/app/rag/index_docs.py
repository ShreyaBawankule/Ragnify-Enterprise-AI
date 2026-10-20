import os

from app.rag.document_loader import load_pdf
from app.rag.chunker import create_chunks
from app.rag.vector_store import add_documents

DOCS_FOLDER = "app/uploads/company_docs"

total_docs = 0
total_chunks = 0

for root, _, files in os.walk(DOCS_FOLDER):
    for file in files:

        file_path = os.path.join(root, file)

        try:
            if file.lower().endswith(".pdf"):
                text = load_pdf(file_path)

            elif file.lower().endswith(".md"):
                with open(file_path, "r", encoding="utf-8") as f:
                    text = f.read()

            else:
                continue

            if not text.strip():
                continue

            chunks = create_chunks(text)

            if not chunks:
                continue

            add_documents(chunks)

            total_docs += 1
            total_chunks += len(chunks)

            print(f"Indexed: {file}")

        except Exception as e:
            print(f"Error processing {file}: {e}")

print("\n========== INDEXING COMPLETE ==========")
print(f"Total Documents Indexed: {total_docs}")
print(f"Total Chunks Stored: {total_chunks}")