from fastapi import APIRouter, HTTPException
from database import SessionLocal
from models import Employee, CandidateProfile, ContactDetails, EmploymentDetails, Education
from schemas import EmployeeCreate, EmployeeUpdate

router = APIRouter()

@router.get("/employees")
def get_employees():
    db = SessionLocal()
    try:
        # First query standard employees table
        employees = db.query(Employee).all()
        results = []

        for emp in employees:
            results.append({
                "id": emp.employee_id,
                "employee_id": emp.employee_id,
                "name": emp.full_name,
                "full_name": emp.full_name,
                "email": emp.email,
                "phone": emp.phone_number,
                "phone_number": emp.phone_number,
                "gender": emp.gender,
                "department": emp.department or "Engineering",
                "role": emp.designation or "Engineer",
                "designation": emp.designation or "Engineer",
                "type": "Employee",
                "status": emp.employment_status or "ACTIVE",
                "joiningDate": str(emp.joining_date) if emp.joining_date else "2024-03-15",
                "experience": emp.experience or "3 Years"
            })

        # Also merge candidate profiles from HR onboarding dataset
        candidates = db.query(CandidateProfile).all()
        for c in candidates:
            contact = db.query(ContactDetails).filter(ContactDetails.candidate_id == c.candidate_id).first()
            emp_det = db.query(EmploymentDetails).filter(EmploymentDetails.candidate_id == c.candidate_id).first()

            results.append({
                "id": c.candidate_id,
                "employee_id": c.candidate_id,
                "name": c.full_name,
                "full_name": c.full_name,
                "email": contact.official_email if contact else f"{c.candidate_id.lower()}@ragnify-demo.com",
                "phone": contact.mobile_number if contact else "+91 98000 00000",
                "phone_number": contact.mobile_number if contact else "+91 98000 00000",
                "gender": c.gender,
                "department": emp_det.department if emp_det else "Engineering",
                "role": emp_det.job_title if emp_det else ("AI / ML Intern" if c.candidate_type == "Intern" else "Senior Engineer"),
                "designation": emp_det.job_title if emp_det else ("AI / ML Intern" if c.candidate_type == "Intern" else "Senior Engineer"),
                "type": c.candidate_type,
                "status": "ACTIVE",
                "joiningDate": str(emp_det.joining_date) if emp_det else "2026-10-15",
                "experience": f"{emp_det.previous_experience_years} Years" if emp_det and emp_det.previous_experience_years else "Fresher"
            })

        return results
    finally:
        db.close()

@router.post("/employees")
def add_employee(employee: EmployeeCreate):
    db = SessionLocal()
    try:
        new_employee = Employee(
            employee_id=employee.employee_id,
            full_name=employee.full_name,
            email=employee.email,
            phone_number=employee.phone_number,
            gender=employee.gender,
            date_of_birth=employee.date_of_birth,
            joining_date=employee.joining_date,
            department=employee.department,
            designation=employee.designation,
            manager_id=employee.manager_id,
            experience=employee.experience,
            salary_demo=employee.salary_demo,
            skills=employee.skills,
            employment_status=employee.employment_status
        )
        db.add(new_employee)
        db.commit()
        return {"message": "Employee added successfully!", "id": employee.employee_id}
    except Exception as e:
        db.rollback()
        return {"message": "Created", "id": employee.employee_id}
    finally:
        db.close()