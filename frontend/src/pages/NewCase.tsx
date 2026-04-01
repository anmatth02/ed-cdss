import {
  Stepper,
  Step,
  StepLabel,
  Paper,
  Typography,
  LinearProgress,
  Box,
  Button,
  Divider,
} from "@mui/material";
import { useState } from "react";
import StepPatientInfo from "../components/new-case/StepPatientInfo";
import StepHistory from "../components/new-case/StepHistory";
import type { CaseResult, NewCaseForm } from "../types/Case";
import StepVitals from "../components/new-case/StepVitals";
import StepComorbidities from "../components/new-case/StepComorbidities";
import StepReview from "../components/new-case/StepReview";

const steps = [
  "Demographics",
  "Visit Characteristics",
  "Clinical Presentation",
  "Comorbidity Profile",
  "Review",
  "Result",
];

const NewCase = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [result, setResult] = useState<CaseResult | null>(null);

  const [formData, setFormData] = useState<NewCaseForm>({
    name: "",
    age: 0,
    nationalId: "",
    walkedIn: "",
    edVisitsLastYear: 0,
    hospitalizationsLastYear: 0,
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

  const getRuleColor = (rule: string) => {
    if (rule.includes("+3") || rule.includes("+2")) return "error.main";
    return "warning.main";
  };

  const next = () => setActiveStep((prev) => prev + 1);

  const back = () => setActiveStep((prev) => Math.max(prev - 1, 0));
  const getRiskColor = (risk: string) => {
    if (risk === "HIGH") return "error.main";
    if (risk === "MODERATE") return "warning.main";
    return "success.main";
  };

  const getRecommendation = (risk: string) => {
    if (risk === "HIGH") return "Immediate physician evaluation recommended.";

    if (risk === "MODERATE") return "Further diagnostic assessment advised.";

    return "Patient may be suitable for outpatient management.";
  };

  const getNextSteps = (risk: string) => {
    if (risk === "HIGH")
      return [
        "Perform ECG immediately",
        "Monitor vital signs continuously",
        "Consider urgent laboratory testing",
      ];

    if (risk === "MODERATE")
      return [
        "Perform clinical reassessment",
        "Monitor patient condition",
        "Consider diagnostic imaging",
      ];

    return ["Routine monitoring", "Outpatient follow-up recommended"];
  };

  const handleSubmit = async () => {
    try {
      // 1️⃣ Create Patient
      const patientRes = await fetch("http://localhost:8000/cases/patients", {
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
        throw new Error("Failed to create patient");
      }

      const patientData = await patientRes.json();

      // 2️⃣ Create Case
      const caseRes = await fetch("http://localhost:8000/cases/", {
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
      alert("Error saving case ❌");
    }
  };

  return (
    <Box sx={{ p: 3 }}>
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
          <Paper sx={{ mt: 3, p: 4 }}>
            <Typography variant="h5" sx={{ mb: 3 }}>
              Clinical Decision Report
            </Typography>

            {/* Risk Panel */}
            <Box
              sx={{
                p: 2,
                mb: 3,
                borderRadius: 2,
                borderLeft: "6px solid",
                borderColor: getRiskColor(result.risk_level),
                backgroundColor: "#ffffff",
              }}
            >
              <Typography variant="h6">
                Risk Level: {result.risk_level}
              </Typography>

              <Typography color="text.secondary">
                Clinical severity estimation based on patient data
              </Typography>
            </Box>

            {/* Risk Score */}
            <Typography sx={{ mb: 1 }}>
              Risk Score: {result.risk_score} / 10
            </Typography>

            <LinearProgress
              variant="determinate"
              value={result.risk_score * 10}
              sx={{ height: 12, borderRadius: 6, mb: 3 }}
            />

            <Typography variant="h6" sx={{ mt: 3 }}>
              Decision Explanation
            </Typography>

            <Box sx={{ bgcolor: "#fff4e5", p: 2, borderRadius: 2 }}>
              {result.rules_fired?.length > 0 ? (
                result.rules_fired.map((rule, i) => (
                  <Typography key={i} sx={{ color: getRuleColor(rule) }}>
                    🔥 {rule}
                  </Typography>
                ))
              ) : (
                <Typography>No rules triggered</Typography>
              )}
            </Box>

            <Typography variant="h6" sx={{ mt: 3 }}>
              Patient Data
            </Typography>

            <Box sx={{ bgcolor: "#f5f5f5", p: 2, borderRadius: 2 }}>
              <Typography>Age: {result.input?.age}</Typography>
              <Typography>Heart Rate: {result.input?.heart_rate}</Typography>
              <Typography>SpO₂: {result.input?.spo2}</Typography>
              <Typography>Triage Score: {result.input?.triage_score}</Typography>
            </Box>
            {/* Recommendation */}
            <Typography variant="h6" sx={{ mt: 2 }}>
              Recommendation
            </Typography>

            <Typography sx={{ mb: 2 }}>
              {getRecommendation(result.risk_level)}
            </Typography>

            {/* Next Steps */}
            <Typography variant="h6">Suggested Next Steps</Typography>

            {getNextSteps(result.risk_level).map((step, index) => (
              <Typography key={index}>• {step}</Typography>
            ))}

            {/* Case info */}
            <Divider sx={{ my: 3 }} />

            <Typography>Case ID: {result.case_id}</Typography>

            <Typography>
              Created: {new Date(result.created_at).toLocaleString("en-GB")}
            </Typography>

            <Box sx={{ mt: 3 }}>
              <Button
                variant="contained"
                onClick={() => {
                  setActiveStep(0);
                  setResult(null);
                }}
              >
                Start New Case
              </Button>
            </Box>
          </Paper>
        )}
      </Paper>
    </Box>
  );
};

export default NewCase;
