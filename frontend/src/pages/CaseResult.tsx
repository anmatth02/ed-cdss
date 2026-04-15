import { useLocation } from "react-router-dom";
import {
  Paper,
  Container,
  Typography,
  LinearProgress,
  Chip,
} from "@mui/material";

const CaseResult = () => {
  const location = useLocation();
  const result = location.state;

  if (!result) return <div>No result available</div>;

  const getColor = (decision: string) => {
    if (decision === "HOSPITALIZATION") return "error";
    if (decision === "DILEMMA") return "warning";
    return "success";
  };

  return (
    <Container maxWidth={false} sx={{ mt: 6 }}>
      <Paper sx={{ p: 4 }} elevation={3}>
        <Typography variant="h4" gutterBottom>
          Clinical Decision Result
        </Typography>

        <Chip
          label={`Decision: ${result.decision}`}
          color={getColor(result.decision)}
          sx={{ mb: 2 }}
        />

        <Typography sx={{ mb: 1 }}>
          Confidence: {Math.round((result.confidence ?? 0) * 100)}%
        </Typography>

        <LinearProgress
          variant="determinate"
          value={(result.confidence ?? 0) * 100}
          sx={{ height: 10, borderRadius: 5, mb: 3 }}
        />

        <Typography sx={{ mb: 2 }}>
          Argumentation Type: {result.argument_type}
        </Typography>

        <Typography>Case ID: {result.case_id}</Typography>

        <Typography>
          Created: {new Date(result.created_at).toLocaleString()}
        </Typography>
      </Paper>
    </Container>
  );
};

export default CaseResult;
