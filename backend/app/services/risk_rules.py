def evaluate_risk(data):

    score = 0
    fired_rules = []

    # Triage
    if data.triage_score >= 3:
        score += 3
        fired_rules.append("Triage score ≥ 3 → +3")
    elif data.triage_score == 2:
        score += 2
        fired_rules.append("Triage score = 2 → +2")

    # Abnormal vitals
    if data.heart_rate and (data.heart_rate > 100 or data.heart_rate < 50):
        score += 1
        fired_rules.append("Abnormal heart rate (<50 or >100) → +1")

    if data.spo2 and data.spo2 < 94:
        score += 2
        fired_rules.append("SpO2 < 94 → +2")  # ✔ fixed (ήταν λάθος πριν)

    if data.systolic_bp and data.systolic_bp < 90:
        score += 2
        fired_rules.append("Systolic BP < 90 → +2")

    # Frequent ED user
    if data.ed_visits_last_year >= 3:
        score += 1
        fired_rules.append("Frequent ED visits (≥3/year) → +1")

    # Age
    if data.age > 75:
        score += 1
        fired_rules.append("Age > 75 → +1")

    # Comorbidity load
    comorb_count = sum([
        data.chf,
        data.renal,
        data.malignancy,
        data.cpd,
        data.dm2
    ])

    if comorb_count > 0:
        fired_rules.append(f"Comorbidities count ({comorb_count}) → +{comorb_count}")

    score += comorb_count

    # Final risk level
    if score >= 6:
        risk = "HIGH"
    elif score >= 3:
        risk = "MODERATE"
    else:
        risk = "LOW"

    return risk, score, fired_rules