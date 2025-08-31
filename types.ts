
export interface TechnicalTerm {
  term: string;
  definition: string;
}

export interface Situation {
  currentScore: string;
  downAndDistance: string;
  fieldPosition: string;
  quarterAndTime: string;
}

export interface PreSnapAnalysis {
  offensiveFormation: string;
  defensiveFormation: string;
}

export interface ExecutionDetails {
    QB?: string;
    OLine?: string;
    'O-Line'?: string; // Handle variations from model
    ReceiversTEs?: string;
    'Receivers/TEs'?: string;
    RunningBack?: string;
    DLine?: string;
    'D-Line'?: string;
    Linebackers?: string;
    Secondary?: string;
}


export interface Breakdown {
  inferredPlayCall: string;
  executionDetails: ExecutionDetails;
}

export interface PlayAnalysis {
  playNumber: number;
  title: string;
  timestampedLink: string;
  situation: Situation;
  preSnapAnalysis: PreSnapAnalysis;
  offensiveBreakdown: Breakdown;
  defensiveBreakdown: Breakdown;
  keyToSuccessOrFailure: string;
  outcome: string;
  technicalTerms: TechnicalTerm[];
}

export interface AnalysisResponse {
  plays: PlayAnalysis[];
}


export type AnalysisResult = PlayAnalysis[];
