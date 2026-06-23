from fastapi import HTTPException
from .model import User
from .repository import UserRepository

from app.core.security import hash_password, verify_password, create_token

def register(db, data):
    
    if UserRepository.get_by_email(db, data.email):
        raise HTTPException(400, "Email already used")
    
    user = User(
        username = data.username,
        email = data.email,
        password = hash_password(data.password)
    )
    user = UserRepository.create(db, user)


    return {
        "access_token": create_token(user.id),
        "token_type": "bearer"
    }


def login(db, data):
    user = UserRepository.get_by_email(db, data.email)

    if not user or not verify_password(data.password, user.password):
        raise HTTPException(401, "Email ou mot de passe incorrect")


    return {
        "access_token": create_token(user.id),
        "token_type": "bearer"
    }


