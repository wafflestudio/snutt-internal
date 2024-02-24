<script lang="ts">
  import './app.css';
  import './colors.css';
  import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
  import { Router, Route, link } from 'svelte-routing';
  import HomePage from './pages/HomePage/index.svelte';
  import ConfigPage from './pages/ConfigPage/index.svelte';
  import ConfigDetailPage from './pages/ConfigDetailPage/index.svelte';
  import NotFoundPage from './pages/NotFoundPage/index.svelte';
  import PushNotificationPage from './pages/PushNotificationPage/index.svelte';
  import { getEnvironmentContext } from './contexts/EnvironmentContext';
  import Header from './components/Header.svelte';

  const queryClient = new QueryClient();
</script>

<QueryClientProvider client={queryClient}>
  <Router>
    <Header />
    <div class="content">
      <nav>
        <p class="menuLabel">관리</p>
        <a class={'menuItem'} href="/config" use:link>컨피그</a>
        <a class={'menuItem'} href="/push-notification" use:link>푸시</a>
      </nav>
      <main>
        <Route path="/" component={HomePage} />
        <Route path="/config" component={ConfigPage} />
        <Route path="/config/:configName" component={ConfigDetailPage} />
        <Route path="/push-notification" component={PushNotificationPage} />
        <Route path="*" component={NotFoundPage} />
      </main>
    </div>
  </Router></QueryClientProvider
>

<style>
  .content {
    min-height: calc(100vh - 60px);
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

      & > .menuItem {
        display: flex;
        align-items: center;
        padding: 16px 28px;
        transition: background-color 0.1s linear;

        &:hover {
          background-color: var(--color-gray-30);
        }
      }
    }

    & > main {
      padding: 20px;
      flex: 1;
    }
  }
</style>
