from app.rag.rag_pipeline import ask_question


def main():
    print("=" * 60)
    print("ExecuAI RAG Pipeline Test")
    print("=" * 60)

    question = input("\nEnter your question: ")

    print("\nSearching documents...")
    print("\nGenerating answer...\n")

    answer = ask_question(question)

    print("=" * 60)
    print("Answer:")
    print("=" * 60)
    print(answer)


if __name__ == "__main__":
    main()