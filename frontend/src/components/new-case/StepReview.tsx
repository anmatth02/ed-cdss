import {
  Box,
  Button,
  Typography,
  Paper,
  Divider,
} from "@mui/material";
import type { NewCaseForm } from "../../types/Case";

type Props = {
  data: NewCaseForm;
  onBack: () => void;
  onSubmit: () => Promise<void>;
};

const StepReview = ({ data, onBack, onSubmit }: Props) => {

  const getColor = (value: number, min: number, max: number) => {
    if (value === 0) return "text.secondary";
    if (value < min || value > max) return "error.main";
    return "success.main";
  };

  const renderVital = (
    label: string,
    value: number,
    unit: string,
    min: number,
    max: number
  ) => (
    <Typography sx={{ color: getColor(value, min, max) }}>
      {label}: {value === 0 ? "—" : `${value} ${unit}`}
    </Typography>
  );

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Review Case
      </Typography>

      {/* Demographics */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="subtitle1">Demographics</Typography>
        <Divider sx={{ mb: 2 }} />

        <Typography>Name: {data.name || "—"}</Typography>
        <Typography>Age: {data.age || "—"}</Typography>
      </Paper>

      {/* Visit Characteristics */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="subtitle1">Visit Characteristics</Typography>
        <Divider sx={{ mb: 2 }} />

        <Typography>
          Mode of Arrival: {data.walkedIn || "-"}
        </Typography>

        <Typography>
          ED Visits (Last Year): {data.edVisitsLastYear || "-"}
        </Typography>

        <Typography>
          Hospitalizations (Last Year): {data.hospitalizationsLastYear || "-"}
        </Typography>

         <Typography>
          Hospitalizations Last 90 Days: {data.hospitalizationsLast90Days || "-"}
        </Typography>
      </Paper>

      {/* Clinical Presentation */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="subtitle1">Clinical Presentation</Typography>
        <Divider sx={{ mb: 2 }} />

        {renderVital("Respiratory Rate", data.respiratoryRate ?? 0, "breaths/min", 12, 20)}
        {renderVital("Heart Rate", data.heartRate ?? 0, "bpm", 60, 100)}
        {renderVital("Systolic BP", data.systolicBP ?? 0, "mmHg", 90, 120)}
        {renderVital("Diastolic BP", data.diastolicBP ?? 0, "mmHg", 60, 80)}
        {renderVital("Oxygen Saturation", data.spo2 ?? 0, "%", 95, 100)}
        {renderVital("Temperature", data.temperature ?? 0, "°C", 36.1, 37.2)}

        <Typography>Pain Scale: {data.painScale}/10</Typography>

        <Typography
          sx={{
            fontWeight: "bold",
            color:
              (data.triageScore ?? 0) >= 3
                ? "error.main"
                : (data.triageScore ?? 0) === 2
                ? "warning.main"
                : "success.main",
          }}
        >
          Triage Score: {data.triageScore}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Typography>Fever: {data.fever ? "Yes" : "No"}</Typography>
        <Typography>Headache: {data.headache ? "Yes" : "No"}</Typography>
        <Typography>Abdominal Pain: {data.abdominalPain ? "Yes" : "No"}</Typography>
      </Paper>

      {/* Comorbidities */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="subtitle1">Comorbidity Profile</Typography>
        <Divider sx={{ mb: 2 }} />

        {[
          data.mi && "Myocardial Infarction",
          data.chf && "Heart Failure",
          data.pvd && "Peripheral Vascular Disease",
          data.cvd && "Cerebrovascular Disease",
          data.dem && "Dementia",
          data.cpd && "Chronic Pulmonary Disease",
          data.pud && "Peptic Ulcer Disease",
          data.rheu && "Rheumatic Disease",
          data.liv1 && "Mild Liver Disease",
          data.liv2 && "Severe Liver Disease",
          data.dm1 && "Diabetes (no damage)",
          data.dm2 && "Diabetes (organ damage)",
          data.paralysis && "Paralysis",
          data.renal && "Renal Disease",
          data.malignancy && "Malignancy",
          data.mets && "Metastatic Tumor",
          data.hiv && "HIV/AIDS",
        ]
          .filter(Boolean)
          .map((item, index) => (
            <Typography key={index}>• {item}</Typography>
          ))}

        {!Object.values({
          mi: data.mi,
          chf: data.chf,
          pvd: data.pvd,
          cvd: data.cvd,
          dem: data.dem,
          cpd: data.cpd,
          pud: data.pud,
          rheu: data.rheu,
          liv1: data.liv1,
          liv2: data.liv2,
          dm1: data.dm1,
          dm2: data.dm2,
          paralysis: data.paralysis,
          renal: data.renal,
          malignancy: data.malignancy,
          mets: data.mets,
          hiv: data.hiv,
        }).some(Boolean) && (
          <Typography color="text.secondary">
            No comorbidities reported
          </Typography>
        )}
      </Paper>

      <Box sx={{ mt: 3 }}>
        <Button onClick={onBack} sx={{ mr: 2 }}>
          Back
        </Button>

        <Button variant="contained" onClick={onSubmit}>
          Submit Case
        </Button>
      </Box>
    </Box>
  );
};

export default StepReview;