export type Question = {
  id: string;
  question: string;
  shortQuestion: string;
  answers: string[];
  shortAnswers: string[];
  targetDailyClassTypeIds: string[];
  active: boolean;
};

export type CreateQuestionRequest = {
  question: string;
  shortQuestion: string;
  answers: string[];
  shortAnswers: string[];
  targetDailyClassTypes: string[];
  active: boolean;
};

export type DailyClassType = {
  id: string;
  name: string;
  active: boolean;
};
