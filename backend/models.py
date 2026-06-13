from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from database import Base
from datetime import date


class User(Base):
    __tablename__ = "users"

    id           = Column(Integer, primary_key=True, index=True)
    username     = Column(String, unique=True, index=True, nullable=False)
    email        = Column(String, unique=True, index=True, nullable=False)
    hashed_pass  = Column(String, nullable=False)
    is_active    = Column(Boolean, default=True)

    payments     = relationship("Payment", back_populates="owner", cascade="all, delete")


class Payment(Base):
    __tablename__ = "payments"

    id          = Column(Integer, primary_key=True, index=True)
    description = Column(String, nullable=False)
    amount      = Column(Float, nullable=False)
    category    = Column(String, nullable=False)
    status      = Column(String, default="Pendiente")   # Pendiente | Pagado
    date        = Column(Date, default=date.today)
    remind      = Column(Boolean, default=False)        # activar recordatorio
    user_id     = Column(Integer, ForeignKey("users.id"))

    owner       = relationship("User", back_populates="payments")
