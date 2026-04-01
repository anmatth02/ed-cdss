import { useLocation } from "react-router-dom";
import { Paper, Container, Typography, LinearProgress, Chip } from "@mui/material";

const CaseResult = () => {
  const location = useLocation();
  const result = location.state;

  if (!result) return <div>No result available</div>;

  const getColor = (risk: string) => {
    if (risk === "HIGH") return "error";
    if (risk === "MEDIUM") return "warning";
    return "success";
  };

  return (
    <Container maxWidth={false} sx={{ mt: 6 }}>
      <Paper sx={{ p: 4 }} elevation={3}>
        <Typography variant="h4" gutterBottom>
          Clinical Decision Result
        </Typography>

        <Chip
          label={`Risk Level: ${result.risk_level}`}
          color={getColor(result.risk_level)}
          sx={{ mb: 2 }}
        />

        <Typography sx={{ mb: 1 }}>
          Risk Score: {result.risk_score} / 10
        </Typography>

        <LinearProgress
          variant="determinate"
          value={result.risk_score * 10}
          sx={{ height: 10, borderRadius: 5, mb: 3 }}
        />

        <Typography>
          Case ID: {result.case_id}
        </Typography>

        <Typography>
          Created: {new Date(result.created_at).toLocaleString()}
        </Typography>
      </Paper>
    </Container>
  );
};

export default CaseResult;