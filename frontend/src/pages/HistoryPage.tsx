import { useState } from "react";
import { Paper, TextField, Button, Typography, Box, Chip } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const API_URL = "http://localhost:8000";

type CaseType = {
  case_id: number;
  created_at: string;
  triage_score: number;
  heart_rate: number;
  spo2: number;
  decision: "HOSPITALIZATION" | "DISCHARGE" | "DILEMMA";
  argument_type: "PRIORITY" | "DEFEATER" | "DILEMMA";
  confidence: number;
  supporting_rules: string[];
  opposing_rules: string[];
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

  const getDecisionColor = (decision: string) => {
    if (decision === "DISCHARGE") return "success";
    if (decision === "DILEMMA") return "warning";
    return "error";
  };

  const getDecisionInterpretation = (decision: string) => {
    if (decision === "HOSPITALIZATION")
      return "The system supports hospital admission based on the available arguments.";

    if (decision === "DILEMMA")
      return "The case is ambiguous and requires physician judgment.";

    return "The system supports discharge based on the available arguments.";
  };

  const chartData =
    history?.cases.map((c) => ({
      date: new Date(c.created_at).toLocaleDateString(),
      confidence: Math.round((c.confidence ?? 0) * 100),
    })) || [];

  // ---------- COMPARISON ----------
  const getComparison = (current: CaseType, previous: CaseType | undefined) => {
    if (!previous) return null;

    return {
      heartRate: current.heart_rate - previous.heart_rate,
      spo2: current.spo2 - previous.spo2,
      decisionChanged: current.decision !== previous.decision,
    };
  };

  const getTrend = (value: number) => {
    if (value > 0) return "worsening";
    if (value < 0) return "improving";
    return "stable";
  };

  // ---------- TRAJECTORY ----------
  const generateTrajectory = (cases: CaseType[]) => {
    if (!cases || cases.length < 2)
      return "Not enough data to determine trajectory.";

    const first = cases[cases.length - 1];
    const last = cases[0];

    const hrDiff = last.heart_rate - first.heart_rate;
    const spo2Diff = last.spo2 - first.spo2;

    let trend = "";

    if (hrDiff > 10 || spo2Diff < -3) {
      trend = "The patient condition appears to be deteriorating over time.";
    } else if (hrDiff < -10 || spo2Diff > 3) {
      trend = "The patient condition shows signs of improvement.";
    } else {
      trend = "The patient condition appears relatively stable.";
    }

    return `${trend}
Heart rate change: ${hrDiff > 0 ? "+" : ""}${hrDiff} bpm.
SpO₂ change: ${spo2Diff > 0 ? "+" : ""}${spo2Diff}%.`;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        HospiGuide
      </Typography>

      <Paper sx={{ p: 4, width: "90%", bgcolor: "#F7E3FA" }}>
        <Typography variant="h5">Patient History</Typography>

        <TextField
          fullWidth
          label="National ID"
          value={nationalId}
          onChange={(e) => setNationalId(e.target.value)}
          sx={{ my: 2 }}
        />

        <Button variant="contained" onClick={fetchHistory}>
          Search
        </Button>

        {history && (
          <Box>
            {/* SUMMARY */}
            <Box sx={{ mt: 4, p: 2, bgcolor: "#f7f7f7", borderRadius: 2 }}>
              <Typography variant="h6">Patient Summary</Typography>
              <Typography>Name: {history.patient.name}</Typography>
              <Typography>ID: {history.patient.national_id}</Typography>
              <Typography>Total Visits: {history.total_visits}</Typography>
            </Box>

            {/* CHART */}
            <Typography variant="h6" sx={{ mt: 4 }}>
              Risk Progression
            </Typography>

            <Box sx={{ height: 250, mt: 2 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="confidence"
                    stroke="#1976d2"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>

            {/* TRAJECTORY */}
            <Typography variant="h6" sx={{ mt: 4 }}>
              Clinical Trajectory
            </Typography>

            <Box sx={{ p: 2, bgcolor: "#eef6ff", borderRadius: 2 }}>
              <Typography>{generateTrajectory(history.cases)}</Typography>
            </Box>

            {/* VISITS */}
            {history.cases.map((visit, index) => {
              const prev = history.cases[index + 1];
              const comp = getComparison(visit, prev);

              return (
                <Paper key={visit.case_id} sx={{ mt: 3, p: 3 }}>
                  <Typography variant="h6">Visit #{visit.case_id}</Typography>

                  <Typography>
                    {new Date(visit.created_at).toLocaleString()}
                  </Typography>

                  {/* CHIPS */}
                  <Box sx={{ mt: 1 }}>
                    <Chip
                      label={`Triage: ${visit.triage_score}`}
                      color={getSeverityColor(visit.triage_score)}
                      sx={{ mr: 1 }}
                    />

                    <Chip
                      label={visit.decision}
                      color={getDecisionColor(visit.decision)}
                    />
                  </Box>

                  {/* VITALS */}
                  <Box sx={{ mt: 2 }}>
                    <Typography>HR: {visit.heart_rate} bpm</Typography>
                    <Typography>SpO₂: {visit.spo2}%</Typography>
                  </Box>

                  {/* RULES */}
                  <Typography sx={{ mt: 2, fontWeight: "bold" }}>
                    Supporting Arguments
                  </Typography>
                  {visit.supporting_rules?.map((r, i) => (
                    <Typography key={i}>✔ {r}</Typography>
                  ))}

                  <Typography sx={{ mt: 2, fontWeight: "bold" }}>
                    Opposing Arguments
                  </Typography>
                  {visit.opposing_rules?.map((r, i) => (
                    <Typography key={i}>✖ {r}</Typography>
                  ))}

                  {/* COMPARISON */}
                  {comp && (
                    <Box
                      sx={{
                        mt: 2,
                        p: 2,
                        borderRadius: 2,
                        bgcolor:
                          comp.heartRate > 20 || comp.spo2 < -3
                            ? "#fdecea"
                            : "#eef6ff",
                      }}
                    >
                      <Typography variant="subtitle2">
                        Change from previous visit:
                      </Typography>

                      <Typography>
                        HR: {comp.heartRate > 0 ? "↑" : "↓"}{" "}
                        {Math.abs(comp.heartRate)} ({getTrend(comp.heartRate)})
                      </Typography>

                      <Typography>
                        SpO₂: {comp.spo2 > 0 ? "↑" : "↓"} {Math.abs(comp.spo2)}{" "}
                        ({getTrend(-comp.spo2)})
                      </Typography>

                      {comp.decisionChanged && (
                        <Typography color="error">
                          ⚠ Decision changed
                        </Typography>
                      )}
                    </Box>
                  )}

                  {/* DECISION */}
                  <Box
                    sx={{
                      mt: 2,
                      p: 2,
                      borderRadius: 1,
                      bgcolor:
                        visit.decision === "HOSPITALIZATION"
                          ? "#fdecea"
                          : visit.decision === "DILEMMA"
                            ? "#fff4e5"
                            : "#edf7ed",
                    }}
                  >
                    <Typography fontWeight="bold">{visit.decision}</Typography>

                    <Typography>
                      {getDecisionInterpretation(visit.decision)}
                    </Typography>

                    <Typography sx={{ mt: 1 }}>
                      Confidence: {Math.round(visit.confidence * 100)}%
                    </Typography>

                    <Typography>Type: {visit.argument_type}</Typography>
                  </Box>

                  {/* PDF BUTTON */}
                  {/* <Button
                    variant="outlined"
                    sx={{ mt: 2 }}
                    onClick={() =>
                      window.open(
                        `${API_URL}/cases/${visit.case_id}/report`,
                        "_blank",
                      )
                    }
                  >
                    Download Report
                  </Button>

                  <Button
                    variant="outlined"
                    sx={{ ml: 2 }}
                    onClick={() => {
                      window.open(
                        `${API_URL}/cases/patients/by-national-id/${nationalId}/report`,
                        "_blank",
                      );
                    }}
                    disabled={!history}
                  >
                    Download Full Patient PDF
                  </Button> */}
                </Paper>
              );
            })}
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default HistoryPage;
