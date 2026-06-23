from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db

from .shemas import RegisterRequest, LoginRequest
from .service import login, register

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/register")
def signup(data: RegisterRequest, db: Session= Depends(get_db)):
    return register(db, data)


@router.post("/login")
def signin(data: LoginRequest, db: Session=Depends(get_db)):
    return login(db, data)

