import type { SnuttBackend } from '@si/snutt-backend';
import type { DiaryRepository } from '../repositories/DiaryRepository';
import type { CreateQuestionRequest } from '../entities/Diary';

export const createDiaryRepository = ({ snuttBackend }: { snuttBackend: SnuttBackend }): DiaryRepository => {
  return {
    getQuestions: (token: string) => snuttBackend.http.get['/v1/admin/diary/questions']({ token }),
    getDailyClassTypes: (token: string) => snuttBackend.http.get['/v1/admin/diary/dailyClassTypes']({ token }),
    createQuestion: (request: CreateQuestionRequest, token: string) =>
      snuttBackend.http.post['/v1/admin/diary/questions']({ body: request, token }),
  };
};
