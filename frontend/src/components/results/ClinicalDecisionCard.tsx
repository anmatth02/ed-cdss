import {
  Paper,
  Typography,
  Box,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Button,
  Chip,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import type { CaseResult, NewCaseForm } from "../../types/Case";

type Props = {
  result: CaseResult;
  formData: NewCaseForm;
  onStartNewCase: () => void;
};

const ClinicalDecisionCard = ({ result, formData, onStartNewCase }: Props) => {
  const confidence = Math.round(result.confidence * 100);

  const getDecisionColor = () => {
    if (result.decision === "HOSPITALIZATION") return "#d32f2f";
    if (result.decision === "DISCHARGE") return "#2e7d32";
    return "#ed6c02";
  };

  const getTypeColor = () => {
    if (result.argument_type === "PRIORITY") return "success";
    if (result.argument_type === "DEFEATER") return "warning";
    return "error";
  };

  const getRecommendation = () => {
    if (result.decision === "HOSPITALIZATION")
      return "Patient should be admitted for further monitoring.";

    if (result.decision === "DISCHARGE")
      return "Patient may be safely discharged with follow-up.";

    return "Clinical judgment required before final disposition.";
  };

  const getNextSteps = () => {
    if (result.decision === "HOSPITALIZATION")
      return [
        "Perform ECG immediately",
        "Monitor vital signs continuously",
        "Consider urgent laboratory testing",
      ];

    if (result.decision === "DILEMMA")
      return [
        "Perform clinical reassessment",
        "Repeat vital signs",
        "Consider imaging or laboratory tests",
      ];

    return [
      "Routine monitoring",
      "Provide discharge instructions",
      "Arrange outpatient follow-up",
    ];
  };

  return (
    <Paper sx={{ mt: 3, p: 4 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        <b>
          <i>Clinical Decision Report</i>
        </b>
      </Typography>

      {/* Decision Panel */}
      <Box
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 2,
          borderLeft: "6px solid",
          borderColor: getDecisionColor(),
          bgcolor: "#fff",
        }}
      >
        <Typography variant="h6">
          Decision: <b>{result.decision}</b>
        </Typography>

        <Chip
          label={result.argument_type}
          color={getTypeColor()}
          size="small"
          sx={{ mt: 1 }}
        />
      </Box>

      {/* Meta */}
      <Typography>Case ID: {result.case_id}</Typography>
      <Typography>
        Created: {new Date(result.created_at).toLocaleString("en-GB")}
      </Typography>

      {/* Snapshot */}
      <Typography variant="h6" sx={{ mt: 3 }}>
        Patient Snapshot
      </Typography>

      <Box sx={{ bgcolor: "#f5f5f5", p: 2, borderRadius: 2 }}>
        <Typography>Age: {result.input?.age ?? "-"}</Typography>
        <Typography>Heart Rate: {result.input?.heart_rate ?? "-"}</Typography>
        <Typography>SpO₂: {result.input?.spo2 ?? "-"}</Typography>
        <Typography>
          Triage Score: {result.input?.triage_score ?? "-"}
        </Typography>
      </Box>

      {/* Full Data */}
      <Accordion sx={{ mt: 2, borderRadius: 2, overflow: "hidden" }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{
            bgcolor: "#f8f9fa",
            borderBottom: "1px solid #eee",
          }}
        >
          <Typography fontWeight="bold">Full Submitted Patient Data</Typography>
        </AccordionSummary>

        <AccordionDetails sx={{ bgcolor: "#ffffff" }}>
          {/* DEMOGRAPHICS */}
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            color="primary.main"
            sx={{ mb: 1 }}
          >
            Demographics
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 1,
              mb: 3,
            }}
          >
            <Typography>
              Name: {String(result.input?.name ?? formData.name ?? "-")}
            </Typography>
            <Typography>Age: {String(result.input?.age ?? "-")}</Typography>
          </Box>

          {/* VISIT HISTORY */}
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            color="primary.main"
            sx={{ mb: 1 }}
          >
            Visit History
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 1,
              mb: 3,
            }}
          >
            <Typography>
              Walked In: {String(result.input?.walked_in ?? "-")}
            </Typography>
            <Typography>
              ED Visits Last Year:{" "}
              {String(result.input?.ed_visits_last_year ?? "-")}
            </Typography>

            <Typography>
              Hospitalizations Last Year:{" "}
              {String(result.input?.hospitalizations_last_year ?? "-")}
            </Typography>

            <Typography>
              Last 90 Days:{" "}
              {String(result.input?.hospitalizations_last_90_days ?? "-")}
            </Typography>
          </Box>

          {/* SYMPTOMS */}
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            color="primary.main"
            sx={{ mb: 1 }}
          >
            Symptoms
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 1,
              mb: 3,
            }}
          >
            <Typography>Fever: {result.input?.fever ? "Yes" : "No"}</Typography>
            <Typography>
              Headache: {result.input?.headache ? "Yes" : "No"}
            </Typography>
            <Typography>
              Abdominal Pain: {result.input?.abdominal_pain ? "Yes" : "No"}
            </Typography>
            <Typography>
              Pain Scale: {String(result.input?.pain_scale ?? "-")}
            </Typography>
          </Box>

          {/* VITALS */}
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            color="primary.main"
            sx={{ mb: 1 }}
          >
            Vital Signs
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 1,
              mb: 3,
            }}
          >
            <Typography>
              Respiratory Rate: {String(result.input?.respiratory_rate ?? "-")}
            </Typography>

            <Typography>
              Heart Rate: {String(result.input?.heart_rate ?? "-")}
            </Typography>

            <Typography>
              Systolic BP: {String(result.input?.systolic_bp ?? "-")}
            </Typography>

            <Typography>
              Diastolic BP: {String(result.input?.diastolic_bp ?? "-")}
            </Typography>

            <Typography>SpO₂: {String(result.input?.spo2 ?? "-")}</Typography>

            <Typography>
              Temperature: {String(result.input?.temperature ?? "-")}
            </Typography>

            <Typography>
              Triage Score: {String(result.input?.triage_score ?? "-")}
            </Typography>
          </Box>

          {/* COMORBIDITIES */}
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            color="primary.main"
            sx={{ mb: 1 }}
          >
            Comorbidities
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 1,
            }}
          >
            <Typography>MI: {result.input?.mi ? "Yes" : "No"}</Typography>
            <Typography>CHF: {result.input?.chf ? "Yes" : "No"}</Typography>
            <Typography>PVD: {result.input?.pvd ? "Yes" : "No"}</Typography>
            <Typography>CVD: {result.input?.cvd ? "Yes" : "No"}</Typography>
            <Typography>
              Dementia: {result.input?.dem ? "Yes" : "No"}
            </Typography>
            <Typography>CPD: {result.input?.cpd ? "Yes" : "No"}</Typography>
            <Typography>PUD: {result.input?.pud ? "Yes" : "No"}</Typography>
            <Typography>
              Rheumatic: {result.input?.rheu ? "Yes" : "No"}
            </Typography>
            <Typography>
              Liver Mild: {result.input?.liv1 ? "Yes" : "No"}
            </Typography>
            <Typography>
              Liver Severe: {result.input?.liv2 ? "Yes" : "No"}
            </Typography>
            <Typography>DM1: {result.input?.dm1 ? "Yes" : "No"}</Typography>
            <Typography>DM2: {result.input?.dm2 ? "Yes" : "No"}</Typography>
            <Typography>
              Paralysis: {result.input?.paralysis ? "Yes" : "No"}
            </Typography>
            <Typography>Renal: {result.input?.renal ? "Yes" : "No"}</Typography>
            <Typography>
              Malignancy: {result.input?.malignancy ? "Yes" : "No"}
            </Typography>
            <Typography>Mets: {result.input?.mets ? "Yes" : "No"}</Typography>
            <Typography>HIV: {result.input?.hiv ? "Yes" : "No"}</Typography>
          </Box>
        </AccordionDetails>
      </Accordion>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6" sx={{ mt: 3 }}>
        Decision Explanation
      </Typography>

      <Box
        sx={{
          bgcolor: "#eef7ee",
          p: 2,
          borderRadius: 2,
          mt: 1,
          mb: 2,
        }}
      >
        <Typography fontWeight="bold" color="success.main" sx={{ mb: 1 }}>
          Reasons supporting {result.decision}
        </Typography>

        {result.supporting_rules.map((rule, i) => (
          <Typography key={i}>
            {i + 1}. {rule}
          </Typography>
        ))}
      </Box>

      <Box
        sx={{
          bgcolor: "#fdeeee",
          p: 2,
          borderRadius: 2,
        }}
      >
        <Typography fontWeight="bold" color="error.main" sx={{ mb: 1 }}>
          Reasons suggesting{" "}
          {result.decision === "HOSPITALIZATION"
            ? "DISCHARGE"
            : "HOSPITALIZATION"}
        </Typography>

        {result.opposing_rules.length > 0 ? (
          result.opposing_rules.map((rule, i) => (
            <Typography key={i}>
              {i + 1}. {rule}
            </Typography>
          ))
        ) : (
          <Typography>No significant opposing arguments.</Typography>
        )}
      </Box>

      {/* Confidence */}
      <Typography variant="h6" sx={{ mt: 3 }}>
        Confidence: {confidence}%
      </Typography>

      <LinearProgress
        variant="determinate"
        value={confidence}
        sx={{ height: 12, borderRadius: 6, mt: 1 }}
      />

      {/* Recommendation */}
      <Typography variant="h6" sx={{ mt: 4 }}>
        Recommendation
      </Typography>

      <Typography>{getRecommendation()}</Typography>

      {/* Next Steps */}
      <Typography variant="h6" sx={{ mt: 3 }}>
        Suggested Next Steps
      </Typography>

      {getNextSteps().map((step, i) => (
        <Typography key={i}>• {step}</Typography>
      ))}

      {/* Button */}
      <Box sx={{ mt: 4 }}>
        <Button variant="contained" onClick={onStartNewCase}>
          Start New Case
        </Button>
      </Box>
    </Paper>
  );
};

export default ClinicalDecisionCard;
