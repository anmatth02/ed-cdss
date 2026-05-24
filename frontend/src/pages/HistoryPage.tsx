import { useState } from "react";
import {
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Chip,
  Card,
  CardContent,
  Divider,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

// LOCAL URL
// const API_URL = "http://localhost:8000";

// LIVE URL
const API_URL = import.meta.env.VITE_API_URL;

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

  input?: Record<string, unknown>;
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

  const getDecisionColor = (decision: string) => {
    if (decision === "HOSPITALIZATION") return "error";
    if (decision === "DISCHARGE") return "success";
    return "warning";
  };

  const getBorderColor = (decision: string) => {
    if (decision === "HOSPITALIZATION") return "#d32f2f";
    if (decision === "DISCHARGE") return "#2e7d32";
    return "#ed6c02";
  };

  const chartData =
    history?.cases
      ?.slice()
      .reverse()
      .map((c) => ({
        date: new Date(c.created_at).toLocaleDateString(),
        confidence: Math.round(c.confidence * 100),
      })) || [];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        HospiGuide
      </Typography>

      <Paper
        sx={{
          p: 4,
          borderRadius: 5,
          bgcolor: "#fcf7fd",
          border: "1px solid #eadcf0",
          boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
        }}
      >
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Patient History
        </Typography>

        {/* SEARCH */}
        <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
          <TextField
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
                bgcolor: "#ffffff",
              },
            }}
            fullWidth
            label="National ID"
            value={nationalId}
            onChange={(e) => setNationalId(e.target.value)}
          />

          <Button variant="contained" onClick={fetchHistory}>
            Search
          </Button>
        </Box>

        {history && (
          <>
            {/* SUMMARY */}
            <Grid container spacing={2} sx={{ mb: 4 }}>
              <Grid size={{ xs: 12, md: 3 }}>
                <Card
                  sx={{
                    py: 3,
                    borderRadius: 4,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                    border: "1px solid #eef2f7",
                    height: "100%",
                  }}
                >
                  <CardContent>
                    <Typography color="text.secondary">Patient</Typography>
                    <Typography fontWeight="bold">
                      {history.patient.name}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, md: 3 }}>
                <Card
                  sx={{
                    py: 3,
                    borderRadius: 4,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                    border: "1px solid #eef2f7",
                    height: "100%",
                  }}
                >
                  <CardContent>
                    <Typography color="text.secondary">National ID</Typography>
                    <Typography fontWeight="bold">
                      {history.patient.national_id}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, md: 3 }}>
                <Card
                  sx={{
                    py: 3,
                    borderRadius: 4,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                    border: "1px solid #eef2f7",
                    height: "100%",
                  }}
                >
                  <CardContent>
                    <Typography color="text.secondary">Visits</Typography>
                    <Typography fontWeight="bold">
                      {history.total_visits}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, md: 3 }}>
                <Card
                  sx={{
                    py: 3,
                    borderRadius: 4,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                    border: "1px solid #eef2f7",
                    height: "100%",
                  }}
                >
                  <CardContent>
                    <Typography color="text.secondary">Last Visit</Typography>
                    <Typography fontWeight="bold">
                      {new Date(
                        history.cases[0]?.created_at,
                      ).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* CHART */}
            <Paper
              sx={{
                p: 4,
                mb: 5,
                borderRadius: 5,
                border: "1px solid #e2e8f0",
                boxShadow: "0 4px 14px rgba(0,0,0,0.05)",
              }}
            >
              <Typography variant="h6" gutterBottom>
                Risk Progression
              </Typography>

              <Box sx={{ height: 260 }}>
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
                      strokeWidth={4}
                      dot={{
                        r: 5,
                        strokeWidth: 2,
                        fill: "#fff",
                      }}
                      activeDot={{
                        r: 7,
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </Paper>

            {/* TIMELINE */}
            <Typography variant="h6" sx={{ mb: 2 }}>
              Visit Timeline
            </Typography>

            {history.cases.map((visit, index) => (
              <Box
                key={visit.case_id}
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  mb: 4,
                }}
              >
                {/* LEFT LINE */}
                <Box
                  sx={{
                    width: 40,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    mt: 2,
                  }}
                >
                  <Box
                    sx={{
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      bgcolor: getBorderColor(visit.decision),
                    }}
                  />

                  {index !== history.cases.length - 1 && (
                    <Box
                      sx={{
                        width: 3,
                        minHeight: 280,
                        bgcolor: "#cbd5e1",
                      }}
                    />
                  )}
                </Box>

                {/* CARD */}
                <Paper
                  sx={{
                    flex: 1,
                    p: 3,
                    borderRadius: 4,
                    borderLeft: `6px solid ${getBorderColor(visit.decision)}`,
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.05)",
                    background: "#ffffff",
                  }}
                >
                  <Box
                    sx={{
                      height: 6,
                      borderTopLeftRadius: 16,
                      borderTopRightRadius: 16,
                      bgcolor: getBorderColor(visit.decision),
                      mb: 2,
                    }}
                  />
                  {/* HEADER */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: 1,
                    }}
                  >
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          color: "#1e293b",
                        }}
                      >
                        Visit #{visit.case_id}
                      </Typography>

                      <Typography
                        color="text.secondary"
                        sx={{
                          fontSize: "0.9rem",
                          color: "#64748b",
                        }}
                      >
                        {new Date(visit.created_at).toLocaleString()}
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                      <Chip
                        label={visit.decision}
                        color={getDecisionColor(visit.decision)}
                        sx={{
                          fontWeight: 700,
                          letterSpacing: 0.3,
                        }}
                      />

                      <Chip label={visit.argument_type} variant="outlined" />

                      <Chip
                        label={`${Math.round(visit.confidence * 100)}%`}
                        color="primary"
                      />
                    </Box>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {/* QUICK SNAPSHOT */}
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    <Chip
                      size="medium"
                      sx={{
                        fontWeight: 600,
                      }}
                      label={`HR ${visit.heart_rate}`}
                    />
                    <Chip
                      size="medium"
                      sx={{
                        fontWeight: 600,
                      }}
                      label={`SpO₂ ${visit.spo2}%`}
                    />
                    <Chip
                      size="medium"
                      sx={{
                        fontWeight: 600,
                      }}
                      label={`Triage ${visit.triage_score}`}
                    />
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mt: 2,
                      mb: 1,
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 600,
                        color: "#334155",
                      }}
                    >
                      Confidence
                    </Typography>

                    <Typography
                      sx={{
                        fontWeight: 700,
                        color: "#1976d2",
                      }}
                    >
                      {Math.round(visit.confidence * 100)}%
                    </Typography>
                  </Box>

                  <LinearProgress
                    variant="determinate"
                    value={visit.confidence * 100}
                    sx={{
                      height: 10,
                      borderRadius: 999,
                      backgroundColor: "#dbeafe",

                      "& .MuiLinearProgress-bar": {
                        borderRadius: 999,
                      },
                    }}
                  />

                  {/* FULL DATA */}
                  <Accordion
                    sx={{
                      mt: 3,
                      borderRadius: 3,
                      overflow: "hidden",
                      border: "1px solid #e2e8f0",
                      boxShadow: "none",

                      "&:before": {
                        display: "none",
                      },
                    }}
                  >
                    <AccordionSummary
                      sx={{
                        bgcolor: "#f8fafc",
                      }}
                      expandIcon={<ExpandMoreIcon />}
                    >
                      <Typography fontWeight="bold">
                        Full Submitted Data
                      </Typography>
                    </AccordionSummary>

                    <AccordionDetails>
                      {visit.input ? (
                        <Box>
                          <Typography
                            variant="subtitle2"
                            fontWeight="bold"
                            sx={{ mb: 1 }}
                          >
                            Demographics
                          </Typography>

                          <Typography>
                            Age: {String(visit.input.age ?? "-")}
                          </Typography>

                          <Box mt={2} />

                          <Typography
                            variant="subtitle2"
                            fontWeight="bold"
                            sx={{ mb: 1 }}
                          >
                            Visit History
                          </Typography>

                          <Typography>
                            Walked In: {visit.input.walked_in ? "Yes" : "No"}
                          </Typography>

                          <Typography>
                            ED Visits Last Year:{" "}
                            {String(visit.input.ed_visits_last_year ?? "-")}
                          </Typography>

                          <Typography>
                            Hospitalizations Last Year:{" "}
                            {String(
                              visit.input.hospitalizations_last_year ?? "-",
                            )}
                          </Typography>

                          <Typography>
                            Hospitalizations Last 90 Days:{" "}
                            {String(
                              visit.input.hospitalizations_last_90_days ?? "-",
                            )}
                          </Typography>

                          <Box mt={2} />

                          <Typography
                            variant="subtitle2"
                            fontWeight="bold"
                            sx={{ mb: 1 }}
                          >
                            Symptoms
                          </Typography>

                          <Typography>
                            Fever: {visit.input.fever ? "Yes" : "No"}
                          </Typography>

                          <Typography>
                            Headache: {visit.input.headache ? "Yes" : "No"}
                          </Typography>

                          <Typography>
                            Abdominal Pain:{" "}
                            {visit.input.abdominal_pain ? "Yes" : "No"}
                          </Typography>

                          <Typography>
                            Pain Scale: {String(visit.input.pain_scale ?? "-")}
                          </Typography>

                          <Box mt={2} />

                          <Typography
                            variant="subtitle2"
                            fontWeight="bold"
                            sx={{ mb: 1 }}
                          >
                            Vitals
                          </Typography>

                          <Typography>
                            Heart Rate: {String(visit.input.heart_rate ?? "-")}
                          </Typography>

                          <Typography>
                            Respiratory Rate:{" "}
                            {String(visit.input.respiratory_rate ?? "-")}
                          </Typography>

                          <Typography>
                            Blood Pressure:{" "}
                            {String(visit.input.systolic_bp ?? "-")} /{" "}
                            {String(visit.input.diastolic_bp ?? "-")}
                          </Typography>

                          <Typography>
                            SpO₂: {String(visit.input.spo2 ?? "-")}%
                          </Typography>

                          <Typography>
                            Temperature:{" "}
                            {String(visit.input.temperature ?? "-")}°C
                          </Typography>

                          <Box mt={2} />

                          <Typography
                            variant="subtitle2"
                            fontWeight="bold"
                            sx={{ mb: 1 }}
                          >
                            Comorbidities (CCI)
                          </Typography>

                          <Typography>
                            Myocardial Infarction:{" "}
                            {visit.input.mi ? "Yes" : "No"}
                          </Typography>
                          <Typography>
                            Heart Failure: {visit.input.chf ? "Yes" : "No"}
                          </Typography>
                          <Typography>
                            Peripheral Vascular:{" "}
                            {visit.input.pvd ? "Yes" : "No"}
                          </Typography>
                          <Typography>
                            Cerebrovascular: {visit.input.cvd ? "Yes" : "No"}
                          </Typography>

                          <Typography>
                            Chronic Pulmonary: {visit.input.cpd ? "Yes" : "No"}
                          </Typography>
                          <Typography>
                            Dementia: {visit.input.dem ? "Yes" : "No"}
                          </Typography>
                          <Typography>
                            Paralysis: {visit.input.paralysis ? "Yes" : "No"}
                          </Typography>

                          <Typography>
                            Diabetes: {visit.input.dm1 ? "Yes" : "No"}
                          </Typography>
                          <Typography>
                            Diabetes (organ damage):{" "}
                            {visit.input.dm2 ? "Yes" : "No"}
                          </Typography>

                          <Typography>
                            Renal Disease: {visit.input.renal ? "Yes" : "No"}
                          </Typography>
                          <Typography>
                            Malignancy: {visit.input.malignancy ? "Yes" : "No"}
                          </Typography>
                          <Typography>
                            Metastatic Tumor: {visit.input.mets ? "Yes" : "No"}
                          </Typography>
                          <Typography>
                            HIV/AIDS: {visit.input.hiv ? "Yes" : "No"}
                          </Typography>
                        </Box>
                      ) : (
                        <Typography>No detailed data stored.</Typography>
                      )}
                    </AccordionDetails>
                  </Accordion>

                  {/* ARGUMENTS */}
                  <Grid container spacing={2} sx={{ mt: 2 }}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          bgcolor: "#eef7ee",
                          height: "100%",
                        }}
                      >
                        <Typography
                          fontWeight="bold"
                          color="success.main"
                          sx={{ mb: 1 }}
                        >
                          Supporting Arguments
                        </Typography>

                        {visit.supporting_rules.map((r, i) => (
                          <Typography
                            key={i}
                            sx={{
                              fontSize: "0.95rem",
                              lineHeight: 1.8,
                            }}
                          >
                            {i + 1}. {r}
                          </Typography>
                        ))}
                      </Box>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          bgcolor: "#fdeeee",
                          height: "100%",
                        }}
                      >
                        <Typography
                          fontWeight="bold"
                          color="error.main"
                          sx={{ mb: 1 }}
                        >
                          Opposing Arguments
                        </Typography>

                        {visit.opposing_rules.length > 0 ? (
                          visit.opposing_rules.map((r, i) => (
                            <Typography
                              key={i}
                              sx={{
                                fontSize: "0.95rem",
                                lineHeight: 1.8,
                              }}
                            >
                              {i + 1}. {r}
                            </Typography>
                          ))
                        ) : (
                          <Typography>No opposing factors</Typography>
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              </Box>
            ))}
          </>
        )}
      </Paper>
    </Box>
  );
};

export default HistoryPage;
