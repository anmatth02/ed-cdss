import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  InputAdornment,
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
    <Box>
      <div>Symptoms</div>
      {/* Symptoms */}
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
      <Box sx={{ mt: 2 }}>
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
      <TextField
        label="Respiratory Rate"
        type="number"
        fullWidth
        margin="normal"
        value={asDisplayValue(local.respiratoryRate)}
        placeholder="e.g. 76"
        helperText="Typical adult: 60–100 bpm"
        onChange={(e) => {
          const raw = e.target.value;
          setLocal({ ...local, respiratoryRate: raw === "" ? 0 : Number(raw) });
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">breaths/min</InputAdornment>
          ),
        }}
      />

      <TextField
        label="Heart Rate"
        type="number"
        fullWidth
        margin="normal"
        value={asDisplayValue(local.heartRate)}
        placeholder="e.g. 72"
        helperText="Typical adult: 60–100 bpm"
        onChange={(e) => {
          const raw = e.target.value;
          setLocal({ ...local, heartRate: raw === "" ? 0 : Number(raw) });
        }}
        InputProps={{
          endAdornment: <InputAdornment position="end">bpm</InputAdornment>,
        }}
      />

      <TextField
        label="Systolic BP"
        type="number"
        fullWidth
        margin="normal"
        value={asDisplayValue(local.systolicBP)}
        placeholder="e.g. 120"
        helperText="Typical adult: 90–120 mmHg"
        onChange={(e) => {
          const raw = e.target.value;
          setLocal({ ...local, systolicBP: raw === "" ? 0 : Number(raw) });
        }}
        InputProps={{
          endAdornment: <InputAdornment position="end">mmHg</InputAdornment>,
        }}
      />

      <TextField
        label="Diastolic BP"
        type="number"
        fullWidth
        margin="normal"
        value={asDisplayValue(local.diastolicBP)}
        placeholder="e.g. 80"
        helperText="Typical adult: 60–80 mmHg"
        onChange={(e) => {
          const raw = e.target.value;
          setLocal({ ...local, diastolicBP: raw === "" ? 0 : Number(raw) });
        }}
        InputProps={{
          endAdornment: <InputAdornment position="end">mmHg</InputAdornment>,
        }}
      />

      <TextField
        label="Oxygen Saturation"
        type="number"
        fullWidth
        margin="normal"
        value={asDisplayValue(local.spo2)}
        placeholder="e.g. 98"
        helperText="Typical adult: 95–100%"
        onChange={(e) => {
          const raw = e.target.value;
          setLocal({ ...local, spo2: raw === "" ? 0 : Number(raw) });
        }}
        InputProps={{
          endAdornment: <InputAdornment position="end">%</InputAdornment>,
        }}
      />

      <TextField
        label="Temperature"
        type="number"
        fullWidth
        margin="normal"
        value={asDisplayValue(local.temperature)}
        placeholder="e.g. 36.8"
        helperText="Typical adult: 36.1–37.2 °C"
        onChange={(e) => {
          const raw = e.target.value;
          setLocal({ ...local, temperature: raw === "" ? 0 : Number(raw) });
        }}
        inputProps={{ step: 0.1 }}
        InputProps={{
          endAdornment: <InputAdornment position="end">°C</InputAdornment>,
        }}
      />

      <TextField
        label="Triage Acuity Level"
        type="number"
        fullWidth
        margin="normal"
        value={local.triageScore ?? ""}
        placeholder="0–4"
        helperText="0 = Non-Urgent, 1 = Less Urgent, 2 = Urgent, 3 = Emergent, 4 = Resuscitation"
        onChange={(e) => {
          const raw = e.target.value;

          setLocal({
            ...local,
            triageScore: raw === "" ? undefined : Number(raw),
          });
        }}
        inputProps={{
          min: 0,
          max: 4,
        }}
        InputProps={{
          endAdornment: <InputAdornment position="end">/4</InputAdornment>,
        }}
      />

      <Button onClick={onBack}>Back</Button>
      <Button variant="contained" onClick={handleNext}>
        Next
      </Button>
    </Box>
  );
};

export default StepVitals;
