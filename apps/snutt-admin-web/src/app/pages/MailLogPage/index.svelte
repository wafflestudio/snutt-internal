<script lang="ts">
  import { createMutation } from '@tanstack/svelte-query';

  import type { Token } from '../../../entities/Auth';
  import { MAIL_LOG_STATUS_LABEL, MAIL_LOG_TYPE_LABEL, type MailLogQuery } from '../../../entities/MailLog';
  import { getEnvironmentContext } from '../../contexts/EnvironmentContext';
  import { getServiceContext } from '../../contexts/ServiceContext';
  import Button from '../../design-system/Button.svelte';
  import Input from '../../design-system/Input.svelte';
  import Select from '../../design-system/Select.svelte';
  import Typography from '../../design-system/Typography.svelte';

  export let token: Token;

  const { userService } = getServiceContext();
  const { APP_ENV } = getEnvironmentContext();

  let searchBy: 'email' | 'localId' = 'email';
  let keyword = '';
  let openLogId: string | null = null;

  const mutation = createMutation({
    mutationFn: (query: MailLogQuery) => userService.searchMailLogs({ query, token }),
  });

  $: isValid = keyword.trim().length > 0 && !$mutation.isPending;

  const onSubmit = () => {
    if (!isValid) return;
    openLogId = null;
    $mutation.mutate(searchBy === 'email' ? { email: keyword } : { localId: keyword });
  };

  const toggleLog = (logId: string) => {
    openLogId = openLogId === logId ? null : logId;
  };

  const formatDate = (epochMillis: number) => {
    const d = new Date(epochMillis);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  };
</script>

<div class="wrapper">
  <header class="header">
    <Typography variant="subtitle">메일 발송 기록</Typography>
  </header>

  {#if APP_ENV === 'prod'}
    <Typography variant="body"
      >운영 환경에서는 아직 지원하지 않습니다. 운영 서버에 메일 발송 기록 API가 아직 없습니다.</Typography
    >
  {:else}
    <form on:submit|preventDefault={onSubmit}>
      <div class="search-row">
        <Select
          label="검색 기준"
          bind:value={searchBy}
          values={[
            { value: 'email', label: '이메일' },
            { value: 'localId', label: '아이디' },
          ]}
        />
        <Input
          required
          label={searchBy === 'email' ? '이메일' : '아이디'}
          bind:value={keyword}
          placeholder={searchBy === 'email' ? 'example@snu.ac.kr' : 'snuttuser'}
        />
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
          <Typography variant="body">기록이 없습니다.</Typography>
        {:else}
          <Typography variant="body">{$mutation.data.length}건 검색됨</Typography>
          <div class="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>요청 시각</th>
                  <th>종류</th>
                  <th>결과</th>
                  <th>이메일</th>
                  <th>요청 아이디</th>
                  <th>제목</th>
                  <th>내용</th>
                </tr>
              </thead>
              <tbody>
                {#each $mutation.data as log (log.id)}
                  <tr>
                    <td class="nowrap">{formatDate(log.createdAt)}</td>
                    <td class="nowrap">{MAIL_LOG_TYPE_LABEL[log.type]}</td>
                    <td class="nowrap">
                      <span
                        class="badge"
                        class:sent={log.status === 'SENT'}
                        class:failed={log.status === 'FAILED'}
                        class:pending={log.status === 'PENDING'}
                      >
                        {MAIL_LOG_STATUS_LABEL[log.status]}
                      </span>
                    </td>
                    <td>{log.email ?? '-'}</td>
                    <td class="mono">{log.requestedLocalId ?? '-'}</td>
                    <td>{log.subject ?? '-'}</td>
                    <td>
                      {#if log.body || log.errorMessage}
                        <button class="detail-toggle" type="button" on:click={() => toggleLog(log.id)}>
                          {openLogId === log.id ? '닫기' : '보기'}
                        </button>
                      {:else}
                        -
                      {/if}
                    </td>
                  </tr>
                  {#if openLogId === log.id}
                    <tr>
                      <td colspan="7">
                        <div class="detail-content">
                          {#if log.errorMessage}
                            <pre class="error">{log.errorMessage}</pre>
                          {/if}
                          {#if log.body}
                            <iframe title="메일 본문" sandbox="" srcdoc={log.body} />
                          {/if}
                        </div>
                      </td>
                    </tr>
                  {/if}
                {/each}
              </tbody>
            </table>
          </div>
        {/if}
      {:else}
        <Typography variant="body"
          >이메일 또는 아이디로 최근 30일간의 이메일 인증·비밀번호 재설정·아이디 찾기 요청 기록을 검색하세요. 아이디
          검색은 아이디로 비밀번호 재설정을 요청한 기록만 찾습니다.</Typography
        >
      {/if}
    </section>
  {/if}
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
    padding: 1px 5px;
    border-radius: 4px;
    font-size: 11px;
    background: #e2e3e5;
    color: #383d41;
  }

  span.badge.sent {
    background: #d4edda;
    color: #155724;
  }

  span.badge.failed {
    background: #f8d7da;
    color: #721c24;
  }

  span.badge.pending {
    background: #fff3cd;
    color: #856404;
  }

  button.detail-toggle {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    font-size: 13px;
    color: var(--color-text-default);
    text-decoration: underline;
  }

  div.detail-content {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  pre.error {
    margin: 0;
    white-space: pre-wrap;
    word-break: break-all;
    font-size: 12px;
    color: var(--color-text-default);
  }

  iframe {
    width: 100%;
    height: 360px;
    border: 1px solid var(--color-border, #e0e0e0);
    border-radius: 4px;
    background: #fff;
  }
</style>
