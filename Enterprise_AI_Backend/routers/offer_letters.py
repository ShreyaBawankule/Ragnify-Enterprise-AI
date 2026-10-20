from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from datetime import datetime, timedelta, date
import os
from database import SessionLocal
import models
from services.report_generator_service import generate_offer_letter_pdf

router = APIRouter(
    prefix="/offer-letters",
    tags=["Offer Letters"]
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("")
def get_offer_letters(db: Session = Depends(get_db)):
    letters = db.query(models.OfferLetter).all()
    results = []

    for o in letters:
        candidate = db.query(models.CandidateProfile).filter(models.CandidateProfile.candidate_id == o.candidate_id).first()
        contact = db.query(models.ContactDetails).filter(models.ContactDetails.candidate_id == o.candidate_id).first()
        emp_det = db.query(models.EmploymentDetails).filter(models.EmploymentDetails.candidate_id == o.candidate_id).first()
        hr_v = db.query(models.HRVerification).filter(models.HRVerification.candidate_id == o.candidate_id).first()

        is_app_approved = False
        if hr_v:
            if "Complete" in (hr_v.overall_onboarding_status or "") or "Verified" in (hr_v.hr_verification_status or "") or "Approved" in (hr_v.hr_verification_status or "") or "APPROVED" in (hr_v.overall_onboarding_status or "").upper():
                is_app_approved = True

        cand_type = candidate.candidate_type if candidate else ("Intern" if "intern" in (o.offer_type or "").lower() else "Employee")
        comp_str = (
            f"₹{int(emp_det.annual_ctc_inr):,} / yr"
            if (emp_det and emp_det.annual_ctc_inr)
            else (
                f"₹{int(emp_det.monthly_stipend_inr):,} / mo"
                if (emp_det and emp_det.monthly_stipend_inr)
                else ("₹25,000 / mo" if cand_type == "Intern" else "₹12,00,000 / yr")
            )
        )

        results.append({
            "id": o.offer_id,
            "applicationId": o.candidate_id,
            "candidateName": candidate.full_name if candidate else o.candidate_id,
            "candidateEmail": contact.official_email if (contact and contact.official_email) else (contact.personal_email if (contact and contact.personal_email) else f"{o.candidate_id.lower()}@ragnify.com"),
            "role": o.position,
            "type": cand_type,
            "department": o.department,
            "stipendSalary": comp_str,
            "reportingManager": o.reporting_manager_name or "Dr. Rajesh Khanna, Head of AI",
            "applicationApproval": "APPROVED" if is_app_approved else "PENDING",
            "isApproved": is_app_approved,
            "joiningDate": str(o.joining_date),
            "generatedDate": str(o.offer_date),
            "validUntil": str(o.valid_until) if o.valid_until else str(o.offer_date),
            "status": "COUNTERSIGNED" if o.acceptance_status == "Accepted" else "ISSUED",
            "file": o.offer_letter_filename or f"{o.candidate_id}_Offer_Letter.pdf",
            "fileUrl": f"/offer-letters/download/{o.candidate_id}"
        })

    return results


@router.get("/download/{offer_or_cand_id}")
def download_offer_letter_pdf(offer_or_cand_id: str, db: Session = Depends(get_db)):
    clean_key = offer_or_cand_id.replace("_Offer_Letter.pdf", "").strip()
    offer = db.query(models.OfferLetter).filter(
        (models.OfferLetter.candidate_id == clean_key) |
        (models.OfferLetter.offer_id == clean_key)
    ).first()

    cand_id = offer.candidate_id if offer else clean_key
    candidate = db.query(models.CandidateProfile).filter(models.CandidateProfile.candidate_id == cand_id).first()
    contact = db.query(models.ContactDetails).filter(models.ContactDetails.candidate_id == cand_id).first()
    emp_det = db.query(models.EmploymentDetails).filter(models.EmploymentDetails.candidate_id == cand_id).first()

    candidate_name = candidate.full_name if candidate else (cand_id if cand_id else "Executive Candidate")
    cand_type = candidate.candidate_type if candidate else ("Intern" if (offer and "intern" in (offer.offer_type or "").lower()) else "Employee")
    role = (offer.position if offer and offer.position else None) or (emp_det.designation if emp_det and emp_det.designation else "Software Engineer")
    department = (offer.department if offer and offer.department else None) or (emp_det.department if emp_det and emp_det.department else "Engineering")
    reporting_mgr = (offer.reporting_manager_name if offer and offer.reporting_manager_name else None) or (emp_det.reporting_manager if emp_det and emp_det.reporting_manager else "Dr. Rajesh Khanna, Head of AI")
    joining_str = str(offer.joining_date) if (offer and offer.joining_date) else (str(emp_det.joining_date) if (emp_det and emp_det.joining_date) else datetime.now().strftime("%Y-%m-%d"))
    offer_dt_str = str(offer.offer_date) if (offer and offer.offer_date) else datetime.now().strftime("%Y-%m-%d")
    email_str = contact.official_email if (contact and contact.official_email) else (contact.personal_email if (contact and contact.personal_email) else f"{cand_id.lower()}@ragnify.com")
    status_str = "COUNTERSIGNED" if (offer and offer.acceptance_status == "Accepted") else "ISSUED"

    comp_str = (
        f"INR {int(emp_det.annual_ctc_inr):,} / annum"
        if (emp_det and emp_det.annual_ctc_inr)
        else (
            f"INR {int(emp_det.monthly_stipend_inr):,} / month"
            if (emp_det and emp_det.monthly_stipend_inr)
            else ("INR 25,000 / month" if cand_type == "Intern" else "INR 12,00,000 / annum")
        )
    )

    pdf_info = generate_offer_letter_pdf(
        candidate_name=candidate_name,
        candidate_id=cand_id,
        role=role,
        department=department,
        ctc_or_stipend=comp_str,
        candidate_type=cand_type,
        joining_date=joining_str,
        reporting_manager=reporting_mgr,
        offer_date=offer_dt_str,
        candidate_email=email_str,
        acceptance_status=status_str
    )

    docs_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads", "documents")
    filepath = os.path.join(docs_dir, pdf_info["filename"])
    if not os.path.exists(filepath):
        raise HTTPException(status_code=404, detail="Offer letter PDF could not be generated")

    return FileResponse(
        filepath,
        media_type="application/pdf",
        headers={"Content-Disposition": f'inline; filename="{pdf_info["filename"]}"'}
    )


@router.post("/generate")
def generate_offer_letter(payload: dict, db: Session = Depends(get_db)):
    app_id = payload.get("applicationId") or payload.get("candidateId") or f"CAND-{datetime.now().strftime('%M%S')}"
    candidate_name = payload.get("candidateName") or payload.get("applicantName") or "Ananya Sharma"
    role = payload.get("role") or payload.get("position") or "Software Engineer"
    department = payload.get("department") or "Engineering"
    candidate_type = payload.get("type") or payload.get("candidateType") or "Employee"
    stipend_salary = payload.get("stipendSalary") or payload.get("ctc") or ("₹12,00,000 / yr" if candidate_type.lower() == "employee" else "₹25,000 / mo")
    reporting_manager = payload.get("reportingManager") or "Dr. Rajesh Khanna, Head of AI"
    cand_email = payload.get("candidateEmail") or f"{app_id.lower()}@ragnify.com"

    joining_date_str = payload.get("joiningDate")
    joining_dt = date.today() + timedelta(days=14)
    if joining_date_str:
        try:
            joining_dt = datetime.strptime(joining_date_str, "%Y-%m-%d").date()
        except Exception:
            pass

    # 1. Generate Physical Executive PDF Offer Letter
    pdf_info = generate_offer_letter_pdf(
        candidate_name=candidate_name,
        candidate_id=app_id,
        role=role,
        department=department,
        ctc_or_stipend=stipend_salary,
        candidate_type=candidate_type,
        joining_date=str(joining_dt),
        reporting_manager=reporting_manager,
        offer_date=str(date.today()),
        candidate_email=cand_email,
        acceptance_status="ISSUED"
    )

    # 2. Database Persistence
    offer_id = f"OFR-{app_id}"
    existing_offer = db.query(models.OfferLetter).filter(models.OfferLetter.candidate_id == app_id).first()

    if existing_offer:
        existing_offer.position = role
        existing_offer.department = department
        existing_offer.offer_letter_filename = pdf_info["filename"]
        existing_offer.offer_date = date.today()
        existing_offer.valid_until = date.today() + timedelta(days=15)
        existing_offer.joining_date = joining_dt
        existing_offer.offer_letter_status = "Generated"
        existing_offer.reporting_manager_name = reporting_manager
        db.commit()
    else:
        new_offer = models.OfferLetter(
            offer_id=offer_id,
            candidate_id=app_id,
            offer_type="Full-Time" if candidate_type.lower() == "employee" else "Internship",
            offer_letter_status="Generated",
            offer_letter_filename=pdf_info["filename"],
            offer_date=date.today(),
            valid_until=date.today() + timedelta(days=15),
            position=role,
            department=department,
            reporting_manager_name=reporting_manager,
            joining_date=joining_dt,
            acceptance_status="Pending"
        )
        db.add(new_offer)
        try:
            db.commit()
        except Exception as e:
            db.rollback()
            print(f"DB Offer insertion notice: {e}")

    return {
        "success": True,
        "id": offer_id,
        "applicationId": app_id,
        "candidateName": candidate_name,
        "candidateEmail": cand_email,
        "role": role,
        "type": candidate_type,
        "department": department,
        "stipendSalary": stipend_salary,
        "reportingManager": reporting_manager,
        "joiningDate": str(joining_dt),
        "generatedDate": str(date.today()),
        "status": "ISSUED",
        "file": pdf_info["filename"],
        "fileUrl": f"/offer-letters/download/{app_id}",
        "message": f"Official offer letter successfully generated for {candidate_name} ({role})."
    }

