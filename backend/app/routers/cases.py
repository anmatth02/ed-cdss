from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from ..database import SessionLocal
from ..models import Patient, Case
from ..schemas import PatientCreate, CaseCreate
from ..services.risk_rules import evaluate_decision
from ..services.report_generator import generate_case_report
from ..services.full_patient_report import generate_patient_history_report

router = APIRouter()


# --------------------------------------------------
# DATABASE SESSION
# --------------------------------------------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# --------------------------------------------------
# CREATE PATIENT
# --------------------------------------------------
@router.post("/patients")
def create_patient(data: PatientCreate, db: Session = Depends(get_db)):
    try:
        existing = db.query(Patient).filter(
            Patient.national_id == data.national_id
        ).first()

        if existing:
            return {
                "id": existing.id,
                "name": existing.name,
                "national_id": existing.national_id,
            }

        patient = Patient(
            name=data.name.strip(),
            national_id=data.national_id.strip()
        )

        db.add(patient)
        db.commit()
        db.refresh(patient)

        return {
            "id": patient.id,
            "name": patient.name,
            "national_id": patient.national_id,
        }

    except Exception as e:
        db.rollback()
        print("CREATE PATIENT ERROR:", str(e))
        raise HTTPException(status_code=500, detail=str(e))


# --------------------------------------------------
# CREATE CASE
# --------------------------------------------------
@router.post("/")
def create_case(data: CaseCreate, db: Session = Depends(get_db)):
    try:
        result = evaluate_decision(data)

        case = Case(
            patient_id=data.patient_id,

            age=data.age,
            walked_in=data.walked_in,
            ed_visits_last_year=data.ed_visits_last_year,
            hospitalizations_last_year=data.hospitalizations_last_year,
            hospitalizations_last_90_days=data.hospitalizations_last_90_days,

            fever=data.fever,
            headache=data.headache,
            abdominal_pain=data.abdominal_pain,
            pain_scale=data.pain_scale,
            triage_score=data.triage_score,

            respiratory_rate=data.respiratory_rate,
            heart_rate=data.heart_rate,
            systolic_bp=data.systolic_bp,
            diastolic_bp=data.diastolic_bp,
            spo2=data.spo2,
            temperature=data.temperature,

            mi=data.mi,
            chf=data.chf,
            pvd=data.pvd,
            cvd=data.cvd,
            dem=data.dem,
            cpd=data.cpd,
            pud=data.pud,
            rheu=data.rheu,
            liv1=data.liv1,
            liv2=data.liv2,
            dm1=data.dm1,
            dm2=data.dm2,
            paralysis=data.paralysis,
            renal=data.renal,
            malignancy=data.malignancy,
            mets=data.mets,
            hiv=data.hiv,

            decision=result["decision"],
            argument_type=result["argument_type"],
            confidence=result["confidence"],

            supporting_rules=result["supporting_rules"],
            opposing_rules=result["opposing_rules"],

            hospitalization_score=result["hospitalization_score"],
            discharge_score=result["discharge_score"],
        )

        db.add(case)
        db.commit()
        db.refresh(case)

        return {
            "case_id": case.id,
            "patient_id": case.patient_id,
            "created_at": case.created_at,

            "decision": case.decision,
            "argument_type": case.argument_type,
            "confidence": case.confidence,

            "supporting_rules": case.supporting_rules,
            "opposing_rules": case.opposing_rules,

            "hospitalization_score": case.hospitalization_score,
            "discharge_score": case.discharge_score,

            "input": data.model_dump(exclude_none=True),
        }

    except Exception as e:
        db.rollback()
        print("CREATE CASE ERROR:", str(e))
        raise HTTPException(status_code=500, detail=str(e))


# --------------------------------------------------
# HISTORY BY PATIENT ID
# --------------------------------------------------
@router.get("/patients/{patient_id}/history")
def get_patient_history(patient_id: str, db: Session = Depends(get_db)):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()

    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    cases = db.query(Case).filter(
        Case.patient_id == patient_id
    ).order_by(Case.created_at.desc()).all()

    return format_history_response(patient, cases)


# --------------------------------------------------
# HISTORY BY NATIONAL ID
# --------------------------------------------------
@router.get("/patients/by-national-id/{national_id}/history")
def get_history_by_national_id(national_id: str, db: Session = Depends(get_db)):
    patient = db.query(Patient).filter(
        Patient.national_id == national_id
    ).first()

    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    cases = db.query(Case).filter(
        Case.patient_id == patient.id
    ).order_by(Case.created_at.desc()).all()

    return format_history_response(patient, cases)


# --------------------------------------------------
# SUMMARY
# --------------------------------------------------
@router.get("/patients/{patient_id}/summary")
def get_patient_summary(patient_id: str, db: Session = Depends(get_db)):
    cases = db.query(Case).filter(
        Case.patient_id == patient_id
    ).order_by(Case.created_at.desc()).all()

    if not cases:
        raise HTTPException(status_code=404, detail="No visits found")

    return {
        "patient_id": patient_id,
        "total_visits": len(cases),
        "last_visit": cases[0].created_at,
        "first_visit": cases[-1].created_at,
    }


# --------------------------------------------------
# SINGLE CASE PDF
# --------------------------------------------------
@router.get("/{case_id}/report")
def get_case_pdf(case_id: int, db: Session = Depends(get_db)):
    case = db.query(Case).filter(Case.id == case_id).first()

    if not case:
        raise HTTPException(status_code=404, detail="Case not found")

    file_path = generate_case_report(case)

    return FileResponse(
        file_path,
        filename=f"case_{case_id}.pdf"
    )


# --------------------------------------------------
# FULL PATIENT PDF
# --------------------------------------------------
@router.get("/patients/by-national-id/{national_id}/report")
def get_patient_pdf(national_id: str, db: Session = Depends(get_db)):
    patient = db.query(Patient).filter(
        Patient.national_id == national_id
    ).first()

    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    cases = db.query(Case).filter(
        Case.patient_id == patient.id
    ).order_by(Case.created_at.desc()).all()

    return generate_patient_history_report(patient, cases)


# --------------------------------------------------
# HELPER
# --------------------------------------------------
def format_history_response(patient, cases):
    return {
        "patient": {
            "name": patient.name,
            "national_id": patient.national_id,
        },
        "total_visits": len(cases),
        "cases": [
            {
                "case_id": c.id,
                "created_at": c.created_at,

                "decision": c.decision,
                "argument_type": c.argument_type,
                "confidence": c.confidence,

                "supporting_rules": c.supporting_rules or [],
                "opposing_rules": c.opposing_rules or [],

                "hospitalization_score": c.hospitalization_score,
                "discharge_score": c.discharge_score,

                "triage_score": c.triage_score,
                "heart_rate": c.heart_rate,
                "spo2": c.spo2,

                "input": {
                    "age": c.age,
                    "walked_in": c.walked_in,
                    "ed_visits_last_year": c.ed_visits_last_year,
                    "hospitalizations_last_year": c.hospitalizations_last_year,
                    "hospitalizations_last_90_days": c.hospitalizations_last_90_days,

                    "fever": c.fever,
                    "headache": c.headache,
                    "abdominal_pain": c.abdominal_pain,
                    "pain_scale": c.pain_scale,

                    "respiratory_rate": c.respiratory_rate,
                    "heart_rate": c.heart_rate,
                    "systolic_bp": c.systolic_bp,
                    "diastolic_bp": c.diastolic_bp,
                    "spo2": c.spo2,
                    "temperature": c.temperature,
                    "triage_score": c.triage_score,

                    "mi": c.mi,
                    "chf": c.chf,
                    "pvd": c.pvd,
                    "cvd": c.cvd,
                    "dem": c.dem,
                    "cpd": c.cpd,
                    "pud": c.pud,
                    "rheu": c.rheu,
                    "liv1": c.liv1,
                    "liv2": c.liv2,
                    "dm1": c.dm1,
                    "dm2": c.dm2,
                    "paralysis": c.paralysis,
                    "renal": c.renal,
                    "malignancy": c.malignancy,
                    "mets": c.mets,
                    "hiv": c.hiv,
                }
            }
            for c in cases
        ]
    }