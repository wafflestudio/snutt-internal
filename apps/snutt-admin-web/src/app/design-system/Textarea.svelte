<script lang="ts">
  import Typography from './Typography.svelte';

  export let value: string | undefined;
  export let label: string;
  export let required = false;
</script>

<label class="my-custom-textarea">
  <div>
    <Typography variant="body">{label}</Typography><span style="color: red;">{required ? '*' : ''}</span>
  </div>
  <textarea bind:value {required} {...$$restProps} />
</label>

<style>
  label.my-custom-textarea {
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex: 1;
  }

  span {
    font-size: 14px;
  }

  label.my-custom-textarea > textarea {
    background: var(--color-bg-default);
    border: 1px solid var(--color-border-default);
    padding-inline: 12px;
    border-radius: 4px;
    color: var(--color-text-default);
    width: 100%;
    padding-top: 5px;
  }

  label.my-custom-textarea > textarea:hover {
    opacity: 0.8;
  }
</style>
