import os
from uuid import uuid4
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib import colors

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

# ==============================================================================
# AUTHORITATIVE RAGNIFY SAAS KNOWLEDGE BASE CORPUS (WITH RBAC ACCESS TIERS)
# ==============================================================================
KNOWLEDGE_BASE_SPEC = [
    {
        "filename": "RAGNIFY_Internship_Handbook_2026.pdf",
        "title": "RAGNIFY Official Internship Program Handbook (2026)",
        "access_tier": "INTERN_ONLY",
        "allowed_roles": "INTERN,MANAGER,HR,ADMIN",
        "category": "Intern Guidelines & Tenure",
        "size_label": "1.4 MB",
        "chunks": [
            (
                "RAGNIFY Official Internship Handbook 2026 — Section 1: Internship Tenure, Stipend & Payout Rules.\n"
                "• Standard Internship Tenure: 3 Months (92 Calendar Days).\n"
                "• Monthly Stipend: ₹30,000 to ₹35,000 per month depending on engineering track (Frontend/Backend/AI Research), "
                "credited via Direct Bank Transfer on the last working day of each month.\n"
                "• Daily Working Hours & Time Clock: Interns are expected to log 8.5 hours per working day using the real-time "
                "Attendance Time Clock ('Start Work' and 'Pause / End Work'). Multiple work sessions on the same calendar date "
                "automatically accumulate into a single audited daily row.\n"
                "• Intern Leave Policy: Interns are entitled to 1 Paid Casual Leave per month (3 paid leaves across the 92-day tenure). "
                "Any additional leave requires prior approval from the assigned Engineering Mentor."
            ),
            (
                "RAGNIFY Official Internship Handbook 2026 — Section 2: Certificate of Completion & Pre-Placement Offer (PPO).\n"
                "• 3-Stage Certificate Governance Lifecycle:\n"
                "  1. LOCKED (Tenure In-Progress): While the intern is completing the 92-day tenure and assigned sprint deliverables.\n"
                "  2. UPCOMING (Ready for HR Sign-Off): Triggered when tenure reaches ≥75%–100% completion and final deliverables are reviewed.\n"
                "  3. AVAILABLE (Issued & Unlocked): Once HR Operations (Priya Sharma) and the Engineering Mentor approve clearance, "
                "the cryptographically verified Royal Navy & Gold PDF Certificate is unlocked in the Intern Portal.\n"
                "• Full-Time Conversion (PPO Eligibility): Interns who maintain ≥90% task completion velocity and receive an 'Optimal' "
                "or 'Exceeds Expectations' workload evaluation from their Engineering Manager are eligible for a Pre-Placement Offer (PPO) "
                "at Level L1 (₹12,00,000 – ₹16,00,000 LPA)."
            ),
            (
                "RAGNIFY Official Internship Handbook 2026 — Section 3: Data Access Boundaries for Interns.\n"
                "• Security Scope: Intern accounts are restricted to Intern Program Guidelines, Engineering Coding Standards, "
                "and their own personal profile, tasks, and attendance records.\n"
                "• Restricted Data: Interns do NOT have access to the Company RAG Vault, Full-Time Employee Benefit Handbooks, "
                "Internal Corporate Financials, Manager Appraisal Playbooks, HR Compensation Grids, or other employees' private records."
            )
        ]
    },
    {
        "filename": "RAGNIFY_Engineering_And_SaaS_Architecture_Guide_2026.pdf",
        "title": "RAGNIFY Engineering & SaaS Architecture Standards (2026)",
        "access_tier": "INTERN_PUBLIC",
        "allowed_roles": "INTERN,EMPLOYEE,MANAGER,HR,ADMIN",
        "category": "Engineering & Technical Standards",
        "size_label": "1.9 MB",
        "chunks": [
            (
                "RAGNIFY Engineering & SaaS Architecture Guide 2026 — Section 1: Production Technology Stack.\n"
                "• Frontend Architecture: React 18, Vite 8, React Router v6, CSS Custom Properties Design System (Light & Dark SaaS themes), "
                "and Axios service layer with graceful offline fallbacks.\n"
                "• Backend Architecture: Python FastAPI, SQLAlchemy ORM, PostgreSQL relational database (employees, tasks, onboarding, "
                "documents, working hours, tenures, notifications, and meetings).\n"
                "• AI & RAG Pipeline: ChromaDB PersistentClient vector store ('ragnify_docs' collection), SentenceTransformer "
                "('all-MiniLM-L6-v2' 384-dimensional dense embeddings), Groq Cloud LLM ('openai/gpt-oss-120b'), Whisper speech-to-text "
                "for meeting audio transcription, and ReportLab + python-pptx for automated PDF and PowerPoint generation."
            ),
            (
                "RAGNIFY Engineering & SaaS Architecture Guide 2026 — Section 2: Sprint Delivery & Code Quality Rules.\n"
                "• Automated Task Progress: Team and individual project progress percentages are calculated automatically from completed "
                "tasks (Completed Tasks / Total Assigned Tasks × 100). Managers assign, edit, or cancel tasks, while progress updates "
                "strictly when employees/interns complete deliverables.\n"
                "• Pull Request & Deployment SLA: Every feature branch requires passing 'npm run build' with zero warnings/errors, "
                "unit test validation, and code review sign-off by the Engineering Manager within 24 hours."
            )
        ]
    },
    {
        "filename": "RAGNIFY_Employee_Handbook_And_Benefits_2026.pdf",
        "title": "RAGNIFY Full-Time Employee Handbook & Benefits Policy (2026)",
        "access_tier": "COMPANY_INTERNAL",
        "allowed_roles": "EMPLOYEE,MANAGER,HR,ADMIN",
        "category": "Company HR Policy (Employees Only)",
        "size_label": "2.6 MB",
        "chunks": [
            (
                "RAGNIFY Full-Time Employee Handbook 2026 — Section 1: Annual Leave, Sick Leave & Holiday Entitlements.\n"
                "• Applicability: Strictly for Full-Time Employees, Managers, HR, and Admin personnel (Not applicable to Interns).\n"
                "• Annual Paid Leave Quota: Every full-time employee receives 30 Paid Leaves per year, consisting of:\n"
                "  - 18 Paid Casual / Privilege Leaves (CL)\n"
                "  - 12 Paid Sick / Medical Leaves (SL)\n"
                "  - Plus 10 Paid National & Festival Holidays (Total 40 paid days off annually).\n"
                "• Carry-Forward & Encashment: Up to 10 unused Casual Leaves can be carried forward to the next calendar year. "
                "Medical leaves exceeding 3 consecutive days require a medical fitness certificate.\n"
                "• Parental Leave: 26 weeks paid Maternity Leave and 15 working days paid Paternity Leave."
            ),
            (
                "RAGNIFY Full-Time Employee Handbook 2026 — Section 2: Equipment Allowance, Health Insurance & Hybrid Work.\n"
                "• Equipment & Ergonomic Allowance: Full-time employees receive a ₹5,500 allowance for home-office equipment "
                "(monitor stand, mechanical keyboard, ergonomic accessories). Claims must be submitted within 30 days of joining "
                "with valid GST invoices.\n"
                "• Group Medical Insurance: ₹5,00,000 Family Floater Health Insurance covering the employee, spouse, and up to 2 children, "
                "plus an annual preventive executive health checkup reimbursement of up to ₹3,500.\n"
                "• Learning & Certification Budget: ₹25,000 per year for approved cloud, AI/ML, and leadership certifications.\n"
                "• Hybrid Work Model: 3 days in-office (Tuesday–Thursday) and 2 days remote (Monday, Friday). Employees may also "
                "request up to 15 days per year of Work-From-Anywhere (WFA) with Manager approval."
            ),
            (
                "RAGNIFY Full-Time Employee Handbook 2026 — Section 3: Probation Confirmation & Working Hours.\n"
                "• Probation Period: All full-time hires undergo a 3-to-6 month probation evaluation. Upon successful completion, "
                "HR issues the official 'Probation Confirmation & Service Award' certificate.\n"
                "• Standard Working Hours: 40–42.5 hours per week (8 to 8.5 hours/day, Monday to Friday) tracked via the Employee "
                "Working Time Clock."
            )
        ]
    },
    {
        "filename": "RAGNIFY_IT_Security_And_Data_Privacy_Policy_2026.pdf",
        "title": "RAGNIFY Enterprise IT Security, RBAC & Employee Privacy Policy (2026)",
        "access_tier": "COMPANY_INTERNAL",
        "allowed_roles": "EMPLOYEE,MANAGER,HR,ADMIN",
        "category": "IT Security & Privacy Compliance",
        "size_label": "1.8 MB",
        "chunks": [
            (
                "RAGNIFY Enterprise IT Security & Data Privacy Policy 2026 — Section 1: Individual Employee Privacy Law.\n"
                "• Strict Personal Data Isolation: Every employee and intern has an isolated privacy boundary. Personal compensation "
                "(salary/stipend), bank account numbers, PAN/Aadhaar KYC documents, individual task queues, attendance logs, and "
                "performance evaluations are strictly private to that individual.\n"
                "• Cross-Employee Query Prohibition: No employee or intern is permitted to view, download, or query another colleague's "
                "salary, private documents, attendance, or tasks via the UI or AI Assistants.\n"
                "• Authentic Document Mandate: Only original, candidate-uploaded KYC and academic documents are stored in the HR "
                "repository ('uploads/documents/'). Synthetic or unverified placeholder files are strictly prohibited."
            ),
            (
                "RAGNIFY Enterprise IT Security & Data Privacy Policy 2026 — Section 2: Role-Based Access Control (RBAC) Matrix.\n"
                "• Tier 1 (INTERN): Access only to Intern Handbook, Engineering Coding Guide, and own personal internship records. "
                "Zero access to internal company policies or employee data.\n"
                "• Tier 2 (EMPLOYEE): Access to Company Employee Handbook, Leave Policy, IT Security Guidelines, and own personal "
                "employment records. Zero access to Manager Playbooks, HR Compensation Grids, or other employees' private records.\n"
                "• Tier 3 (MANAGER): Access to Company Policies + Manager Leadership & Appraisal Playbook + assigned team's tasks & workload.\n"
                "• Tier 4 (HR & ADMIN): Full governance access across onboarding, document verification, offer letters, certificates, "
                "and HR Compensation Grids."
            )
        ]
    },
    {
        "filename": "RAGNIFY_Manager_Leadership_And_Appraisal_Playbook_2026.pdf",
        "title": "RAGNIFY Engineering Manager Leadership, Workload & Appraisal Playbook (2026)",
        "access_tier": "MANAGER_RESTRICTED",
        "allowed_roles": "MANAGER,HR,ADMIN",
        "category": "Manager Confidential Playbook",
        "size_label": "2.1 MB",
        "chunks": [
            (
                "RAGNIFY Manager Leadership & Appraisal Playbook 2026 [CONFIDENTIAL — MANAGER, HR & ADMIN ONLY] — Section 1: "
                "Team Workload Review & Task Governance.\n"
                "• Workload Balancing Thresholds:\n"
                "  - Optimal Load: 3 to 5 active sprint tasks with ≥65% completion velocity.\n"
                "  - High Load (Overallocated): >5 active tasks or multiple high-priority blockers; requires immediate task redistribution.\n"
                "  - Underutilized: ≤2 active tasks; eligible for new backlog assignment.\n"
                "• Task Lifecycle Controls: Managers can create tasks, edit task titles/priorities/deadlines, or delete/cancel obsolete tasks. "
                "Task completion progress is driven strictly by employee/intern task completion."
            ),
            (
                "RAGNIFY Manager Leadership & Appraisal Playbook 2026 [CONFIDENTIAL — MANAGER, HR & ADMIN ONLY] — Section 2: "
                "Performance Appraisal Ratings, Merit Bonus Pool & PIP Protocol.\n"
                "• Annual Performance Rating Scale (1 to 5):\n"
                "  - Rating 5 (Exceptional): 18%–22% annual performance bonus + fast-track promotion eligibility.\n"
                "  - Rating 4 (Exceeds Expectations): 12%–16% annual performance bonus.\n"
                "  - Rating 3 (Meets Expectations): 8%–10% standard bonus.\n"
                "  - Rating 1–2 (Needs Improvement): Placed on a structured 45-day Performance Improvement Plan (PIP) with weekly "
                "manager check-ins before any HR escalation.\n"
                "• Department Budget Allocation: Engineering Managers hold a quarterly discretionary team tooling & recognition budget "
                "of ₹1,50,000 per squad."
            )
        ]
    },
    {
        "filename": "RAGNIFY_HR_Compensation_Grids_And_Executive_Governance_2026.pdf",
        "title": "RAGNIFY HR Master Compensation Grids, ESOPs & Severance Governance (2026)",
        "access_tier": "HR_CONFIDENTIAL",
        "allowed_roles": "HR,ADMIN",
        "category": "HR & Executive Confidential",
        "size_label": "2.8 MB",
        "chunks": [
            (
                "RAGNIFY HR Master Compensation Grids 2026 [STRICTLY CONFIDENTIAL — HR & ADMIN ONLY] — Section 1: "
                "2026 Salary Bands & ESOP Equity Matrix.\n"
                "• Band I0 (Engineering / AI / Product Intern): ₹30,000 – ₹35,000 / month stipend (No ESOPs during internship).\n"
                "• Band L1 (Software Engineer / Associate): ₹12,00,000 – ₹16,00,000 LPA + 500 ESOP units (4-year vesting, 1-year cliff).\n"
                "• Band L2 (Senior Software Engineer / Data Scientist / Product Designer): ₹18,00,000 – ₹26,00,000 LPA + 1,200 ESOP units.\n"
                "• Band L3 (Engineering Manager / DevOps Lead / Staff Engineer): ₹28,00,000 – ₹38,00,000 LPA + 2,500 ESOP units.\n"
                "• Band L4 (Director / Head of People Operations / VP): ₹42,00,000 – ₹60,00,000 LPA + 5,000 ESOP units."
            ),
            (
                "RAGNIFY HR Master Compensation Grids 2026 [STRICTLY CONFIDENTIAL — HR & ADMIN ONLY] — Section 2: "
                "Severance, Termination Protocols & Offer Letter Governance.\n"
                "• Notice Period: 60 calendar days for confirmed full-time employees; 15 calendar days during probation or internship.\n"
                "• Severance Package: In the event of organizational restructuring, affected full-time employees receive 2 months of "
                "gross base pay plus pro-rata variable bonus and accelerated ESOP vesting for the current quarter.\n"
                "• Disciplinary & Termination Governance: Immediate termination applies only to verified breaches of the IT Security Policy, "
                "fraudulent KYC documentation, or severe code-of-conduct violations, requiring joint sign-off from Head of HR (Priya Sharma) "
                "and Legal Counsel.\n"
                "• Full & Final (F&F) Settlement SLA: Processed within 14 business days of the last working day."
            )
        ]
    }
]


def _generate_policy_pdf_file(doc_spec: dict):
    """Create a clean, readable PDF file in uploads/ for each official knowledge base document."""
    pdf_path = os.path.join(UPLOAD_DIR, doc_spec["filename"])
    try:
        c = canvas.Canvas(pdf_path, pagesize=letter)
        width, height = letter

        # Header Banner
        c.setFillColor(colors.HexColor("#0F172A"))
        c.rect(0, height - 85, width, 85, fill=True, stroke=False)
        c.setFillColor(colors.HexColor("#FFFFFF"))
        c.setFont("Helvetica-Bold", 15)
        c.drawString(40, height - 42, doc_spec["title"])
        c.setFont("Helvetica", 9.5)
        c.setFillColor(colors.HexColor("#93C5FD"))
        c.drawString(
            40,
            height - 62,
            f"Security Classification: {doc_spec['access_tier']}  |  Authorized Roles: {doc_spec['allowed_roles']}"
        )

        y = height - 115
        c.setFillColor(colors.HexColor("#1E293B"))
        for chunk in doc_spec["chunks"]:
            for line in chunk.split("\n"):
                # Wrap long lines at ~92 chars
                words = line.split(" ")
                curr = ""
                for w in words:
                    if len(curr) + len(w) + 1 <= 92:
                        curr = (curr + " " + w).strip()
                    else:
                        if y < 60:
                            c.showPage()
                            y = height - 60
                        c.setFont("Helvetica-Bold" if ("Section" in curr or "RAGNIFY" in curr) else "Helvetica", 10)
                        c.drawString(40, y, curr)
                        y -= 15
                        curr = w
                if curr:
                    if y < 60:
                        c.showPage()
                        y = height - 60
                    c.setFont("Helvetica-Bold" if ("Section" in curr or "RAGNIFY" in curr) else "Helvetica", 10)
                    c.drawString(40, y, curr)
                    y -= 15
            y -= 12

        c.save()
    except Exception as e:
        print(f"Warning: Could not write PDF {pdf_path}: {e}")


def ensure_knowledge_base_seeded(collection, model):
    """
    Ensure all 6 official RAGNIFY enterprise policy documents are generated as PDFs
    and indexed into ChromaDB with strict RBAC metadata.
    """
    existing = collection.get(include=["metadatas"])
    existing_metas = existing.get("metadatas") or []
    existing_files = {m.get("filename") for m in existing_metas if isinstance(m, dict)}

    # Check if our 6 authoritative documents are already indexed with correct access_tier metadata
    intern_meta = next((m for m in existing_metas if isinstance(m, dict) and m.get("filename") == "RAGNIFY_Internship_Handbook_2026.pdf"), None)
    has_rbac_docs = all(
        doc["filename"] in existing_files for doc in KNOWLEDGE_BASE_SPEC
    ) and any(isinstance(m, dict) and m.get("access_tier") for m in existing_metas) and (
        intern_meta and "EMPLOYEE" not in (intern_meta.get("allowed_roles") or "")
    )

    if has_rbac_docs:
        return

    print("Seeding RAGNIFY Enterprise SaaS Knowledge Base into ChromaDB with RBAC tiers...")

    # Also tag any pre-existing uploaded PDFs that lack access_tier as COMPANY_INTERNAL
    if existing and existing.get("ids"):
        ids_to_delete = []
        for doc_id, meta in zip(existing["ids"], existing_metas):
            fname = (meta or {}).get("filename", "")
            if fname in {d["filename"] for d in KNOWLEDGE_BASE_SPEC} or fname == "RAGNIFY_Company_Policy.pdf":
                ids_to_delete.append(doc_id)
        if ids_to_delete:
            try:
                collection.delete(ids=ids_to_delete)
            except Exception:
                pass

    for doc_spec in KNOWLEDGE_BASE_SPEC:
        _generate_policy_pdf_file(doc_spec)
        chunks = doc_spec["chunks"]
        embeddings = model.encode(chunks).tolist()
        ids = [f"kb_{uuid4().hex}" for _ in chunks]
        metadatas = [
            {
                "filename": doc_spec["filename"],
                "title": doc_spec["title"],
                "access_tier": doc_spec["access_tier"],
                "allowed_roles": doc_spec["allowed_roles"],
                "category": doc_spec["category"],
                "size_label": doc_spec["size_label"],
                "chunk_index": idx
            }
            for idx in range(len(chunks))
        ]
        collection.add(
            documents=chunks,
            embeddings=embeddings,
            ids=ids,
            metadatas=metadatas
        )

    print("RAGNIFY Knowledge Base successfully seeded with 6 RBAC-classified policy documents!")
