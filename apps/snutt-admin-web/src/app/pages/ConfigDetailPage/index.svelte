<script lang="ts">
  import {
    createMutation,
    createQuery,
    getQueryClientContext,
  } from "@tanstack/svelte-query";
  import { getServiceContext } from "../../contexts/ServiceContext";
  import type { AdminConfigId } from "../../../entities/Config";
  import { getAuthContext } from "../../contexts/AuthContext";

  export let configName: string;
  const queryClient = getQueryClientContext();
  const { configService } = getServiceContext();
  const { token } = getAuthContext();

  $: query = createQuery(
    ["configs", { configName, token }] as const,
    ({ queryKey: [, { configName, token }] }) => {
      if (!token) throw new Error();
      return configService.getAdminConfig({ configName, token });
    },
    { enabled: !!token }
  );

  const mutation = createMutation((configId: AdminConfigId) => {
    if (!token) throw new Error();

    return configService.deleteAdminConfig({ configName, configId, token });
  });

  const versionKeys = ["minVersion", "maxVersion"] as const;
</script>

<div>
  <h2>{configName}</h2>

  {#if $query.data}<div>
      {#each $query.data as adminConfig}
        <div class="item">
          <div class="itemHeader">
            <p>{adminConfig.id}</p>
            <button
              on:click={() =>
                $mutation.mutate(adminConfig.id, {
                  onSuccess: () => queryClient.invalidateQueries(),
                })}>제거</button
            >
          </div>
          <dl>
            {#each versionKeys.map( (version) => ({ version, config: adminConfig[version] }) ) as vc}
              <dt>{vc.version}</dt>
              <dd>
                {#if vc.config}<div>
                    aos: {vc.config.android} / ios: {vc.config.ios}
                  </div>{:else}<div>null</div>{/if}
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
