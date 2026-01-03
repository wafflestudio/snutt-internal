<script lang="ts">
  import { createQuery, useQueryClient } from '@tanstack/svelte-query';

  import { type Token } from '../../../../entities/Auth';
  import { getServiceContext } from '../../../contexts/ServiceContext';
  import Button from '../../../design-system/Button.svelte';
  import Input from '../../../design-system/Input.svelte';
  import Typography from '../../../design-system/Typography.svelte';

  export let token: Token;
  export let onClose: () => void;

  const { diaryService } = getServiceContext();
  const queryClient = useQueryClient();

  let name = '';
  let errorMessage = '';

  const onClickCreate = async () => {
    try {
      await diaryService.createDailyClassType(
        {
          name,
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
    <Typography variant="subtitle">DailyClassType 추가하기</Typography>
    <Input required type="text" label="name" bind:value={name} />
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
