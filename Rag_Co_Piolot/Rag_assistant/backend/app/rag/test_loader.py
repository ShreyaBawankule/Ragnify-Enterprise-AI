from app.rag.document_loader import load_pdf

text = load_pdf("uploads/ExecuAI 2.pdf")

print(text[:1000])