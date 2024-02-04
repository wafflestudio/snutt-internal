import { Member } from '@sf/entities';

import { ReleaseNoteRepository } from '../repositories/ReleaseNoteRepository';

export const implementGithubReleaseNoteRepository = ({
  owner,
  repository,
  tag,
  githubAuthToken,
}: {
  owner: string;
  repository: string;
  tag: string;
  githubAuthToken: string;
}): ReleaseNoteRepository => {
  return {
    getReleaseNote: async () => {
      // https://docs.github.com/en/rest/releases/releases?apiVersion=2022-11-28#get-a-release-by-tag-name
      const response = await fetch(`https://api.github.com/repos/${owner}/${repository}/releases/tags/${tag}`, {
        headers: {
          Authorization: `token ${githubAuthToken}`,
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
        },
      });

      const { url, body } = await response.json().then((data): { url: string; body: string } => {
        if (
          !data ||
          typeof data !== 'object' ||
          !('html_url' in data) ||
          !data.html_url ||
          typeof data.html_url !== 'string' ||
          !('body' in data) ||
          !data.body ||
          typeof data.body !== 'string'
        )
          throw new Error('Invalid response');
        return { url: data.html_url, body: data.body };
      });

      return {
        releaseUrl: url,
        changes: body
          .split('\n')
          .filter((line) => line.startsWith('*'))
          .map((line) => {
            const match = line.match(/\* (.*) by @(.*) in (.*)/);
            if (!match) throw new Error('Invalid line');
            const member = Object.entries(MEMBER_GITHUB_ID_MAP).find(
              ([, githubId]) => githubId === match[2],
            )?.[0] as Member;
            if (!member) throw new Error('Invalid member');
            return { content: match[1], member, detailUrl: match[3] };
          }),
      };
    },
  };
};

const MEMBER_GITHUB_ID_MAP: Record<Member, string> = {
  [Member.WOOHM402]: 'woohm402',
  [Member.SHP7724]: 'shp7724',
  [Member.JUTAK97]: 'JuTak97',
  [Member.DAVIN111]: 'davin111',
  [Member.HANK_CHOI]: 'Hank-Choi',
  [Member.ARS_KI_00]: 'ars-ki-00',
  [Member.JHVICTOR4]: 'jhvictor4',
  [Member.EASTSHINE2741]: 'eastshine2741',
  [Member.PENG_U_0807]: 'peng-u-0807',
  [Member.CHAEMIN2001]: 'chaemin2001',
  [Member.EUXXNIA]: 'euxxnia',
  [Member.SUBEENPARK_IO]: 'subeenpark-io',
};
