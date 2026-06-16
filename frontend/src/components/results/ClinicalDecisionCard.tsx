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
  console.log("📊 RESULT IN CARD =", result);
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
  const derived = result?.derived_features;

  const supportingTitle =
    result.decision === "DILEMMA"
      ? "Why the system suggested DISCHARGE"
      : `Why the system suggested ${result.decision}`;

  const opposingTitle =
    result.decision === "DILEMMA"
      ? "Factors that may support HOSPITALIZATION"
      : `Factors that may support ${
          result.decision === "HOSPITALIZATION"
            ? "DISCHARGE"
            : "HOSPITALIZATION"
        }`;

  const getColor = (decision: string): "success" | "warning" | "error" => {
    if (decision === "HOSPITALIZATION") return "error";
    if (decision === "DILEMMA") return "warning";
    return "success";
  };

  const supportingStyles =
    result.decision === "HOSPITALIZATION"
      ? {
          bg: "#fff4f4",
          text: "error.main",
        }
      : {
          bg: "#eef7ee",
          text: "success.main",
        };

  const opposingStyles =
    result.decision === "HOSPITALIZATION"
      ? {
          bg: "#eef7ee",
          text: "success.main",
        }
      : {
          bg: "#fff4f4",
          text: "error.main",
        };
  return (
    <Paper sx={{ mt: 3, p: 4 }}>
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          mb: 4,
          color: "#1e293b",
        }}
      >
        Clinical Decision Report
      </Typography>

      {/* Decision Panel */}
      <Box
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 3,
          borderLeft: "8px solid",
          borderColor: getDecisionColor(),
          background:
            result.decision === "HOSPITALIZATION"
              ? "#fff5f5"
              : result.decision === "DISCHARGE"
                ? "#f0fdf4"
                : "#fff8e6",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: getDecisionColor(),
            }}
          >
            {result.decision}
          </Typography>

          <Chip
            label={result.argument_type}
            color={getTypeColor()}
            size="medium"
            sx={{
              fontWeight: 700,
            }}
          />
        </Box>
      </Box>

      {/* Meta */}
      <Typography>Case ID: {result.case_id}</Typography>
      <Typography>
        Created: {new Date(result.created_at).toLocaleString("en-GB")}
      </Typography>

      <Divider sx={{ my: 3 }} />

      {/* Recommendation */}
      <Typography variant="h6" sx={{ mt: 4,fontWeight: 700 }}>
        <strong>Recommendation</strong>
      </Typography>

      <Box
        sx={{
          mt: 2,
          p: 3,
          borderRadius: 3,
          background:
            result.decision === "HOSPITALIZATION"
              ? "#fff4f4"
              : result.decision === "DISCHARGE"
                ? "#eef7ee"
                : "#fff8e6",
          borderLeft: "6px solid",
          borderColor: getDecisionColor(),
        }}
      >
        <Typography
          variant="body1"
          sx={{
            fontWeight: 600,
          }}
        >
          {getRecommendation()}
        </Typography>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Typography
        variant="h6"
        sx={{
          mt: 4,
          mb: 2,
          fontWeight: 700,
          color: "#1e293b",
        }}
      >
        <strong>Decision Explanation</strong>
      </Typography>

      <Box
        sx={{
          bgcolor: supportingStyles.bg,
          p: 3,
          borderRadius: 3,
          border: "1px solid",
          borderColor:
            result.decision === "HOSPITALIZATION" ? "#ffcdd2" : "#c8e6c9",
          boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
          mt: 2,
          mb: 3,
        }}
      >
        <Typography
          fontWeight="bold"
          color={supportingStyles.text}
          sx={{ mb: 1 }}
        >
          {supportingTitle}
        </Typography>

        {result.supporting_rules.map((rule, i) => (
          <Typography key={i}>
            {i + 1}. {rule}
          </Typography>
        ))}
      </Box>

      <Box
        sx={{
          bgcolor: opposingStyles.bg,
          p: 3,
          borderRadius: 3,
          border: "1px solid",
          borderColor:
            result.decision === "HOSPITALIZATION" ? "#c8e6c9" : "#ffcdd2",
          boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
        }}
      >
        <Typography
          fontWeight="bold"
          color={opposingStyles.text}
          sx={{ mb: 1 }}
        >
          {opposingTitle}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          These factors may support a different clinical decision, but they were
          considered weaker than the factors supporting the recommended
          disposition.
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
      <br />
      {/* Confidence */}
      {result.decision !== "DILEMMA" && (
        <Box
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 3,
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
            Clinical Confidence
          </Typography>

          <Typography sx={{ mb: 2 }}>
            The system estimates <b>{confidence}% confidence</b> that{" "}
            <b>
              <u>{result.decision}</u>
            </b>{" "}
            is the most appropriate disposition based on the submitted clinical
            information.
          </Typography>

          <LinearProgress
            variant="determinate"
            value={confidence}
            color={getColor(result.decision)}
            sx={{
              height: 12,
              borderRadius: 10,
              mb: 2,
              backgroundColor: "#e5e7eb",
            }}
          />

          <Typography variant="body2" color="text.secondary">
            Confidence reflects how consistently the patient data aligns with
            patterns associated with the recommended clinical disposition.
          </Typography>
        </Box>
      )}

      {result.decision === "DILEMMA" && (
        <Typography
          variant="h6"
          sx={{
            mt: 4,
            mb: 2,
            fontWeight: 700,
            color: "#1e293b",
          }}
        >
          <strong>Confidence:</strong>{" "}
          <u>
            The clinical indicators suggest mixed risk signals. Some findings
            support discharge, while others indicate possible need for
            hospitalization.
          </u>
        </Typography>
      )}

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6" fontWeight={700}>
        <strong>Risk Scores</strong>
      </Typography>

      <Box
        sx={{
          p: 3,
          borderRadius: 3,
          background: "#f8fafc",
          border: "1px solid #e2e8f0",
          mt: 2,
        }}
      >
        {derived ? (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
              },
              gap: 2,
              mt: 2,
            }}
          >
            {/* NEWS */}
            <Box
              sx={{
                p: 2,
                borderRadius: 3,
                background: "#ffffff",
                border: "1px solid #e5e7eb",
              }}
            >
              <Typography variant="body2" color="text.secondary">
                NEWS Score
              </Typography>

              <Typography variant="h4" fontWeight={700}>
                {derived.news_raw}
              </Typography>

              <Chip
                label={
                  derived.news_cat === 0
                    ? "Low"
                    : derived.news_cat === 1
                      ? "Medium"
                      : "High"
                }
                color={
                  derived.news_cat === 0
                    ? "success"
                    : derived.news_cat === 1
                      ? "warning"
                      : "error"
                }
                size="small"
                sx={{ mt: 1 }}
              />

              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Detects physiological deterioration risk.
              </Typography>
            </Box>

            {/* CART */}
            <Box
              sx={{
                p: 2,
                borderRadius: 3,
                background: "#ffffff",
                border: "1px solid #e5e7eb",
              }}
            >
              <Typography variant="body2" color="text.secondary">
                CART Score
              </Typography>

              <Typography variant="h4" fontWeight={700}>
                {derived.cart_raw}
              </Typography>

              <Chip
                label={
                  derived.cart_cat === 0
                    ? "Low"
                    : derived.cart_cat === 1
                      ? "Moderate"
                      : "High"
                }
                color={
                  derived.cart_cat === 0
                    ? "success"
                    : derived.cart_cat === 1
                      ? "warning"
                      : "error"
                }
                size="small"
                sx={{ mt: 1 }}
              />

              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Estimates cardiac arrest risk.
              </Typography>
            </Box>

            {/* CCI */}
            <Box
              sx={{
                p: 2,
                borderRadius: 3,
                background: "#ffffff",
                border: "1px solid #e5e7eb",
              }}
            >
              <Typography variant="body2" color="text.secondary">
                CCI Score
              </Typography>

              <Typography variant="h4" fontWeight={700}>
                {derived.cci_raw}
              </Typography>

              <Chip
                label={
                  derived.cci_cat === 0
                    ? "None"
                    : derived.cci_cat === 1
                      ? "Mild"
                      : derived.cci_cat === 2
                        ? "Moderate"
                        : "Severe"
                }
                color={
                  derived.cci_cat <= 1
                    ? "success"
                    : derived.cci_cat === 2
                      ? "warning"
                      : "error"
                }
                size="small"
                sx={{ mt: 1 }}
              />

              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Measures comorbidity burden and mortality risk.
              </Typography>
            </Box>
          </Box>
        ) : (
          <Typography color="error">No risk scores available</Typography>
        )}
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Snapshot */}
      <Typography
        variant="h6"
        sx={{
          mt: 4,
          mb: 2,
          fontWeight: 700,
          color: "#1e293b",
        }}
      >
        <strong>Patient Snapshot</strong>
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
          },
          gap: 2,
          mt: 2,
        }}
      >
        <Box
          sx={{
            p: 2,
            borderRadius: 3,
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Name
          </Typography>

          <Typography variant="h6" fontWeight={700}>
            {result.input?.name ?? formData.name ?? "-"}
          </Typography>
        </Box>

        <Box
          sx={{
            p: 2,
            borderRadius: 3,
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            ID
          </Typography>

          <Typography variant="h6" fontWeight={700}>
            <Typography variant="h6" fontWeight={700}>
              {result.input?.national_id ?? formData.nationalId ?? "-"}
            </Typography>
          </Typography>
        </Box>

        <Box
          sx={{
            p: 2,
            borderRadius: 3,
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Age
          </Typography>

          <Typography variant="h6" fontWeight={700}>
            {result.input?.age ?? "-"}
          </Typography>
        </Box>

        <Box
          sx={{
            p: 2,
            borderRadius: 3,
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Heart Rate
          </Typography>

          <Typography variant="h6" fontWeight={700}>
            {result.input?.heart_rate ?? "-"}
          </Typography>
        </Box>

        <Box
          sx={{
            p: 2,
            borderRadius: 3,
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            SpO₂
          </Typography>

          <Typography variant="h6" fontWeight={700}>
            {result.input?.spo2 ?? "-"}
          </Typography>
        </Box>

        <Box
          sx={{
            p: 2,
            borderRadius: 3,
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Triage Score
          </Typography>

          <Typography variant="h6" fontWeight={700}>
            {result.input?.triage_score ?? "-"}
          </Typography>
        </Box>
      </Box>

      {/* Full Data */}
      <Accordion
        sx={{
          mt: 3,
          borderRadius: 3,
          overflow: "hidden",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",

          "&:before": {
            display: "none",
          },
        }}
      >
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
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
              },
              gap: 2,
              mt: 2,
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
      {/* Next Steps */}
      <Typography
        variant="h6"
        sx={{
          mt: 4,
          mb: 2,
          fontWeight: 700,
          color: "#1e293b",
        }}
      >
        <strong>Suggested Next Steps</strong>
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          mt: 2,
        }}
      >
        {getNextSteps().map((step, i) => (
          <Box
            key={i}
            sx={{
              p: 2,
              borderRadius: 2,
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
            }}
          >
            <Typography fontWeight={500}>{step}</Typography>
          </Box>
        ))}
      </Box>

      {/* Button */}
      <Box
        sx={{
          mt: 5,
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Button
          variant="contained"
          size="large"
          onClick={onStartNewCase}
          sx={{
            px: 4,
            py: 1.2,
            borderRadius: 3,
            fontWeight: 700,
            textTransform: "none",
          }}
        >
          Start New Case
        </Button>
      </Box>
    </Paper>
  );
};

export default ClinicalDecisionCard;
