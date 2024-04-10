<script lang="ts">
  import { createQuery } from '@tanstack/svelte-query';

  import { getServiceContext } from '../../contexts/ServiceContext';
  import Paper from '../../design-system/Paper.svelte';
  import Typography from '../../design-system/Typography.svelte';

  const { popupService } = getServiceContext();

  $: popupQuery = createQuery({
    queryKey: ['PopupService', 'getCurrentPopups'],
    queryFn: () => popupService.getCurrentPopups(),
  });
</script>

<div class="wrapper">
  {#if $popupQuery.data}
    {#each $popupQuery.data as popup}
      <Paper class="popupItem">
        <Typography variant="body">key: {popup.key}</Typography>
        <Typography variant="body">hiddenDays: {popup.hiddenDays}</Typography>
        <img class="popupImage" src={popup.url} alt={popup.key} />
      </Paper>
    {/each}
  {/if}
</div>

<style>
  :global(.popupItem) {
    width: 400px;
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
