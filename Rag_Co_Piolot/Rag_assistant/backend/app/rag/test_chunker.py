from document_loader import load_pdf
from chunker import create_chunks


pdf_path = "uploads/ExecuAI 2.pdf"

text = load_pdf(pdf_path)

chunks = create_chunks(text)

print("Total chunks:", len(chunks))

print("\nFirst chunk:")
print(chunks[0])
