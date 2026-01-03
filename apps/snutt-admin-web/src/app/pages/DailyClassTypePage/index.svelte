<script lang="ts">
  import { createQuery, useQueryClient } from '@tanstack/svelte-query';

  import type { Token } from '../../../entities/Auth';
  import { getServiceContext } from '../../contexts/ServiceContext';
  import Button from '../../design-system/Button.svelte';
  import Paper from '../../design-system/Paper.svelte';
  import Typography from '../../design-system/Typography.svelte';
  // import type { DailyClassType } from '../../../entities/Diary';
  import CreateDailyClassTypePopup from './CreateDailyClassTypePopup/index.svelte';
  import ConfirmRequiredButton from '../../components/ConfirmRequiredButton.svelte';

  export let token: Token;

  const { diaryService } = getServiceContext();
  const queryClient = useQueryClient();

  let isCreateQuestionOpen = false;

  $: dailyClassTypesQuery = createQuery({
    queryKey: ['diaryService', 'getDailyClassTypes', token],
    queryFn: () =>
      diaryService
        .getDailyClassTypes(token)
        .then((dailyClassTypes) => dailyClassTypes.sort((first, _) => (first.active === false ? 1 : -1))),
  });

  const onClickDelete = async (name: string) => {
    try {
      await diaryService.deleteDailyClassType(name, token);
      queryClient.invalidateQueries({ queryKey: ['PopupService'] });
    } catch (err) {}
  };
</script>

<div>
  <header class="header">
    <Typography variant="subtitle">현재 질문 목록</Typography>
    <Button on:click={() => (isCreateQuestionOpen = true)}>추가하기</Button>
  </header>
  <section class="dailyClassTypes">
    {#if $dailyClassTypesQuery.data}
      {#each $dailyClassTypesQuery.data as dailyClassType}
        <Paper class="dailyClassType">
          <Typography variant="body">id: {dailyClassType.id}</Typography>
          <Typography variant="body">name: {dailyClassType.name}</Typography>
          <Typography variant="body">active: {dailyClassType.active}</Typography>
          {#if dailyClassType.active == true}
            <ConfirmRequiredButton
              confirmTitle={`${dailyClassType.name} 제거`}
              confirmMessage="이 작업은 되돌릴 수 없습니다."
              variant="danger"
              onConfirm={() => onClickDelete(dailyClassType.name)}
            >
              제거하기
            </ConfirmRequiredButton>
          {/if}
        </Paper>
      {/each}
    {/if}
  </section>
  {#if isCreateQuestionOpen}
    <CreateDailyClassTypePopup {token} onClose={() => (isCreateQuestionOpen = false)} />
  {/if}
</div>

<style>
  header.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  section.dailyClassTypes {
    margin-top: 20px;
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
  }

  :global(.dailyClassType) {
    min-width: 400px;
    width: 40%;
    display: flex;
    flex-direction: column;
    /* white-space: ; */
    /* align-items: center; */
    gap: 4px;
    white-space: pre-wrap;
  }
</style>
