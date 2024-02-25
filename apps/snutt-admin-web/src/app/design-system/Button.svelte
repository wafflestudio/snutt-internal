<script lang="ts">
  export let variant: 'primary' | 'third' | 'danger' = 'primary';
</script>

<button on:click {...$$restProps} class="{variant} {$$restProps.class}"><slot /></button>

<style>
  button {
    height: 40px;
    border: 1px solid var(--color-border-default);
    padding: 8px 24px;
    border-radius: 8px;
    cursor: pointer;
    color: var(--color-text-default);
  }

  button.primary {
    background: var(--color-bg-primary);
  }

  button.third {
    background: var(--color-bg-third);
  }

  button.danger {
    background: #e74c3c;
  }

  button:not(:disabled):hover {
    opacity: 0.8;
  }

  button:disabled {
    background: var(--color-bg-disabled);
    cursor: not-allowed;
  }
</style>
