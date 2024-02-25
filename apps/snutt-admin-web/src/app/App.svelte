<script lang="ts">
  import './app.css';
  import './colors.css';

  import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
  import { Route, Router } from 'svelte-routing';

  import type { Token } from '../entities/Auth';
  import Header from './components/Header.svelte';
  import Link from './design-system/Link.svelte';
  import ConfigDetailPage from './pages/ConfigDetailPage/index.svelte';
  import ConfigPage from './pages/ConfigPage/index.svelte';
  import HomePage from './pages/HomePage/index.svelte';
  import LoginPage from './pages/LoginPage/index.svelte';
  import NotFoundPage from './pages/NotFoundPage/index.svelte';
  import PushNotificationPage from './pages/PushNotificationPage/index.svelte';

  const queryClient = new QueryClient();

  let token: Token | null = null;
</script>

<QueryClientProvider client={queryClient}>
  {#if token !== null}
    <Router>
      <Header />
      <div class="content">
        <nav>
          <p class="menuLabel">관리</p>
          <Link class={'menuItem'} href="/config">컨피그</Link>
          <Link class={'menuItem'} href="/push-notification">푸시</Link>
        </nav>
        <main>
          <Route path="/"><HomePage /></Route>
          <Route path="/config"><ConfigPage /></Route>
          <Route path="/config/:configName" let:params>
            <ConfigDetailPage configName={params.configName} {token} />
          </Route>
          <Route path="/push-notification"><PushNotificationPage {token} /></Route>
          <Route path="*"><NotFoundPage /></Route>
        </main>
      </div>
    </Router>
  {:else}
    <LoginPage bind:token />
  {/if}
</QueryClientProvider>

<style>
  .content {
    flex: 1;
    display: flex;

    & > nav {
      width: 200px;
      background-color: var(--color-gray-30);
      border-right: 1px solid var(--color-gray-10);
      box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);

      & > .menuLabel {
        margin: 30px 28px 10px;
        font-size: 12px;
        color: var(--color-gray-50);
      }
    }

    & > main {
      padding: 20px;
      flex: 1;
    }
  }
</style>
