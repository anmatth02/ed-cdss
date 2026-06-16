import {
  Box,
  Button,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import type { NewCaseForm } from "../../types/Case";

type Props = {
  onNext: () => void;
  onBack: () => void;
  onChange: (data: Partial<NewCaseForm>) => void;

  defaultEdVisitsLastYear?: number;
  defaultHospitalizationsLastYear?: number;
  defaultHospitalizationsLast90Days?: number;
};

const StepHistory = ({
  onNext,
  onBack,
  onChange,
  defaultEdVisitsLastYear,
  defaultHospitalizationsLastYear,
  defaultHospitalizationsLast90Days,
}: Props) => {
  const [walkedIn, setWalkedIn] = useState("");
  const [edVisitsLastYear, setEdVisitsLastYear] = useState<number | undefined>(
    defaultEdVisitsLastYear,
  );
  const [hospitalizationsLastYear, setHospitalizationsLastYear] = useState<
    number | undefined
  >(defaultHospitalizationsLastYear);

  const [hospitalizationsLast90Days, setHospitalizationsLast90Days] = useState<
    number | undefined
  >(defaultHospitalizationsLast90Days);

  const handleNext = () => {
    onChange({
      walkedIn,
      edVisitsLastYear,
      hospitalizationsLastYear,
      hospitalizationsLast90Days,
    });
    onNext();
  };

  const asDisplayValue = (v?: number) => v ?? "";

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
        Emergency Department History
      </Typography>

      {/* Mode of Arrival */}
      <FormLabel
        sx={{
          fontWeight: 600,
          color: "#334155",
        }}
      >
        Mode of Arrival
      </FormLabel>

      <Box
        sx={{
          display: "flex",
          gap: 3,
          mt: 1,
          mb: 4,
        }}
      >
        <RadioGroup
          row
          value={walkedIn}
          onChange={(e) => setWalkedIn(e.target.value)}
        >
          <FormControlLabel value="Yes" control={<Radio />} label="Walked In" />

          <FormControlLabel
            value="No"
            control={<Radio />}
            label="Ambulance / Other"
          />
        </RadioGroup>
      </Box>

      {/* Inputs */}
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
          label="ED Visits (Last 12 Months)"
          type="number"
          value={asDisplayValue(edVisitsLastYear)}
          placeholder="e.g. 2"
          helperText="Number of emergency visits in the past year"
          onChange={(e) => {
            const raw = e.target.value;
            setEdVisitsLastYear(raw === "" ? undefined : Number(raw));
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
          label="Hospitalizations (Last 12 Months)"
          type="number"
          value={asDisplayValue(hospitalizationsLastYear)}
          placeholder="e.g. 1"
          helperText="Number of inpatient admissions in the past year"
          onChange={(e) => {
            const raw = e.target.value;
            setHospitalizationsLastYear(raw === "" ? undefined : Number(raw));
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
          label="Hospitalizations (Last 90 Days)"
          type="number"
          value={asDisplayValue(hospitalizationsLast90Days)}
          placeholder="e.g. 1"
          helperText="Number of hospitalizations in the last 90 days"
          onChange={(e) => {
            const raw = e.target.value;
            setHospitalizationsLast90Days(raw === "" ? undefined : Number(raw));
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 3,
              background: "#fff",
              height: 56,
            },
          }}
        />
      </Box>

      {/* Buttons */}
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

export default StepHistory;
