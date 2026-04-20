import { useLocation } from "react-router-dom";
import {
  Paper,
  Container,
  Typography,
  LinearProgress,
  Chip,
  Box,
  Divider,
} from "@mui/material";

const CaseResult = () => {
  const location = useLocation();
  const result = location.state;
  console.log(result);
  if (!result) return <div>No result available</div>;

  const getColor = (decision: string) => {
    if (decision === "HOSPITALIZATION") return "error";
    if (decision === "DILEMMA") return "warning";
    return "success";
  };

  const confidence = Math.round((result.confidence ?? 0) * 100);

  console.log("RESULT =", result);
  console.log("EXPLANATION =", result.explanation_text);
  return (
    <Container maxWidth="lg" sx={{ mt: 6, mb: 6 }}>
      <Paper sx={{ p: 4 }} elevation={3}>
        <Typography variant="h4" gutterBottom>
          Clinical Decision Result
        </Typography>
        <Chip
          label={`Decision: ${result.decision}`}
          color={getColor(result.decision)}
          sx={{ mb: 2 }}
        />
        <Typography sx={{ mb: 1 }}>Confidence: {confidence}%</Typography>
        <LinearProgress
          variant="determinate"
          value={confidence}
          sx={{ height: 10, borderRadius: 5, mb: 3 }}
        />
        <Typography variant="h6" sx={{ mt: 3 }}>
          Argumentation Type
        </Typography>

        <Chip
          label={result.argument_type}
          color={
            result.argument_type === "PRIORITY"
              ? "success"
              : result.argument_type === "DEFEATER"
                ? "warning"
                : "error"
          }
          sx={{ mt: 1, mb: 2 }}
        />
        <Divider sx={{ mb: 3 }} />

        {/* Explanation
        <Typography variant="h6" gutterBottom color="primary.main">
          Decision Explanation
        </Typography>

        <Box
          sx={{
            whiteSpace: "pre-line",
            background: "#f9fafb",
            border: "1px solid #e0e0e0",
            lineHeight: 1.7,
            p: 2,
            borderRadius: 2,
            mb: 4,
          }}
        >
          {result.explanation_text}
        </Box> */}

        <Typography variant="h6" gutterBottom color="success.main">
          Supporting Arguments
        </Typography>
        <Box
          sx={{
            background: "#eef7ee",
            p: 2,
            borderRadius: 2,
            mb: 4,
          }}
        >
          {result.supporting_rules?.length > 0 ? (
            result.supporting_rules.map((rule: string, i: number) => (
              <Typography key={i}>• {rule}</Typography>
            ))
          ) : (
            <Typography>No supporting factors identified.</Typography>
          )}
        </Box>
        
        {/* Opposing */}
        <Typography variant="h6" gutterBottom color="error.main" sx={{ mt: 3 }}>
          <b>Opposing Arguments</b>
        </Typography>
        <Box
          sx={{
            background: "#fdeeee",
            p: 2,
            borderRadius: 2,
            mb: 4,
          }}
        >
          {result.opposing_rules?.length > 0 ? (
            result.opposing_rules.map((rule: string, i: number) => (
              <Typography key={i}>• {rule}</Typography>
            ))
          ) : (
            <Typography>
              {result.decision === "HOSPITALIZATION"
                ? "No discharge-supporting factors identified."
                : "No hospitalization-supporting factors identified."}
            </Typography>
          )}
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Typography>Case ID: {result.case_id}</Typography>
        <Typography>
          Created: {new Date(result.created_at).toLocaleString()}
        </Typography>
      </Paper>
    </Container>
  );
};

export default CaseResult;
