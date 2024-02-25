<script lang="ts">
  import { createQuery } from '@tanstack/svelte-query';

  import type { OS } from '../../../entities/NativeClient';
  import { getServiceContext } from '../../contexts/ServiceContext';
  import Input from '../../design-system/Input.svelte';
  import Link from '../../design-system/Link.svelte';
  import Select from '../../design-system/Select.svelte';
  import Typography from '../../design-system/Typography.svelte';

  const { configService } = getServiceContext();

  let os: OS = 'android';
  let version1 = '3',
    version2 = '5',
    version3 = '0';

  $: ver1Num = parseInt(version1);
  $: ver2Num = parseInt(version2);
  $: ver3Num = parseInt(version3);

  $: query = createQuery({
    queryKey: ['configs', { os, ver1Num, ver2Num, ver3Num }] as const,
    queryFn: async ({ queryKey: [, v] }) => {
      return configService.getConfigs({
        os: v.os,
        version: `${v.ver1Num}.${v.ver2Num}.${v.ver3Num}`,
      });
    },
    enabled: !isNaN(ver1Num) && !isNaN(ver2Num) && !isNaN(ver3Num),
  });
</script>

<div class="wrapper">
  <div class="header">
    <Typography variant="subtitle">현재 컨피그 확인</Typography>
    <div>
      <Select bind:value={os} values={['android', 'ios'].map((item) => ({ value: item, label: item }))} label="os" />
      <div>
        <Input label="M" bind:value={version1} type="number" min="1" max="3" step="1" />.
        <Input label="m" bind:value={version2} type="number" min="0" step="1" />.
        <Input label="p" bind:value={version3} type="number" min="0" step="1" />
      </div>
    </div>
  </div>
  {#if $query.isSuccess}
    {#each Object.entries($query.data) as [key, value]}
      <Link href={`/config/${key}`}>
        <div class="link-item">
          <Typography variant="subtitle">{key}</Typography>
          <Typography variant="code">{JSON.stringify(value, null, 2)}</Typography>
        </div>
      </Link>
    {/each}
  {/if}
</div>

<style>
  .wrapper {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 30px;

    & > .header {
      display: flex;
      justify-content: space-between;

      & > div {
        display: flex;
        gap: 20px;
        height: 70px;
        align-items: stretch;

        & > div {
          display: flex;
          align-items: stretch;
          width: 200px;
        }
      }
    }
  }

  div.link-item {
    display: flex;
    flex-direction: column;
  }
</style>
