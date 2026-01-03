import type { CreateQuestionRequest, DailyClassType, Question } from '../entities/Diary';
import type { DiaryRepository } from '../repositories/DiaryRepository';

export type DiaryService = {
  getQuestions: (token: string) => Promise<Question[]>;
  createQuestion: (request: CreateQuestionRequest, token: string) => Promise<{ message: string }>;
  getDailyClassTypes: (token: string) => Promise<DailyClassType[]>;
  // createDailyClassType: (name: string) => Promise<void>;
  // deleteDailyClassType: (name: string) => Promise<void>;
};

export const createDiaryService = ({ diaryRepository }: { diaryRepository: DiaryRepository }): DiaryService => {
  return {
    getQuestions: (token: string) => diaryRepository.getQuestions(token),
    getDailyClassTypes: (token: string) => diaryRepository.getDailyClassTypes(token),
    createQuestion: (request: CreateQuestionRequest, token: string) => diaryRepository.createQuestion(request, token),
  };
};
