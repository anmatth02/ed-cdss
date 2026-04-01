import { useState } from "react";
import { Container, Paper, TextField, Button, Typography } from "@mui/material";

type PatientSummary = {
  patient_id: string;
  total_visits: number;
  first_visit: string;
  last_visit: string;
};

const SearchPatient = () => {
  const [patientId, setPatientId] = useState("");
  const [result, setResult] = useState<PatientSummary | null>(null);

  const searchPatient = async () => {
    try {
      const res = await fetch(
        `http://localhost:8000/cases/patients/${patientId}/summary`
      );

      const data = await res.json();
      setResult(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container maxWidth={false} sx={{ mt: 6 }}>
      <Paper sx={{ p: 4 }} elevation={3}>
        <Typography variant="h5" gutterBottom>
          Search Patient
        </Typography>

        <TextField
          fullWidth
          label="Patient Id"
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
          sx={{ mb: 2 }}
        />

        <Button variant="contained" onClick={searchPatient}>
          Search
        </Button>

        {result && (
          <Paper sx={{ mt: 3, p: 2 }}>
            <Typography>
              Total Visits: {result.total_visits}
            </Typography>
            <Typography>
              First Visit: {result.first_visit}
            </Typography>
            <Typography>
              Last Visit: {result.last_visit}
            </Typography>
          </Paper>
        )}
      </Paper>
    </Container>
  );
};

export default SearchPatient;