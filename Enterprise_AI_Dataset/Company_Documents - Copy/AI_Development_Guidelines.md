# AI Development Guidelines

## Grounded Responses

AI assistant answers should be grounded in approved company documents, meeting transcripts, task records, and project requirements. Unsupported claims must be avoided.

## Retrieval Quality

RAG pipelines should store document title, version, department, effective date, and access level as metadata. Retrieval tests must cover policy questions, project questions, and meeting action item questions.

## Safety

The assistant must not reveal sensitive salary, personal, or HR details unless the user role is authorized in the application design.
