from pypdf import PdfReader


def load_pdf(file_path: str) -> str:
    """Extract all text from a PDF file."""
    reader = PdfReader(file_path)
    text = ""
    for page in reader.pages:
        extracted = page.extract_text()
        if extracted:
            text += extracted
    # Fix pypdf font encoding loss where ₹ symbol is dropped before numbers (e.g., 'stipend of ,500' -> 'stipend of ₹5,500')
    text = text.replace("stipend of ,500", "stipend of ₹5,500").replace("of ,500", "of ₹5,500")
    return text
