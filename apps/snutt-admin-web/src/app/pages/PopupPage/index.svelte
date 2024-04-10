<script lang="ts">
  import { createQuery } from '@tanstack/svelte-query';

  import type { Token } from '../../../entities/Auth';
  import { getServiceContext } from '../../contexts/ServiceContext';
  import Button from '../../design-system/Button.svelte';
  import Paper from '../../design-system/Paper.svelte';
  import Typography from '../../design-system/Typography.svelte';
  import CreatePopupPopup from './CreatePopupPopup/index.svelte';

  export let token: Token;

  const { popupService } = getServiceContext();

  let isCreatePopupOpen = false;

  $: popupQuery = createQuery({
    queryKey: ['PopupService', 'getCurrentPopups'],
    queryFn: () => popupService.getCurrentPopups(),
  });
</script>

<div>
  <header class="header">
    <Typography variant="subtitle">현재 팝업 목록</Typography>
    <Button on:click={() => (isCreatePopupOpen = true)}>추가하기</Button>
  </header>
  <section class="currentPopups">
    {#if $popupQuery.data}
      {#each $popupQuery.data as popup}
        <Paper class="popupItem">
          <Typography variant="body">key: {popup.key}</Typography>
          <Typography variant="body">hiddenDays: {popup.hiddenDays}</Typography>
          <img class="popupImage" src={popup.url} alt={popup.key} />
        </Paper>
      {/each}
    {/if}
  </section>
  {#if isCreatePopupOpen}
    <CreatePopupPopup {token} onClose={() => (isCreatePopupOpen = false)} />
  {/if}
</div>

<style>
  header.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  section.currentPopups {
    margin-top: 20px;
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
  }

  :global(.popupItem) {
    width: 300px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }

  img.popupImage {
    width: 100%;
    object-fit: contain;
  }
</style>
