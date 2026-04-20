from .clinical_features import build_categorized_features


def evaluate_decision(data):
    print("RAW DATA:", data)

    f = build_categorized_features(data)

    print("CATEGORIZED FEATURES:", f)

    h_score = 0
    d_score = 0

    h_rules = []
    d_rules = []

    # =====================================================
    # TRIAGE SCALE
    # 0 = Non-Urgent
    # 1 = Less Urgent
    # 2 = Urgent
    # 3 = Emergent
    # 4 = Resuscitation
    # =====================================================

    # =====================================================
    # HOSPITALIZATION RULES
    # =====================================================

    # Critical triage
    if f.triage_cat >= 3:
        h_score += 3
        h_rules.append("Emergent or resuscitation triage level")

    # Urgent triage (moderate push)
    if f.triage_cat == 2:
        h_score += 1
        h_rules.append("Urgent triage level")

    # Age + acute presentation
    if f.age_cat > 0 and f.triage_cat >= 2:
        h_score += 2
        h_rules.append("Older patient with elevated triage severity")

    # High CART
    if f.cart_cat > 0 and f.triage_cat >= 2:
        h_score += 2
        h_rules.append("Elevated CART risk score")

    # High NEWS
    if f.news_cat > 0 and f.triage_cat >= 2:
        h_score += 2
        h_rules.append("Elevated NEWS warning score")

    # Comorbidity burden
    if f.cci_cat > 0:
        h_score += 2
        h_rules.append("Relevant comorbidity burden")

    # Not walk-in + older
    if f.walk_in_cat == 0 and f.age_cat > 0:
        h_score += 1
        h_rules.append("Older patient arriving by ambulance / assisted transport")

    # Recent admissions
    if f.hosp_90d_cat > 0:
        h_score += 2
        h_rules.append("Recent hospitalization history")

    # Repeated admissions
    if f.hosp_365d_cat == 2:
        h_score += 1
        h_rules.append("Multiple hospitalizations in past year")

    elif f.hosp_365d_cat >= 3:
        h_score += 1
        h_rules.append("Frequent hospitalizations in past year")
        
    # Hypoxia
    if f.spo2_cat == 0:
        h_score += 3
        h_rules.append("Low oxygen saturation")

    # Fever severe
    if f.temperature_cat >= 3:
        h_score += 1
        h_rules.append("Abnormal temperature")

    # Severe pain
    if f.pain_cat >= 2:
        h_score += 1
        h_rules.append("Moderate to severe pain")

    # =====================================================
    # DISCHARGE RULES
    # =====================================================

    # Low triage
    if f.triage_cat <= 1:
        d_score += 3
        d_rules.append("Low acuity triage level")

    # Walk in + stable
    if f.walk_in_cat == 1 and f.triage_cat <= 1:
        d_score += 2
        d_rules.append("Walk-in presentation with low acuity")

    # No comorbidities
    if f.cci_cat == 0:
        d_score += 2
        d_rules.append("No significant comorbidities")

    # No recent admissions
    if f.hosp_90d_cat == 0:
        d_score += 1
        d_rules.append("No hospitalization in past 90 days")

    # Limited yearly admissions
    if f.hosp_365d_cat <= 1:
        d_score += 1
        d_rules.append("Limited hospitalizations in past year")

    # Low NEWS
    if f.news_cat == 0:
        d_score += 2
        d_rules.append("Low NEWS warning score")

    # Low CART
    if f.cart_cat == 0:
        d_score += 2
        d_rules.append("Low CART risk score")

    # Normal oxygen
    if f.spo2_cat >= 1:
        d_score += 1
        d_rules.append("Acceptable oxygen saturation")

    # Normal temperature
    if f.temperature_cat == 2:
        d_score += 1
        d_rules.append("Normal temperature")

    # Mild / no pain
    if f.pain_cat <= 1:
        d_score += 1
        d_rules.append("No or mild pain")

    # =====================================================
    # FINAL DECISION
    # =====================================================

    total = h_score + d_score + 0.00001
    confidence = max(h_score, d_score) / total

    if h_score > d_score:
        decision = "HOSPITALIZATION"
    elif d_score > h_score:
        decision = "DISCHARGE"
    else:
        decision = "DILEMMA"

    # =====================================================
    # ARGUMENT TYPE
    # =====================================================

    has_opposition = len(h_rules) > 0 and len(d_rules) > 0

    if decision == "DILEMMA":
        argument_type = "DILEMMA"

    elif has_opposition:
        if confidence >= 0.65:
            argument_type = "PRIORITY"
        else:
            argument_type = "DEFEATER"
    else:
        argument_type = "PRIORITY"

    # =====================================================
    # OUTPUT
    # =====================================================

    def format_rules(items):
        if not items:
            return "None"

        return "\n".join(
            [f"{i+1}. {rule}" for i, rule in enumerate(items)]
        )


    # winning side rules
    supporting = h_rules if decision == "HOSPITALIZATION" else d_rules

    # losing side rules
    opposing = d_rules if decision == "HOSPITALIZATION" else h_rules

    support_text = format_rules(supporting)
    oppose_text = format_rules(opposing)

    opposite = "DISCHARGE" if decision == "HOSPITALIZATION" else "HOSPITALIZATION"
    exception_reason = None
    
    if decision == "DILEMMA":
        explanation_text = (
            f"This case is in dilemma.\n\n"
            f"The following reasons support Hospitalization:\n"
            f"{format_rules(h_rules)}\n\n"
            f"while the following reasons support Discharge:\n"
            f"{format_rules(d_rules)}\n\n"
            f"Final decision should be taken by the doctor."
        )

    elif argument_type == "PRIORITY" and len(opposing) > 0:
        explanation_text = (
            f"Decision is {decision} because of the following reasons:\n"
            f"{support_text}\n\n"
            f"even though the following reasons would suggest {opposite}:\n"
            f"{oppose_text}"
        )

    elif argument_type == "DEFEATER" and len(opposing) > 0:
        explanation_text = (
            f"Despite the fact that these reasons support {opposite}:\n"
            f"{oppose_text}\n\n"
            f"final decision is {decision} because the following reasons that support this hold greater importance:\n"
            f"{support_text}"
        )

    elif len(opposing) > 0:
        if exception_reason:
            explanation_text = (
                f"Despite the fact that these reasons support {opposite}:\n"
                f"{oppose_text}\n\n"
                f"the final decision is {decision} because {exception_reason}."
            )
        else:
            explanation_text = (
                f"Despite the fact that these reasons support {opposite}:\n"
                f"{oppose_text}\n\n"
                f"the final decision is {decision} because the above reasons are generally weak for this specific context."
            )

    else:
        explanation_text = (
            f"Decision is {decision} because of the following reasons:\n"
            f"{support_text}"
        )
        
    return {
        "decision": decision,
        "argument_type": argument_type,
        "confidence": round(confidence, 2),

        "hospitalization_score": h_score,
        "discharge_score": d_score,

        "supporting_rules": supporting,
        "opposing_rules": opposing,

        "explanation_text": explanation_text,
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