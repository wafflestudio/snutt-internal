<script lang="ts">
  import logo from '../../assets/logo.png';
  import { getEnvironmentContext } from '../contexts/EnvironmentContext';
  import Link from '../design-system/Link.svelte';
  import Typography from '../design-system/Typography.svelte';

  const { APP_ENV } = getEnvironmentContext();
</script>

<header>
  <Link class="home-link" href="/">
    <img src={logo} class="logo" alt="logo" />
    <Typography variant="title" class="home-title">SNUTT Admin</Typography>
  </Link>
  <Typography variant="subtitle">{APP_ENV}</Typography>
</header>

<style>
  header {
    width: 100%;
    background-color: var(--color-bg-accent);
    display: flex;
    align-items: center;
    padding: 0 20px;
    justify-content: space-between;
  }

  img.logo {
    width: 40px;
    height: 40px;
    margin-right: 10px;
  }
</style>
