import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Slider,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import type { NewCaseForm } from "../../types/Case";

type Props = {
  onNext: () => void;
  onBack: () => void;
  onChange: (data: Partial<NewCaseForm>) => void;
};

const asDisplayValue = (v?: number) => v ?? "";

const StepVitals = ({ onNext, onBack, onChange }: Props) => {
  const [local, setLocal] = useState<{
    fever?: boolean;
    headache?: boolean;
    abdominalPain?: boolean;
    painScale?: number;
    respiratoryRate?: number;
    heartRate?: number;
    systolicBP?: number;
    diastolicBP?: number;
    spo2?: number;
    temperature?: number;
    triageScore?: number;
  }>({
    fever: false,
    headache: false,
    abdominalPain: false,
    painScale: 0,
    respiratoryRate: undefined,
    heartRate: undefined,
    systolicBP: undefined,
    diastolicBP: undefined,
    spo2: undefined,
    temperature: undefined,
    triageScore: undefined,
  });

  const handleNext = () => {
    onChange(local);
    onNext();
  };

  return (
    <Box
      sx={{
        maxWidth: "1000px",
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
        Clinical Presentation
      </Typography>
      {/* Symptoms */}
      <p>Symptoms</p>
      <FormControlLabel
        control={
          <Checkbox
            checked={local.fever}
            onChange={(e) => setLocal({ ...local, fever: e.target.checked })}
          />
        }
        label="Fever or chills"
      />

      <FormControlLabel
        control={
          <Checkbox
            checked={local.headache}
            onChange={(e) => setLocal({ ...local, headache: e.target.checked })}
          />
        }
        label="Headache"
      />

      <FormControlLabel
        control={
          <Checkbox
            checked={local.abdominalPain}
            onChange={(e) =>
              setLocal({ ...local, abdominalPain: e.target.checked })
            }
          />
        }
        label="Abdominal pain"
      />

      {/* Pain */}
      <Box
        sx={{
          mt: 3,
          mb: 4,
          p: 3,
          borderRadius: 3,
          background: "#f8fafc",
          border: "1px solid #e2e8f0",
        }}
      >
        Pain Scale: {local.painScale}/10
        <Slider
          min={0}
          max={10}
          value={local.painScale}
          onChange={(_, value) =>
            setLocal({ ...local, painScale: value as number })
          }
          valueLabelDisplay="auto"
        />
        <Typography variant="caption" color="text.secondary">
          0 = no pain, 10 = worst imaginable pain
        </Typography>
      </Box>

      {/* Vitals */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "1fr 1fr",
          },
          gap: 3,
        }}
      >
        <TextField
          label="Respiratory Rate"
          type="number"
          value={asDisplayValue(local.respiratoryRate)}
          placeholder="e.g. 12"
          helperText="Typical adult: 12–20 breaths/min"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 3,
              background: "#fff",
              height: 56,
            },
          }}
          onChange={(e) => {
            const raw = e.target.value;
            setLocal({
              ...local,
              respiratoryRate: raw === "" ? 0 : Number(raw),
            });
          }}
        />

        <TextField
          label="Heart Rate"
          type="number"
          value={asDisplayValue(local.heartRate)}
          placeholder="e.g. 72"
          helperText="Typical adult: 60–100 bpm"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 3,
              background: "#fff",
              height: 56,
            },
          }}
          onChange={(e) => {
            const raw = e.target.value;
            setLocal({ ...local, heartRate: raw === "" ? 0 : Number(raw) });
          }}
        />

        <TextField
          label="Systolic BP"
          type="number"
          value={asDisplayValue(local.systolicBP)}
          placeholder="e.g. 120"
          helperText="Typical adult: 90–120 mmHg"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 3,
              background: "#fff",
              height: 56,
            },
          }}
          onChange={(e) => {
            const raw = e.target.value;
            setLocal({ ...local, systolicBP: raw === "" ? 0 : Number(raw) });
          }}
        />

        <TextField
          label="Diastolic BP"
          type="number"
          value={asDisplayValue(local.diastolicBP)}
          placeholder="e.g. 80"
          helperText="Typical adult: 60–80 mmHg"
          onChange={(e) => {
            const raw = e.target.value;
            setLocal({ ...local, diastolicBP: raw === "" ? 0 : Number(raw) });
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 3,
              background: "#fff",
              height: 56,
            },
          }}
        />

        <TextField
          label="Oxygen Saturation"
          type="number"
          value={asDisplayValue(local.spo2)}
          placeholder="e.g. 98"
          helperText="Typical adult: 95–100%"
          onChange={(e) => {
            const raw = e.target.value;
            setLocal({ ...local, spo2: raw === "" ? 0 : Number(raw) });
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 3,
              background: "#fff",
              height: 56,
            },
          }}
        />

        <TextField
          label="Temperature"
          type="number"
          value={asDisplayValue(local.temperature)}
          placeholder="e.g. 36.8"
          helperText="Typical adult: 36.1–37.2 °C"
          onChange={(e) => {
            const raw = e.target.value;
            setLocal({ ...local, temperature: raw === "" ? 0 : Number(raw) });
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 3,
              background: "#fff",
              height: 56,
            },
          }}
        />

        <TextField
          label="Triage Acuity Level"
          type="number"
          value={local.triageScore ?? ""}
          placeholder="0–4"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 3,
              background: "#fff",
              height: 56,
            },
          }}
          helperText="0 = Non-Urgent, 1 = Less Urgent, 2 = Urgent, 3 = Emergent, 4 = Resuscitation"
          onChange={(e) => {
            const raw = e.target.value;

            setLocal({
              ...local,
              triageScore: raw === "" ? undefined : Number(raw),
            });
          }}
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mt: 5,
        }}
      >
        <Button
          variant="outlined"
          size="large"
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
          size="large"
          onClick={handleNext}
          sx={{
            borderRadius: 3,
            px: 5,
            fontWeight: 700,
            textTransform: "none",
          }}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default StepVitals;
