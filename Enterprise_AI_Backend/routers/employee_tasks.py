from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import SessionLocal
from models import Task
from utils.security import get_current_user

router = APIRouter(
    prefix="/employee",
    tags=["Employee Tasks"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/tasks")
def get_employee_tasks(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    employee_id = current_user.get("employee_id")

    tasks = (
        db.query(Task)
        .filter(Task.assigned_employee_id == employee_id)
        .order_by(Task.deadline.asc())
        .all()
    )

    return [
        {
            "task_id": task.task_id,
            "task_title": task.task_title,
            "description": task.description,
            "priority": task.priority,
            "status": task.status,
            "progress": task.progress,
            "created_date": task.created_date,
            "start_date": task.start_date,
            "deadline": task.deadline,
            "completion_date": task.completion_date,
            "estimated_hours": task.estimated_hours,
            "actual_hours": task.actual_hours,
        }
        for task in tasks
    ]