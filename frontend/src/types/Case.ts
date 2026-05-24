export interface NewCaseForm {
  // Demographics
  name?: string;
  age?: number;
  nationalId?: string;

  // Visit Characteristics
  walkedIn: string;
  edVisitsLastYear?: number;
  hospitalizationsLastYear?: number;
  hospitalizationsLast90Days?: number;

  // Symptoms
  fever?: boolean;
  headache?: boolean;
  abdominalPain?: boolean;

  // Pain
  painScale?: number;

  // Vitals
  respiratoryRate?: number;
  heartRate?: number;
  systolicBP?: number;
  diastolicBP?: number;
  spo2?: number;
  temperature?: number;

  // Triage
  triageScore?: number;

  // Comorbidities
  mi: boolean;
  chf: boolean;
  pvd: boolean;
  cvd: boolean;
  dem: boolean;
  cpd: boolean;
  pud: boolean;
  rheu: boolean;
  liv1: boolean;
  liv2: boolean;
  dm1: boolean;
  dm2: boolean;
  paralysis: boolean;
  renal: boolean;
  malignancy: boolean;
  mets: boolean;
  hiv: boolean;
}

export interface CaseInput {
  // Demographics
  name?: string;
  age?: number;
  national_id?: string;

  // Visit Characteristics
  walked_in?: string;
  ed_visits_last_year?: number;
  hospitalizations_last_year?: number;
  hospitalizations_last_90_days?: number;

  // Symptoms
  fever?: boolean;
  headache?: boolean;
  abdominal_pain?: boolean;

  // Pain
  pain_scale?: number;

  // Vitals
  respiratory_rate?: number;
  heart_rate?: number;
  systolic_bp?: number;
  diastolic_bp?: number;
  spo2?: number;
  temperature?: number;

  // Triage
  triage_score?: number;

  // Comorbidities
  mi?: boolean;
  chf?: boolean;
  pvd?: boolean;
  cvd?: boolean;
  dem?: boolean;
  cpd?: boolean;
  pud?: boolean;
  rheu?: boolean;
  liv1?: boolean;
  liv2?: boolean;
  dm1?: boolean;
  dm2?: boolean;
  paralysis?: boolean;
  renal?: boolean;
  malignancy?: boolean;
  mets?: boolean;
  hiv?: boolean;
}

export type CaseResult = {
  case_id: number;
  patient_id?: string;
  created_at: string;

  decision: "HOSPITALIZATION" | "DISCHARGE" | "DILEMMA";
  argument_type: "PRIORITY" | "DEFEATER" | "DILEMMA";
  confidence: number;

  hospitalization_score: number;
  discharge_score: number;

  supporting_rules: string[];
  opposing_rules: string[];

  explanation_text: string;

  input: CaseInput;

  derived_features: {
    age_cat: number;
    triage_cat: number;
    walk_in_cat: number;
    hosp_365d_cat: number;
    hosp_90d_cat: number;
    ed_365d_cat: number;

    cci_raw: number;
    cci_cat: number;

    news_raw: number;
    news_cat: number;

    cart_raw: number;
    cart_cat: number;

    spo2_cat: number;
    temperature_cat: number;
    pain_cat: number;
  }
};