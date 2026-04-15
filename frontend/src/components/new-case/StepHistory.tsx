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
    edVisitsLastYear: number;
    hospitalizationsLastYear: number;
    hospitalizationsLast90Days: number;
  }) => void;
};

const StepHistory = ({ onNext, onBack, onChange }: Props) => {
  const [walkedIn, setWalkedIn] = useState("");
  const [edVisitsLastYear, setEdVisitsLastYear] = useState(0);
  const [hospitalizationsLastYear, setHospitalizationsLastYear] = useState(0);
  const [hospitalizationsLast90Days, setHospitalizationsLast90Days] =
    useState(0);

  const handleNext = () => {
    onChange({
      walkedIn,
      edVisitsLastYear,
      hospitalizationsLastYear,
      hospitalizationsLast90Days
    });
    onNext();
  };

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
        value={edVisitsLastYear === 0 ? "" : edVisitsLastYear}
        placeholder="e.g. 2"
        helperText="Number of emergency visits in the past year"
        onChange={(e) => {
          const raw = e.target.value;
          setEdVisitsLastYear(raw === "" ? 0 : Number(raw));
        }}
      />

      {/* Hospitalizations */}
      <TextField
        label="Hospitalizations (Last 12 Months)"
        type="number"
        fullWidth
        margin="normal"
        value={hospitalizationsLastYear === 0 ? "" : hospitalizationsLastYear}
        placeholder="e.g. 1"
        helperText="Number of inpatient admissions in the past year"
        onChange={(e) => {
          const raw = e.target.value;
          setHospitalizationsLastYear(raw === "" ? 0 : Number(raw));
        }}
      />

      {/* hospitalizationsLast90Days */}
      <TextField
        label="Hospitalizations (Last 90 Days)"
        type="number"
        fullWidth
        margin="normal"
        value={
          hospitalizationsLast90Days === 0 ? "" : hospitalizationsLast90Days
        }
        placeholder="e.g. 1"
        helperText="Number of hospitalizations in the last 90 days"
        onChange={(e) => {
          const raw = e.target.value;
          setHospitalizationsLast90Days(raw === "" ? 0 : Number(raw));
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
