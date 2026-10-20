from fastapi import FastAPI

from app.api import upload, chat

app = FastAPI()

app.include_router(upload.router)
app.include_router(chat.router)

@app.get("/")
def home():
    return {"message": "Welcome to ExecuAI Backend"}