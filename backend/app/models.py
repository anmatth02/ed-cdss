import uuid
from sqlalchemy import Column, String, Integer, Boolean, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from .database import Base


class Patient(Base):
    __tablename__ = "patients"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    national_id = Column(String, unique=True, nullable=False)
    cases = relationship("Case", back_populates="patient")


class Case(Base):
    __tablename__ = "cases"

    risk_level = Column(String)
    risk_score = Column(Integer)

    id = Column(Integer, primary_key=True, index=True)

    patient_id = Column(String, ForeignKey("patients.id"))
    patient = relationship("Patient", back_populates="cases")

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    age = Column(Integer)
    walked_in = Column(String)
    ed_visits_last_year = Column(Integer)
    hospitalizations_last_year = Column(Integer)

    fever = Column(Boolean)
    headache = Column(Boolean)
    abdominal_pain = Column(Boolean)
    pain_scale = Column(Integer)
    triage_score = Column(Integer)

    respiratory_rate = Column(Integer)
    heart_rate = Column(Integer)
    systolic_bp = Column(Integer)
    diastolic_bp = Column(Integer)
    spo2 = Column(Integer)
    temperature = Column(Integer)

    mi = Column(Boolean)
    chf = Column(Boolean)
    pvd = Column(Boolean)
    cvd = Column(Boolean)
    dem = Column(Boolean)
    cpd = Column(Boolean)
    pud = Column(Boolean)
    rheu = Column(Boolean)
    liv1 = Column(Boolean)
    liv2 = Column(Boolean)
    dm1 = Column(Boolean)
    dm2 = Column(Boolean)
    paralysis = Column(Boolean)
    renal = Column(Boolean)
    malignancy = Column(Boolean)
    mets = Column(Boolean)
    hiv = Column(Boolean)