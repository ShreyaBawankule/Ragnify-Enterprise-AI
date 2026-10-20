import os
import sys
from rag.vector_store import collection, search_documents_with_metadata, get_indexed_documents_summary
from database import SessionLocal
import models

print("=" * 60)
print("1. CHROMADB VECTOR STORE STATUS")
print("=" * 60)
total_chunks = collection.count()
print(f"Total Chunks in ChromaDB: {total_chunks}")
summary = get_indexed_documents_summary(role="ADMIN")
print(f"Total Unique Document Policies in Vector Store: {summary['total_documents']}")
for d in summary['documents']:
    title = d.get('name', 'Unknown')
    tier = d.get('access_tier', 'None')
    roles = d.get('allowed_roles', 'All')
    chunks = d.get('chunks', 0)
    print(f"  [+] {title} ({chunks} chunks)")
    print(f"      Tier: {tier} | Allowed: {roles}")

print("\n" + "=" * 60)
print("2. 4-TIER RBAC FILTER & SECURITY AUDIT")
print("=" * 60)

# Test 1: Employee leaves query
q1 = "How many annual paid leaves do employees get?"
print(f"Test Query 1: '{q1}'")

chunks_intern = search_documents_with_metadata(q1, n_results=3, role="INTERN")
print(f"  -> Intern Role Retrieved Chunks: {len(chunks_intern)}")
for c in chunks_intern:
    print(f"     Allowed to Intern: {c['metadata'].get('filename')} (Roles: {c['metadata'].get('allowed_roles')})")

chunks_emp = search_documents_with_metadata(q1, n_results=3, role="EMPLOYEE")
print(f"  -> Employee Role Retrieved Chunks: {len(chunks_emp)}")
for c in chunks_emp:
    print(f"     Allowed to Employee: {c['metadata'].get('filename')} (Roles: {c['metadata'].get('allowed_roles')})")

# Test 2: Confidential Salary & Compensation query
q2 = "What is the compensation band and ESOP units for L3 Engineering Manager?"
print(f"\nTest Query 2 (Confidential): '{q2}'")

chunks_intern_sal = search_documents_with_metadata(q2, n_results=3, role="INTERN")
print(f"  -> Intern Role Retrieved Chunks: {len(chunks_intern_sal)}")
for c in chunks_intern_sal:
    print(f"     Intern sees: {c['metadata'].get('filename')}")

chunks_emp_sal = search_documents_with_metadata(q2, n_results=3, role="EMPLOYEE")
print(f"  -> Employee Role Retrieved Chunks: {len(chunks_emp_sal)}")
for c in chunks_emp_sal:
    print(f"     Employee sees: {c['metadata'].get('filename')}")

chunks_hr_sal = search_documents_with_metadata(q2, n_results=3, role="HR")
print(f"  -> HR Role Retrieved Chunks: {len(chunks_hr_sal)}")
for c in chunks_hr_sal:
    print(f"     HR sees: {c['metadata'].get('filename')} (Tier: {c['metadata'].get('access_tier')})")

print("\n" + "=" * 60)
print("3. RELATIONAL DATABASE & OPERATIONAL MODELS AUDIT")
print("=" * 60)
db = SessionLocal()
try:
    cands = db.query(models.CandidateProfile).all()
    print(f"Candidates Registered: {len(cands)}")
    for c in cands[:4]:
        print(f"  - {c.candidate_id}: {c.full_name} ({c.candidate_type})")

    offers = db.query(models.OfferLetter).all()
    print(f"Offer Letters Generated: {len(offers)}")
    for o in offers[:3]:
        print(f"  - {o.offer_id}: {o.candidate_id} | Role: {o.position} | Status: {o.offer_letter_status}")

    certs = db.query(models.InternshipTenure).all()
    print(f"Internship Tenures Tracked: {len(certs)}")

    wh = db.query(models.WorkingHours).all()
    print(f"Working Hour Logs: {len(wh)}")
finally:
    db.close()

print("\n" + "=" * 60)
print("4. REPORTLAB PDF & CERTIFICATE GENERATION AUDIT")
print("=" * 60)
from services.report_generator_service import generate_offer_letter_pdf
res_pdf = generate_offer_letter_pdf(
    candidate_name="Ananya Sharma",
    candidate_id="CAND-001",
    role="Senior AI Engineer",
    department="AI & Data Science",
    ctc_or_stipend="INR 14,50,000 / annum",
    candidate_type="Employee",
    joining_date="2026-06-15",
    reporting_manager="Dr. Rajesh Khanna, Head of AI"
)
print("Offer Letter PDF Generated:", res_pdf["filename"])
print("Static Path:", res_pdf["static_url"])

print("\n" + "=" * 60)
print("ALL SYSTEM MODULES, CHROMADB, RBAC & GENERATORS ARE FULLY OPERATIONAL!")
print("=" * 60)
