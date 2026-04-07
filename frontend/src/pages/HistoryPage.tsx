import { useState } from "react";
import {
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Chip,
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const API_URL = import.meta.env.VITE_API_URL;

type CaseType = {
  id: number;
  created_at: string;
  triage_score: number;
  heart_rate: number;
  spo2: number;
  risk_level: "LOW" | "MODERATE" | "HIGH";
  risk_score: number;
};

type HistoryResponse = {
  patient: {
    name: string;
    national_id: string;
  };
  total_visits: number;
  cases: CaseType[];
};

const HistoryPage = () => {
  const [nationalId, setNationalId] = useState("");
  const [history, setHistory] = useState<HistoryResponse | null>(null);

  const fetchHistory = async () => {
    const res = await fetch(
      `${API_URL}/cases/patients/by-national-id/${nationalId}/history`,
    );

    const data = await res.json();
    setHistory(data);
  };

  const getSeverityColor = (score: number) => {
    if (score <= 2) return "success";
    if (score === 3) return "warning";
    return "error";
  };

  const getRiskColor = (risk: string) => {
    if (risk === "LOW") return "success";
    if (risk === "MODERATE") return "warning";
    return "error";
  };

  const getRiskInterpretation = (risk: string) => {
    if (risk === "HIGH")
      return "High clinical risk based on recorded vital signs.";

    if (risk === "MODERATE")
      return "Moderate clinical risk. Monitoring advised.";

    return "Low clinical risk.";
  };

  const chartData =
    history?.cases.map((c) => ({
      date: new Date(c.created_at).toLocaleDateString(),
      risk: c.risk_score,
    })) || [];

  return (
    <Box sx={{ p: 3 }}>
       <Typography variant="h4" fontWeight="bold" gutterBottom>
          HospiGuide
        </Typography>
      <Paper sx={{ p: 4, width: "90%", bgcolor: "#F7E3FA" }}>
        <Typography variant="h5" gutterBottom>
          Patient History
        </Typography>

        <TextField
          fullWidth
          label="National ID"
          value={nationalId}
          onChange={(e) => setNationalId(e.target.value)}
          sx={{ mb: 2 }}
        />

        <Button variant="contained" onClick={fetchHistory}>
          Search
        </Button>

        {history && (
          <Box>
            <Box
              sx={{
                mt: 4,
                p: 2,
                borderRadius: 2,
                backgroundColor: "#f7f7f7",
              }}
            >
              <Typography variant="h6">Patient Summary</Typography>

              <Typography>Name: {history.patient.name}</Typography>

              <Typography>
                National ID: {history.patient.national_id}
              </Typography>

              <Typography>Total Visits: {history.total_visits}</Typography>
            </Box>
            <Typography variant="h6" sx={{ mt: 4 }}>
              Visit Timeline
            </Typography>

            <Typography variant="h6" sx={{ mt: 4 }}>
              Risk Progression
            </Typography>

            <Box sx={{ height: 250, mt: 2 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="date" />

                  <YAxis domain={[0, 10]} />

                  <Tooltip />

                  <Line
                    type="monotone"
                    dataKey="risk"
                    stroke="#1976d2"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
            {history.cases.map((visit, index) => (
              <Paper key={visit.id ?? index} sx={{ mt: 3, p: 2 }}>
                <Typography variant="subtitle1">
                  Visit ID: {visit.id}
                </Typography>

                <Typography>
                  Date: {new Date(visit.created_at).toLocaleString()}
                </Typography>

                <Chip
                  label={`Triage Score: ${visit.triage_score}`}
                  color={getSeverityColor(visit.triage_score)}
                  sx={{ mt: 1 }}
                />

                <Chip
                  label={`Risk Level: ${visit.risk_level}`}
                  color={getRiskColor(visit.risk_level)}
                  sx={{ mt: 1, ml: 1 }}
                />

                <Typography sx={{ mt: 1 }}>
                  Clinical Risk Score: {visit.risk_score}
                </Typography>

                <Box sx={{ mt: 1 }}>
                  <Typography>Heart Rate: {visit.heart_rate} bpm</Typography>
                  <Typography>SpO₂: {visit.spo2}%</Typography>
                </Box>

                <Box
                  sx={{
                    mt: 2,
                    p: 2,
                    borderRadius: 1,
                    backgroundColor:
                      visit.risk_level === "HIGH"
                        ? "#fdecea"
                        : visit.risk_level === "MODERATE"
                          ? "#fff4e5"
                          : "#edf7ed",
                  }}
                >
                  <Typography sx={{ fontWeight: "bold" }}>
                    Clinical Risk: {visit.risk_level}
                  </Typography>

                  <Typography color="text.secondary">
                    {getRiskInterpretation(visit.risk_level)}
                  </Typography>
                </Box>
              </Paper>
            ))}
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default HistoryPage;
