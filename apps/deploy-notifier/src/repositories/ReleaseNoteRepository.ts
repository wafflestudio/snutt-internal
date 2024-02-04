import { Member } from '@sf/entities';

export type ReleaseNoteRepository = {
  getReleaseNote: () => Promise<{
    releaseUrl: string;
    changes: { member: Member; detailUrl: string; content: string }[];
  }>;
};
