<script lang="ts">
  export let value: string | undefined;
  export let values: { value: string; label: string }[];
  export let label: string;
  export let required = false;
</script>

<label class="my-custom-input">
  <div>
    <span>{label}</span><span style="color: red;">{required ? '*' : ''}</span>
  </div>
  <select {required} {value}>
    {#each values as { value, label }}
      <option {value}>{label}</option>
    {/each}
  </select>
</label>

<style>
  label.my-custom-input {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  label.my-custom-input > select {
    background: #333;
    height: 40px;
    border: 1px solid white;
    padding-inline: 12px;
    border-radius: 4px;
    transition: background 0.2s ease-in-out;
    cursor: pointer;
  }

  label.my-custom-input > select:hover {
    background: #444;
  }
</style>
