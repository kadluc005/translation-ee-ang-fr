from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.core.database import Base

class History(Base):
    __tablename__ = "histories"

    id = Column(Integer, primary_key=True)
    source_text = Column(String)
    translated_text = Column(String)
    user_id = Column(Integer, ForeignKey("users.id"))
    createdAt = Column(DateTime)
    updaterAt = Column(DateTime)

    user = relationship("User")

    