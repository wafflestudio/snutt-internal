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
    color: var(--color-text-default);
  }

  a:hover {
    opacity: 0.6;
  }

  a:active {
    opacity: 0.2;
  }
</style>
