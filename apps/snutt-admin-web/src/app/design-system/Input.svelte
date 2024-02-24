<script lang="ts">
  export let value: string | undefined;
  export let label: string;
  export let required = false;
</script>

<label class="my-custom-input">
  <div>
    <span>{label}</span><span style="color: red;">{required ? '*' : ''}</span>
  </div>
  <input bind:value {required} {...$$restProps} />
</label>

<style>
  label.my-custom-input {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  span {
    font-size: 14px;
  }

  label.my-custom-input > input {
    background: #333;
    height: 40px;
    border: 1px solid white;
    padding-inline: 12px;
    border-radius: 4px;
    transition: background 0.2s ease-in-out;
  }

  label.my-custom-input > input:hover {
    background: #444;
  }
</style>
