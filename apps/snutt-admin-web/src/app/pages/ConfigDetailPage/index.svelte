<script lang="ts">
  import { createMutation, createQuery, getQueryClientContext } from '@tanstack/svelte-query';

  import type { Token } from '../../../entities/Auth';
  import type { AdminConfigId } from '../../../entities/Config';
  import ConfirmRequiredButton from '../../components/ConfirmRequiredButton.svelte';
  import { getServiceContext } from '../../contexts/ServiceContext';
  import Typography from '../../design-system/Typography.svelte';

  export let configName: string;
  const queryClient = getQueryClientContext();
  const { configService } = getServiceContext();

  export let token: Token;

  $: query = createQuery({
    queryKey: ['configs', { configName, token }] as const,
    queryFn: ({ queryKey: [, params] }) => {
      if (!params.token) throw new Error();
      return configService.getAdminConfig(params);
    },
    enabled: !!token,
  });

  const mutation = createMutation({
    mutationFn: (configId: AdminConfigId) => {
      if (!token) throw new Error();

      return configService.deleteAdminConfig({ configName, configId, token });
    },
  });

  const versionKeys = ['minVersion', 'maxVersion'] as const;
</script>

<div>
  <Typography variant="subtitle">{configName}</Typography>

  {#if $query.data}
    {#each $query.data as adminConfig}
      <div class="item">
        <div class="itemHeader">
          <Typography variant="subtitle">{adminConfig.id}</Typography>
          <ConfirmRequiredButton
            variant="danger"
            confirmTitle="정말 삭제하시겠습니까?"
            confirmMessage="이 작업은 되돌릴 수 없습니다"
            onConfirm={() =>
              $mutation.mutate(adminConfig.id, {
                onSuccess: () => queryClient.invalidateQueries(),
              })}
          >
            제거
          </ConfirmRequiredButton>
        </div>

        <table>
          <thead
            ><th></th><th><Typography variant="code">android</Typography></th><th
              ><Typography variant="code">ios</Typography></th
            ></thead
          >
          <tbody>
            {#each versionKeys.map((version) => ({ version, config: adminConfig[version] })) as vc}
              <tr>
                <td><Typography variant="body">{vc.version}</Typography></td>

                {#if vc.config}
                  <td><Typography variant="code">{vc.config.android}</Typography></td>
                  <td><Typography variant="code">{vc.config.ios}</Typography></td>
                {:else}
                  <td colspan="2">
                    <Typography variant="code">null</Typography>
                  </td>
                {/if}
              </tr>
            {/each}
          </tbody>
        </table>

        <Typography variant="code">{JSON.stringify(adminConfig.data, null, 2)}</Typography>
      </div>
    {/each}
  {/if}
</div>

<style>
  div.item {
    margin-top: 20px;
    padding: 20px;
    border: 1px solid #ccc;

    & > .itemHeader {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }
  }

  table,
  th,
  td {
    border: 1px solid var(--color-border-default);
  }

  td {
    padding: 4px 20px;
  }

  table {
    margin-bottom: 20px;
  }
</style>
