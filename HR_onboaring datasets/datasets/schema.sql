-- RAGNIFY HR Onboarding schema (PostgreSQL). Data is SYNTHETIC DEMO data only.
-- Load order = order below (parents first).

-- Reference: Fictional HR coordinators who verify documents.
CREATE TABLE hr_staff (
  hr_id VARCHAR(10) PRIMARY KEY,
  hr_name VARCHAR(100) NOT NULL,
  hr_email VARCHAR(120) NOT NULL
);

-- Reference: Fictional department managers.
CREATE TABLE managers (
  manager_id VARCHAR(10) PRIMARY KEY,
  manager_name VARCHAR(100) NOT NULL,
  department VARCHAR(60) NOT NULL
);

-- A. Candidate / User Profile: One row per candidate (employee or intern). Parent table for all others.
CREATE TABLE candidate_profile (
  candidate_id VARCHAR(12) PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL,
  gender VARCHAR(10) NOT NULL,
  date_of_birth DATE NOT NULL,
  nationality VARCHAR(30) NOT NULL,
  marital_status VARCHAR(15) NOT NULL,
  blood_group VARCHAR(5) NOT NULL,
  profile_photo_filename VARCHAR(120) NOT NULL,
  candidate_type VARCHAR(10) NOT NULL CHECK (candidate_type IN ('Employee', 'Intern')),
  data_classification VARCHAR(30) NOT NULL
);

-- B. Contact Details: Email and phone details (all fictional).
CREATE TABLE contact_details (
  contact_id VARCHAR(12) PRIMARY KEY,
  candidate_id VARCHAR(12) NOT NULL REFERENCES candidate_profile(candidate_id),
  personal_email VARCHAR(120) NOT NULL,
  official_email VARCHAR(120) NOT NULL,
  mobile_number VARCHAR(20) NOT NULL,
  alternate_phone VARCHAR(20),
  UNIQUE (candidate_id)
);

-- C. Address: Current and permanent address (two rows per candidate).
CREATE TABLE addresses (
  address_id VARCHAR(12) PRIMARY KEY,
  candidate_id VARCHAR(12) NOT NULL REFERENCES candidate_profile(candidate_id),
  address_type VARCHAR(12) NOT NULL,
  address_line VARCHAR(200) NOT NULL,
  city VARCHAR(60) NOT NULL,
  state VARCHAR(60) NOT NULL,
  country VARCHAR(30) NOT NULL,
  pin_code VARCHAR(6) NOT NULL
);

-- D. Emergency Contact: Person to contact in an emergency.
CREATE TABLE emergency_contacts (
  emergency_contact_id VARCHAR(12) PRIMARY KEY,
  candidate_id VARCHAR(12) NOT NULL REFERENCES candidate_profile(candidate_id),
  contact_name VARCHAR(100) NOT NULL,
  relationship VARCHAR(30) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(120),
  address VARCHAR(250) NOT NULL
);

-- E. Education: One row per education level per candidate.
CREATE TABLE education (
  education_id VARCHAR(12) PRIMARY KEY,
  candidate_id VARCHAR(12) NOT NULL REFERENCES candidate_profile(candidate_id),
  level VARCHAR(10) NOT NULL,
  qualification VARCHAR(60) NOT NULL,
  specialization VARCHAR(80) NOT NULL,
  institution VARCHAR(150) NOT NULL,
  board_or_university VARCHAR(120) NOT NULL,
  year_of_passing INT NOT NULL,
  score_type VARCHAR(15) NOT NULL,
  score_value NUMERIC(5,2) NOT NULL,
  education_status VARCHAR(12) NOT NULL,
  is_highest_qualification BOOLEAN NOT NULL,
  document_filename VARCHAR(150) NOT NULL,
  verification_status VARCHAR(15) NOT NULL
);

-- F. Employment / Internship Details: Role, department, manager, location and compensation (demo values).
CREATE TABLE employment_details (
  employment_id VARCHAR(12) PRIMARY KEY,
  candidate_id VARCHAR(12) NOT NULL REFERENCES candidate_profile(candidate_id),
  candidate_type VARCHAR(10) NOT NULL,
  job_title VARCHAR(80) NOT NULL,
  department VARCHAR(60) NOT NULL,
  reporting_manager_id VARCHAR(10) NOT NULL REFERENCES managers(manager_id),
  reporting_manager_name VARCHAR(100) NOT NULL,
  hr_coordinator_id VARCHAR(10) NOT NULL REFERENCES hr_staff(hr_id),
  hr_coordinator_name VARCHAR(100) NOT NULL,
  employment_type VARCHAR(30) NOT NULL,
  work_location VARCHAR(100) NOT NULL,
  work_mode VARCHAR(10) NOT NULL CHECK (work_mode IN ('Office', 'Hybrid', 'Remote')),
  joining_date DATE NOT NULL,
  probation_months INT,
  probation_end_date DATE,
  previous_experience_years INT,
  previous_employer VARCHAR(120),
  annual_ctc_inr NUMERIC(12,2),
  monthly_stipend_inr NUMERIC(10,2),
  UNIQUE (candidate_id)
);

-- K. Internship Tenure: Extra details for interns only (one row per intern).
CREATE TABLE internship_tenure (
  tenure_id VARCHAR(12) PRIMARY KEY,
  candidate_id VARCHAR(12) NOT NULL REFERENCES candidate_profile(candidate_id),
  internship_start_date DATE NOT NULL,
  internship_end_date DATE NOT NULL,
  duration_months INT NOT NULL,
  objectives TEXT NOT NULL,
  assigned_department VARCHAR(60) NOT NULL,
  mentor_name VARCHAR(100) NOT NULL,
  CHECK (internship_end_date > internship_start_date),
  UNIQUE (candidate_id)
);

-- L. Working Hours: Daily schedule for each candidate.
CREATE TABLE working_hours (
  working_hours_id VARCHAR(12) PRIMARY KEY,
  candidate_id VARCHAR(12) NOT NULL REFERENCES candidate_profile(candidate_id),
  start_time VARCHAR(5) NOT NULL,
  end_time VARCHAR(5) NOT NULL,
  hours_per_day NUMERIC(3,1) NOT NULL,
  working_days VARCHAR(60) NOT NULL,
  shift VARCHAR(20) NOT NULL,
  UNIQUE (candidate_id)
);

-- J. Offer Letter: Offer and acceptance details.
CREATE TABLE offer_letters (
  offer_id VARCHAR(12) PRIMARY KEY,
  candidate_id VARCHAR(12) NOT NULL REFERENCES candidate_profile(candidate_id),
  offer_type VARCHAR(25) NOT NULL,
  offer_letter_status VARCHAR(20) NOT NULL,
  offer_letter_filename VARCHAR(150) NOT NULL,
  offer_date DATE NOT NULL,
  valid_until DATE NOT NULL,
  position VARCHAR(80) NOT NULL,
  department VARCHAR(60) NOT NULL,
  reporting_manager_name VARCHAR(100) NOT NULL,
  joining_date DATE NOT NULL,
  acceptance_status VARCHAR(15) NOT NULL,
  acceptance_date DATE,
  appointment_letter_status VARCHAR(25) NOT NULL,
  UNIQUE (candidate_id)
);

-- G. Bank / Payroll Details: Demo bank placeholders and payroll status.
CREATE TABLE bank_payroll (
  bank_id VARCHAR(12) PRIMARY KEY,
  candidate_id VARCHAR(12) NOT NULL REFERENCES candidate_profile(candidate_id),
  bank_name VARCHAR(80) NOT NULL,
  account_holder_name VARCHAR(100) NOT NULL,
  account_number_placeholder VARCHAR(30) NOT NULL,
  ifsc_placeholder VARCHAR(30) NOT NULL,
  branch VARCHAR(100) NOT NULL,
  compensation_type VARCHAR(20) NOT NULL,
  compensation_amount_inr NUMERIC(12,2) NOT NULL,
  bank_verification_status VARCHAR(15) NOT NULL,
  payroll_status VARCHAR(40) NOT NULL,
  UNIQUE (candidate_id)
);

-- H. Identity / Verification: Identity metadata with DEMO placeholders only.
CREATE TABLE identity_verification (
  identity_id VARCHAR(12) PRIMARY KEY,
  candidate_id VARCHAR(12) NOT NULL REFERENCES candidate_profile(candidate_id),
  aadhaar_status VARCHAR(15) NOT NULL,
  aadhaar_number_placeholder VARCHAR(30) NOT NULL,
  pan_status VARCHAR(15) NOT NULL,
  pan_number_placeholder VARCHAR(30) NOT NULL,
  passport_status VARCHAR(20) NOT NULL,
  passport_number_placeholder VARCHAR(30),
  other_identity_type VARCHAR(30) NOT NULL,
  other_identity_number_placeholder VARCHAR(30) NOT NULL,
  data_classification VARCHAR(30) NOT NULL,
  UNIQUE (candidate_id)
);

-- I. Documents: Document inventory (18 document types per candidate).
CREATE TABLE documents (
  document_id VARCHAR(12) PRIMARY KEY,
  candidate_id VARCHAR(12) NOT NULL REFERENCES candidate_profile(candidate_id),
  document_type VARCHAR(60) NOT NULL,
  filename VARCHAR(150) NOT NULL,
  file_format VARCHAR(5) NOT NULL,
  document_status VARCHAR(15) NOT NULL CHECK (document_status IN ('PENDING', 'UPLOADED', 'UNDER_REVIEW', 'VERIFIED', 'REJECTED', 'NOT_REQUIRED')),
  uploaded_date DATE,
  verified_by VARCHAR(10) REFERENCES hr_staff(hr_id),
  verification_date DATE,
  remarks VARCHAR(250) NOT NULL
);

-- M. Onboarding Checklist: 17 checklist items per candidate.
CREATE TABLE onboarding_checklist (
  checklist_id VARCHAR(12) PRIMARY KEY,
  candidate_id VARCHAR(12) NOT NULL REFERENCES candidate_profile(candidate_id),
  item_no INT NOT NULL,
  item_name VARCHAR(80) NOT NULL,
  status VARCHAR(15) NOT NULL CHECK (status IN ('COMPLETED', 'IN_PROGRESS', 'PENDING', 'BLOCKED')),
  responsible VARCHAR(60) NOT NULL,
  due_date DATE NOT NULL,
  completion_date DATE,
  remarks VARCHAR(250) NOT NULL
);

-- N. Consent / Declaration: Consent and declaration status.
CREATE TABLE consents (
  consent_id VARCHAR(12) PRIMARY KEY,
  candidate_id VARCHAR(12) NOT NULL REFERENCES candidate_profile(candidate_id),
  data_privacy_consent BOOLEAN NOT NULL,
  background_verification_consent BOOLEAN NOT NULL,
  policy_acknowledgement BOOLEAN NOT NULL,
  nda_status VARCHAR(25) NOT NULL,
  code_of_conduct_acknowledgement BOOLEAN NOT NULL,
  declaration_status VARCHAR(25) NOT NULL,
  declaration_date DATE,
  consent_date DATE,
  candidate_confirmation BOOLEAN NOT NULL,
  UNIQUE (candidate_id)
);

-- O. System Account: IT and RAGNIFY access. No real passwords are generated.
CREATE TABLE system_accounts (
  system_account_id VARCHAR(12) PRIMARY KEY,
  candidate_id VARCHAR(12) NOT NULL REFERENCES candidate_profile(candidate_id),
  company_email_status VARCHAR(20) NOT NULL,
  ragnify_account_status VARCHAR(20) NOT NULL,
  employee_or_intern_id VARCHAR(20) NOT NULL,
  role VARCHAR(30) NOT NULL,
  department_access VARCHAR(100) NOT NULL,
  required_tools VARCHAR(200) NOT NULL,
  laptop_status VARCHAR(20) NOT NULL,
  access_card_status VARCHAR(20) NOT NULL,
  password_status VARCHAR(30) NOT NULL,
  UNIQUE (candidate_id)
);

-- P. HR Verification Status: Overall verification and onboarding status.
CREATE TABLE hr_verification (
  verification_id VARCHAR(12) PRIMARY KEY,
  candidate_id VARCHAR(12) NOT NULL REFERENCES candidate_profile(candidate_id),
  hr_verification_status VARCHAR(20) NOT NULL,
  manager_verification_status VARCHAR(20) NOT NULL,
  document_verification_status VARCHAR(40) NOT NULL,
  background_verification_status VARCHAR(20) NOT NULL,
  overall_onboarding_status VARCHAR(50) NOT NULL,
  missing_documents VARCHAR(300),
  hr_remarks VARCHAR(300) NOT NULL,
  manager_remarks VARCHAR(300) NOT NULL,
  hr_verified_date DATE,
  manager_verified_date DATE,
  last_updated DATE NOT NULL,
  UNIQUE (candidate_id)
);

CREATE INDEX idx_documents_candidate ON documents(candidate_id);
CREATE INDEX idx_documents_status ON documents(document_status);
CREATE INDEX idx_checklist_candidate ON onboarding_checklist(candidate_id);
CREATE INDEX idx_education_candidate ON education(candidate_id);
CREATE UNIQUE INDEX uq_contact_personal_email ON contact_details(personal_email);
CREATE UNIQUE INDEX uq_contact_official_email ON contact_details(official_email);
