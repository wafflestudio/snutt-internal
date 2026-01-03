<script lang="ts">
  import { createQuery, useQueryClient } from '@tanstack/svelte-query';

  import type { Token } from '../../../entities/Auth';
  import { getServiceContext } from '../../contexts/ServiceContext';
  import Button from '../../design-system/Button.svelte';
  import Paper from '../../design-system/Paper.svelte';
  import Typography from '../../design-system/Typography.svelte';
  import type { DailyClassType } from '../../../entities/Diary';
  import CreateQuestionPopup from './CreateQuestionPopup/index.svelte';

  export let token: Token;

  const { diaryService } = getServiceContext();

  let isCreateQuestionOpen = false;

  $: questionsQuery = createQuery({
    queryKey: ['diaryService', 'getQuestions', token],
    queryFn: () => diaryService.getQuestions(token),
  });

  $: dailyClassTypesQeury = createQuery({
    queryKey: ['diaryService', 'getDailyClassTypes', token],
    queryFn: () =>
      diaryService.getDailyClassTypes(token).then((dailyClassTypes) => {
        return dailyClassTypes.reduce(
          (dailyClassTypeMap, dailyClassType) => {
            dailyClassTypeMap[dailyClassType.id] = dailyClassType;
            return dailyClassTypeMap;
          },
          {} as Record<string, DailyClassType>,
        );
      }),
  });

  // const onClickDelete = async (id: string) => {
  //   try {
  //     await popupService.deletePopup({ id, token });
  //     queryClient.invalidateQueries({ queryKey: ['PopupService'] });
  //   } catch (err) {}
  // };
</script>

<div>
  <header class="header">
    <Typography variant="subtitle">현재 질문 목록</Typography>
    <Button on:click={() => (isCreateQuestionOpen = true)}>추가하기</Button>
  </header>
  <section class="currentQuestions">
    {#if $questionsQuery.data}
      {#each $questionsQuery.data as question}
        <Paper class="questionItem">
          <Typography variant="body">id: {question.id}</Typography>
          <Typography variant="body">question: {question.question}</Typography>
          <Typography variant="body">shortQuestion: {question.shortQuestion}</Typography>
          <Typography variant="body">
            answers:<br />{#each question.answers as answer}- {answer}<br />{/each}
          </Typography>
          <Typography variant="body">
            shortAnswers:<br />{#each question.shortAnswers as shortAnswer}- {shortAnswer}<br />{/each}
          </Typography>
          {#if $dailyClassTypesQeury.data}
            <Typography variant="body">
              targetDailyClassTypeIds:<br />{#each question.targetDailyClassTypeIds as targetDailyClassTypeId}- {$dailyClassTypesQeury
                  .data[targetDailyClassTypeId]}<br />{/each}
            </Typography>
          {/if}
          <Typography variant="body">active: {question.active}</Typography>
        </Paper>
      {/each}
    {/if}
  </section>
  {#if isCreateQuestionOpen}
    <CreateQuestionPopup {token} onClose={() => (isCreateQuestionOpen = false)} />
  {/if}
</div>

<style>
  header.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  section.currentQuestions {
    margin-top: 20px;
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
  }

  :global(.questionItem) {
    min-width: 400px;
    width: 40%;
    display: flex;
    flex-direction: column;
    /* white-space: ; */
    /* align-items: center; */
    gap: 20px;
    white-space: pre-wrap;
  }
</style>
