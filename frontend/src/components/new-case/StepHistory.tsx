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

type Props = {
  onNext: () => void;
  onBack: () => void;
  onChange: (data: {
    walkedIn: string;
    edVisitsLastYear?: number;
    hospitalizationsLastYear?: number;
    hospitalizationsLast90Days?: number;
  }) => void;
};

const StepHistory = ({ onNext, onBack, onChange }: Props) => {
  const [walkedIn, setWalkedIn] = useState("");
  const [edVisitsLastYear, setEdVisitsLastYear] = useState<number | undefined>(undefined);
  const [hospitalizationsLastYear, setHospitalizationsLastYear] = useState<number | undefined>(undefined);
  const [hospitalizationsLast90Days, setHospitalizationsLast90Days] =
    useState<number | undefined>(undefined);

  const handleNext = () => {
    onChange({
      walkedIn,
      edVisitsLastYear,
      hospitalizationsLastYear,
      hospitalizationsLast90Days
    });
    onNext();
  };

  const asDisplayValue = (v?: number) => v ?? "";

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Emergency Department History
      </Typography>

      {/* Mode of Arrival */}
      <FormLabel sx={{ mt: 2 }}>Mode of Arrival</FormLabel>
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

      {/* ED Visits */}
      <TextField
        label="ED Visits (Last 12 Months)"
        type="number"
        fullWidth
        margin="normal"
        value={asDisplayValue(edVisitsLastYear)}
        placeholder="e.g. 2"
        helperText="Number of emergency visits in the past year"
        onChange={(e) => {
          const raw = e.target.value;
          setEdVisitsLastYear(raw === "" ? undefined : Number(raw));
        }}
      />

      {/* Hospitalizations */}
      <TextField
        label="Hospitalizations (Last 12 Months)"
        type="number"
        fullWidth
        margin="normal"
        value={asDisplayValue(hospitalizationsLastYear)}
        placeholder="e.g. 1"
        helperText="Number of inpatient admissions in the past year"
        onChange={(e) => {
          const raw = e.target.value;
          setHospitalizationsLastYear(raw === "" ? undefined : Number(raw));
        }}
      />

      {/* hospitalizationsLast90Days */}
      <TextField
        label="Hospitalizations (Last 90 Days)"
        type="number"
        fullWidth
        margin="normal"
        value={asDisplayValue(hospitalizationsLast90Days)}
        placeholder="e.g. 1"
        helperText="Number of hospitalizations in the last 90 days"
        onChange={(e) => {
          const raw = e.target.value;
          setHospitalizationsLast90Days(raw === "" ? undefined : Number(raw));
        }}
      />

      <Box sx={{ mt: 2 }}>
        <Button onClick={onBack}>Back</Button>
        <Button variant="contained" onClick={handleNext} sx={{ ml: 2 }}>
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default StepHistory;
