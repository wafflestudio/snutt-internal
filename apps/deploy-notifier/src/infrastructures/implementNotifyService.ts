import { MessengerPresenter } from '@sf/adapters';

import { ReleaseNoteRepository } from '../repositories/ReleaseNoteRepository';
import { NotifyService } from '../services/NotifyService';

export const implementNotifyService = ({
  releaseNoteRepository,
  messengerPresenter,
  serviceName,
}: {
  releaseNoteRepository: ReleaseNoteRepository;
  messengerPresenter: MessengerPresenter;
  serviceName: string;
}): NotifyService => {
  return {
    notifyFromReleaseNote: async () => {
      const releaseNote = await releaseNoteRepository.getReleaseNote();
      await messengerPresenter.sendThread(({ formatBold, formatLink, formatMemberMention }) =>
        [
          `${formatBold(serviceName)} (${formatLink('release', { url: releaseNote.releaseUrl })})`,
          '',
          ...releaseNote.changes.map(({ member, content }) => {
            return `- ${content} ${formatMemberMention(member)}`;
          }),
        ].join('\n'),
      );
    },
  };
};
