from sqlalchemy import Column, String, Numeric, Text, Date, ForeignKey, Integer, Boolean, DateTime
from datetime import datetime
from database import Base

# Existing Core Models
class Employee(Base):
    __tablename__ = "employees"

    employee_id = Column(String, primary_key=True)
    full_name = Column(String)
    email = Column(String)
    phone_number = Column(String)
    gender = Column(String)
    date_of_birth = Column(Date)
    joining_date = Column(Date)
    department = Column(String)
    designation = Column(String)
    manager_id = Column(String)
    experience = Column(String)
    skills = Column(Text)
    salary_demo = Column(Numeric)
    employment_status = Column(String)

class Task(Base):
    __tablename__ = "tasks"

    task_id = Column(String, primary_key=True)
    task_title = Column(String)
    description = Column(Text)
    assigned_employee_id = Column(
        String,
        ForeignKey("employees.employee_id")
    )
    assigned_manager_id = Column(
        String,
        ForeignKey("managers.manager_id")
    )
    priority = Column(String)
    status = Column(String)
    progress = Column(String)      
    created_date = Column(Date)
    start_date = Column(Date)
    deadline = Column(Date)
    completion_date = Column(Date)
    estimated_hours = Column(String)
    actual_hours = Column(String)

class Manager(Base):
    __tablename__ = "managers"

    manager_id = Column(String, primary_key=True)
    name = Column(String, nullable=True)
    manager_name = Column(String, nullable=True)
    email = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    department = Column(String, nullable=True)
    experience = Column(String, nullable=True)

class User(Base):
    __tablename__ = "users"

    user_id = Column(String, primary_key=True)
    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    role = Column(String, nullable=False)

    employee_id = Column(
        String,
        ForeignKey("employees.employee_id"),
        nullable=True
    )

    manager_id = Column(
        String,
        ForeignKey("managers.manager_id"),
        nullable=True
    )

class Meeting(Base):
    __tablename__ = "meetings"

    meeting_id = Column(String(20), primary_key=True)
    meeting_title = Column(String(200))
    meeting_date = Column(Date)
    duration = Column(String(30))
    organizer = Column(String(100))
    participants = Column(Text)
    agenda = Column(Text)
    decisions = Column(Text)
    action_items = Column(Text)

    transcript = Column(Text, nullable=True)
    summary = Column(Text, nullable=True)
    audio_filename = Column(String(255), nullable=True)


# ============================================================
# HR ONBOARDING DATASET MODELS
# ============================================================

class HRStaff(Base):
    __tablename__ = "hr_staff"

    hr_id = Column(String(50), primary_key=True)
    hr_name = Column(String(100), nullable=False)
    hr_email = Column(String(120), nullable=False)


class CandidateProfile(Base):
    __tablename__ = "candidate_profile"

    candidate_id = Column(String(50), primary_key=True)
    full_name = Column(String(100), nullable=False)
    gender = Column(String(10), nullable=False)
    date_of_birth = Column(Date, nullable=False)
    nationality = Column(String(30), nullable=False)
    marital_status = Column(String(15), nullable=False)
    blood_group = Column(String(5), nullable=False)
    profile_photo_filename = Column(String(120), nullable=False)
    candidate_type = Column(String(20), nullable=False)  # Employee, Intern
    data_classification = Column(String(30), nullable=False)


class ContactDetails(Base):
    __tablename__ = "contact_details"

    contact_id = Column(String(50), primary_key=True)
    candidate_id = Column(String(50), ForeignKey("candidate_profile.candidate_id"), nullable=False, unique=True)
    personal_email = Column(String(120), nullable=False)
    official_email = Column(String(120), nullable=False)
    mobile_number = Column(String(20), nullable=False)
    alternate_phone = Column(String(20), nullable=True)


class Address(Base):
    __tablename__ = "addresses"

    address_id = Column(String(50), primary_key=True)
    candidate_id = Column(String(50), ForeignKey("candidate_profile.candidate_id"), nullable=False)
    address_type = Column(String(20), nullable=False)
    address_line = Column(String(200), nullable=False)
    city = Column(String(60), nullable=False)
    state = Column(String(60), nullable=False)
    country = Column(String(30), nullable=False)
    pin_code = Column(String(10), nullable=False)


class EmergencyContact(Base):
    __tablename__ = "emergency_contacts"

    emergency_contact_id = Column(String(50), primary_key=True)
    candidate_id = Column(String(50), ForeignKey("candidate_profile.candidate_id"), nullable=False)
    contact_name = Column(String(100), nullable=False)
    relationship = Column(String(30), nullable=False)
    phone = Column(String(20), nullable=False)
    email = Column(String(120), nullable=True)
    address = Column(String(250), nullable=False)


class Education(Base):
    __tablename__ = "education"

    education_id = Column(String(50), primary_key=True)
    candidate_id = Column(String(50), ForeignKey("candidate_profile.candidate_id"), nullable=False)
    level = Column(String(20), nullable=False)
    qualification = Column(String(60), nullable=False)
    specialization = Column(String(80), nullable=False)
    institution = Column(String(150), nullable=False)
    board_or_university = Column(String(120), nullable=False)
    year_of_passing = Column(Integer, nullable=False)
    score_type = Column(String(20), nullable=False)
    score_value = Column(Numeric(5, 2), nullable=False)
    education_status = Column(String(20), nullable=False)
    is_highest_qualification = Column(Boolean, nullable=False)
    document_filename = Column(String(150), nullable=False)
    verification_status = Column(String(20), nullable=False)


class EmploymentDetails(Base):
    __tablename__ = "employment_details"

    employment_id = Column(String(50), primary_key=True)
    candidate_id = Column(String(50), ForeignKey("candidate_profile.candidate_id"), nullable=False, unique=True)
    candidate_type = Column(String(20), nullable=False)
    job_title = Column(String(80), nullable=False)
    department = Column(String(60), nullable=False)
    reporting_manager_id = Column(String(50), ForeignKey("managers.manager_id"), nullable=False)
    reporting_manager_name = Column(String(100), nullable=False)
    hr_coordinator_id = Column(String(50), ForeignKey("hr_staff.hr_id"), nullable=False)
    hr_coordinator_name = Column(String(100), nullable=False)
    employment_type = Column(String(30), nullable=False)
    work_location = Column(String(100), nullable=False)
    work_mode = Column(String(20), nullable=False)
    joining_date = Column(Date, nullable=False)
    probation_months = Column(Integer, nullable=True)
    probation_end_date = Column(Date, nullable=True)
    previous_experience_years = Column(Integer, nullable=True)
    previous_employer = Column(String(120), nullable=True)
    annual_ctc_inr = Column(Numeric(12, 2), nullable=True)
    monthly_stipend_inr = Column(Numeric(10, 2), nullable=True)


class InternshipTenure(Base):
    __tablename__ = "internship_tenure"

    tenure_id = Column(String(50), primary_key=True)
    candidate_id = Column(String(50), ForeignKey("candidate_profile.candidate_id"), nullable=False, unique=True)
    internship_start_date = Column(Date, nullable=False)
    internship_end_date = Column(Date, nullable=False)
    duration_months = Column(Integer, nullable=False)
    objectives = Column(Text, nullable=False)
    assigned_department = Column(String(60), nullable=False)
    mentor_name = Column(String(100), nullable=False)


class WorkingHours(Base):
    __tablename__ = "working_hours"

    working_hours_id = Column(String(50), primary_key=True)
    candidate_id = Column(String(50), ForeignKey("candidate_profile.candidate_id"), nullable=False, unique=True)
    start_time = Column(String(10), nullable=False)
    end_time = Column(String(10), nullable=False)
    hours_per_day = Column(Numeric(3, 1), nullable=False)
    working_days = Column(String(60), nullable=False)
    shift = Column(String(20), nullable=False)


class OfferLetter(Base):
    __tablename__ = "offer_letters"

    offer_id = Column(String(50), primary_key=True)
    candidate_id = Column(String(50), ForeignKey("candidate_profile.candidate_id"), nullable=False, unique=True)
    offer_type = Column(String(25), nullable=False)
    offer_letter_status = Column(String(20), nullable=False)
    offer_letter_filename = Column(String(150), nullable=False)
    offer_date = Column(Date, nullable=False)
    valid_until = Column(Date, nullable=False)
    position = Column(String(80), nullable=False)
    department = Column(String(60), nullable=False)
    reporting_manager_name = Column(String(100), nullable=False)
    joining_date = Column(Date, nullable=False)
    acceptance_status = Column(String(15), nullable=False)
    acceptance_date = Column(Date, nullable=True)
    appointment_letter_status = Column(String(25), nullable=False)


class Document(Base):
    __tablename__ = "documents"

    document_id = Column(String(120), primary_key=True)
    candidate_id = Column(String(50), ForeignKey("candidate_profile.candidate_id"), nullable=False)
    document_type = Column(String(60), nullable=False)
    filename = Column(String(150), nullable=False)
    file_format = Column(String(10), nullable=False)
    document_status = Column(String(20), nullable=False)
    uploaded_date = Column(Date, nullable=True)
    verified_by = Column(String(50), ForeignKey("hr_staff.hr_id"), nullable=True)
    verification_date = Column(Date, nullable=True)
    remarks = Column(String(250), nullable=False)


class OnboardingChecklist(Base):
    __tablename__ = "onboarding_checklist"

    checklist_id = Column(String(50), primary_key=True)
    candidate_id = Column(String(50), ForeignKey("candidate_profile.candidate_id"), nullable=False)
    item_no = Column(Integer, nullable=False)
    item_name = Column(String(80), nullable=False)
    status = Column(String(20), nullable=False)
    responsible = Column(String(60), nullable=False)
    due_date = Column(Date, nullable=False)
    completion_date = Column(Date, nullable=True)
    remarks = Column(String(250), nullable=False)


class HRVerification(Base):
    __tablename__ = "hr_verification"

    verification_id = Column(String(50), primary_key=True)
    candidate_id = Column(String(50), ForeignKey("candidate_profile.candidate_id"), nullable=False, unique=True)
    hr_verification_status = Column(String(20), nullable=False)
    manager_verification_status = Column(String(20), nullable=False)
    document_verification_status = Column(String(40), nullable=False)
    background_verification_status = Column(String(20), nullable=False)
    overall_onboarding_status = Column(String(50), nullable=False)
    missing_documents = Column(String(300), nullable=True)
    hr_remarks = Column(String(300), nullable=False)
    manager_remarks = Column(String(300), nullable=False)
    hr_verified_date = Column(Date, nullable=True)
    manager_verified_date = Column(Date, nullable=True)
    last_updated = Column(Date, nullable=False)


class Notification(Base):
    __tablename__ = "notifications"

    notification_id = Column(String(50), primary_key=True)
    sender_name = Column(String(100), nullable=False)
    sender_role = Column(String(30), nullable=False)  # "HR", "Manager", "Employee", "Intern", "System"
    sender_email = Column(String(120), nullable=True)
    target_role = Column(String(50), nullable=False)  # "All", "Manager", "Employee", "Intern", "HR", or specific user
    target_name = Column(String(120), nullable=True)
    title = Column(String(200), nullable=False)
    message = Column(Text, nullable=False)
    notification_type = Column(String(40), default="announcement")  # "announcement", "chat", "reply", "task", "onboarding"
    parent_id = Column(String(50), nullable=True)  # for thread replies
    created_at = Column(DateTime, default=datetime.utcnow)
    is_read = Column(Boolean, default=False)


class AttendanceRecord(Base):
    __tablename__ = "attendance_records"

    id = Column(String(50), primary_key=True)
    candidate_id = Column(String(50), nullable=False)
    candidate_name = Column(String(100), nullable=False)
    candidate_type = Column(String(30), default="Intern")
    date = Column(Date, nullable=False)
    clock_in = Column(String(20), nullable=False)
    clock_out = Column(String(20), nullable=True)
    total_hours = Column(String(20), nullable=True)
    status = Column(String(20), default="IN_PROGRESS")  # "IN_PROGRESS", "COMPLETED"
    created_at = Column(DateTime, default=datetime.utcnow)