import asyncio

from app.config.settings import get_settings
from app.models.schemas import PDFGenerationRequest
from app.services.document_service import DocumentService


async def main():

    service = DocumentService(get_settings())

    payload = PDFGenerationRequest(
        title="Enterprise AI Assistant Test Report",
        content="""Enterprise AI Assistant

This is a PDF generation test.

The system can generate PDF documents from text content.

PDF generation is working successfully.""",
        author="Enterprise AI Assistant",
        subject="PDF Generation Test",
        keywords=["AI", "Assistant", "PDF"],
        footer_text="Enterprise AI Assistant",
        filename="enterprise_ai_test",
    )

    result = await service.generate_pdf(payload)

    print("\nSUCCESS")
    print("Filename:", result.filename)
    print("File path:", result.file_path)
    print("Download URL:", result.download_url)
    print("File size:", result.file_size_bytes, "bytes")
    print("Page count:", result.page_count)


if __name__ == "__main__":
    asyncio.run(main())