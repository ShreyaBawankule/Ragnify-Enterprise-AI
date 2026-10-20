# Data Quality Report

> SYNTHETIC DEMO DOCUMENT — NOT A REAL LEGAL DOCUMENT

## Validation checks

| # | Check | Result | Detail |
|---|---|---|---|
| 1 | At least 20 candidates | PASS | 20 |
| 2 | Unique candidate IDs | PASS |  |
| 3 | No duplicate email addresses | PASS | 54 |
| 4 | contact_details: every row belongs to an existing candidate | PASS | 20 |
| 5 | addresses: every row belongs to an existing candidate | PASS | 40 |
| 6 | emergency_contacts: every row belongs to an existing candidate | PASS | 20 |
| 7 | education: every row belongs to an existing candidate | PASS | 65 |
| 8 | employment_details: every row belongs to an existing candidate | PASS | 20 |
| 9 | internship_tenure: every row belongs to an existing candidate | PASS | 9 |
| 10 | working_hours: every row belongs to an existing candidate | PASS | 20 |
| 11 | offer_letters: every row belongs to an existing candidate | PASS | 20 |
| 12 | bank_payroll: every row belongs to an existing candidate | PASS | 20 |
| 13 | identity_verification: every row belongs to an existing candidate | PASS | 20 |
| 14 | documents: every row belongs to an existing candidate | PASS | 360 |
| 15 | onboarding_checklist: every row belongs to an existing candidate | PASS | 340 |
| 16 | consents: every row belongs to an existing candidate | PASS | 20 |
| 17 | system_accounts: every row belongs to an existing candidate | PASS | 20 |
| 18 | hr_verification: every row belongs to an existing candidate | PASS | 20 |
| 19 | Every candidate has an employment record | PASS |  |
| 20 | Every candidate has 18 documents and 17 checklist items | PASS |  |
| 21 | Primary keys unique in every table | PASS |  |
| 22 | Joining date matches between offer and employment | PASS |  |
| 23 | Offer date <= acceptance date < joining date (gap >= 14 days) | PASS |  |
| 24 | Offer valid_until after offer date | PASS |  |
| 25 | Internship end date after start date | PASS |  |
| 26 | Internship start date equals joining date | PASS |  |
| 27 | Interns have tenure rows, employees do not | PASS |  |
| 28 | Probation only for employees | PASS |  |
| 29 | Age at joining: employees >= 21, interns >= 18 | PASS |  |
| 30 | Document statuses are valid | PASS |  |
| 31 | VERIFIED documents have verifier and verification date | PASS |  |
| 32 | REJECTED documents have remarks, verifier and date | PASS |  |
| 33 | PENDING / NOT_REQUIRED / UPLOADED / UNDER_REVIEW documents have no verification date | PASS |  |
| 34 | PENDING / NOT_REQUIRED documents have no upload date | PASS |  |
| 35 | Uploaded / reviewed documents have an upload date | PASS |  |
| 36 | Verification date on or after upload date | PASS |  |
| 37 | No dates after 2026-10-02 in uploaded / verification / completion fields | PASS |  |
| 38 | Every filename contains its candidate ID | PASS |  |
| 39 | Checklist: COMPLETED items have completion date, others do not | PASS |  |
| 40 | Checklist completion dates are not before offer date | PASS |  |
| 41 | Checklist "Bank details submitted" matches Bank Proof document | PASS |  |
| 42 | Education verification status matches linked document | PASS |  |
| 43 | Education: one 10TH, one 12TH and at least one UG per candidate | PASS |  |
| 44 | Education years strictly increase (10th < 12th < UG < PG) | PASS |  |
| 45 | All ID placeholders start with DEMO- | PASS |  |
| 46 | No 10-digit or 12-digit numeric strings (no valid-looking phone, Aadhaar or account numbers) | PASS |  |
| 47 | All emails use reserved demo domains | PASS |  |
| 48 | All phone numbers use fictional +91-00000 range | PASS |  |
| 49 | No real password generated (password_status fixed) | PASS |  |
| 50 | data_classification = SYNTHETIC_DEMO everywhere | PASS |  |
| 51 | No blank mandatory fields | PASS | [] |
| 52 | CTC only for employees, stipend only for interns | PASS |  |
| 53 | Payroll ON_HOLD only where bank proof is missing or rejected | PASS |  |
| 54 | System IDs unique | PASS |  |

**Checks passed: 54 / 54**

## Summary

- Total candidates: 20
- Total employees: 11
- Total interns: 9
- Total documents: 360 (18 per candidate)
- Verified documents: 241
- Pending documents (not uploaded): 22
- Rejected documents: 2
- Uploaded (awaiting review): 36
- Under review: 15
- Not required: 44
- Candidates fully onboarded: 5
- Candidates with incomplete onboarding: 15
- Candidates with pending manager verification: 11
- Candidates with pending HR verification: 11

## Scenario mix (overall_onboarding_status)

- FULLY_ONBOARDED: 5 (CAND-001, CAND-002, CAND-003, CAND-004, CAND-005)
- DOCUMENTS_UNDER_REVIEW: 2 (CAND-006, CAND-007)
- MISSING_BANK_PROOF: 2 (CAND-008, CAND-009)
- MISSING_EDUCATION_DOCUMENT: 2 (CAND-010, CAND-011)
- OFFER_ACCEPTED_ONBOARDING_PENDING: 3 (CAND-012, CAND-013, CAND-014)
- MANAGER_VERIFICATION_PENDING: 2 (CAND-015, CAND-016)
- BACKGROUND_VERIFICATION_PENDING: 2 (CAND-017, CAND-018)
- REJECTED_DOCUMENT_REUPLOAD_REQUIRED: 2 (CAND-019, CAND-020)
