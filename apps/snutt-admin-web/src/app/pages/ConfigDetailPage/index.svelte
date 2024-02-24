<script lang="ts">
  import { createMutation, createQuery, getQueryClientContext } from '@tanstack/svelte-query';

  import type { Token } from '../../../entities/Auth';
  import type { AdminConfigId } from '../../../entities/Config';
  import ConfirmRequiredButton from '../../components/ConfirmRequiredButton.svelte';
  import { getServiceContext } from '../../contexts/ServiceContext';

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
  <h2>{configName}</h2>

  {#if $query.data}<div>
      {#each $query.data as adminConfig}
        <div class="item">
          <div class="itemHeader">
            <p>{adminConfig.id}</p>
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
          <dl>
            {#each versionKeys.map((version) => ({ version, config: adminConfig[version] })) as vc}
              <dt>{vc.version}</dt>
              <dd>
                {#if vc.config}
                  <div>aos: {vc.config.android} / ios: {vc.config.ios}</div>
                {:else}
                  <div>null</div>
                {/if}
              </dd>
            {/each}
          </dl>
          <div>{JSON.stringify(adminConfig.data)}</div>
        </div>
      {/each}
    </div>{/if}
</div>

<style>
  h2 {
    margin-bottom: 20px;
  }

  div.item {
    margin-bottom: 20px;
    padding: 20px;
    border: 1px solid #ccc;

    & > .itemHeader {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }
  }
</style>
