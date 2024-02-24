<script lang="ts">
</script>

<button {...$$restProps}><slot /></button>

<style>
  button {
    background: #eb8f58;
    height: 40px;
    border: 1px solid white;
    padding: 8px 24px;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.2s ease-in-out;
  }

  button:hover {
    background: #d07642;
  }

  button:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
</style>
