# RAGNIFY HR Onboarding - Requirements Analysis and Data Model

> SYNTHETIC DEMO DOCUMENT — NOT A REAL LEGAL DOCUMENT
> All data in this package is fictional. Requirements vary by organization, employment type and applicable laws or policies. Treat this list as a starting point and confirm it with your HR and legal teams.

## Part 1 - Onboarding requirements by category

### 1. Personal Information
- **Purpose:** Identify the person and create the master profile.
- **Mandatory fields:** Full name, gender, date of birth, nationality, marital status, blood group
- **Optional fields:** Profile photo, preferred name
- **Usual documents:** Photograph; Aadhaar or other ID (name and DOB match); 10th marksheet (DOB proof)

### 2. Contact Information
- **Purpose:** Reach the candidate before and after joining.
- **Mandatory fields:** Personal email, mobile number
- **Optional fields:** Alternate phone, company email (created after acceptance)
- **Usual documents:** None (verified by OTP or reply)

### 3. Address Information
- **Purpose:** Record where the person lives for communication, payroll and statutory forms.
- **Mandatory fields:** Current address, permanent address, city, state, country, PIN code
- **Optional fields:** Landmark
- **Usual documents:** Address proof (Aadhaar, utility bill, rent agreement or passport)

### 4. Emergency Contact
- **Purpose:** Reach someone quickly in an emergency.
- **Mandatory fields:** Contact name, relationship, phone, address
- **Optional fields:** Email
- **Usual documents:** Emergency contact form

### 5. Identity Verification
- **Purpose:** Confirm the person is who they say they are.
- **Mandatory fields:** Primary ID (Aadhaar or equivalent), PAN for employees
- **Optional fields:** Passport, voter ID, driving licence, college ID (interns)
- **Usual documents:** Aadhaar, PAN card, passport, voter ID, driving licence, college ID

### 6. Educational Information
- **Purpose:** Confirm qualifications required for the role.
- **Mandatory fields:** Highest qualification, degree, specialization, institution, year, score, 10th and 12th details
- **Optional fields:** Diploma details, certifications
- **Usual documents:** 10th and 12th marksheets, degree certificate, graduation marksheets

### 7. Employment / Internship Information
- **Purpose:** Define the role, reporting line and work arrangement.
- **Mandatory fields:** Type, title, department, manager, HR coordinator, employment type, location, work mode, joining date
- **Optional fields:** Probation (employees), previous employer and experience (experienced hires)
- **Usual documents:** Resume, previous employment documents (relieving letter, payslips), internship certificate

### 8. Bank / Payroll Information
- **Purpose:** Pay salary or stipend correctly.
- **Mandatory fields:** Bank name, account holder name, account number, IFSC, branch
- **Optional fields:** Secondary account
- **Usual documents:** Cancelled cheque or bank passbook first page

### 9. Tax / Statutory Information
- **Purpose:** Meet tax and statutory rules (PAN, PF/UAN, ESI where applicable).
- **Mandatory fields:** PAN (employees)
- **Optional fields:** UAN, previous PF details, Form 12B (prior-employer income) for experienced hires
- **Usual documents:** PAN card, previous Form 16, UAN details

### 10. Joining Information
- **Purpose:** Plan day one.
- **Mandatory fields:** Joining date, work location, work mode, reporting manager, working hours
- **Optional fields:** Shift, buddy or mentor, joining kit preferences
- **Usual documents:** Joining checklist

### 11. Offer / Appointment Information
- **Purpose:** Record the formal offer and acceptance.
- **Mandatory fields:** Offer date, position, department, manager, acceptance status and date
- **Optional fields:** Appointment letter number
- **Usual documents:** Offer letter, appointment letter (employees), internship offer letter (interns)

### 12. Document Verification
- **Purpose:** Track each document from upload to verification.
- **Mandatory fields:** Document type, filename, status, uploaded date, verifier, verification date
- **Optional fields:** Remarks
- **Usual documents:** All documents above

### 13. Consent / Declaration
- **Purpose:** Capture agreement to data use and company rules.
- **Mandatory fields:** Data privacy consent, background verification consent, policy acknowledgement, code of conduct, declaration
- **Optional fields:** NDA (policy dependent)
- **Usual documents:** Signed declaration, consent form, NDA

### 14. IT / System Access
- **Purpose:** Give the person the tools needed to start work.
- **Mandatory fields:** Company email, RAGNIFY account, employee or intern ID, role, department access
- **Optional fields:** Software list, laptop, access card
- **Usual documents:** IT access request form

### 15. HR Onboarding Status
- **Purpose:** Show where each candidate is in the process.
- **Mandatory fields:** HR verification, manager verification, document verification, background verification, overall status
- **Optional fields:** Missing documents, remarks
- **Usual documents:** Document verification form

### 16. Internship-specific Information
- **Purpose:** Cover items that apply only to interns.
- **Mandatory fields:** Internship start and end date, duration, objectives, assigned department, mentor
- **Optional fields:** College NOC or bonafide letter, stipend details
- **Usual documents:** Internship offer letter, college ID, completion or clearance form (at the end)

## Part 2 - Data model (PostgreSQL / FastAPI)

Primary keys are the first column of each table. `candidate_id` is a foreign key to `candidate_profile` in every other table. M = mandatory, O = optional. Examples come from CAND-001 (or the first row that has a value).

### `hr_staff` - Reference
Fictional HR coordinators who verify documents.

| Field | Data type | M/O | Example | Description |
|---|---|---|---|---|
| hr_id | VARCHAR(10) | M | HR-001 | HR coordinator ID |
| hr_name | VARCHAR(100) | M | Meera Kulkarni | Fictional HR coordinator name |
| hr_email | VARCHAR(120) | M | hr-001@ragnify-demo.example | Demo HR email |

### `managers` - Reference
Fictional department managers.

| Field | Data type | M/O | Example | Description |
|---|---|---|---|---|
| manager_id | VARCHAR(10) | M | MGR-001 | Manager ID |
| manager_name | VARCHAR(100) | M | Vikram Joshi | Fictional manager name |
| department | VARCHAR(60) | M | Engineering | Department managed |

### `candidate_profile` - A. Candidate / User Profile
One row per candidate (employee or intern). Parent table for all others.

| Field | Data type | M/O | Example | Description |
|---|---|---|---|---|
| candidate_id | VARCHAR(12) | M | CAND-001 | Unique candidate ID, format CAND-001 |
| full_name | VARCHAR(100) | M | Aarav Deshmukh | Fictional full name |
| gender | VARCHAR(10) | M | Male | Male / Female / Other |
| date_of_birth | DATE | M | 1999-03-14 | Date of birth |
| nationality | VARCHAR(30) | M | Indian | Nationality |
| marital_status | VARCHAR(15) | M | Single | Single / Married |
| blood_group | VARCHAR(5) | M | AB+ | Blood group |
| profile_photo_filename | VARCHAR(120) | M | CAND-001_Photograph.jpg | Placeholder photo filename |
| candidate_type | VARCHAR(10) | M | Employee | Employee or Intern |
| data_classification | VARCHAR(30) | M | SYNTHETIC_DEMO | Always SYNTHETIC_DEMO |

### `contact_details` - B. Contact Details
Email and phone details (all fictional).

| Field | Data type | M/O | Example | Description |
|---|---|---|---|---|
| contact_id | VARCHAR(12) | M | CON-001 | Primary key |
| candidate_id | VARCHAR(12) | M | CAND-001 | FK to candidate_profile (FK: candidate_profile(candidate_id)) |
| personal_email | VARCHAR(120) | M | aarav.deshmukh.demo001@example.com | Demo personal email (example.com) |
| official_email | VARCHAR(120) | M | aarav.deshmukh@ragnify-demo.example | Demo company email (ragnify-demo.example) |
| mobile_number | VARCHAR(20) | M | +91-00000-10001 | Demo mobile number (+91-00000-xxxxx) |
| alternate_phone | VARCHAR(20) | O | +91-00000-30002 | Alternate demo phone |

### `addresses` - C. Address
Current and permanent address (two rows per candidate).

| Field | Data type | M/O | Example | Description |
|---|---|---|---|---|
| address_id | VARCHAR(12) | M | ADR-001 | Primary key |
| candidate_id | VARCHAR(12) | M | CAND-001 | FK to candidate_profile (FK: candidate_profile(candidate_id)) |
| address_type | VARCHAR(12) | M | CURRENT | CURRENT or PERMANENT |
| address_line | VARCHAR(200) | M | Flat 101, Demo Residency, Sample Road, DEMO Locality 1 | Fictional street address |
| city | VARCHAR(60) | M | Nagpur | City |
| state | VARCHAR(60) | M | Maharashtra | State |
| country | VARCHAR(30) | M | India | Country |
| pin_code | VARCHAR(6) | M | 440901 | Fictional 6-digit PIN |

### `emergency_contacts` - D. Emergency Contact
Person to contact in an emergency.

| Field | Data type | M/O | Example | Description |
|---|---|---|---|---|
| emergency_contact_id | VARCHAR(12) | M | EMC-001 | Primary key |
| candidate_id | VARCHAR(12) | M | CAND-001 | FK to candidate_profile (FK: candidate_profile(candidate_id)) |
| contact_name | VARCHAR(100) | M | Ramesh Deshmukh | Fictional contact name |
| relationship | VARCHAR(30) | M | Father | Father / Mother / Spouse / Sibling |
| phone | VARCHAR(20) | M | +91-00000-20001 | Demo phone |
| email | VARCHAR(120) | O | ramesh.deshmukh.demo001@example.org | Demo email |
| address | VARCHAR(250) | M | Flat 101, Demo Residency, Sample Road, DEMO Locality 1, Nagp | Contact address |

### `education` - E. Education
One row per education level per candidate.

| Field | Data type | M/O | Example | Description |
|---|---|---|---|---|
| education_id | VARCHAR(12) | M | EDU-001 | Primary key |
| candidate_id | VARCHAR(12) | M | CAND-001 | FK to candidate_profile (FK: candidate_profile(candidate_id)) |
| level | VARCHAR(10) | M | 10TH | 10TH / 12TH / UG / PG |
| qualification | VARCHAR(60) | M | Secondary School Certificate (Class 10) | Degree or board qualification |
| specialization | VARCHAR(80) | M | General | Branch / stream |
| institution | VARCHAR(150) | M | Demo Public School, Nagpur | Fictional school / college |
| board_or_university | VARCHAR(120) | M | ICSE | Fictional board / university |
| year_of_passing | INT | M | 2015 | Year of passing (expected year if pursuing) |
| score_type | VARCHAR(15) | M | PERCENTAGE | CGPA or PERCENTAGE |
| score_value | NUMERIC(5,2) | M | 79 | Score |
| education_status | VARCHAR(12) | M | COMPLETED | COMPLETED or PURSUING |
| is_highest_qualification | BOOLEAN | M | false | True for highest qualification |
| document_filename | VARCHAR(150) | M | CAND-001_10th_Marksheet.pdf | Related document filename |
| verification_status | VARCHAR(15) | M | VERIFIED | Same values as document_status |

### `employment_details` - F. Employment / Internship Details
Role, department, manager, location and compensation (demo values).

| Field | Data type | M/O | Example | Description |
|---|---|---|---|---|
| employment_id | VARCHAR(12) | M | EMPL-001 | Primary key |
| candidate_id | VARCHAR(12) | M | CAND-001 | FK to candidate_profile (FK: candidate_profile(candidate_id)) |
| candidate_type | VARCHAR(10) | M | Employee | Employee or Intern |
| job_title | VARCHAR(80) | M | Backend Developer | Job or internship title |
| department | VARCHAR(60) | M | Engineering | Department |
| reporting_manager_id | VARCHAR(10) | M | MGR-001 | FK to managers (FK: managers(manager_id)) |
| reporting_manager_name | VARCHAR(100) | M | Vikram Joshi | Manager name |
| hr_coordinator_id | VARCHAR(10) | M | HR-001 | FK to hr_staff (FK: hr_staff(hr_id)) |
| hr_coordinator_name | VARCHAR(100) | M | Meera Kulkarni | HR coordinator name |
| employment_type | VARCHAR(30) | M | Full-time | Full-time / Paid Internship |
| work_location | VARCHAR(100) | M | RAGNIFY Nagpur HQ (DEMO) | Office or remote location |
| work_mode | VARCHAR(10) | M | Office | Office / Hybrid / Remote |
| joining_date | DATE | M | 2026-08-03 | Date of joining |
| probation_months | INT | O | 6 | Probation length (employees only) |
| probation_end_date | DATE | O | 2027-02-03 | Probation end (employees only) |
| previous_experience_years | INT | O | 4 | Years of prior experience (employees only) |
| previous_employer | VARCHAR(120) | O | Demo Prior Employer 01 Pvt Ltd (fictional) | Fictional previous employer (employees only) |
| annual_ctc_inr | NUMERIC(12,2) | O | 1400000 | Demo annual CTC (employees only) |
| monthly_stipend_inr | NUMERIC(10,2) | O | 15000 | Demo monthly stipend (interns only) |

### `internship_tenure` - K. Internship Tenure
Extra details for interns only (one row per intern).

| Field | Data type | M/O | Example | Description |
|---|---|---|---|---|
| tenure_id | VARCHAR(12) | M | INTN-002 | Primary key |
| candidate_id | VARCHAR(12) | M | CAND-002 | FK to candidate_profile (FK: candidate_profile(candidate_id)) |
| internship_start_date | DATE | M | 2026-08-10 | Internship start date |
| internship_end_date | DATE | M | 2027-02-09 | Internship end date |
| duration_months | INT | M | 6 | Duration in months |
| objectives | TEXT | M | Build and evaluate a small text-classification model, docume | Internship objectives |
| assigned_department | VARCHAR(60) | M | Data & AI | Assigned department |
| mentor_name | VARCHAR(100) | M | Neha Bansal | Mentor / manager |

### `working_hours` - L. Working Hours
Daily schedule for each candidate.

| Field | Data type | M/O | Example | Description |
|---|---|---|---|---|
| working_hours_id | VARCHAR(12) | M | WH-001 | Primary key |
| candidate_id | VARCHAR(12) | M | CAND-001 | FK to candidate_profile (FK: candidate_profile(candidate_id)) |
| start_time | VARCHAR(5) | M | 09:30 | Start time (HH:MM) |
| end_time | VARCHAR(5) | M | 18:30 | End time (HH:MM) |
| hours_per_day | NUMERIC(3,1) | M | 8.0 | Working hours per day |
| working_days | VARCHAR(60) | M | Mon-Fri | Working days |
| shift | VARCHAR(20) | M | General | General or Rotational |

### `offer_letters` - J. Offer Letter
Offer and acceptance details.

| Field | Data type | M/O | Example | Description |
|---|---|---|---|---|
| offer_id | VARCHAR(12) | M | OFR-001 | Primary key |
| candidate_id | VARCHAR(12) | M | CAND-001 | FK to candidate_profile (FK: candidate_profile(candidate_id)) |
| offer_type | VARCHAR(25) | M | Employment Offer | Employment Offer / Internship Offer |
| offer_letter_status | VARCHAR(20) | M | ACCEPTED_AND_ARCHIVED | Status of the letter |
| offer_letter_filename | VARCHAR(150) | M | CAND-001_Offer_Letter.pdf | Letter filename |
| offer_date | DATE | M | 2026-07-06 | Date offer was issued |
| valid_until | DATE | M | 2026-07-16 | Offer validity date |
| position | VARCHAR(80) | M | Backend Developer | Position offered |
| department | VARCHAR(60) | M | Engineering | Department |
| reporting_manager_name | VARCHAR(100) | M | Vikram Joshi | Manager name |
| joining_date | DATE | M | 2026-08-03 | Joining date |
| acceptance_status | VARCHAR(15) | M | ACCEPTED | ACCEPTED / PENDING / DECLINED |
| acceptance_date | DATE | O | 2026-07-08 | Date accepted |
| appointment_letter_status | VARCHAR(25) | M | ISSUED | Appointment letter status (employees) |

### `bank_payroll` - G. Bank / Payroll Details
Demo bank placeholders and payroll status.

| Field | Data type | M/O | Example | Description |
|---|---|---|---|---|
| bank_id | VARCHAR(12) | M | BNK-001 | Primary key |
| candidate_id | VARCHAR(12) | M | CAND-001 | FK to candidate_profile (FK: candidate_profile(candidate_id)) |
| bank_name | VARCHAR(80) | M | Sample Cooperative Bank | Fictional bank name |
| account_holder_name | VARCHAR(100) | M | Aarav Deshmukh | Name on account |
| account_number_placeholder | VARCHAR(30) | M | DEMO-ACCOUNT-0001 | DEMO-ACCOUNT-xxxx (not a real number) |
| ifsc_placeholder | VARCHAR(30) | M | DEMO-IFSC-0001 | DEMO-IFSC-xxxx (not a real code) |
| branch | VARCHAR(100) | M | Sample Branch, Nagpur | Fictional branch |
| compensation_type | VARCHAR(20) | M | ANNUAL_CTC | ANNUAL_CTC or MONTHLY_STIPEND |
| compensation_amount_inr | NUMERIC(12,2) | M | 1400000 | Demo amount |
| bank_verification_status | VARCHAR(15) | M | VERIFIED | Bank proof verification status |
| payroll_status | VARCHAR(40) | M | ACTIVE | Payroll set-up status |

### `identity_verification` - H. Identity / Verification
Identity metadata with DEMO placeholders only.

| Field | Data type | M/O | Example | Description |
|---|---|---|---|---|
| identity_id | VARCHAR(12) | M | IDV-001 | Primary key |
| candidate_id | VARCHAR(12) | M | CAND-001 | FK to candidate_profile (FK: candidate_profile(candidate_id)) |
| aadhaar_status | VARCHAR(15) | M | VERIFIED | Verification status |
| aadhaar_number_placeholder | VARCHAR(30) | M | DEMO-AADHAAR-0001 | DEMO-AADHAAR-xxxx |
| pan_status | VARCHAR(15) | M | VERIFIED | Verification status |
| pan_number_placeholder | VARCHAR(30) | M | DEMO-PAN-0001 | DEMO-PAN-xxxx |
| passport_status | VARCHAR(20) | M | VERIFIED_DEMO | Status or NOT_PROVIDED |
| passport_number_placeholder | VARCHAR(30) | O | DEMO-PASSPORT-0001 | DEMO-PASSPORT-xxxx |
| other_identity_type | VARCHAR(30) | M | Driving Licence | Voter ID / Driving Licence / College ID |
| other_identity_number_placeholder | VARCHAR(30) | M | DEMO-DL-0001 | DEMO placeholder |
| data_classification | VARCHAR(30) | M | SYNTHETIC_DEMO | Always SYNTHETIC_DEMO |

### `documents` - I. Documents
Document inventory (18 document types per candidate).

| Field | Data type | M/O | Example | Description |
|---|---|---|---|---|
| document_id | VARCHAR(12) | M | DOC-001 | Primary key, format DOC-001 |
| candidate_id | VARCHAR(12) | M | CAND-001 | FK to candidate_profile (FK: candidate_profile(candidate_id)) |
| document_type | VARCHAR(60) | M | Resume / CV | Type of document |
| filename | VARCHAR(150) | M | CAND-001_Resume.pdf | Filename containing candidate ID |
| file_format | VARCHAR(5) | M | pdf | pdf / jpg / png |
| document_status | VARCHAR(15) | M | VERIFIED | PENDING / UPLOADED / UNDER_REVIEW / VERIFIED / REJECTED / NOT_REQUIRED |
| uploaded_date | DATE | O | 2026-07-09 | Blank if not uploaded |
| verified_by | VARCHAR(10) | O | HR-001 | HR ID of reviewer (VERIFIED or REJECTED only) (FK: hr_staff(hr_id)) |
| verification_date | DATE | O | 2026-07-10 | Review date (VERIFIED or REJECTED only) |
| remarks | VARCHAR(250) | M | Verified successfully (DEMO) | Reviewer or system remarks |

### `onboarding_checklist` - M. Onboarding Checklist
17 checklist items per candidate.

| Field | Data type | M/O | Example | Description |
|---|---|---|---|---|
| checklist_id | VARCHAR(12) | M | CHK-001-01 | Primary key |
| candidate_id | VARCHAR(12) | M | CAND-001 | FK to candidate_profile (FK: candidate_profile(candidate_id)) |
| item_no | INT | M | 1 | Item number 1-17 |
| item_name | VARCHAR(80) | M | Personal information submitted | Checklist item |
| status | VARCHAR(15) | M | COMPLETED | COMPLETED / IN_PROGRESS / PENDING / BLOCKED |
| responsible | VARCHAR(60) | M | Candidate | Responsible person or team |
| due_date | DATE | M | 2026-07-15 | Due date |
| completion_date | DATE | O | 2026-07-09 | Blank if not completed |
| remarks | VARCHAR(250) | M | Completed (DEMO) | Remarks |

### `consents` - N. Consent / Declaration
Consent and declaration status.

| Field | Data type | M/O | Example | Description |
|---|---|---|---|---|
| consent_id | VARCHAR(12) | M | CNS-001 | Primary key |
| candidate_id | VARCHAR(12) | M | CAND-001 | FK to candidate_profile (FK: candidate_profile(candidate_id)) |
| data_privacy_consent | BOOLEAN | M | true | Data privacy consent given |
| background_verification_consent | BOOLEAN | M | true | Background check consent given |
| policy_acknowledgement | BOOLEAN | M | true | Company policy acknowledged |
| nda_status | VARCHAR(25) | M | SIGNED | SIGNED / SIGNED_PENDING_REVIEW / NOT_SIGNED |
| code_of_conduct_acknowledgement | BOOLEAN | M | true | Code of conduct acknowledged |
| declaration_status | VARCHAR(25) | M | SIGNED | Same values as nda_status |
| declaration_date | DATE | O | 2026-07-11 | Date declaration was submitted |
| consent_date | DATE | O | 2026-07-13 | Date consent was submitted |
| candidate_confirmation | BOOLEAN | M | true | Candidate confirmed details are correct |

### `system_accounts` - O. System Account
IT and RAGNIFY access. No real passwords are generated.

| Field | Data type | M/O | Example | Description |
|---|---|---|---|---|
| system_account_id | VARCHAR(12) | M | SYS-001 | Primary key |
| candidate_id | VARCHAR(12) | M | CAND-001 | FK to candidate_profile (FK: candidate_profile(candidate_id)) |
| company_email_status | VARCHAR(20) | M | ACTIVE | NOT_CREATED / PROVISIONING / ACTIVE |
| ragnify_account_status | VARCHAR(20) | M | ACTIVE | NOT_CREATED / PROVISIONING / ACTIVE |
| employee_or_intern_id | VARCHAR(20) | M | EMP-2026-001 | EMP-2026-001 or INT-2026-001 |
| role | VARCHAR(30) | M | EMPLOYEE | RAGNIFY role |
| department_access | VARCHAR(100) | M | Engineering workspace | Workspace access |
| required_tools | VARCHAR(200) | M | Git; VS Code; Docker; PostgreSQL client; Jira | Software and tools |
| laptop_status | VARCHAR(20) | M | ISSUED | ISSUED / PENDING_ISSUE |
| access_card_status | VARCHAR(20) | M | ISSUED | ISSUED / PENDING_ISSUE / NOT_REQUIRED |
| password_status | VARCHAR(30) | M | NOT_GENERATED_FOR_DEMO | Always NOT_GENERATED_FOR_DEMO |

### `hr_verification` - P. HR Verification Status
Overall verification and onboarding status.

| Field | Data type | M/O | Example | Description |
|---|---|---|---|---|
| verification_id | VARCHAR(12) | M | VER-001 | Primary key |
| candidate_id | VARCHAR(12) | M | CAND-001 | FK to candidate_profile (FK: candidate_profile(candidate_id)) |
| hr_verification_status | VARCHAR(20) | M | VERIFIED | VERIFIED / IN_PROGRESS / PENDING / ACTION_REQUIRED |
| manager_verification_status | VARCHAR(20) | M | VERIFIED | VERIFIED / PENDING |
| document_verification_status | VARCHAR(40) | M | COMPLETED | Summary of document checks |
| background_verification_status | VARCHAR(20) | M | COMPLETED | NOT_STARTED / IN_PROGRESS / COMPLETED |
| overall_onboarding_status | VARCHAR(50) | M | FULLY_ONBOARDED | Overall status |
| missing_documents | VARCHAR(300) | O | Bank Proof (Cancelled Cheque) | Documents not uploaded or rejected |
| hr_remarks | VARCHAR(300) | M | All documents verified and onboarding completed (DEMO). | HR remarks |
| manager_remarks | VARCHAR(300) | M | Joined and settled in the team (DEMO). | Manager remarks |
| hr_verified_date | DATE | O | 2026-07-17 | Date HR verification finished |
| manager_verified_date | DATE | O | 2026-08-01 | Date manager verification finished |
| last_updated | DATE | M | 2026-10-02 | Last update date |
