<script lang="ts">
  export let variant: 'primary' | 'third' | 'danger' = 'primary';
</script>

<button on:click {...$$restProps} class="{variant} {$$restProps.class}"><slot /></button>

<style>
  button {
    height: 40px;
    border: 1px solid white;
    padding: 8px 24px;
    border-radius: 8px;
    cursor: pointer;
    transition:
      background 0.2s ease-in-out,
      opacity 0.2s ease-in-out;
  }

  button.primary {
    background: #eb8f58;
  }

  button.third {
    background: #898989;
  }

  button.danger {
    background: #e74c3c;
  }

  button:hover {
    opacity: 0.8;
  }

  button:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
</style>
