from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from apscheduler.schedulers.background import BackgroundScheduler
from datetime import date, timedelta
from database import engine, SessionLocal
import models
from routers import payments, users

# ─── Crear tablas ─────────────────────────
models.Base.metadata.create_all(bind=engine)

# ─── App ──────────────────────────────────
app = FastAPI(
    title="Control de Pagos API",
    description="Backend para la app de control de pagos de Jeison",
    version="1.0.0"
)

# ─── CORS (permite el frontend React) ────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # en producción pon tu dominio real
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Routers ──────────────────────────────
app.include_router(users.router)
app.include_router(payments.router)


# ─── Recordatorios automáticos ────────────
def check_reminders():
    """Revisa cada día pagos pendientes con recordatorio activo próximos a vencer."""
    db = SessionLocal()
    try:
        tomorrow = date.today() + timedelta(days=1)
        pending = db.query(models.Payment).filter(
            models.Payment.remind == True,
            models.Payment.status == "Pendiente",
            models.Payment.date == tomorrow
        ).all()
        for p in pending:
            # Aquí puedes integrar email, push notification, etc.
            print(f"[RECORDATORIO] Pago '{p.description}' vence mañana — ₡{p.amount:,.2f}")
    finally:
        db.close()

scheduler = BackgroundScheduler()
scheduler.add_job(check_reminders, "cron", hour=8, minute=0)  # todos los días a las 8am
scheduler.start()


# ─── Ruta raíz ────────────────────────────
@app.get("/")
def root():
    return {"message": "Control de Pagos API corriendo ✅"}


# ─── Apagar scheduler al cerrar ───────────
@app.on_event("shutdown")
def shutdown_scheduler():
    scheduler.shutdown()
