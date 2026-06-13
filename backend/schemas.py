from pydantic import BaseModel, EmailStr, field_validator
from datetime import date
from typing import Optional


# ─────────────────────────────────────────
#  USUARIOS
# ─────────────────────────────────────────
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    username: str
    email: str
    is_active: bool

    model_config = {"from_attributes": True}


# ─────────────────────────────────────────
#  LOGIN
# ─────────────────────────────────────────
class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Optional[str] = None


# ─────────────────────────────────────────
#  PAGOS
# ─────────────────────────────────────────
VALID_CATEGORIES = {"Alimentación", "Servicios", "Entretenimiento", "Salud", "Educación", "Otros"}
VALID_STATUSES   = {"Pendiente", "Pagado"}


class PaymentCreate(BaseModel):
    description: str
    amount: float
    category: str
    status: str = "Pendiente"
    date: date
    remind: bool = False

    @field_validator("amount")
    @classmethod
    def amount_positive(cls, v):
        if v <= 0:
            raise ValueError("El monto debe ser mayor a 0")
        return v

    @field_validator("category")
    @classmethod
    def valid_category(cls, v):
        if v not in VALID_CATEGORIES:
            raise ValueError(f"Categoría inválida: {v}")
        return v

    @field_validator("status")
    @classmethod
    def valid_status(cls, v):
        if v not in VALID_STATUSES:
            raise ValueError(f"Estado inválido: {v}")
        return v


class PaymentUpdate(PaymentCreate):
    pass


class PaymentOut(BaseModel):
    id: int
    description: str
    amount: float
    category: str
    status: str
    date: date
    remind: bool
    user_id: int

    model_config = {"from_attributes": True}
