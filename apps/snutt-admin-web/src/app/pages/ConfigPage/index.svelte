<script lang="ts">
  import { createQuery } from "@tanstack/svelte-query";
  import Paper from "../../components/Paper.svelte";
  import { getServiceContext } from "../../contexts/ServiceContext";
  import type { OS } from "../../../entities/nativeClient";

  const { configService } = getServiceContext();

  let os: OS = "android";
  let version1 = "3",
    version2 = "2",
    version3 = "0";

  $: ver1Num = parseInt(version1);
  $: ver2Num = parseInt(version2);
  $: ver3Num = parseInt(version3);

  $: query = createQuery(
    ["configs", { os, ver1Num, ver2Num, ver3Num }] as const,
    async ({ queryKey: [, v] }) => {
      return configService.getConfigs({
        os: v.os,
        version: `${v.ver1Num}.${v.ver2Num}.${v.ver3Num}`,
      });
    },
    { enabled: !isNaN(ver1Num) && !isNaN(ver2Num) && !isNaN(ver3Num) }
  );
</script>

<div class="wrapper">
  <Paper class="paperCurrent">
    <div class="header">
      <h2>현재 컨피그 확인</h2>
      <div>
        <select bind:value={os}
          ><option value="android">android</option><option value="ios"
            >ios</option
          ></select
        >
        <div>
          <input
            bind:value={version1}
            type="number"
            min="1"
            max="3"
            step="1"
          />.
          <input bind:value={version2} type="number" min="0" step="1" />.
          <input bind:value={version3} type="number" min="0" step="1" />
        </div>
      </div>
    </div>
    {#if $query.isSuccess}{#each Object.entries($query.data) as config}<h3>
          {config[0]}
        </h3>
        <p>{JSON.stringify(config[1])}</p>
        <br />{/each}{/if}</Paper
  >
</div>

<style>
  .wrapper {
    width: 100%;
  }

  :global(.paperCurrent) {
    width: 100%;

    & > .header {
      display: flex;
      justify-content: space-between;

      & > h2 {
        margin-bottom: 20px;
      }

      & > div {
        display: flex;
        gap: 20px;
        height: 30px;
        align-items: stretch;

        & > div {
          display: flex;
          align-items: stretch;

          & > input {
            width: 30px;
          }
        }
      }
    }
  }
</style>