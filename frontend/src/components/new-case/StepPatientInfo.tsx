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
    nationalId.trim() !== "" && name.trim() !== "" && age >= 0 && age <= 120;

  const handleNext = () => {
    if (!isValid) return;

    onChange({ nationalId, name, age });
    onNext();
  };

  return (
    <Box
      sx={{
        maxWidth: "1200px",
        width: "100%",
        mx: "auto",
        background: "#ffffff",
        p: 5,
        py: 6,
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
        Patient Identification
      </Typography>

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
          label="National ID"
          size="medium"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 3,
              background: "#fff",
            },
          }}
          value={nationalId}
          placeholder="e.g. 12345678"
          helperText="Unique patient identifier"
          onChange={(e) => setNationalId(e.target.value.toUpperCase())}
        />

        <TextField
          label="Patient Name"
          fullWidth
          size="medium"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 3,
              background: "#fff",
            },
          }}
          value={name}
          placeholder="e.g. Name Surname"
          onChange={(e) => setName(e.target.value)}
        />

        <TextField
          label="Age"
          type="number"
          size="medium"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 3,
              background: "#fff",
            },
          }}
          fullWidth
          value={age === 0 ? "" : age}
          placeholder="e.g. 45"
          helperText="Age in years (0–120)"
          inputProps={{ min: 0, max: 120 }}
          onChange={(e) => {
            const raw = e.target.value;
            setAge(raw === "" ? 0 : Number(raw));
          }}
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          mt: 4,
        }}
      >
        <Button
          variant="contained"
          size="large"
          sx={{
            px: 5,
            py: 1.2,
            borderRadius: 3,
            fontWeight: 700,
            textTransform: "none",

            "&.Mui-disabled": {
              background: "#cbd5e1",
              color: "#64748b",
            },
          }}
          disabled={!isValid}
          onClick={handleNext}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default StepPatientInfo;
