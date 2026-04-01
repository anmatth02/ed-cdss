import { Box, Button, TextField, Typography } from "@mui/material";
import { useState } from "react";

type Props = {
  onNext: () => void;
  onChange: (data: { nationalId: string; name: string; age: number }) => void;
};

const StepPatientInfo = ({ onNext, onChange }: Props) => {
  const [nationalId, setNationalId] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState(0);

  const isValid =
    nationalId.trim() !== "" &&
    name.trim() !== "" &&
    age >= 0 &&
    age <= 120;

  const handleNext = () => {
    if (!isValid) return;

    onChange({ nationalId, name, age });
    onNext();
  };

  return (
    <Box>

      <Typography variant="h6" sx={{ mb: 2 }}>
        Patient Identification
      </Typography>

      <TextField
        label="National ID"
        fullWidth
        margin="normal"
        value={nationalId}
        placeholder="e.g. 12345678"
        helperText="Unique patient identifier"
        onChange={(e) => setNationalId(e.target.value.toUpperCase())}
      />

      <TextField
        label="Patient Name"
        fullWidth
        margin="normal"
        value={name}
        placeholder="e.g. Andri Matheou"
        onChange={(e) => setName(e.target.value)}
      />

      <TextField
        label="Age"
        type="number"
        fullWidth
        margin="normal"
        value={age === 0 ? "" : age}
        placeholder="e.g. 45"
        helperText="Age in years (0–120)"
        inputProps={{ min: 0, max: 120 }}
        onChange={(e) => {
          const raw = e.target.value;
          setAge(raw === "" ? 0 : Number(raw));
        }}
      />

      <Button
        variant="contained"
        sx={{ mt: 2 }}
        disabled={!isValid}
        onClick={handleNext}
      >
        Next
      </Button>

    </Box>
  );
};

export default StepPatientInfo;