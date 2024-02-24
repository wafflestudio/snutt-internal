<script lang="ts">
  import { getEnvironmentContext } from '../contexts/EnvironmentContext';
  import Button from '../design-system/Button.svelte';
  import ConfirmPopup from './ConfirmPopup.svelte';

  export let confirmTitle: string;
  export let confirmMessage: string;
  export let onConfirm: () => void;

  const { APP_ENV } = getEnvironmentContext();

  let isOpen = false;

  const onClickButton = () => {
    isOpen = true;
  };

  const onClickConfirm = () => {
    onConfirm();
    isOpen = false;
  };
</script>

<Button on:click={onClickButton} type="button" {...$$restProps}>
  <slot />
</Button>

<ConfirmPopup
  title={confirmTitle}
  description={confirmMessage}
  onConfirm={onClickConfirm}
  bind:isOpen
  type={APP_ENV === 'prod' ? 'complex' : 'basic'}
/>
