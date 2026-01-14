import type { SnuttBackend } from '@si/snutt-backend';
import type { DiaryRepository } from '../repositories/DiaryRepository';
import type { CreateDailyClassTypeRequest, CreateQuestionRequest } from '../entities/Diary';

export const createDiaryRepository = ({ snuttBackend }: { snuttBackend: SnuttBackend }): DiaryRepository => {
  return {
    getQuestions: (token: string) => snuttBackend.http.get['/v1/admin/diary/questions']({ token }),
    createQuestion: (request: CreateQuestionRequest, token: string) =>
      snuttBackend.http.post['/v1/admin/diary/questions']({ body: request, token }),
    getDailyClassTypes: (token: string) => snuttBackend.http.get['/v1/admin/diary/dailyClassTypes']({ token }),
    createDailyClassType: (param: CreateDailyClassTypeRequest, token: string) =>
      snuttBackend.http.post['/v1/admin/diary/dailyClassTypes']({ param, token }),
    deleteDailyClassType: (name: string, token: string) =>
      snuttBackend.http.delete['/v1/admin/diary/dailyClassTypes']({ name, token }),
  };
};
