<script lang="ts">
  import type { Token } from '../../../entities/Auth';
  import { getServiceContext } from '../../contexts/ServiceContext';
  import Button from '../../design-system/Button.svelte';
  import Input from '../../design-system/Input.svelte';
  import Typography from '../../design-system/Typography.svelte';

  export let token: null | Token = null;
  let loading: boolean = false;
  let username: string = '';
  let password: string = '';

  const { authService } = getServiceContext();

  const onSubmit = async () => {
    loading = true;
    try {
      const response = await authService.login({ username, password });
      token = response.token;
    } catch (e) {
      console.error(e);
    } finally {
      loading = false;
    }
  };
</script>

<form on:submit|preventDefault={onSubmit}>
  <Typography variant="title">로그인</Typography>
  <Input autocomplete="username" name="login-username" type="text" label="username" bind:value={username} />
  <Input autocomplete="current-password" name="login-password" type="password" label="password" bind:value={password} />
  <Button type="submit" disabled={loading}>로그인</Button>
  <Typography variant="code">Note: 자동 로그인이 되지 않습니다 :)</Typography>
</form>

<style>
  form {
    width: 300px;
    height: 300px;
    position: fixed;
    top: 50%;
    left: 50%;
    display: flex;
    transform: translate(-50%, -50%);
    flex-direction: column;
    gap: 30px;
  }
</style>
