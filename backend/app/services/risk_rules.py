from .clinical_features import build_categorized_features


def evaluate_decision(data):
    print("RAW DATA:", data)
    f = build_categorized_features(data)
    print("CATEGORIZED FEATURES:", f)
    
    h_score = 0
    d_score = 0
    h_rules = []
    d_rules = []

    if f.age_cat > 0 and f.triage_cat > 2:
        h_score += 2
        h_rules.append("Middle-aged or older patient with less urgent/non-urgent triage")

    if f.walk_in_cat == 0 and f.age_cat > 0:
        h_score += 1
        h_rules.append("Older patient arriving not as walk-in")

    if f.cart_cat > 0 and f.triage_cat > 2:
        h_score += 2
        h_rules.append("Elevated CART with less urgent/non-urgent triage")

    if f.cci_cat > 0 and f.triage_cat > 2:
        h_score += 2
        h_rules.append("Comorbidity burden with less urgent/non-urgent triage")

    if f.news_cat > 0 and f.triage_cat > 2:
        h_score += 2
        h_rules.append("Elevated NEWS with less urgent/non-urgent triage")

    if f.cart_cat <= 1 and f.hosp_90d_cat <= 0 and f.triage_cat <= 2:
        d_score += 2
        d_rules.append("Low CART, no recent hospitalization, and higher-acuity triage profile")

    if f.walk_in_cat == 1 and f.cart_cat <= 0 and f.hosp_365d_cat <= 1:
        d_score += 2
        d_rules.append("Walk-in, very low CART, and limited hospitalizations last year")

    if f.walk_in_cat == 1 and f.hosp_90d_cat <= 0 and f.triage_cat <= 2:
        d_score += 2
        d_rules.append("Walk-in, no recent hospitalization, and higher-acuity triage profile")

    if f.cci_cat <= 0 and f.triage_cat <= 2:
        d_score += 2
        d_rules.append("No comorbidities with higher-acuity triage profile")

    if f.triage_cat <= 1:
        d_score += 2
        d_rules.append("Resuscitation or emergent triage rule for discharge group")

    total = h_score + d_score + 1e-5
    confidence = max(h_score, d_score) / total

    if h_score > d_score:
        decision = "HOSPITALIZATION"
    elif d_score > h_score:
        decision = "DISCHARGE"
    else:
        decision = "DILEMMA"

    if decision == "DILEMMA":
        argument_type = "DILEMMA"
    elif confidence > 0.6:
        argument_type = "PRIORITY"
    elif confidence < 0.4:
        argument_type = "DEFEATER"
    else:
        argument_type = "DILEMMA"

    print("H_SCORE:", h_score)
    print("D_SCORE:", d_score)
    print("H_RULES:", h_rules)
    print("D_RULES:", d_rules)
    print("DECISION:", decision)
    print("CONFIDENCE:", confidence)

    return {
        "decision": decision,
        "argument_type": argument_type,
        "confidence": round(confidence, 2),
        "hospitalization_score": h_score,
        "discharge_score": d_score,
        "supporting_rules": h_rules if decision == "HOSPITALIZATION" else d_rules,
        "opposing_rules": d_rules if decision == "HOSPITALIZATION" else h_rules,
        "derived_features": {
            "age_cat": f.age_cat,
            "triage_cat": f.triage_cat,
            "walk_in_cat": f.walk_in_cat,
            "hosp_365d_cat": f.hosp_365d_cat,
            "hosp_90d_cat": f.hosp_90d_cat,
            "ed_365d_cat": f.ed_365d_cat,
            "cci_raw": f.cci_raw,
            "cci_cat": f.cci_cat,
            "news_raw": f.news_raw,
            "news_cat": f.news_cat,
            "cart_raw": f.cart_raw,
            "cart_cat": f.cart_cat,
            "spo2_cat": f.spo2_cat,
            "temperature_cat": f.temperature_cat,
            "pain_cat": f.pain_cat,
        },
    }