from langchain_text_splitters import RecursiveCharacterTextSplitter


def create_chunks(text: str) -> list[str]:
    """Split text into smaller overlapping chunks."""
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=50,
        length_function=len,
        separators=["\n\n", "\n", " ", ""]
    )
    chunks = splitter.split_text(text)
    return chunks
