from fastapi import APIRouter, HTTPException
from sqlalchemy.exc import IntegrityError

from database import SessionLocal
from models import Manager
from schemas import ManagerCreate, ManagerUpdate

router = APIRouter()

@router.post("/managers")
def add_manager(manager: ManagerCreate):

    db = SessionLocal()

    try:
        new_manager = Manager(
        manager_id=manager.manager_id,
        name=manager.name,
        email=manager.email,
        phone=manager.phone,
        department=manager.department,
        experience=manager.experience
        )
        

        db.add(new_manager)
        db.commit()

        return {"message": "Manager added successfully!"}

    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail="Manager ID already exists."
        )

    finally:
        db.close()

@router.get("/managers")
def get_all_managers():

    db = SessionLocal()

    managers = db.query(Manager).all()

    db.close()

    return managers

@router.get("/managers/{manager_id}")
def get_manager_by_id(manager_id: str):

    db = SessionLocal()

    manager = db.query(Manager).filter(
        Manager.manager_id == manager_id
    ).first()

    db.close()

    if manager is None:
        raise HTTPException(
            status_code=404,
            detail="Manager not found."
        )

    return manager

@router.put("/managers/{manager_id}")
def update_manager(manager_id: str, updated_manager: ManagerUpdate):

    db = SessionLocal()

    manager = db.query(Manager).filter(
        Manager.manager_id == manager_id
    ).first()

    if manager is None:
        db.close()
        raise HTTPException(
            status_code=404,
            detail="Manager not found."
        )

    manager.name = updated_manager.name
    manager.email = updated_manager.email
    manager.phone = updated_manager.phone
    manager.department = updated_manager.department
    manager.experience = updated_manager.experience

    db.commit()
    db.close()

    return {"message": "Manager updated successfully!"}

@router.delete("/managers/{manager_id}")
def delete_manager(manager_id: str):

    db = SessionLocal()

    manager = db.query(Manager).filter(
        Manager.manager_id == manager_id
    ).first()

    if manager is None:
        db.close()
        raise HTTPException(
            status_code=404,
            detail="Manager not found."
        )

    db.delete(manager)
    db.commit()
    db.close()

    return {"message": "Manager deleted successfully!"}