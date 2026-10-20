# Enterprise AI Dataset

This dataset simulates daily operations at TechNova Solutions Pvt. Ltd., a software development and AI solutions company with 10 employees, 2 managers, and departments for AI, Frontend, Backend, HR, and QA.

## Folder Structure

- `Employees/`: employee master data in CSV and JSON.
- `Managers/`: manager master data in CSV.
- `Tasks/`: 60 realistic software development tasks in CSV and JSON.
- `Meetings/`: 10 meeting records.
- `Meeting_Transcripts/`: detailed meeting transcripts for sprint planning, AI development, RAG, dashboards, testing, deployment, and client feedback.
- `Company_Documents/`: markdown knowledge base documents suitable for RAG retrieval.
- `Document_Versions/`: v1 and v2 files for selected documents with meaningful changes.
- `Dashboard_Data/`: analytics derived from the task dataset.
- `SQL/`: relational schema and seed data.
- `JSON/`: sample API responses.
- `CSV/`: consolidated CSV copies for import and analysis.

## Entity Relationships

- Employees reference managers through `Manager ID`.
- Tasks reference both `Assigned Employee ID` and `Assigned Manager ID`.
- Dashboard metrics are derived from task status, deadlines, estimated hours, and actual hours.
- Meeting participants are employee names from the employee master data.
- Document versions support comparison and retrieval use cases for the AI assistant.

## Purpose

The dataset is designed for a Final Year Engineering Project named Enterprise AI Workspace. It can support demos for authentication, employee dashboards, manager dashboards, task tracking, meeting search, RAG-based document retrieval, AI assistant responses, and SQL analytics.
