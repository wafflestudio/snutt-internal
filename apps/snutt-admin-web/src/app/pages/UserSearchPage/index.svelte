<script lang="ts">
  import { createMutation } from '@tanstack/svelte-query';

  import type { Token } from '../../../entities/Auth';
  import { AUTH_PROVIDER_LABEL } from '../../../entities/User';
  import { getServiceContext } from '../../contexts/ServiceContext';
  import Button from '../../design-system/Button.svelte';
  import Input from '../../design-system/Input.svelte';
  import Paper from '../../design-system/Paper.svelte';
  import Typography from '../../design-system/Typography.svelte';

  export let token: Token;

  const { userService } = getServiceContext();

  let email = '';

  const mutation = createMutation({
    mutationFn: (req: { email: string }) => userService.searchUsersByEmail({ email: req.email, token }),
  });

  $: isValid = email.trim().length > 0 && !$mutation.isPending;

  const onSubmit = () => isValid && $mutation.mutate({ email });

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleString();
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
        <div class="cards">
          {#each $mutation.data as user (user.id)}
            <Paper class="userCard">
              <Typography variant="body">id: {user.id}</Typography>
              <Typography variant="body"
                >email: {user.email ?? '-'} (verified: {user.isEmailVerified ?? false})</Typography
              >
              <Typography variant="body">nickname: {user.nickname}</Typography>
              <Typography variant="body">localId: {user.localId ?? '-'}</Typography>
              <Typography variant="body">active: {user.active}</Typography>
              <Typography variant="body">isAdmin: {user.isAdmin}</Typography>
              <Typography variant="body">가입일: {formatDate(user.regDate)}</Typography>
              <Typography variant="body"
                >최근 로그인: {formatDate(new Date(user.lastLoginTimestamp).toISOString())}</Typography
              >
              <Typography variant="body">
                로그인 수단:
                {#if user.authProviders.length === 0}
                  (없음)
                {:else}
                  {user.authProviders.map((p) => AUTH_PROVIDER_LABEL[p]).join(', ')}
                {/if}
              </Typography>
              <details>
                <summary>소셜 계정 상세</summary>
                <Typography variant="body">google: {user.socialAccounts.googleEmail ?? '-'}</Typography>
                <Typography variant="body">kakao: {user.socialAccounts.kakaoEmail ?? '-'}</Typography>
                <Typography variant="body">apple: {user.socialAccounts.appleEmail ?? '-'}</Typography>
                <Typography variant="body">facebook name: {user.socialAccounts.facebookName ?? '-'}</Typography>
              </details>
            </Paper>
          {/each}
        </div>
      {/if}
    {:else}
      <Typography variant="body"
        >이메일을 입력해 유저를 검색하세요. (대소문자 정확히 일치해야 함, 비활성 유저 포함)</Typography
      >
    {/if}
  </section>
</div>

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

  div.cards {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
  }

  :global(.userCard) {
    min-width: 400px;
    width: 45%;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  details > summary {
    cursor: pointer;
    margin-top: 8px;
    font-size: 14px;
    color: var(--color-text-default);
  }
</style>
