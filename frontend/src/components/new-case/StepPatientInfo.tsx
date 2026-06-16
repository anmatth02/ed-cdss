import { Box, Button, TextField, Typography } from "@mui/material";
import { useState } from "react";
import axios from "axios";
import type { NewCaseForm } from "../../types/Case";
import SearchIcon from "@mui/icons-material/Search";

// LOCAL URL
// const API_URL = "http://localhost:8000";

// LIVE URL
const API_URL = import.meta.env.VITE_API_URL;

type Props = {
  onNext: () => void;
  onChange: (data: Partial<NewCaseForm>) => void;
};

const StepPatientInfo = ({ onNext, onChange }: Props) => {
  const [nationalId, setNationalId] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState(0);
  const [patientFound, setPatientFound] = useState(false);

  const isValid =
    nationalId.trim() !== "" && name.trim() !== "" && age >= 0 && age <= 120;

  const handleSearchPatient = async () => {
    if (!nationalId.trim()) return;

    try {
      const response = await axios.get(
        `${API_URL}/cases/patients/by-national-id/${nationalId}`,
      );

      setName(response.data.name);

      if (response.data.age) {
        setAge(response.data.age);
      }

      onChange({
        nationalId: response.data.national_id,
        name: response.data.name,
        age: response.data.age,

        edVisitsLastYear: response.data.ed_visits_last_year,

        hospitalizationsLastYear: response.data.hospitalizations_last_year,

        hospitalizationsLast90Days: response.data.hospitalizations_last_90_days,
      });

      setPatientFound(true);
    } catch {
      setPatientFound(false);
    }
  };

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
        <Box>
          <TextField
            label="National ID"
            fullWidth
            value={nationalId}
            placeholder="e.g. 00000000"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
                background: "#fff",
              },
            }}
            helperText="Enter the patient's national identifier and search existing records"
            onChange={(e) => setNationalId(e.target.value.toUpperCase())}
            InputProps={{
              endAdornment: (
                <Button
                  variant="contained"
                  startIcon={<SearchIcon />}
                  onClick={handleSearchPatient}
                  sx={{
                    ml: 1,
                    minWidth: 140,
                    height: 40,
                    borderRadius: 2,
                    fontWeight: 700,
                    textTransform: "none",
                    boxShadow: "none",

                    "&:hover": {
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    },
                  }}
                >
                  Search
                </Button>
              ),
            }}
          />
        </Box>

        {patientFound && (
          <Typography
            sx={{
              mt: 1,
              color: "success.main",
              fontWeight: 600,
              fontSize: "0.9rem",
            }}
          >
            ✓ Existing patient record found
          </Typography>
        )}

        <TextField
          label="Patient Name"
          disabled={patientFound}
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
