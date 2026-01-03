<script lang="ts">
  import { createQuery, useQueryClient } from '@tanstack/svelte-query';

  import { type Token } from '../../../../entities/Auth';
  import { getServiceContext } from '../../../contexts/ServiceContext';
  import Button from '../../../design-system/Button.svelte';
  import Input from '../../../design-system/Input.svelte';
  import Textarea from '../../../design-system/Textarea.svelte';
  import Checkbox from '../../../design-system/Checkbox.svelte';
  import Typography from '../../../design-system/Typography.svelte';

  export let token: Token;
  export let onClose: () => void;

  const { diaryService } = getServiceContext();
  const queryClient = useQueryClient();

  // let file: File | null = null;
  let question = '';
  let shortQuestion = '';
  let answers = '';
  let shortAnswers = '';
  let targetDailyClassTypes: Record<string, boolean> = {};
  let errorMessage = '';

  $: dailyClassTypesQuery = createQuery({
    queryKey: ['diaryService', 'getDailyClassTypes', token],
    queryFn: () => diaryService.getDailyClassTypes(token),
  });

  const onClickCreate = async () => {
    try {
      await diaryService.createQuestion(
        {
          question,
          shortQuestion,
          answers: answers.split('\n').map((answer) => answer.trim()),
          shortAnswers: shortAnswers.split('\n').map((answer) => answer.trim()),
          targetDailyClassTypes: Object.entries(targetDailyClassTypes)
            .filter(([_, value]) => value)
            .map(([key, _]) => key),
          active: true,
        },
        token,
      );
      await queryClient.invalidateQueries({ queryKey: ['diaryService'] });
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
      errorMessage = message;
    }
  };
</script>

<div class="dimmer">
  <div class="question">
    <Typography variant="subtitle">질문 추가하기</Typography>
    <Input required type="text" label="question" bind:value={question} />
    <Input required type="text" label="shortQuestion" bind:value={shortQuestion} />
    <Textarea required type="text" rows="5" label="answers (엔터로 구분)" bind:value={answers} />
    <Textarea required type="text" rows="5" label="shortAnswers (엔터로 구분)" bind:value={shortAnswers} />
    {#if $dailyClassTypesQuery.data}
      <div class="checkboxes">
        targetDailyClassTypes
        {#each $dailyClassTypesQuery.data as dailyClassType}
          <Checkbox
            label={dailyClassType.name}
            bind:checked={targetDailyClassTypes[dailyClassType.id]}
            type="checkbox"
          />
        {/each}
      </div>
    {/if}
    <Typography variant="code">{errorMessage}</Typography>
    <div class="buttons">
      <Button on:click={onClose} variant="third">취소</Button>
      <Button on:click={onClickCreate}>추가</Button>
    </div>
  </div>
</div>

<style>
  div.dimmer {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: var(--z-index-popup);
  }

  div.question {
    display: flex;
    flex-direction: column;
    gap: 30px;
    background: var(--color-bg-default);
    padding: 20px;
    border-radius: 12px;
    width: 600px;
    max-width: calc(100% - 40px);
    max-height: 700px;
    overflow: scroll;
  }

  .buttons {
    display: flex;
    gap: 20px;
    justify-content: flex-end;
  }
</style>
