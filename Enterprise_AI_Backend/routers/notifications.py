from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from uuid import uuid4
from database import SessionLocal, engine, Base
import models

# Ensure table exists
Base.metadata.create_all(bind=engine)

router = APIRouter(
    prefix="/notifications",
    tags=["Notifications & Communications"]
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def seed_default_notifications(db: Session):
    """Seed initial enterprise notifications if empty."""
    count = db.query(models.Notification).count()
    if count == 0:
        seed_data = [
            models.Notification(
                notification_id="NOTIF-001",
                sender_name="Priya Sharma (HR Operations)",
                sender_role="HR",
                sender_email="hr@ragnify.com",
                target_role="All",
                target_name="All Workforce (Managers, Employees & Interns)",
                title="Q4 Workplace Hybrid Policy & Leave Guidelines",
                message="Welcome to Q4! All team members are requested to log their hybrid work schedules on the working hours portal. Standard casual & medical leave allowances for 2026 have been refreshed in your profile dashboards.",
                notification_type="announcement",
                created_at=datetime.utcnow(),
                is_read=False
            ),
            models.Notification(
                notification_id="NOTIF-002",
                sender_name="Vikram Mehta (Engineering Manager)",
                sender_role="Manager",
                sender_email="manager@ragnify.com",
                target_role="Employee",
                target_name="All AI & Data Science Division Employees",
                title="Sprint 4 Architecture Sync & Task Allocations",
                message="Please review your assigned sprint backlog items in Employee Tasks. We have completed ChromaDB cosine vector index integration and aim to complete QA testing by Friday EOD.",
                notification_type="chat",
                created_at=datetime.utcnow(),
                is_read=False
            ),
            models.Notification(
                notification_id="NOTIF-003",
                sender_name="Priya Sharma (HR Operations)",
                sender_role="HR",
                sender_email="hr@ragnify.com",
                target_role="Intern",
                target_name="All Active Internship Candidates",
                title="11-Point Compliance Document Verification Reminder",
                message="All onboarding interns are requested to verify their uploaded degrees, bank proofs, and emergency contact details on their Intern Profile to ensure smooth stipend disbursement.",
                notification_type="onboarding",
                created_at=datetime.utcnow(),
                is_read=False
            ),
            models.Notification(
                notification_id="NOTIF-004",
                sender_name="Vikram Mehta (Engineering Manager)",
                sender_role="Manager",
                sender_email="manager@ragnify.com",
                target_role="Intern",
                target_name="Engineering & Frontend Interns",
                title="Internship Capstone Presentation Schedule & Daily Time Clock Policy",
                message="Welcome to Q4! All interns under my direct supervision please ensure daily working hours are logged via the Time Clock on your workspace dashboard. Milestone 2 deliverable reviews and mentorship sync are scheduled for this Friday.",
                notification_type="chat",
                created_at=datetime.utcnow(),
                is_read=False
            )
        ]
        db.add_all(seed_data)
        db.commit()


@router.get("")
def get_notifications(role: str = None, db: Session = Depends(get_db)):
    """
    Retrieve all notifications and their replies.
    """
    seed_default_notifications(db)

    # Get parent notifications
    query = db.query(models.Notification).filter(models.Notification.parent_id == None).order_by(models.Notification.created_at.desc())
    parents = query.all()

    # Role-based restriction: Interns can ONLY see Manager broadcasts sent specifically to Interns,
    # and CANNOT see any notifications related to employees.
    if role and role.upper() == "INTERN":
        parents = [
            p for p in parents
            if (
                "manager" in (p.sender_role or "").lower()
                and "intern" in (p.target_role or "").lower()
                and "employee" not in (p.target_role or "").lower()
                and "employee" not in (p.target_name or "").lower()
            )
        ]

    results = []
    for p in parents:
        # Fetch thread replies
        replies = db.query(models.Notification).filter(models.Notification.parent_id == p.notification_id).order_by(models.Notification.created_at.asc()).all()
        
        results.append({
            "id": p.notification_id,
            "notification_id": p.notification_id,
            "sender_name": p.sender_name,
            "sender_role": p.sender_role,
            "sender_email": p.sender_email,
            "target_role": p.target_role,
            "target_name": p.target_name or p.target_role,
            "title": p.title,
            "desc": p.message,
            "message": p.message,
            "type": p.notification_type,
            "time": p.created_at.strftime("%Y-%m-%d %H:%M") if p.created_at else "Just now",
            "created_at": str(p.created_at),
            "unread": not p.is_read,
            "replies": [
                {
                    "id": r.notification_id,
                    "notification_id": r.notification_id,
                    "sender_name": r.sender_name,
                    "sender_role": r.sender_role,
                    "sender_email": r.sender_email,
                    "message": r.message,
                    "time": r.created_at.strftime("%Y-%m-%d %H:%M") if r.created_at else "Just now",
                    "created_at": str(r.created_at)
                }
                for r in replies
            ]
        })

    return results


@router.post("/send")
def send_notification(payload: dict, db: Session = Depends(get_db)):
    """
    Send a notification/announcement from HR or Manager to specific target audience.
    """
    sender_name = payload.get("sender_name") or payload.get("senderName") or "HR Operations"
    sender_role = payload.get("sender_role") or payload.get("senderRole") or "HR"
    sender_email = payload.get("sender_email") or payload.get("senderEmail") or "hr@ragnify.com"
    
    target_role = payload.get("target_role") or payload.get("targetRole") or "All"
    target_name = payload.get("target_name") or payload.get("targetName") or f"{target_role} Workforce"
    
    title = payload.get("title") or "Corporate Notification"
    message = payload.get("message") or payload.get("desc") or ""
    notif_type = payload.get("type") or payload.get("notification_type") or "announcement"

    if not message.strip():
        raise HTTPException(status_code=400, detail="Notification message cannot be empty.")

    notif_id = f"NOTIF-{uuid4().hex[:6].upper()}"
    new_notif = models.Notification(
        notification_id=notif_id,
        sender_name=sender_name,
        sender_role=sender_role,
        sender_email=sender_email,
        target_role=target_role,
        target_name=target_name,
        title=title,
        message=message,
        notification_type=notif_type,
        parent_id=None,
        created_at=datetime.utcnow(),
        is_read=False
    )
    db.add(new_notif)
    db.commit()

    return {
        "success": True,
        "id": notif_id,
        "notification_id": notif_id,
        "sender_name": sender_name,
        "sender_role": sender_role,
        "target_role": target_role,
        "target_name": target_name,
        "title": title,
        "desc": message,
        "message": message,
        "type": notif_type,
        "time": "Just now",
        "unread": True,
        "replies": []
    }


@router.post("/{notification_id}/reply")
def reply_to_notification(notification_id: str, payload: dict, db: Session = Depends(get_db)):
    """
    Reply to a specific notification thread.
    """
    parent = db.query(models.Notification).filter(models.Notification.notification_id == notification_id).first()
    if not parent:
        raise HTTPException(status_code=404, detail="Parent notification not found.")

    sender_name = payload.get("sender_name") or payload.get("senderName") or "User"
    sender_role = payload.get("sender_role") or payload.get("senderRole") or "Employee"
    sender_email = payload.get("sender_email") or payload.get("senderEmail") or "user@ragnify.com"
    reply_msg = payload.get("message") or payload.get("reply") or ""

    if not reply_msg.strip():
        raise HTTPException(status_code=400, detail="Reply message cannot be empty.")

    reply_id = f"REP-{uuid4().hex[:6].upper()}"
    reply_notif = models.Notification(
        notification_id=reply_id,
        sender_name=sender_name,
        sender_role=sender_role,
        sender_email=sender_email,
        target_role=parent.sender_role,
        target_name=parent.sender_name,
        title=f"Re: {parent.title}",
        message=reply_msg,
        notification_type="reply",
        parent_id=parent.notification_id,
        created_at=datetime.utcnow(),
        is_read=False
    )
    db.add(reply_notif)
    db.commit()

    return {
        "success": True,
        "id": reply_id,
        "notification_id": reply_id,
        "parent_id": parent.notification_id,
        "sender_name": sender_name,
        "sender_role": sender_role,
        "sender_email": sender_email,
        "message": reply_msg,
        "time": "Just now",
        "created_at": str(datetime.utcnow())
    }


@router.patch("/{notification_id}/read")
def mark_notification_read(notification_id: str, db: Session = Depends(get_db)):
    notif = db.query(models.Notification).filter(models.Notification.notification_id == notification_id).first()
    if notif:
        notif.is_read = True
        db.commit()
    return {"success": True, "id": notification_id}


@router.patch("/read-all")
def mark_all_read(db: Session = Depends(get_db)):
    db.query(models.Notification).update({models.Notification.is_read: True})
    db.commit()
    return {"success": True}
