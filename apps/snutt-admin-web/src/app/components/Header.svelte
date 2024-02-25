<script lang="ts">
  import logo from '../../assets/logo.png';
  import { getEnvironmentContext } from '../contexts/EnvironmentContext';
  import Link from '../design-system/Link.svelte';

  const { APP_ENV } = getEnvironmentContext();
</script>

<header>
  <Link class="home-link" href="/">
    <img src={logo} class="logo" alt="logo" />
    <h1 class="home-title">SNUTT Admin</h1>
  </Link>
  <h1 class="env">{APP_ENV}</h1>
</header>

<style>
  header {
    width: 100%;
    background-color: var(--color-gray-20);
    display: flex;
    align-items: center;
    padding: 0 20px;
    justify-content: space-between;
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
