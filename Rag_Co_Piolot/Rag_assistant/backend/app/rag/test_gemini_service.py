from app.rag.gemini_service import generate_answer


def main():
    question = "What is Retrieval-Augmented Generation?"

    context = """
Retrieval-Augmented Generation (RAG) is an AI architecture that retrieves
relevant information from a knowledge base before generating a response.
It improves accuracy by grounding answers in retrieved documents.
"""

    answer = generate_answer(question, context)

    print("\n===== Gemini Response =====\n")
    print(answer)


if __name__ == "__main__":
    main()