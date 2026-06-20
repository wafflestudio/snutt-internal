<script lang="ts">
  import { createMutation } from '@tanstack/svelte-query';

  import type { Token } from '../../../entities/Auth';
  import { AUTH_PROVIDER_LABEL } from '../../../entities/User';
  import { getServiceContext } from '../../contexts/ServiceContext';
  import Button from '../../design-system/Button.svelte';
  import Input from '../../design-system/Input.svelte';
  import Typography from '../../design-system/Typography.svelte';

  export let token: Token;

  const { userService } = getServiceContext();

  let email = '';

  const mutation = createMutation({
    mutationFn: (req: { email: string }) => userService.searchUsersByEmail({ email: req.email, token }),
  });

  $: isValid = email.trim().length > 0 && !$mutation.isPending;

  const onSubmit = () => isValid && $mutation.mutate({ email });

  let openSocialId: string | null = null;
  let popupTop = 0;
  let popupLeft = 0;
  let popupFlip = false;

  const toggleSocial = (e: MouseEvent, userId: string) => {
    if (openSocialId === userId) {
      openSocialId = null;
      return;
    }
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    popupFlip = window.innerHeight - rect.bottom < 120;
    popupTop = popupFlip ? rect.top : rect.bottom + 4;
    popupLeft = rect.left;
    openSocialId = userId;
  };

  const closePopup = () => {
    openSocialId = null;
  };

  const formatDate = (iso: string) => {
    try {
      const d = new Date(iso);
      const pad = (n: number) => String(n).padStart(2, '0');
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    } catch {
      return iso;
    }
  };
</script>

<div class="wrapper">
  <header class="header">
    <Typography variant="subtitle">유저 검색</Typography>
  </header>

  <form on:submit|preventDefault={onSubmit}>
    <div class="search-row">
      <Input required label="이메일" bind:value={email} placeholder="example@snu.ac.kr" />
      <Button type="submit" disabled={!isValid}>검색</Button>
    </div>
  </form>

  <section class="results">
    {#if $mutation.isPending}
      <Typography variant="body">검색 중...</Typography>
    {:else if $mutation.isError}
      <Typography variant="body">검색 실패: {String($mutation.error)}</Typography>
    {:else if $mutation.data}
      {#if $mutation.data.length === 0}
        <Typography variant="body">일치하는 유저가 없습니다.</Typography>
      {:else}
        <Typography variant="body">{$mutation.data.length}건 검색됨</Typography>
        <div class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>이메일</th>
                <th>인증 여부</th>
                <th>닉네임</th>
                <th>localId</th>
                <th>활성</th>
                <th>관리자</th>
                <th>로그인 수단</th>
                <th>소셜 계정</th>
                <th>가입일</th>
                <th>최근 로그인</th>
              </tr>
            </thead>
            <tbody>
              {#each $mutation.data as user (user.id)}
                <tr>
                  <td class="mono">{user.id}</td>
                  <td>{user.email ?? '-'}</td>
                  <td>
                    {#if user.isEmailVerified == null}
                      -
                    {:else}
                      <span
                        class="badge"
                        class:verified={user.isEmailVerified}
                        class:unverified={!user.isEmailVerified}
                      >
                        {user.isEmailVerified ? '인증' : '미인증'}
                      </span>
                    {/if}
                  </td>
                  <td>{user.nickname}</td>
                  <td class="mono">{user.localId ?? '-'}</td>
                  <td>{user.active ? '활성' : '비활성'}</td>
                  <td>{user.isAdmin ? '예' : '아니오'}</td>
                  <td>
                    {#if user.authProviders.length === 0}
                      (없음)
                    {:else}
                      {user.authProviders.map((p) => AUTH_PROVIDER_LABEL[p]).join(', ')}
                    {/if}
                  </td>
                  <td>
                    <button class="social-toggle" on:click|stopPropagation={(e) => toggleSocial(e, user.id)}>
                      상세
                    </button>
                  </td>
                  <td class="nowrap">{formatDate(user.regDate)}</td>
                  <td class="nowrap">{formatDate(new Date(user.lastLoginTimestamp).toISOString())}</td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {/if}
    {:else}
      <Typography variant="body"
        >이메일을 입력해 유저를 검색하세요. (대소문자 정확히 일치해야 함, 비활성 유저 포함)</Typography
      >
    {/if}
  </section>
</div>

<svelte:body on:click={closePopup} />

{#if openSocialId}
  {@const user = $mutation.data?.find((u) => u.id === openSocialId)}
  {#if user}
    <div
      class="social-popup"
      class:flip={popupFlip}
      style="top:{popupTop}px;left:{popupLeft}px"
      on:click|stopPropagation
    >
      <ul class="social-list">
        <li>google: {user.socialAccounts.googleEmail ?? '-'}</li>
        <li>kakao: {user.socialAccounts.kakaoEmail ?? '-'}</li>
        <li>apple: {user.socialAccounts.appleEmail ?? '-'}</li>
        <li>facebook: {user.socialAccounts.facebookName ?? '-'}</li>
      </ul>
    </div>
  {/if}
{/if}

<style>
  div.wrapper {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  header.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  form > .search-row {
    display: flex;
    gap: 12px;
    align-items: flex-end;
  }

  section.results {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  div.table-wrapper {
    overflow-x: auto;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
  }

  th {
    text-align: left;
    padding: 8px 12px;
    border-bottom: 2px solid var(--color-border, #e0e0e0);
    white-space: nowrap;
    color: var(--color-text-default);
    font-weight: 600;
  }

  td {
    padding: 8px 12px;
    border-bottom: 1px solid var(--color-border, #e0e0e0);
    vertical-align: top;
    color: var(--color-text-default);
  }

  tr:last-child td {
    border-bottom: none;
  }

  td.mono {
    font-family: monospace;
    font-size: 12px;
    word-break: break-all;
  }

  td.nowrap {
    white-space: nowrap;
  }

  span.badge {
    display: inline-block;
    margin-left: 4px;
    padding: 1px 5px;
    border-radius: 4px;
    font-size: 11px;
  }

  span.badge.verified {
    background: #d4edda;
    color: #155724;
  }

  span.badge.unverified {
    background: #f8d7da;
    color: #721c24;
  }

  button.social-toggle {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    font-size: 13px;
    color: var(--color-text-default);
    text-decoration: underline;
  }

  :global(div.social-popup) {
    position: fixed;
    z-index: 1000;
    background: var(--color-surface, #fff);
    border: 1px solid var(--color-border, #e0e0e0);
    border-radius: 6px;
    padding: 8px 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    white-space: nowrap;
  }

  :global(div.social-popup.flip) {
    transform: translateY(-100%);
  }

  :global(ul.social-list) {
    margin: 0;
    padding: 0;
    font-size: 12px;
    list-style: none;
  }

  :global(ul.social-list li + li) {
    margin-top: 4px;
  }
</style>
