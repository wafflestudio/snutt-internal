import type { CreateQuestionRequest, DailyClassType, Question } from '../entities/Diary';

export type DiaryRepository = {
  getQuestions: (token: string) => Promise<Question[]>;
  createQuestion: (request: CreateQuestionRequest, token: string) => Promise<{ message: string }>;
  getDailyClassTypes: (token: string) => Promise<DailyClassType[]>;
  // createDailyClassType: (name: string) => Promise<void>;
  // deleteDailyClassType: (name: string) => Promise<void>;
};
