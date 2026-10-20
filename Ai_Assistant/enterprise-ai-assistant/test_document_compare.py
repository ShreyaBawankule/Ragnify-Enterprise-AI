import asyncio
import io

from fastapi import UploadFile

from app.config.settings import get_settings
from app.services.document_service import DocumentService


async def main():

    service = DocumentService(get_settings())

    document1 = b"""Enterprise AI Assistant

The system helps employees with company information.

It can answer questions and summarize documents.

Version 1
"""

    document2 = b"""Enterprise AI Assistant

The system helps employees with company information.

It can answer questions, summarize documents, and generate reports.

Version 2
"""

    file1 = UploadFile(
        filename="document_v1.txt",
        file=io.BytesIO(document1),
    )

    file2 = UploadFile(
        filename="document_v2.txt",
        file=io.BytesIO(document2),
    )

    result = await service.compare_documents(
        file1,
        file2,
    )

    print("\nSUCCESS")
    print("Source:", result.source_filename)
    print("Target:", result.target_filename)
    print("Similarity:", result.similarity_ratio)
    print("Changed lines:", result.changed_lines)
    print("Diff lines:")

    for line in result.diff_lines:
        print(line)


if __name__ == "__main__":
    asyncio.run(main())