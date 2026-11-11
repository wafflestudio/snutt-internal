export type MailLogType = 'VERIFICATION' | 'PASSWORD_RESET' | 'FIND_ID';

export type MailLogStatus = 'PENDING' | 'SENT' | 'SUPPRESSED' | 'FAILED' | 'THROTTLED' | 'NO_ACCOUNT' | 'NO_EMAIL';

export const MAIL_LOG_TYPE_LABEL: Record<MailLogType, string> = {
  VERIFICATION: '이메일 인증',
  PASSWORD_RESET: '비밀번호 재설정',
  FIND_ID: '아이디 찾기',
};

export const MAIL_LOG_STATUS_LABEL: Record<MailLogStatus, string> = {
  PENDING: '결과 미확인',
  SENT: '발송',
  SUPPRESSED: '수신 거부',
  FAILED: '실패',
  THROTTLED: '재요청 제한',
  NO_ACCOUNT: '계정 없음',
  NO_EMAIL: '이메일 없음',
};

export type MailLogQuery = { email: string } | { localId: string };

export type AdminMailLog = {
  id: string;
  type: MailLogType;
  status: MailLogStatus;
  email: string | null;
  requestedLocalId: string | null;
  subject: string | null;
  body: string | null;
  errorMessage: string | null;
  createdAt: number;
  updatedAt: number;
};
