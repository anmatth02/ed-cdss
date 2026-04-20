import {
  Stepper,
  Step,
  StepLabel,
  Paper,
  Typography,
  Box,
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

  // const getDecisionColor = (decision: string) => {
  //   if (decision === "HOSPITALIZATION") return "error.main";
  //   if (decision === "DISCHARGE") return "success.main";
  //   return "warning.main";
  // };

  // const getRecommendation = (decision: string) => {
  //   if (decision === "HOSPITALIZATION")
  //     return "Patient should be admitted for further monitoring.";

  //   if (decision === "DISCHARGE")
  //     return "Patient may be safely discharged with follow-up.";

  //   return "Case is unclear - clinical judgment required.";
  // };

  // const getNextSteps = (decision: string) => {
  //   if (decision === "HOSPITALIZATION")
  //     return [
  //       "Perform ECG immediately",
  //       "Monitor vital signs continuously",
  //       "Consider urgent laboratory testing",
  //     ];

  //   if (decision === "DILEMMA")
  //     return [
  //       "Perform clinical reassessment",
  //       "Monitor patient condition",
  //       "Consider diagnostic imaging",
  //     ];

  //   return ["Routine monitoring", "Outpatient follow-up recommended"];
  // };

  const handleSubmit = async () => {
    try {
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
          triage_score: formData.triageScore,

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

      console.log("Saved case:", caseData);

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
      <Paper sx={{ p: 4, width: "90%", bgcolor: "#F7E3FA" }}>
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
          <StepHistory onNext={next} onBack={back} onChange={update} />
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
    </Box>
  );
};

export default NewCase;
