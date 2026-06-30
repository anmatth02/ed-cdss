import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
  Paper,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
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
        Comorbidities (CCI)
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "1fr 1fr",
            lg: "1fr 1fr 1fr",
          },
          gap: 3,
        }}
      >
        <Box sx={{ flex: "1 1 300px" }}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 4,
              border: "1px solid #e2e8f0",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              height: "100%",
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                mb: 2,
                fontWeight: 700,
                color: "#334155",
              }}
            >
              Cardiovascular
            </Typography>

            <FormControlLabel
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 1,
              }}
              control={
                <Checkbox checked={local.mi} onChange={() => toggle("mi")} />
              }
              label="Myocardial Infarction"
            />
            <FormControlLabel
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 1,
              }}
              control={
                <Checkbox checked={local.chf} onChange={() => toggle("chf")} />
              }
              label="Congestive Heart Failure"
            />
            <FormControlLabel
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 1,
              }}
              control={
                <Checkbox checked={local.pvd} onChange={() => toggle("pvd")} />
              }
              label="Peripheral Vascular Disease"
            />
            <FormControlLabel
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 1,
              }}
              control={
                <Checkbox checked={local.cvd} onChange={() => toggle("cvd")} />
              }
              label="Cerebrovascular"
            />
          </Paper>
        </Box>

        <Box sx={{ flex: "1 1 300px" }}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 4,
              border: "1px solid #e2e8f0",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              height: "100%",
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                mb: 2,
                fontWeight: 700,
                color: "#334155",
              }}
            >
              Pulmonary / Neuro
            </Typography>

            <FormControlLabel
              control={
                <Checkbox checked={local.cpd} onChange={() => toggle("cpd")} />
              }
              label="Chronic Pulmonary Disease"
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
              label="Hemiplegia / Paraplegia"
            />

            <FormControlLabel
              control={
                <Checkbox checked={local.pud} onChange={() => toggle("pud")} />
              }
              label="Peptic Ulcer Disease"
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={local.rheu}
                  onChange={() => toggle("rheu")}
                />
              }
              label="Rheumatic / Connective Tissue Disease"
            />

            <FormControl sx={{ mt: 2 }}>
              <FormLabel>Liver Disease</FormLabel>

              <RadioGroup
                value={local.liv2 ? "severe" : local.liv1 ? "mild" : "none"}
                onChange={(e) => {
                  const value = e.target.value;

                  setLocal((prev) => ({
                    ...prev,
                    liv1: value === "mild",
                    liv2: value === "severe",
                  }));
                }}
              >
                <FormControlLabel
                  value="none"
                  control={<Radio />}
                  label="None"
                />

                <FormControlLabel
                  value="mild"
                  control={<Radio />}
                  label="Mild Liver Disease"
                />

                <FormControlLabel
                  value="severe"
                  control={<Radio />}
                  label="Severe Liver Disease"
                />
              </RadioGroup>
            </FormControl>
          </Paper>
        </Box>

        <Box sx={{ flex: "1 1 300px" }}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 4,
              border: "1px solid #e2e8f0",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              height: "100%",
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                mb: 2,
                fontWeight: 700,
                color: "#334155",
              }}
            >
              Metabolic / Oncology
            </Typography>

            <FormControl sx={{ mb: 2 }}>
              <FormLabel>Diabetes</FormLabel>

              <RadioGroup
                value={
                  local.dm2 ? "complication" : local.dm1 ? "simple" : "none"
                }
                onChange={(e) => {
                  const value = e.target.value;

                  setLocal((prev) => ({
                    ...prev,
                    dm1: value === "simple",
                    dm2: value === "complication",
                  }));
                }}
              >
                <FormControlLabel
                  value="none"
                  control={<Radio />}
                  label="None"
                />

                <FormControlLabel
                  value="simple"
                  control={<Radio />}
                  label="Without organ damage"
                />

                <FormControlLabel
                  value="complication"
                  control={<Radio />}
                  label="With organ damage"
                />
              </RadioGroup>
            </FormControl>
            <FormControlLabel
              control={
                <Checkbox
                  checked={local.renal}
                  onChange={() => toggle("renal")}
                />
              }
              label="Renal Disease"
            />
            <FormControl sx={{ mt: 2 }}>
              <FormLabel>Malignancy</FormLabel>

              <RadioGroup
                value={
                  local.mets ? "mets" : local.malignancy ? "malignancy" : "none"
                }
                onChange={(e) => {
                  const value = e.target.value;

                  setLocal((prev) => ({
                    ...prev,
                    malignancy: value === "malignancy",
                    mets: value === "mets",
                  }));
                }}
              >
                <FormControlLabel
                  value="none"
                  control={<Radio />}
                  label="None"
                />

                <FormControlLabel
                  value="malignancy"
                  control={<Radio />}
                  label="Any malignancy (including leukemia / lymphoma)"
                />

                <FormControlLabel
                  value="mets"
                  control={<Radio />}
                  label="Metastatic solid tumor"
                />
              </RadioGroup>
            </FormControl>
            <FormControlLabel
              control={
                <Checkbox checked={local.hiv} onChange={() => toggle("hiv")} />
              }
              label="HIV/AIDS"
            />
          </Paper>
        </Box>
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

export default StepComorbidities;
