def calculate_risk(case):

    score = 0

    if case.triage_score >= 3:
        score += 3

    if case.spo2 < 94:
        score += 2

    if case.heart_rate > 120 or case.heart_rate < 50:
        score += 1

    if case.respiratory_rate > 24:
        score += 1

    if case.temperature > 38:
        score += 1

    if case.ed_visits_last_year >= 5:
        score += 1

    if score >= 5:
        level = "HIGH"
    elif score >= 3:
        level = "MODERATE"
    else:
        level = "LOW"

    return level, score