<script lang="ts">
  import type { Theme } from '../../entities/Screen';
  import { getServiceContext } from '../contexts/ServiceContext';

  const { screenService } = getServiceContext();

  $: theme = screenService.getCurrentTheme();

  const items: Theme[] = ['light', 'dark', 'neon'];

  const onChange = () => {
    const nextTheme = items[(items.findIndex((t) => t === theme) + 1) % items.length];
    theme = nextTheme;
    screenService.setCurrentTheme(nextTheme);
  };
</script>

<div class="wrapper">
  <button on:click={onChange}>
    <span style={theme !== 'light' ? 'transform: translateY(200%);' : undefined}>🌞</span>
    <span style={theme !== 'dark' ? 'transform: translateY(200%);' : undefined}>🌙</span>
    <span style={theme !== 'neon' ? 'transform: translateY(200%);' : undefined}>💥</span>
  </button>
</div>

<style>
  div.wrapper {
    position: fixed;
    left: 20px;
    bottom: 20px;
  }

  button {
    display: flex;
    gap: 10px;
    padding: 4px 8px;
    border-radius: 16px;
    border: 2px solid var(--color-border-accent);
    background: var(--color-bg-accent);
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  button:hover {
    opacity: 0.8;
  }

  span {
    width: 20px;
    height: 20px;
  }
</style>
