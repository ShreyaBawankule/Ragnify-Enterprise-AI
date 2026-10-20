from app.rag.retriever import retrieve_documents


def main():
    query = input("Enter your question: ")

    results = retrieve_documents(query)

    print("\n===== Retrieved Chunks =====\n")

    for i, chunk in enumerate(results, start=1):
        print(f"Chunk {i}:")
        print(chunk)
        print("-" * 80)


if __name__ == "__main__":
    main()