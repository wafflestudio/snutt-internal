<script lang="ts">
  import { getServiceContext } from '../contexts/ServiceContext';

  const { screenService } = getServiceContext();

  $: theme = screenService.getCurrentTheme();

  const onChange = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    theme = nextTheme;
    screenService.setCurrentTheme(nextTheme);
  };
</script>

<div class="wrapper">
  <button on:click={onChange}>
    <span>🌞</span>
    <span>🌙</span>
    <div class="switch" style={theme === 'dark' ? 'transform: translateX(100%)' : undefined}></div>
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
    border: 2px solid var(--color-border-default);
    background-color: var(--color-bg-default);
    cursor: pointer;
    position: relative;
  }

  button:hover {
    opacity: 0.8;
  }

  span {
    width: 20px;
    height: 20px;
  }

  div.switch {
    position: absolute;
    width: 50%;
    border-radius: 50%;
    background-color: var(--color-bg-default);
    top: 0;
    bottom: 0;
    height: 100%;
    left: 0;
    transition:
      transform 0.2s,
      background-color 0.2s;
  }
</style>
