import {
  Stepper,
  Step,
  StepLabel,
  Paper,
  Typography,
  Box,
  DialogActions,
  DialogTitle,
  Button,
  DialogContent,
  Dialog,
} from "@mui/material";
import { useState } from "react";
import StepPatientInfo from "../components/new-case/StepPatientInfo";
import StepHistory from "../components/new-case/StepHistory";
import type { CaseResult, NewCaseForm } from "../types/Case";
import StepVitals from "../components/new-case/StepVitals";
import StepComorbidities from "../components/new-case/StepComorbidities";
import StepReview from "../components/new-case/StepReview";
import ClinicalDecisionCard from "../components/results/ClinicalDecisionCard";

const steps = [
  "Demographics",
  "Visit Characteristics",
  "Clinical Presentation",
  "Comorbidity Profile",
  "Review",
  "Result",
];

// LOCAL URL
// const API_URL = "http://localhost:8000";

// LIVE URL
const API_URL = import.meta.env.VITE_API_URL;

console.log("API_URL =", API_URL);
const NewCase = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [result, setResult] = useState<CaseResult | null>(null);
  const [severityDialogOpen, setSeverityDialogOpen] = useState(false);
  const [pendingResolve, setPendingResolve] = useState<
    ((value: number) => void) | null
  >(null);
  const [formData, setFormData] = useState<NewCaseForm>({
    name: "",
    age: 0,
    nationalId: "",
    walkedIn: "",
    edVisitsLastYear: undefined,
    hospitalizationsLastYear: undefined,
    hospitalizationsLast90Days: undefined,
    fever: false,
    headache: false,
    abdominalPain: false,
    painScale: 0,
    respiratoryRate: 0,
    heartRate: 0,
    systolicBP: 0,
    diastolicBP: 0,
    spo2: 0,
    temperature: 0,
    triageScore: 0,
    mi: false,
    chf: false,
    pvd: false,
    cvd: false,
    dem: false,
    cpd: false,
    pud: false,
    rheu: false,
    liv1: false,
    liv2: false,
    dm1: false,
    dm2: false,
    paralysis: false,
    renal: false,
    malignancy: false,
    mets: false,
    hiv: false,
  });
  console.log("FORM DATA:", formData);
  const update = (data: Partial<NewCaseForm>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const next = () => setActiveStep((prev) => prev + 1);

  const back = () => setActiveStep((prev) => Math.max(prev - 1, 0));

  const askSeverity = () => {
    return new Promise<number>((resolve) => {
      setPendingResolve(() => resolve);
      setSeverityDialogOpen(true);
    });
  };

  const handleSubmit = async () => {
    try {
      const lowTriagePayload = {
        patient_id: "",

        age: formData.age,
        walked_in: formData.walkedIn,
        ed_visits_last_year: formData.edVisitsLastYear,
        hospitalizations_last_year: formData.hospitalizationsLastYear,
        hospitalizations_last_90_days: formData.hospitalizationsLast90Days,

        fever: formData.fever,
        headache: formData.headache,
        abdominal_pain: formData.abdominalPain,
        pain_scale: formData.painScale,
        triage_score: 1,

        respiratory_rate: formData.respiratoryRate,
        heart_rate: formData.heartRate,
        systolic_bp: formData.systolicBP,
        diastolic_bp: formData.diastolicBP,
        spo2: formData.spo2,
        temperature: formData.temperature,

        mi: formData.mi,
        chf: formData.chf,
        pvd: formData.pvd,
        cvd: formData.cvd,
        dem: formData.dem,
        cpd: formData.cpd,
        pud: formData.pud,
        rheu: formData.rheu,
        liv1: formData.liv1,
        liv2: formData.liv2,
        dm1: formData.dm1,
        dm2: formData.dm2,
        paralysis: formData.paralysis,
        renal: formData.renal,
        malignancy: formData.malignancy,
        mets: formData.mets,
        hiv: formData.hiv,
      };

      const highTriagePayload = {
        ...lowTriagePayload,
        triage_score: 4,
      };

      const lowRes = await fetch(`${API_URL}/cases/evaluate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(lowTriagePayload),
      });

      const highRes = await fetch(`${API_URL}/cases/evaluate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(highTriagePayload),
      });

      const lowResult = await lowRes.json();
      const highResult = await highRes.json();

      console.log("LOW RESULT:", lowResult);
      console.log("HIGH RESULT:", highResult);

      let finalTriageScore = 1;

      if (
        lowResult.decision !== highResult.decision ||
        lowResult.argument_type !== highResult.argument_type
      ) {
        finalTriageScore = await askSeverity();
      }
      console.log(
        "DECISION CHANGED:",
        lowResult.decision !== highResult.decision ||
          lowResult.argument_type !== highResult.argument_type,
      );

      // 1️⃣ Create Patient
      const patientRes = await fetch(`${API_URL}/cases/patients`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          national_id: formData.nationalId,
        }),
      });

      if (!patientRes.ok) {
        const errorText = await patientRes.text();
        console.error("CASE ERROR RESPONSE:", errorText);
        throw new Error(errorText);
      }

      const patientData = await patientRes.json();

      // 2️⃣ Create Case
      const caseRes = await fetch(`${API_URL}/cases/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patient_id: patientData.id,

          age: formData.age,
          walked_in: formData.walkedIn,
          ed_visits_last_year: formData.edVisitsLastYear,
          hospitalizations_last_year: formData.hospitalizationsLastYear,
          hospitalizations_last_90_days: formData.hospitalizationsLast90Days,

          fever: formData.fever,
          headache: formData.headache,
          abdominal_pain: formData.abdominalPain,
          pain_scale: formData.painScale,
          triage_score: finalTriageScore,

          respiratory_rate: formData.respiratoryRate,
          heart_rate: formData.heartRate,
          systolic_bp: formData.systolicBP,
          diastolic_bp: formData.diastolicBP,
          spo2: formData.spo2,
          temperature: formData.temperature,

          mi: formData.mi,
          chf: formData.chf,
          pvd: formData.pvd,
          cvd: formData.cvd,
          dem: formData.dem,
          cpd: formData.cpd,
          pud: formData.pud,
          rheu: formData.rheu,
          liv1: formData.liv1,
          liv2: formData.liv2,
          dm1: formData.dm1,
          dm2: formData.dm2,
          paralysis: formData.paralysis,
          renal: formData.renal,
          malignancy: formData.malignancy,
          mets: formData.mets,
          hiv: formData.hiv,
        }),
      });

      if (!caseRes.ok) {
        const errorText = await caseRes.text();
        throw new Error(errorText);
      }

      const caseData = await caseRes.json();

      setResult(caseData);
      setActiveStep(5);
    } catch (error) {
      console.error("Error saving case:", error);
      alert(`Error saving case ❌\n${String(error)}`);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        HospiGuide
      </Typography>
      <Paper sx={{ p: 4, width: "90%", bgcolor: "#ee4cd81c" }}>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {activeStep === 0 && (
          <StepPatientInfo onNext={next} onChange={update} />
        )}

        {activeStep === 1 && (
          <StepHistory
            onNext={next}
            onBack={back}
            onChange={update}
            defaultEdVisitsLastYear={formData.edVisitsLastYear}
            defaultHospitalizationsLastYear={formData.hospitalizationsLastYear}
            defaultHospitalizationsLast90Days={
              formData.hospitalizationsLast90Days
            }
          />
        )}

        {activeStep === 2 && (
          <StepVitals onNext={next} onBack={back} onChange={update} />
        )}

        {activeStep === 3 && (
          <StepComorbidities onNext={next} onBack={back} onChange={update} />
        )}

        {activeStep === 4 && (
          <StepReview data={formData} onBack={back} onSubmit={handleSubmit} />
        )}

        {activeStep === 5 && result && (
          <ClinicalDecisionCard
            result={result}
            formData={formData}
            onStartNewCase={() => {
              setActiveStep(0);
              setResult(null);
            }}
          />
        )}
      </Paper>

      <Dialog open={severityDialogOpen} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>
          Clinical Severity Assessment
        </DialogTitle>

        <DialogContent>
          The system detected that the recommendation changes depending on the
          perceived severity of the case.
          <br />
          <br />
          Please indicate the overall clinical severity of the patient.
        </DialogContent>

        <DialogActions
          sx={{
            p: 3,
            justifyContent: "space-between",
          }}
        >
          <Button
            variant="outlined"
            size="large"
            onClick={() => {
              pendingResolve?.(1);
              setSeverityDialogOpen(false);
            }}
          >
            Low Severity
          </Button>

          <Button
            variant="contained"
            color="error"
            size="large"
            onClick={() => {
              pendingResolve?.(4);
              setSeverityDialogOpen(false);
            }}
          >
            High Severity
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default NewCase;
