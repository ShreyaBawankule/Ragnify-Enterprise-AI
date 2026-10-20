import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)


def generate_answer(question, context):
    prompt = f"""
You are a helpful AI assistant for RAGNIFY.

Use only the information provided in the context to answer the question.

Context:
{context}

Question:
{question}

Instructions:
- Answer using only the given context.
- If the answer is not present in the context, clearly say that the information is not available in the provided documents.
- Do not invent information.
- Give a clear and concise answer.
"""

    response = client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.2
    )

    return response.choices[0].message.content