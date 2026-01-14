import type { CreateDailyClassTypeRequest, CreateQuestionRequest, DailyClassType, Question } from '../entities/Diary';

export type DiaryRepository = {
  getQuestions: (token: string) => Promise<Question[]>;
  createQuestion: (request: CreateQuestionRequest, token: string) => Promise<{ message: string }>;
  getDailyClassTypes: (token: string) => Promise<DailyClassType[]>;
  createDailyClassType: (param: CreateDailyClassTypeRequest, token: string) => Promise<void>;
  deleteDailyClassType: (name: string, token: string) => Promise<void>;
};
