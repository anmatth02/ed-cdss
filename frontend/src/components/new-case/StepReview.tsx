import { Box, Button, Typography, Paper, Divider } from "@mui/material";
import type { NewCaseForm } from "../../types/Case";

type Props = {
  data: NewCaseForm;
  onBack: () => void;
  onSubmit: () => Promise<void>;
};

const StepReview = ({ data, onBack, onSubmit }: Props) => {
  const pain = data.painScale ?? 0;

  const getColor = (value: number, min: number, max: number) => {
    if (value === 0) return "text.secondary";

    // severely abnormal
    if (value < min * 0.85 || value > max * 1.2) {
      return "error.main";
    }

    // mildly abnormal
    if (value < min || value > max) {
      return "warning.main";
    }

    return "success.main";
  };

  const renderVital = (
    label: string,
    value: number,
    unit: string,
    min: number,
    max: number,
  ) => {
    const color = getColor(value, min, max);

    return (
      <Box
        sx={{
          p: 2,
          borderRadius: 3,
          border: "1px solid #e2e8f0",
          background: "#f8fafc",
        }}
      >
        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
          {label}
        </Typography>

        <Typography
          sx={{
            color,
            fontWeight: 700,
            fontSize: "1rem",
          }}
        >
          {value === 0 ? "—" : `${value} ${unit}`}
        </Typography>
      </Box>
    );
  };

  return (
    <Box
      sx={{
        maxWidth: "1200px",
        mx: "auto",
        background: "#ffffff",
        p: 5,
        borderRadius: 4,
        boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
      }}
    >
      <Typography
        variant="h5"
        sx={{
          mb: 4,
          fontWeight: 700,
          color: "#1e293b",
        }}
      >
        Review Case
      </Typography>

      {/* Demographics */}
      <Paper
        sx={{
          p: 4,
          mb: 3,
          borderRadius: 4,
          border: "1px solid #e2e8f0",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 700,
            color: "#334155",
            mb: 1,
          }}
        >
          Demographics
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Typography sx={{ mb: 1 }}>Name: {data.name || "—"}</Typography>
        <Typography sx={{ mb: 1 }}>Age: {data.age || "—"}</Typography>
      </Paper>

      {/* Visit Characteristics */}
      <Paper
        sx={{
          p: 4,
          mb: 3,
          borderRadius: 4,
          border: "1px solid #e2e8f0",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 700,
            color: "#334155",
            mb: 1,
          }}
        >
          Visit Characteristics
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Typography sx={{ mb: 1 }}>
          Mode of Arrival: {data.walkedIn || "-"}
        </Typography>

        <Typography sx={{ mb: 1 }}>
          ED Visits (Last Year): {data.edVisitsLastYear || "-"}
        </Typography>

        <Typography sx={{ mb: 1 }}>
          Hospitalizations (Last Year): {data.hospitalizationsLastYear || "-"}
        </Typography>

        <Typography sx={{ mb: 1 }}>
          Hospitalizations Last 90 Days:{" "}
          {data.hospitalizationsLast90Days || "-"}
        </Typography>
      </Paper>

      {/* Clinical Presentation */}
      <Paper
        sx={{
          p: 4,
          mb: 3,
          borderRadius: 4,
          border: "1px solid #e2e8f0",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 700,
            color: "#334155",
            mb: 1,
          }}
        >
          Clinical Presentation
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Typography sx={{ mb: 1 }}>
          <Box
            sx={{
              p: 2,
              borderRadius: 3,
              border: "1px solid #e2e8f0",
              background: "#f8fafc",
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: "#64748b",
                mb: 1,
              }}
            >
              Pain Scale
            </Typography>

            <Typography
              sx={{
                fontSize: 24,
                fontWeight: 700,
                color:
                  pain >= 7 ? "#dc2626" : pain >= 4 ? "#ea580c" : "#16a34a",
              }}
            >
              {pain}/10
            </Typography>
          </Box>
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "1fr 1fr",
            },
            gap: 2,
            mt: 2,
          }}
        >
          {renderVital(
            "Respiratory Rate",
            data.respiratoryRate ?? 0,
            "breaths/min",
            12,
            20,
          )}
          {renderVital("Heart Rate", data.heartRate ?? 0, "bpm", 60, 100)}
          {renderVital("Systolic BP", data.systolicBP ?? 0, "mmHg", 90, 120)}
          {renderVital("Diastolic BP", data.diastolicBP ?? 0, "mmHg", 60, 80)}
          {renderVital("Oxygen Saturation", data.spo2 ?? 0, "%", 95, 100)}
          {renderVital("Temperature", data.temperature ?? 0, "°C", 36.1, 37.2)}
        </Box>
        <Divider sx={{ my: 2 }} />

        <Typography sx={{ mb: 1 }}>
          Fever: {data.fever ? "Yes" : "No"}
        </Typography>
        <Typography sx={{ mb: 1 }}>
          Headache: {data.headache ? "Yes" : "No"}
        </Typography>
        <Typography sx={{ mb: 1 }}>
          Abdominal Pain: {data.abdominalPain ? "Yes" : "No"}
        </Typography>
      </Paper>

      {/* Comorbidities */}
      <Paper
        sx={{
          p: 4,
          mb: 3,
          borderRadius: 4,
          border: "1px solid #e2e8f0",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 700,
            color: "#334155",
            mb: 1,
          }}
        >
          Comorbidity Profile
        </Typography>
        <Divider sx={{ mb: 2 }} />

        {[
          data.mi && "Myocardial Infarction",
          data.chf && "Congestive Heart Failure",
          data.pvd && "Peripheral Vascular Disease",
          data.cvd && "Cerebrovascular Disease",
          data.dem && "Dementia",
          data.cpd && "Chronic Pulmonary Disease",
          data.pud && "Peptic Ulcer Disease",
          data.rheu && "Rheumatic / Connective Tissue Disease",
          data.liv1 && "Mild Liver Disease",
          data.liv2 && "Severe Liver Disease",
          data.dm1 && "Diabetes (without organ damage)",
          data.dm2 && "Diabetes (with organ damage)",
          data.paralysis && "Hemiplegia / Paraplegia",
          data.renal && "Renal Disease",
          data.malignancy && "Any Malignancy (including leukemia / lymphoma)",
          data.mets && "Metastatic Solid Tumor",
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
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              background: "#f0fdf4",
              color: "#166534",
              fontWeight: 600,
              display: "inline-block",
            }}
          >
            No comorbidities reported
          </Box>
        )}
      </Paper>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mt: 5,
        }}
      >
        <Button
          variant="outlined"
          onClick={onBack}
          sx={{
            borderRadius: 3,
            px: 4,
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          Back
        </Button>

        <Button
          variant="contained"
          onClick={onSubmit}
          sx={{
            borderRadius: 3,
            px: 5,
            fontWeight: 700,
            textTransform: "none",
          }}
        >
          Submit Case
        </Button>
      </Box>
    </Box>
  );
};

export default StepReview;
