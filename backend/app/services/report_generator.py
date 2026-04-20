from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet

def generate_case_report(case):
    file_path = f"/tmp/case_{case.id}.pdf"

    doc = SimpleDocTemplate(file_path)
    styles = getSampleStyleSheet()

    content = []

    content.append(Paragraph("Clinical Decision Report", styles["Title"]))
    content.append(Spacer(1, 12))

    content.append(Paragraph(f"Case ID: {case.id}", styles["Normal"]))
    content.append(Paragraph(f"Decision: {case.decision}", styles["Normal"]))
    content.append(Paragraph(f"Confidence: {round(case.confidence * 100)}%", styles["Normal"]))
    content.append(Spacer(1, 12))

    content.append(Paragraph("Supporting Arguments:", styles["Heading2"]))
    for rule in case.supporting_rules or []:
        content.append(Paragraph(f"- {rule}", styles["Normal"]))

    content.append(Spacer(1, 12))

    content.append(Paragraph("Opposing Arguments:", styles["Heading2"]))
    for rule in case.opposing_rules or []:
        content.append(Paragraph(f"- {rule}", styles["Normal"]))

    content.append(Spacer(1, 12))

    content.append(Paragraph("Vitals:", styles["Heading2"]))
    content.append(Paragraph(f"Heart Rate: {case.heart_rate}", styles["Normal"]))
    content.append(Paragraph(f"SpO₂: {case.spo2}", styles["Normal"]))
    content.append(Paragraph(f"Triage Score: {case.triage_score}", styles["Normal"]))

    doc.build(content)

    return file_path