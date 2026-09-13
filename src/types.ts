export interface Mistake {
  id: string;
  year: string;
  textType: string;
  questionNum: string;
  questionType: string;
  myAnswer: string;
  correctAnswer: string;
  myThoughtProcess: string;
  coreWeakness: string;
}

export interface ExamMaterial {
  id: string;
  year: string;
  fileName: string;
  content: string;
}

export interface AnalysisResponse {
  id: string;
  timestamp: number;
  analysis: string;
  mistakeCount: number;
  years?: string[];
}
