<script lang="ts">
  import Typography from './Typography.svelte';

  export let value: string | undefined;
  export let values: { value: string; label: string }[];
  export let label: string;
  export let required = false;
</script>

<label class="my-custom-input">
  <div>
    <Typography variant="body">{label}</Typography><span style="color: red;">{required ? '*' : ''}</span>
  </div>
  <select {required} bind:value>
    {#each values as { value, label }}
      <option {value}>{label}</option>
    {/each}
  </select>
</label>

<style>
  label.my-custom-input {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  label.my-custom-input > select {
    background: var(--color-bg-default);
    height: 40px;
    border: 1px solid var(--color-border-default);
    padding-inline: 12px;
    border-radius: 4px;
    cursor: pointer;
  }

  label.my-custom-input > select:hover {
    opacity: 0.8;
  }

  select {
    color: var(--color-text-default);
  }
</style>
