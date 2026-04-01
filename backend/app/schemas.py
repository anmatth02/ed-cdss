from pydantic import BaseModel
from typing import Optional

class CaseCreate(BaseModel):
    patient_id: str
    age: int

    walked_in: str
    ed_visits_last_year: int
    hospitalizations_last_year: int

    fever: bool
    headache: bool
    abdominal_pain: bool
    pain_scale: int
    triage_score: int

    respiratory_rate: int
    heart_rate: int
    systolic_bp: int
    diastolic_bp: int
    spo2: int
    temperature: float

    mi: bool
    chf: bool
    pvd: bool
    cvd: bool
    dem: bool
    cpd: bool
    pud: bool
    rheu: bool
    liv1: bool
    liv2: bool
    dm1: bool
    dm2: bool
    paralysis: bool
    renal: bool
    malignancy: bool
    mets: bool
    hiv: bool

class PatientCreate(BaseModel):
    name: str
    national_id: str