<script lang="ts">
  import { link } from 'svelte-routing';

  export let href: string;
</script>

<a {href} {...$$restProps} use:link><slot /></a>

<style>
  a {
    display: flex;
    align-items: center;
    padding: 10px 20px;
    transition:
      background-color 0.2s ease-in-out,
      opacity 0.2s ease-in-out;
  }

  a:hover {
    background-color: var(--color-gray-20);
  }

  a:active {
    opacity: 0.5;
  }
</style>
