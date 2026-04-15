from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)

def generate_patient_history_report(patient, cases):
    file_path = f"/tmp/patient_history_{patient.id}.pdf"

    doc = SimpleDocTemplate(file_path, pagesize=A4)
    styles = getSampleStyleSheet()
    elements = []

    elements.append(Paragraph("Full Patient History Report", styles["Title"]))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph(f"Patient Name: {patient.name}", styles["Normal"]))
    elements.append(Paragraph(f"National ID: {patient.national_id}", styles["Normal"]))
    elements.append(Paragraph(f"Total Visits: {len(cases)}", styles["Normal"]))
    elements.append(Spacer(1, 16))

    if len(cases) >= 2:
        first = cases[-1]
        last = cases[0]
        hr_diff = (last.heart_rate or 0) - (first.heart_rate or 0)
        spo2_diff = (last.spo2 or 0) - (first.spo2 or 0)

        if hr_diff > 10 or spo2_diff < -3:
            trend = "The patient condition appears to be deteriorating over time."
        elif hr_diff < -10 or spo2_diff > 3:
            trend = "The patient condition shows signs of improvement."
        else:
            trend = "The patient condition appears relatively stable."

        elements.append(Paragraph("Clinical Trajectory", styles["Heading2"]))
        elements.append(Paragraph(trend, styles["Normal"]))
        elements.append(
            Paragraph(
                f"Heart rate change: {'+' if hr_diff > 0 else ''}{hr_diff} bpm",
                styles["Normal"],
            )
        )
        elements.append(
            Paragraph(
                f"SpO₂ change: {'+' if spo2_diff > 0 else ''}{spo2_diff}%",
                styles["Normal"],
            )
        )
        elements.append(Spacer(1, 16))

    elements.append(Paragraph("Visit Summary Table", styles["Heading2"]))

    table_data = [[
        "Visit ID",
        "Date",
        "Decision",
        "Type",
        "Confidence",
        "Heart Rate",
        "SpO₂",
        "Triage",
    ]]

    for c in cases:
        table_data.append([
            str(c.id),
            str(c.created_at.strftime("%d/%m/%Y %H:%M") if c.created_at else ""),
            str(c.decision or ""),
            str(c.argument_type or ""),
            f"{round((c.confidence or 0) * 100)}%",
            str(c.heart_rate or ""),
            str(c.spo2 or ""),
            str(c.triage_score or ""),
        ])

    table = Table(table_data, repeatRows=1)
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.lightgrey),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.black),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("FONTSIZE", (0, 0), (-1, -1), 8),
        ("BOTTOMPADDING", (0, 0), (-1, 0), 8),
    ]))
    elements.append(table)
    elements.append(Spacer(1, 20))

    for c in cases:
        elements.append(Paragraph(f"Visit #{c.id}", styles["Heading2"]))
        elements.append(
            Paragraph(
                f"Date: {c.created_at.strftime('%d/%m/%Y %H:%M') if c.created_at else ''}",
                styles["Normal"],
            )
        )
        elements.append(Paragraph(f"Decision: {c.decision}", styles["Normal"]))
        elements.append(Paragraph(f"Argumentation Type: {c.argument_type}", styles["Normal"]))
        elements.append(
            Paragraph(f"Confidence: {round((c.confidence or 0) * 100)}%", styles["Normal"])
        )
        elements.append(Paragraph(f"Heart Rate: {c.heart_rate} bpm", styles["Normal"]))
        elements.append(Paragraph(f"SpO₂: {c.spo2}%", styles["Normal"]))
        elements.append(Paragraph(f"Triage Score: {c.triage_score}", styles["Normal"]))
        elements.append(Spacer(1, 8))

        elements.append(Paragraph("Supporting Arguments", styles["Heading3"]))
        if c.supporting_rules:
            for rule in c.supporting_rules:
                elements.append(Paragraph(f"• {rule}", styles["Normal"]))
        else:
            elements.append(Paragraph("None", styles["Normal"]))

        elements.append(Spacer(1, 6))
        elements.append(Paragraph("Opposing Arguments", styles["Heading3"]))
        if c.opposing_rules:
            for rule in c.opposing_rules:
                elements.append(Paragraph(f"• {rule}", styles["Normal"]))
        else:
            elements.append(Paragraph("None", styles["Normal"]))

        elements.append(Spacer(1, 16))

    doc.build(elements)
    return file_path