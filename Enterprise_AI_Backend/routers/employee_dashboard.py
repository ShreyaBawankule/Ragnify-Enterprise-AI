from datetime import date

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import SessionLocal
from models import Employee, Task
from utils.security import get_current_user

router = APIRouter(
    prefix="/employee",
    tags=["Employee Dashboard"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/dashboard")
def employee_dashboard(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    employee_id = current_user.get("employee_id")

    employee = (
        db.query(Employee)
        .filter(Employee.employee_id == employee_id)
        .first()
    )

    tasks = (
        db.query(Task)
        .filter(Task.assigned_employee_id == employee_id)
        .all()
    )

    total_tasks = len(tasks)

    completed_tasks = len(
        [t for t in tasks if (t.status or "").lower() == "completed"]
    )

    pending_tasks = len(
        [t for t in tasks if (t.status or "").lower() == "pending"]
    )

    in_progress_tasks = len(
        [t for t in tasks if (t.status or "").lower() == "in progress"]
    )

    overdue_tasks = len(
        [
            t for t in tasks
            if (
                t.deadline
                and t.deadline < date.today()
                and (t.status or "").lower() != "completed"
            )
        ]
    )

    completion_rate = 0

    if total_tasks > 0:
        completion_rate = round(
            (completed_tasks / total_tasks) * 100,
            2
        )

    recent_tasks = sorted(
        tasks,
        key=lambda x: x.created_date,
        reverse=True
    )[:5]

    return {

    "employee": {
        "employee_id": employee.employee_id,
        "full_name": employee.full_name,
        "designation": employee.designation,
        "department": employee.department,
    },

    "total_tasks": total_tasks,

    "assigned_tasks": total_tasks,

    "completed_tasks": completed_tasks,

    "pending_tasks": pending_tasks,

    "in_progress_tasks": in_progress_tasks,

    "overdue_tasks": overdue_tasks,

    "completion_rate": completion_rate,

    "recent_tasks": [

        {
            "task_id": t.task_id,
            "task_title": t.task_title,
            "employee_id": employee.employee_id,
            "status": t.status,
            "priority": t.priority,
            "deadline": t.deadline,
        }

        for t in recent_tasks
    ],

    "activity": [

        {
            "message": f"{t.task_title}",
            "status": t.status,
            "date": t.created_date,
        }

        for t in recent_tasks
    ]
}