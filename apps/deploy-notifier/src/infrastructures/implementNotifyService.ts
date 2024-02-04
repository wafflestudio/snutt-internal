import { MessengerPresenter } from '@sf/adapters';

import { ReleaseNoteRepository } from '../repositories/ReleaseNoteRepository';
import { NotifyService } from '../services/NotifyService';

export const implementNotifyService = ({
  releaseNoteRepository,
  messengerPresenter,
  title,
}: {
  releaseNoteRepository: ReleaseNoteRepository;
  messengerPresenter: MessengerPresenter;
  title: string;
}): NotifyService => {
  return {
    notifyFromReleaseNote: async () => {
      const releaseNote = await releaseNoteRepository.getReleaseNote();
      await messengerPresenter.sendThread(({ formatBold, formatLink, formatMemberMention }) =>
        [
          `${formatBold(title)} (${formatLink('release', { url: releaseNote.releaseUrl })})`,
          '',
          ...releaseNote.changes.map(({ member, content }) => {
            return `- ${content} ${formatMemberMention(member)}`;
          }),
        ].join('\n'),
      );
    },
  };
};
