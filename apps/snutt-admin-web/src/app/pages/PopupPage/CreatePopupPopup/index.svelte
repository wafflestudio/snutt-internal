<script lang="ts">
  import { useQueryClient } from '@tanstack/svelte-query';

  import { type Token } from '../../../../entities/Auth';
  import { getServiceContext } from '../../../contexts/ServiceContext';
  import Button from '../../../design-system/Button.svelte';
  import Input from '../../../design-system/Input.svelte';
  import Typography from '../../../design-system/Typography.svelte';

  export let token: Token;
  export let onClose: () => void;

  const { popupService } = getServiceContext();
  const queryClient = useQueryClient();

  let file: File | null = null;
  let key = '';
  let hiddenDays = '';
  let errorMessage = '';

  const onChangeFileInput = (e: Event) => {
    const target = e.target as HTMLInputElement;
    file = target.files?.[0] ?? null;
  };

  const onClickCreate = async () => {
    try {
      await popupService.createPopup({ key, hiddenDays, file, token });
      await queryClient.invalidateQueries({ queryKey: ['PopupService'] });
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
      errorMessage = message;
    }
  };
</script>

<div class="dimmer">
  <div class="popup">
    <Typography variant="subtitle">팝업 추가하기</Typography>
    <Input required type="text" label="key" bind:value={key} />
    <Input required type="text" label="hiddenDays" bind:value={hiddenDays} />
    <div class="upload">
      <Typography variant="body">이미지</Typography>
      <label class="upload">
        <input type="file" accept="image/*" on:change={onChangeFileInput} />
        {#if file}
          <img class="preview-image" src={URL.createObjectURL(file)} alt="팝업 이미지" />
        {/if}
      </label>
    </div>
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

  div.popup {
    display: flex;
    flex-direction: column;
    gap: 30px;
    background: var(--color-bg-default);
    padding: 20px;
    border-radius: 12px;
    width: 400px;
    max-width: calc(100% - 40px);
  }

  div.upload {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  label.upload {
    background: var(--color-bg-accent);
    width: 100%;
    height: 300px;
    overflow: hidden;
    display: flex;
    align-items: center;
    cursor: pointer;
  }

  label.upload:hover {
    background: var(--color-bg-third);
  }

  label.upload input {
    display: none;
  }

  img.preview-image {
    width: 100%;
  }

  .buttons {
    display: flex;
    gap: 20px;
    justify-content: flex-end;
  }
</style>
