from datetime import datetime, timedelta, timezone

from pwdlib import PasswordHash
from jose import jwt

from passlib.context import CryptContext
import os


password_hash = PasswordHash.recommended()
def hash_password(password:str):
    return password_hash.hash(password)

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

# def hash_password(password):
#     return pwd_context.hash(password)

def verify_password(plain, hashed):
    return password_hash.verify(plain, hashed)


def create_token(user_id):
    
    payload = {
        "sub": str(user_id),
        "exp": (
            datetime.now(timezone.utc)+timedelta(minutes=int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES")))
        )
    }

    return jwt.encode(
        payload,
        os.getenv("SECRET_KEY"),
        algorithm=os.getenv("ALGORITHM")
    )