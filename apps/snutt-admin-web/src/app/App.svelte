<script lang="ts">
  import './theme.css';
  import './app.css';
  import './zIndex.css';

  import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
  import { Route, Router } from 'svelte-routing';

  import type { Token } from '../entities/Auth';
  import Header from './components/Header.svelte';
  import ThemeToggle from './components/ThemeToggle.svelte';
  import { getServiceContext } from './contexts/ServiceContext';
  import Link from './design-system/Link.svelte';
  import ConfigDetailPage from './pages/ConfigDetailPage/index.svelte';
  import ConfigPage from './pages/ConfigPage/index.svelte';
  import HomePage from './pages/HomePage/index.svelte';
  import LoginPage from './pages/LoginPage/index.svelte';
  import NotFoundPage from './pages/NotFoundPage/index.svelte';
  import PopupPage from './pages/PopupPage/index.svelte';
  import DiaryPage from './pages/DiaryPage/index.svelte';
  import DailyClassTypePage from './pages/DailyClassTypePage/index.svelte';
  import PushNotificationPage from './pages/PushNotificationPage/index.svelte';

  const queryClient = new QueryClient();
  const { authService } = getServiceContext();

  let token: Token | null = authService.autoLogin.enabled ? authService.autoLogin.initialToken : null;

  const onLogout = () => {
    authService.logout();
    token = null;
  };

  const onLogin = (loginToken: Token) => {
    token = loginToken;
  };
</script>

<QueryClientProvider client={queryClient}>
  {#if token !== null}
    <Router>
      <Header {onLogout} />
      <div class="content">
        <nav>
          <p class="menuLabel">관리</p>
          <Link class={'menuItem'} href="/config">컨피그</Link>
          <Link class={'menuItem'} href="/push-notification">푸시</Link>
          <Link class={'menuItem'} href="/popup">팝업</Link>
          <Link class={'menuItem'} href="/diary">강의일기장 질문</Link>
          <Link class={'menuItem'} href="/daily-class-type">Daily Class Type</Link>
        </nav>
        <main>
          <Route path="/"><HomePage /></Route>
          <Route path="/config"><ConfigPage /></Route>
          <Route path="/config/:configName" let:params>
            <ConfigDetailPage configName={params.configName} {token} />
          </Route>
          <Route path="/push-notification"><PushNotificationPage {token} /></Route>
          <Route path="/popup"><PopupPage {token} /></Route>
          <Route path="/diary"><DiaryPage {token} /></Route>
          <Route path="/daily-class-type"><DailyClassTypePage {token} /></Route>
          <Route path="*"><NotFoundPage /></Route>
        </main>
      </div>
    </Router>
  {:else}
    <LoginPage {onLogin} />
  {/if}
  <ThemeToggle />
</QueryClientProvider>

<style>
  .content {
    flex: 1;
    display: flex;

    & > nav {
      width: 200px;
      background: var(--color-bg-accent);
      border-right: 1px solid var(--color-border-default);
      box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);

      & > .menuLabel {
        margin: 30px 28px 10px;
        font-size: 12px;
        color: var(--color-text-default);
      }
    }

    & > main {
      padding: 20px;
      flex: 1;
    }
  }
</style>
