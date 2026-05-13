export type AuthProvider = 'LOCAL' | 'FACEBOOK' | 'GOOGLE' | 'KAKAO' | 'APPLE';

export const AUTH_PROVIDER_LABEL: Record<AuthProvider, string> = {
  LOCAL: '아이디/비밀번호',
  FACEBOOK: '페이스북',
  GOOGLE: '구글',
  KAKAO: '카카오',
  APPLE: '애플',
};

export type AdminUserSearchResult = {
  id: string;
  email: string | null;
  isEmailVerified: boolean | null;
  nickname: string;
  localId: string | null;
  isAdmin: boolean;
  active: boolean;
  regDate: string;
  lastLoginTimestamp: number;
  authProviders: AuthProvider[];
  socialAccounts: {
    googleEmail: string | null;
    kakaoEmail: string | null;
    appleEmail: string | null;
    facebookName: string | null;
  };
};
