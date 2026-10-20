from pydantic import BaseModel
from datetime import date


class EmployeeCreate(BaseModel):
    employee_id: str
    full_name: str
    email: str
    phone_number: str
    gender: str
    date_of_birth: date
    joining_date: date
    department: str
    designation: str
    manager_id: str
    experience: str
    salary_demo: float
    skills: str
    employment_status: str

class EmployeeUpdate(BaseModel):
    designation: str
    salary_demo: float
    department: str
    skills: str
    employment_status: str

class TaskCreate(BaseModel):
    task_id: str
    task_title: str
    description: str
    assigned_employee_id: str
    assigned_manager_id: str
    priority: str
    status: str
    progress: str
    created_date: date
    start_date: date
    deadline: date
    completion_date: date
    estimated_hours: str
    actual_hours: str

class ManagerCreate(BaseModel):
    manager_id: str
    name: str
    email: str
    phone: str
    department: str
    experience: str

class ManagerUpdate(BaseModel):
    name: str
    email: str
    phone: str
    department: str
    experience: str

class TaskUpdate(BaseModel):
    task_title: str
    description: str
    assigned_employee_id: str
    assigned_manager_id: str
    priority: str
    status: str
    progress: str
    start_date: date
    deadline: date
    completion_date: date
    estimated_hours: str
    actual_hours: str

class UserCreate(BaseModel):
    user_id: str
    email: str
    password: str
    role: str
    employee_id: str | None = None
    manager_id: str | None = None

class LoginRequest(BaseModel):
    email: str
    password: str