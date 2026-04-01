import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
  Paper,
} from "@mui/material";

import { useState } from "react";
import type { NewCaseForm } from "../../types/Case";

type Props = {
  onNext: () => void;
  onBack: () => void;
  onChange: (data: Partial<NewCaseForm>) => void;
};

const StepComorbidities = ({ onNext, onBack, onChange }: Props) => {
  const [local, setLocal] = useState({
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

  const toggle = (key: keyof typeof local) => {
    setLocal((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleNext = () => {
    onChange(local);
    onNext();
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Comorbidities (CCI)
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 3,
        }}
      >
        <Box sx={{ flex: "1 1 300px" }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Cardiovascular
            </Typography>

            <FormControlLabel
              control={
                <Checkbox checked={local.mi} onChange={() => toggle("mi")} />
              }
              label="Myocardial Infarction"
            />
            <FormControlLabel
              control={
                <Checkbox checked={local.chf} onChange={() => toggle("chf")} />
              }
              label="Heart Failure"
            />
            <FormControlLabel
              control={
                <Checkbox checked={local.pvd} onChange={() => toggle("pvd")} />
              }
              label="Peripheral Vascular"
            />
            <FormControlLabel
              control={
                <Checkbox checked={local.cvd} onChange={() => toggle("cvd")} />
              }
              label="Cerebrovascular"
            />
          </Paper>
        </Box>

        <Box sx={{ flex: "1 1 300px" }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Pulmonary / Neuro
            </Typography>

            <FormControlLabel
              control={
                <Checkbox checked={local.cpd} onChange={() => toggle("cpd")} />
              }
              label="Chronic Pulmonary"
            />
            <FormControlLabel
              control={
                <Checkbox checked={local.dem} onChange={() => toggle("dem")} />
              }
              label="Dementia"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={local.paralysis}
                  onChange={() => toggle("paralysis")}
                />
              }
              label="Paralysis"
            />
          </Paper>
        </Box>

        <Box sx={{ flex: "1 1 300px" }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Metabolic / Oncology
            </Typography>

            <FormControlLabel
              control={
                <Checkbox checked={local.dm1} onChange={() => toggle("dm1")} />
              }
              label="Diabetes (no damage)"
            />
            <FormControlLabel
              control={
                <Checkbox checked={local.dm2} onChange={() => toggle("dm2")} />
              }
              label="Diabetes (organ damage)"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={local.renal}
                  onChange={() => toggle("renal")}
                />
              }
              label="Renal Disease"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={local.malignancy}
                  onChange={() => toggle("malignancy")}
                />
              }
              label="Malignancy"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={local.mets}
                  onChange={() => toggle("mets")}
                />
              }
              label="Metastatic Tumor"
            />
            <FormControlLabel
              control={
                <Checkbox checked={local.hiv} onChange={() => toggle("hiv")} />
              }
              label="HIV/AIDS"
            />
          </Paper>
        </Box>
      </Box>

      <Box sx={{ mt: 4 }}>
        <Button onClick={onBack} sx={{ mr: 2 }}>
          Back
        </Button>
        <Button variant="contained" onClick={handleNext}>
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default StepComorbidities;
