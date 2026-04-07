import { Box, Button, Card, CardContent, Grid, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
const Dashboard = () => {
  return (
    <Box sx={{ p: 4 }}>
      {/* Hero Section */}
      <Box
        sx={{
          mb: 4,
          p: 4,
          borderRadius: 3,
          background: "linear-gradient(135deg, #f3e5f5, #e3f2fd)",
          boxShadow: 2,
        }}
      >
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          HospiGuide
        </Typography>

        <Typography variant="h6" color="text.secondary" gutterBottom>
          Explainable Clinical Decision Support for Emergency Triage
        </Typography>

        <Typography variant="body1" sx={{ mt: 2, maxWidth: 950, lineHeight: 1.8 }}>
          HospiGuide is an AI-assisted clinical support system designed to help healthcare
          professionals evaluate emergency department patients and estimate whether a case
          is more likely to require <strong>hospitalization</strong> or <strong>discharge</strong>.
        </Typography>

        <Typography variant="body1" sx={{ mt: 2, maxWidth: 950, lineHeight: 1.8 }}>
          The system combines patient demographics, visit history, symptoms, vital signs,
          and comorbidity-related indicators to generate an interpretable prediction,
          along with a clinical-style explanation of the factors influencing the result.
        </Typography>

        <Typography
          variant="body2"
          sx={{ mt: 3, fontStyle: "italic", color: "text.secondary" }}
        >
          Important: HospiGuide is intended to support — not replace — clinical judgment.
        </Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ mt: 3, borderRadius: 2 }}
          href="/cases/new"
        >
          Start New Case
        </Button>
      </Box>

      {/* Info Cards */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, boxShadow: 2, height: "100%" }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                What it does
              </Typography>
              <Typography variant="body2" color="text.secondary" lineHeight={1.8}>
                Predicts whether a patient is more likely to require hospitalization
                or can be safely discharged from the emergency department.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, boxShadow: 2, height: "100%" }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                How it works
              </Typography>
              <Typography variant="body2" color="text.secondary" lineHeight={1.8}>
                Uses patient demographics, triage severity, symptoms, vital signs,
                visit history, and clinical risk indicators to generate predictions.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, boxShadow: 2, height: "100%" }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Why it matters
              </Typography>
              <Typography variant="body2" color="text.secondary" lineHeight={1.8}>
                Provides transparent recommendations and interpretable explanations
                to support safer and more informed clinical decision-making.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;