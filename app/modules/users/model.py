from sqlalchemy import Column, Integer, String, DateTime
from app.core.database import Base
from datetime import datetime, timezone

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    username = Column(String)
    email = Column(String, unique=True)
    password = Column(String)
    createdAt = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updaterAt = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))