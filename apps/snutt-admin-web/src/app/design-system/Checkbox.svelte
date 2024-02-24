<script lang="ts">
  export let checked: boolean;
  export let required = false;
  export let label: string;
</script>

<label class="my-custom-input">
  <div>
    <span>{label}</span><span style="color: red;">{required ? '*' : ''}</span>
  </div>
  <input bind:checked type="checkbox" {...$$restProps} />
</label>

<style>
  label.my-custom-input {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  label.my-custom-input > input {
    background: transparent;
    height: 40px;
    border: 1px solid white;
    cursor: pointer;
  }
</style>
