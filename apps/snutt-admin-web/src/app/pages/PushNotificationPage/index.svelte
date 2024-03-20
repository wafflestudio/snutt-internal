<script lang="ts">
  import { createMutation, createQuery } from '@tanstack/svelte-query';

  import type { Token } from '../../../entities/Auth';
  import type { PushNotificationType } from '../../../entities/PushNotification';
  import ConfirmRequiredButton from '../../components/ConfirmRequiredButton.svelte';
  import { getServiceContext } from '../../contexts/ServiceContext';
  import Checkbox from '../../design-system/Checkbox.svelte';
  import Input from '../../design-system/Input.svelte';
  import Select from '../../design-system/Select.svelte';
  import Typography from '../../design-system/Typography.svelte';
  const { pushNotificationService, authService } = getServiceContext();

  export let token: Token;
  let title = '';
  let body = '';
  let type: PushNotificationType = 'NORMAL';
  let urlScheme = '';
  let 푸시쏘기 = false;
  let 나에게만 = true;

  $: meQuery = createQuery({ queryKey: [], queryFn: () => authService.getMe({ token }) });
  const mutation = createMutation({
    mutationFn: () => {
      if (!$meQuery.data) throw new Error();
      return pushNotificationService.sendPushNotification({
        token,
        title,
        body,
        insertFcm: 푸시쏘기,
        userId: 나에게만 ? $meQuery.data.userId : undefined,
        type,
        urlScheme: urlScheme || undefined,
      });
    },
  });

  $: isValid = $meQuery.data && token && title && body && !$mutation.isPending;

  const onSubmit = () => isValid && $mutation.mutate();
</script>

<div class="wrapper">
  <div class="header">
    <Typography variant="subtitle">푸시 보내기</Typography>
  </div>

  {#if $meQuery.data}
    <form on:submit|preventDefault>
      <div class="section">
        <Input required label="title" bind:value={title} placeholder="아아 마이크테스트" />

        <Input required label="body" bind:value={body} placeholder="붕어빵 먹고싶엉" />

        <Select
          required
          label="type"
          bind:value={type}
          values={[
            { value: 'NORMAL', label: 'NORMAL' },
            { value: 'COURSEBOOK', label: 'COURSEBOOK' },
            { value: 'LECTURE_UPDATE', label: 'LECTURE_UPDATE' },
            { value: 'LECTURE_REMOVE', label: 'LECTURE_REMOVE' },
            { value: 'FRIEND', label: 'FRIEND' },
          ]}
        />

        <Input label="url_scheme" bind:value={urlScheme} />

        <div class="checkboxes">
          <Checkbox required label="푸시도 쏘나요" bind:checked={푸시쏘기} type="checkbox" />
          <Checkbox required label="나에게만 쏘기" bind:checked={나에게만} type="checkbox" />
        </div>
      </div>

      <ConfirmRequiredButton
        onConfirm={onSubmit}
        disabled={!isValid}
        class="button"
        confirmTitle="정말 보내시겠습니까?"
        confirmMessage={'모든 유저에게 전송됩니다'}
        type="basic"
        skipConfirm={나에게만}
      >
        전송
      </ConfirmRequiredButton>
    </form>
  {:else}
    <Typography variant="body">loading...</Typography>
  {/if}
</div>

<style>
  div.header {
    display: flex;
    justify-content: space-between;
  }

  form {
    margin-top: 60px;
    margin-bottom: 60px;
    width: 100%;
  }

  form > div.section {
    display: flex;
    flex-direction: column;
    gap: 30px;
    flex: 1;
  }

  form > :global(.button) {
    width: 100%;
    margin-top: 40px;
  }

  div.checkboxes {
    display: flex;
    gap: 20px;
  }
</style>
