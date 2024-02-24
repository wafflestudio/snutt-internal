<script lang="ts">
  import { link } from 'svelte-routing';

  import logo from '../../assets/logo.png';
  import { getEnvironmentContext } from '../contexts/EnvironmentContext';

  const { APP_ENV } = getEnvironmentContext();
</script>

<header>
  <a class="home-link" href="/" use:link>
    <img src={logo} class="logo" alt="logo" />
    <h1 class="home-title">SNUTT Admin</h1>
  </a>
  <h1 class="env">{APP_ENV}</h1>
</header>

<style>
  header {
    height: 60px;
    width: 100%;
    background-color: var(--color-gray-20);
    display: flex;
    align-items: center;
    padding: 0 20px;
    justify-content: space-between;
  }

  a.home-link {
    display: flex;
    align-items: center;
  }

  h1.home-title {
    font-size: 20px;
    margin-left: 10px;
  }

  img.logo {
    width: 40px;
    height: 40px;
  }

  h1.env {
    font-size: 20px;
    color: var(--color-gray-50);
  }
</style>
