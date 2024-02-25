<script lang="ts">
  import Typography from './Typography.svelte';

  export let value: string | undefined;
  export let label: string;
  export let required = false;
</script>

<label class="my-custom-input">
  <div>
    <Typography variant="body">{label}</Typography><span style="color: red;">{required ? '*' : ''}</span>
  </div>
  <input bind:value {required} {...$$restProps} />
</label>

<style>
  label.my-custom-input {
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex: 1;
  }

  span {
    font-size: 14px;
  }

  label.my-custom-input > input {
    background-color: var(--color-bg-default);
    height: 40px;
    border: 1px solid var(--color-border-default);
    padding-inline: 12px;
    border-radius: 4px;
    color: var(--color-text-default);
    width: 100%;
  }

  label.my-custom-input > input:hover {
    opacity: 0.8;
  }
</style>
