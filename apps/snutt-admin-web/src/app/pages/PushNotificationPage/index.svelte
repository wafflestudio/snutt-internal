<script lang="ts">
  import { createMutation } from '@tanstack/svelte-query';

  import type { Token } from '../../../entities/Auth';
  import type { PushNotificationType } from '../../../entities/PushNotification';
  import ConfirmRequiredButton from '../../components/ConfirmRequiredButton.svelte';
  import { getServiceContext } from '../../contexts/ServiceContext';
  import Checkbox from '../../design-system/Checkbox.svelte';
  import Input from '../../design-system/Input.svelte';
  import Select from '../../design-system/Select.svelte';
  import Typography from '../../design-system/Typography.svelte';
  const { pushNotificationService } = getServiceContext();

  export let token: Token;
  let title = '';
  let body = '';
  let insertFcm = false;
  let type: PushNotificationType = 'NORMAL';
  let urlScheme = '';

  const mutation = createMutation({
    mutationFn: () =>
      pushNotificationService.sendPushNotification({
        token,
        title,
        body,
        insertFcm,
        type,
        urlScheme: urlScheme || undefined,
      }),
  });

  $: isValid = token && title && body && !$mutation.isPending;

  const onSubmit = () => isValid && $mutation.mutate();
</script>

<div class="wrapper">
  <div class="header"><Typography variant="subtitle">푸시 보내기</Typography></div>

  <form on:submit|preventDefault>
    <div class="section">
      <Input required label="title" bind:value={title} placeholder="아아 마이크테스트" />

      <Input required label="body" bind:value={body} placeholder="붕어빵 먹고싶엉" />

      <Checkbox required label="insert_fcm" bind:checked={insertFcm} type="checkbox" />

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
    </div>

    <ConfirmRequiredButton
      onConfirm={onSubmit}
      disabled={!isValid}
      class="button"
      confirmTitle="정말 보내시겠습니까?"
      confirmMessage="모든 유저에게 전송됩니다"
      type="basic"
    >
      전송
    </ConfirmRequiredButton>
  </form>
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
</style>
