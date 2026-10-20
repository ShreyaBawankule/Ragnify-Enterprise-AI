import asyncio
from fastapi import UploadFile

from app.config.settings import get_settings
from app.services.document_service import DocumentService


async def main():
    settings = get_settings()
    service = DocumentService(settings)

    with open("test.pdf", "rb") as file:
        upload = UploadFile(
            filename="test.pdf",
            file=file,
        )

        result = await service.read_document(upload)

        print("SUCCESS")
        print(result)


asyncio.run(main())