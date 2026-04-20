from dataclasses import dataclass


@dataclass
class CategorizedFeatures:
    age_cat: int
    triage_cat: int
    walk_in_cat: int
    hosp_365d_cat: int
    hosp_90d_cat: int
    ed_365d_cat: int
    cci_raw: int
    cci_cat: int
    news_raw: int
    news_cat: int
    cart_raw: int
    cart_cat: int
    spo2_cat: int
    temperature_cat: int
    pain_cat: int
    abdominal_pain_cat: int
    fever_cat: int
    headache_cat: int


def categorize_age(age: int) -> int:
    if age <= 34:
        return 0
    if age <= 54:
        return 1
    if age <= 74:
        return 2
    return 3


def categorize_walk_in(walked_in: str) -> int:
    if str(walked_in).strip().lower() == "yes":
        return 1
    return 0

def categorize_hosp_365d(n: int) -> int:
    if n <= 0:
        return 0
    if n == 1:
        return 1
    if 2 <= n <= 3:
        return 2
    if 4 <= n <= 10:
        return 3
    return 4

def categorize_hosp_90d(n: int) -> int:
    if n <= 0:
        return 0
    if n == 1:
        return 1
    if 2 <= n <= 3:
        return 2
    if 4 <= n <= 5:
        return 3
    return 4


def categorize_ed_365d(n: int) -> int:
    if n <= 0:
        return 0
    if n == 1:
        return 1
    if 2 <= n <= 3:
        return 2
    if 4 <= n <= 5:
        return 3
    return 4


def categorize_triage(triage_score: int) -> int:
    """
    Expected paper encoding:
    0: Resuscitation
    1: Emergent
    2: Urgent
    3: Less Urgent
    4: Non-Urgent

    If your UI already sends 0..4, this returns the same value.
    If your UI sends 1..5, convert it to 0..4 first in frontend or here.
    """
    if triage_score < 0:
        return 0
    if triage_score > 4:
        return 4
    return triage_score


def categorize_spo2(spo2: int) -> int:
    if spo2 < 90:
        return 0
    if spo2 <= 94:
        return 1
    return 2


def categorize_temperature(temp: float) -> int:
    if temp < 35:
        return 0
    if temp <= 36:
        return 1
    if temp <= 37.5:
        return 2
    if temp <= 38.5:
        return 3
    return 4


def categorize_pain(pain: int) -> int:
    if pain <= 0:
        return 0
    if pain <= 3:
        return 1
    if pain <= 6:
        return 2
    return 3


def compute_cci(data) -> int:
    age = int(getattr(data, "age", 0))

    if age < 50:
        age_score = 0
    elif age <= 59:
        age_score = 1
    elif age <= 69:
        age_score = 2
    elif age <= 79:
        age_score = 3
    else:
        age_score = 4

    score = age_score
    score += 1 if getattr(data, "mi", False) else 0
    score += 1 if getattr(data, "chf", False) else 0
    score += 1 if getattr(data, "pvd", False) else 0
    score += 1 if getattr(data, "cvd", False) else 0
    score += 1 if getattr(data, "dem", False) else 0
    score += 1 if getattr(data, "cpd", False) else 0
    score += 1 if getattr(data, "pud", False) else 0
    score += 1 if getattr(data, "rheu", False) else 0
    score += 1 if getattr(data, "liv1", False) else 0
    score += 3 if getattr(data, "liv2", False) else 0
    score += 1 if getattr(data, "dm1", False) else 0
    score += 2 if getattr(data, "dm2", False) else 0
    score += 2 if getattr(data, "paralysis", False) else 0
    score += 2 if getattr(data, "renal", False) else 0
    score += 2 if getattr(data, "malignancy", False) else 0
    score += 6 if getattr(data, "mets", False) else 0
    score += 6 if getattr(data, "hiv", False) else 0

    return score

def categorize_cci(cci: int) -> int:
    if cci == 0:
        return 0
    if 1 <= cci <= 3:
        return 1
    if 4 <= cci <= 6:
        return 2
    return 3

def compute_news(data) -> int:
    r = int(getattr(data, "respiratory_rate", 0))
    s = int(getattr(data, "spo2", 0))
    t = float(getattr(data, "temperature", 0))
    p = int(getattr(data, "systolic_bp", 0))
    h = int(getattr(data, "heart_rate", 0))

    # Respiratory rate
    if r <= 8:
        n1 = 3
    elif r <= 11:
        n1 = 1
    elif r <= 20:
        n1 = 0
    elif r <= 24:
        n1 = 2
    else:
        n1 = 3

    # SpO2
    if s <= 91:
        n2 = 3
    elif s <= 93:
        n2 = 2
    elif s <= 95:
        n2 = 1
    else:
        n2 = 0

    # Temperature
    if t <= 35:
        n3 = 3
    elif t <= 36:
        n3 = 1
    elif t <= 38:
        n3 = 0
    elif t <= 39:
        n3 = 1
    else:
        n3 = 2

    # Systolic BP
    if p <= 90:
        n4 = 3
    elif p <= 100:
        n4 = 2
    elif p <= 110:
        n4 = 1
    elif p <= 219:
        n4 = 0
    else:
        n4 = 3

    # Heart rate
    if h <= 40:
        n5 = 3
    elif h <= 50:
        n5 = 1
    elif h <= 90:
        n5 = 0
    elif h <= 110:
        n5 = 1
    elif h <= 130:
        n5 = 2
    else:
        n5 = 3

    return n1 + n2 + n3 + n4 + n5


def categorize_news(news: int) -> int:
    if news <= 2:
        return 0
    if news <= 4:
        return 1
    return 2


def compute_cart(data) -> int:
    age = int(getattr(data, "age", 0))
    r = int(getattr(data, "respiratory_rate", 0))
    h = int(getattr(data, "heart_rate", 0))
    d = int(getattr(data, "diastolic_bp", 0))

    # Age
    if age < 55:
        a_score = 0
    elif age <= 69:
        a_score = 4
    else:
        a_score = 9

    # Respiratory rate
    if r < 21:
        r_score = 0
    elif r <= 23:
        r_score = 8
    elif r <= 25:
        r_score = 12
    elif r <= 29:
        r_score = 15
    else:
        r_score = 22

    # Heart rate
    if h < 110:
        h_score = 0
    elif h <= 139:
        h_score = 4
    else:
        h_score = 13

    # Diastolic BP
    if d > 49:
        d_score = 0
    elif d >= 40:
        d_score = 4
    elif d >= 35:
        d_score = 6
    else:
        d_score = 13

    return a_score + r_score + h_score + d_score


def categorize_cart(cart: int) -> int:
    if cart == 0:
        return 0
    if 1 <= cart <= 4:
        return 1
    if 5 <= cart <= 9:
        return 2
    return 3


def build_categorized_features(data) -> CategorizedFeatures:
    cci_raw = compute_cci(data)
    news_raw = compute_news(data)
    cart_raw = compute_cart(data)

    return CategorizedFeatures(
        age_cat=categorize_age(int(getattr(data, "age", 0))),
        triage_cat=categorize_triage(int(getattr(data, "triage_score", 0))),
        walk_in_cat=categorize_walk_in(str(getattr(data, "walked_in", "No"))),
        hosp_365d_cat=categorize_hosp_365d(int(getattr(data, "hospitalizations_last_year", 0))),
        hosp_90d_cat=categorize_hosp_90d(
            int(getattr(data, "hospitalizations_last_90_days", 0))
        ),
        ed_365d_cat=categorize_ed_365d(int(getattr(data, "ed_visits_last_year", 0))),
        cci_raw=cci_raw,
        cci_cat=categorize_cci(cci_raw),
        news_raw=news_raw,
        news_cat=categorize_news(news_raw),
        cart_raw=cart_raw,
        cart_cat=categorize_cart(cart_raw),
        spo2_cat=categorize_spo2(int(getattr(data, "spo2", 0))),
        temperature_cat=categorize_temperature(float(getattr(data, "temperature", 0))),
        pain_cat=categorize_pain(int(getattr(data, "pain_scale", 0))),
        abdominal_pain_cat=1 if getattr(data, "abdominal_pain", False) else 0,
        fever_cat=1 if getattr(data, "fever", False) else 0,
        headache_cat=1 if getattr(data, "headache", False) else 0,
    )