<script lang="ts">
  import { getRandomString } from '@sf/utils';

  import Button from '../design-system/Button.svelte';
  import Input from '../design-system/Input.svelte';

  export let type: 'basic' | 'complex';

  export let isOpen: boolean;
  export let title: string;
  export let description: string;
  export let onConfirm: () => void;
  let confirmValue = '';
  const confirmString = getRandomString(6);

  const onClose = () => {
    isOpen = false;
  };

  const onKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  };
</script>

{#if isOpen}
  <div class="dimmer" on:click={onClose} on:keydown={onKeydown} aria-label="dimmer" tabindex="0" role="button">
    <div class="popup" on:click|stopPropagation on:keydown={onKeydown} aria-label="popup" tabindex="0" role="button">
      <h3>{title}</h3>
      <p>{description}</p>
      <div class="confirmBox">
        {#if type === 'complex'}
          <Input
            bind:value={confirmValue}
            label="아래 확인 문자열을 따라 입력하세요"
            placeholder="따라 입력하세요"
            hideLabel
          />
          <pre>{confirmString}</pre>
        {/if}
      </div>
      <div class="buttons">
        <Button class="cancel" on:click={onClose} variant="third">취소</Button>
        <Button class="confirm" on:click={onConfirm}>확인</Button>
      </div>
    </div>
  </div>
{/if}

<style>
  div.dimmer {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  div.popup {
    width: 300px;
    background-color: var(--color-gray-30);
    padding: 20px;
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  h3 {
    font-size: 24px;
    font-weight: bold;
  }

  p {
    font-size: 16px;
  }

  div.confirmBox {
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex: 1;
    justify-content: center;
    height: 200px;
  }

  pre {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  div.buttons {
    display: flex;
    gap: 10px;
    justify-content: space-between;
  }

  div.buttons > :global(.cancel),
  div.buttons > :global(.confirm) {
    flex: 1;
  }
</style>
