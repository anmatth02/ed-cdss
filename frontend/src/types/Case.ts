export interface NewCaseForm {
  // Demographics
  name?: string;
  age?: number;
  nationalId?: string;
  
  // Visit Characteristics
  walkedIn: string;
  edVisitsLastYear?: number;
  hospitalizationsLastYear?: number;

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
  triage_score: number;
  heart_rate: number;
  spo2: number;
  risk_level: "LOW" | "MODERATE" | "HIGH";
  risk_score: number;
  rules_fired: string[];
  input: any;
};