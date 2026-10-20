from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, date
from uuid import uuid4
from database import SessionLocal, engine, Base
import models

# Ensure tables exist
Base.metadata.create_all(bind=engine)

router = APIRouter(
    tags=["Tenure & Working Hours"]
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def seed_default_attendance(db: Session):
    count = db.query(models.AttendanceRecord).count()
    if count == 0:
        seed_data = [
            models.AttendanceRecord(
                id="ATT-001",
                candidate_id="INT-201",
                candidate_name="Ananya Roy",
                candidate_type="Intern",
                date=date(2026, 10, 7),
                clock_in="09:15 AM",
                clock_out="06:00 PM",
                total_hours="8.75 hrs",
                status="COMPLETED"
            ),
            models.AttendanceRecord(
                id="ATT-002",
                candidate_id="INT-202",
                candidate_name="Rohan Gupta",
                candidate_type="Intern",
                date=date(2026, 10, 7),
                clock_in="09:30 AM",
                clock_out="06:15 PM",
                total_hours="8.75 hrs",
                status="COMPLETED"
            ),
            models.AttendanceRecord(
                id="ATT-003",
                candidate_id="INT-203",
                candidate_name="Tanvi Deshmukh",
                candidate_type="Intern",
                date=date(2026, 10, 7),
                clock_in="09:00 AM",
                clock_out="05:30 PM",
                total_hours="8.50 hrs",
                status="COMPLETED"
            ),
            models.AttendanceRecord(
                id="ATT-004",
                candidate_id="INT-201",
                candidate_name="Ananya Roy",
                candidate_type="Intern",
                date=date(2026, 10, 6),
                clock_in="09:30 AM",
                clock_out="06:30 PM",
                total_hours="9.00 hrs",
                status="COMPLETED"
            ),
            models.AttendanceRecord(
                id="ATT-005",
                candidate_id="INT-201",
                candidate_name="Ananya Roy",
                candidate_type="Intern",
                date=date(2026, 10, 5),
                clock_in="09:15 AM",
                clock_out="06:00 PM",
                total_hours="8.75 hrs",
                status="COMPLETED"
            ),
            models.AttendanceRecord(
                id="ATT-006",
                candidate_id="EMP-101",
                candidate_name="Rahul Verma",
                candidate_type="Employee",
                date=date(2026, 10, 7),
                clock_in="09:00 AM",
                clock_out="06:00 PM",
                total_hours="9.00 hrs",
                status="COMPLETED"
            ),
            models.AttendanceRecord(
                id="ATT-007",
                candidate_id="EMP-101",
                candidate_name="Rahul Verma",
                candidate_type="Employee",
                date=date(2026, 10, 6),
                clock_in="09:15 AM",
                clock_out="06:30 PM",
                total_hours="9.25 hrs",
                status="COMPLETED"
            )
        ]
        db.add_all(seed_data)
        db.commit()


@router.get("/tenure")
def get_tenures(
    role: str = None, 
    user_id: str = None, 
    candidate_id: str = None, 
    db: Session = Depends(get_db)
):
    seed_default_attendance(db)
    user_role = (role or "").strip().upper()
    target_id = candidate_id or user_id
    results = []
    today = date.today()

    # 1. Fetch Full-Time Employees from Employee Table (13 core staff)
    if user_role not in ["INTERN"]:
        emp_query = db.query(models.Employee)
        if target_id and user_role == "EMPLOYEE":
            emp_query = emp_query.filter(models.Employee.employee_id == target_id)
        
        employees = emp_query.all()
        for emp in employees:
            j_date = emp.joining_date or date(2024, 3, 15)
            days_active = max(1, (today - j_date).days)
            milestone_total = 1095  # 3-Year milestone tracking
            prog = min(100, round((days_active / milestone_total) * 100))
            rem_days = max(0, milestone_total - days_active)

            att_count = db.query(models.AttendanceRecord).filter(
                (models.AttendanceRecord.candidate_id == emp.employee_id) |
                (models.AttendanceRecord.candidate_name == emp.full_name)
            ).count()

            results.append({
                "id": f"TEN-{emp.employee_id}",
                "candidate_id": emp.employee_id,
                "candidateName": emp.full_name,
                "name": emp.full_name,
                "email": emp.email,
                "type": "Employee",
                "role": emp.designation or "Senior Engineer",
                "department": emp.department or "Engineering",
                "startDate": str(j_date),
                "endDate": "Permanent",
                "duration": f"{(days_active / 365.25):.1f} Years Active",
                "activeDays": days_active + att_count,
                "daysCompleted": days_active + att_count,
                "daysRemaining": rem_days,
                "totalDays": milestone_total,
                "progress": prog,
                "status": "CONFIRMED",
                "probationStatus": "Confirmed Full-Time",
                "nextMilestone": "3-Year Veteran Milestone" if days_active < 1095 else "5-Year Leadership Milestone"
            })

    # 2. Fetch Candidates and Interns from CandidateProfile Table (25 records: 12 Interns + 13 Onboarded Employees)
    cand_query = db.query(models.CandidateProfile)
    if target_id and user_role in ["EMPLOYEE", "INTERN"]:
        cand_query = cand_query.filter(models.CandidateProfile.candidate_id == target_id)

    candidates = cand_query.all()
    for c in candidates:
        # Avoid duplicate if already present
        if any(r["candidate_id"] == c.candidate_id for r in results):
            continue

        emp_det = db.query(models.EmploymentDetails).filter(models.EmploymentDetails.candidate_id == c.candidate_id).first()
        contact = db.query(models.ContactDetails).filter(models.ContactDetails.candidate_id == c.candidate_id).first()
        
        att_count = db.query(models.AttendanceRecord).filter(
            (models.AttendanceRecord.candidate_id == c.candidate_id) |
            (models.AttendanceRecord.candidate_name == c.full_name)
        ).count()

        is_intern = c.candidate_type == "Intern"
        
        if is_intern:
            base_days = 68
            total_active_days = max(base_days, base_days + att_count)
            total_tenure_days = 92
            progress_pct = min(100, round((total_active_days / total_tenure_days) * 100))
            rem_days = max(0, total_tenure_days - total_active_days)
            duration_str = "3 Months (92 Days)"
            status_str = "ACTIVE"
            probation_str = "Active Term (92 Days)"
            next_ms = "Stage-3 Certificate Clearance" if total_active_days >= 85 else "Mid-Term Review"
            start_str = "2026-08-01"
            end_str = "2026-10-31"
        else:
            j_date = emp_det.joining_date if (emp_det and emp_det.joining_date) else date(2024, 6, 1)
            days_active = max(1, (today - j_date).days) if isinstance(j_date, date) else 380
            total_active_days = max(days_active, days_active + att_count)
            total_tenure_days = 730
            progress_pct = min(100, round((total_active_days / total_tenure_days) * 100))
            rem_days = max(0, total_tenure_days - total_active_days)
            duration_str = "2 Years Contract"
            status_str = "CONFIRMED"
            probation_str = "Confirmed"
            next_ms = "Annual Performance Appraisal"
            start_str = str(j_date) if j_date else "2024-06-01"
            end_str = "Permanent"

        job_role = (
            getattr(emp_det, 'job_title', None) or 
            getattr(emp_det, 'designation', None) or 
            ("Frontend Development Intern" if is_intern else "Senior Software Engineer")
        )
        dept = getattr(emp_det, 'department', None) or "Engineering"

        results.append({
            "id": f"TEN-{c.candidate_id}",
            "candidate_id": c.candidate_id,
            "candidateName": c.full_name,
            "name": c.full_name,
            "email": contact.official_email if contact else f"{c.candidate_id.lower()}@ragnify-demo.com",
            "type": c.candidate_type,
            "role": job_role,
            "department": dept,
            "startDate": start_str,
            "endDate": end_str,
            "duration": duration_str,
            "activeDays": total_active_days,
            "daysCompleted": total_active_days,
            "daysRemaining": rem_days,
            "totalDays": total_tenure_days,
            "progress": progress_pct,
            "status": status_str,
            "probationStatus": probation_str,
            "nextMilestone": next_ms
        })

    return results


@router.get("/working-hours")
@router.get("/attendance/working-hours")
def get_working_hours(candidate_id: str = None, db: Session = Depends(get_db)):
    seed_default_attendance(db)
    
    query = db.query(models.AttendanceRecord).order_by(models.AttendanceRecord.date.desc(), models.AttendanceRecord.created_at.desc())
    if candidate_id:
        query = query.filter(models.AttendanceRecord.candidate_id == candidate_id)
    
    records = query.all()
    results = []
    for r in records:
        results.append({
            "id": r.id,
            "candidate_id": r.candidate_id,
            "candidateName": r.candidate_name,
            "name": r.candidate_name,
            "type": r.candidate_type,
            "date": str(r.date),
            "clockIn": r.clock_in,
            "clockOut": r.clock_out or "--:--",
            "totalHours": r.total_hours or "In Progress",
            "total": r.total_hours or "In Progress",
            "status": r.status
        })

    return results


def format_duration(total_seconds):
    """Format duration into friendly readable string: e.g. '1.25 hrs', '45 mins', '2 mins 15s'."""
    sec = max(0, int(total_seconds))
    if sec < 60:
        return f"{sec}s"
    mins = sec // 60
    rem_sec = sec % 60
    if mins < 60:
        return f"{mins}m {rem_sec}s" if rem_sec > 0 else f"{mins} mins"
    hours = mins / 60.0
    return f"{hours:.2f} hrs"


def parse_hours_val(val_str):
    """Extract numeric hours float from strings like '8.50 hrs', '45 mins', '90s'."""
    if not val_str:
        return 0.0
    try:
        clean = str(val_str).lower().strip()
        if "s" in clean and "m" in clean:
            # e.g. 5m 30s
            parts = clean.replace("s", "").split("m")
            m = float(parts[0].strip()) if parts[0].strip() else 0.0
            s = float(parts[1].strip()) if len(parts) > 1 and parts[1].strip() else 0.0
            return (m * 60 + s) / 3600.0
        if "mins" in clean or "m" in clean:
            m = float(clean.replace("mins", "").replace("m", "").strip())
            return m / 60.0
        if clean.endswith("s"):
            s = float(clean.replace("s", "").strip())
            return s / 3600.0
        clean_num = clean.replace("hrs", "").replace("hr", "").strip()
        return float(clean_num)
    except:
        return 0.0


@router.post("/working-hours/start")
@router.post("/attendance/clock-in")
def start_working_time(payload: dict, db: Session = Depends(get_db)):
    candidate_id = payload.get("candidate_id") or payload.get("candidateId") or "INT-201"
    candidate_name = payload.get("candidate_name") or payload.get("candidateName") or "Ananya Roy"
    candidate_type = payload.get("candidate_type") or payload.get("type") or ("Employee" if "EMP" in candidate_id.upper() else "Intern")
    today_date = date.today()
    now_time_str = datetime.now().strftime("%I:%M %p")

    # Check if there is already an attendance record for this candidate on today's date
    today_rec = db.query(models.AttendanceRecord).filter(
        models.AttendanceRecord.candidate_id == candidate_id,
        models.AttendanceRecord.date == today_date
    ).order_by(models.AttendanceRecord.created_at.desc()).first()

    if today_rec:
        if today_rec.status == "IN_PROGRESS":
            # Already active session in progress
            return {
                "success": True,
                "message": f"Active session already running since {today_rec.clock_in}",
                "record": {
                    "id": today_rec.id,
                    "candidate_id": today_rec.candidate_id,
                    "candidateName": today_rec.candidate_name,
                    "date": str(today_rec.date),
                    "clockIn": today_rec.clock_in,
                    "clockOut": today_rec.clock_out or "--:--",
                    "totalHours": today_rec.total_hours or "In Progress",
                    "status": today_rec.status
                }
            }
        else:
            # Resuming after a break on the same date! Keep in the SAME row:
            today_rec.status = "IN_PROGRESS"
            # Set created_at to exact current time so the upcoming elapsed session is measured accurately in real-time
            today_rec.created_at = datetime.utcnow()
            db.commit()

            return {
                "success": True,
                "message": f"Welcome back! Working session resumed at {now_time_str}. Elapsed time will accumulate into today's record in real time.",
                "record": {
                    "id": today_rec.id,
                    "candidate_id": today_rec.candidate_id,
                    "candidateName": today_rec.candidate_name,
                    "date": str(today_rec.date),
                    "clockIn": today_rec.clock_in,
                    "clockOut": "--:--",
                    "totalHours": today_rec.total_hours or "In Progress",
                    "status": "IN_PROGRESS"
                }
            }

    # Brand new first shift for today
    rec_id = f"ATT-{uuid4().hex[:6].upper()}"
    new_rec = models.AttendanceRecord(
        id=rec_id,
        candidate_id=candidate_id,
        candidate_name=candidate_name,
        candidate_type=candidate_type,
        date=today_date,
        clock_in=now_time_str,
        clock_out=None,
        total_hours="0s",
        status="IN_PROGRESS",
        created_at=datetime.utcnow()
    )
    db.add(new_rec)
    db.commit()

    return {
        "success": True,
        "message": f"Working time started at {now_time_str}! First session initialized for today.",
        "record": {
            "id": rec_id,
            "candidate_id": candidate_id,
            "candidateName": candidate_name,
            "date": str(today_date),
            "clockIn": now_time_str,
            "clockOut": "--:--",
            "totalHours": "In Progress",
            "status": "IN_PROGRESS"
        }
    }


@router.post("/working-hours/end")
@router.post("/attendance/clock-out")
def end_working_time(payload: dict, db: Session = Depends(get_db)):
    candidate_id = payload.get("candidate_id") or payload.get("candidateId") or "INT-201"
    today_date = date.today()
    now_time_str = datetime.now().strftime("%I:%M %p")

    # Find today's session record
    rec = db.query(models.AttendanceRecord).filter(
        models.AttendanceRecord.candidate_id == candidate_id,
        models.AttendanceRecord.date == today_date
    ).first()

    if not rec:
        # Find any most recent open session if date rolled over
        rec = db.query(models.AttendanceRecord).filter(
            models.AttendanceRecord.candidate_id == candidate_id,
            models.AttendanceRecord.status == "IN_PROGRESS"
        ).order_by(models.AttendanceRecord.created_at.desc()).first()

    if not rec:
        rec_id = f"ATT-{uuid4().hex[:6].upper()}"
        rec = models.AttendanceRecord(
            id=rec_id,
            candidate_id=candidate_id,
            candidate_name=payload.get("candidate_name") or "Ananya Roy",
            candidate_type="Employee" if "EMP" in candidate_id.upper() else "Intern",
            date=today_date,
            clock_in=now_time_str,
            clock_out=now_time_str,
            total_hours="0m 30s",
            status="COMPLETED",
            created_at=datetime.utcnow()
        )
        db.add(rec)
        db.commit()
    else:
        # Compute exact real-time duration in seconds from created_at
        session_seconds = 0
        if rec.created_at:
            delta = (datetime.utcnow() - rec.created_at).total_seconds()
            session_seconds = max(1, int(delta))
        else:
            session_seconds = 60

        current_hours_float = parse_hours_val(rec.total_hours)
        accum_seconds = int(current_hours_float * 3600) + session_seconds

        rec.clock_out = now_time_str
        rec.total_hours = format_duration(accum_seconds)
        rec.status = "COMPLETED"
        db.commit()

    # Calculate updated tenure based on attendance
    distinct_completed_days = db.query(models.AttendanceRecord).filter(
        models.AttendanceRecord.candidate_id == candidate_id,
        models.AttendanceRecord.status == "COMPLETED"
    ).count()

    is_employee = "EMP" in candidate_id.upper()
    base_days = 380 if is_employee else 68
    total_days = 730 if is_employee else 92
    updated_days = min(total_days, max(base_days, base_days + distinct_completed_days))
    updated_progress = min(100, round((updated_days / total_days) * 100))

    return {
        "success": True,
        "message": f"Work session paused/ended at {now_time_str}. Total time recorded: {rec.total_hours}.",
        "record": {
            "id": rec.id,
            "candidate_id": rec.candidate_id,
            "candidateName": rec.candidate_name,
            "date": str(rec.date),
            "clockIn": rec.clock_in,
            "clockOut": rec.clock_out,
            "totalHours": rec.total_hours,
            "status": rec.status
        },
        "tenure": {
            "daysCompleted": updated_days,
            "totalDays": total_days,
            "progress": updated_progress
        }
    }
