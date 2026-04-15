export interface NewCaseForm {
  // Demographics
  name?: string;
  age?: number;
  nationalId?: string;

  // Visit Characteristics
  walkedIn: string;
  edVisitsLastYear?: number;
  hospitalizationsLastYear?: number;
  hospitalizationsLast90Days: number;
  
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

  // Comorbidity Profile
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

export type CaseResult = {
  case_id: number;
  created_at: string;

  decision: "HOSPITALIZATION" | "DISCHARGE" | "DILEMMA";
  argument_type: "PRIORITY" | "DEFEATER" | "DILEMMA";
  confidence: number;

  hospitalization_score: number;
  discharge_score: number;

  supporting_rules: string[];
  opposing_rules: string[];

  input: {
    age?: number;
    heart_rate?: number;
    spo2?: number;
    triage_score?: number;
    [key: string]: unknown;
  };
};
