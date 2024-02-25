<script lang="ts">
  export let variant: 'title' | 'subtitle' | 'body' | 'code';
  export let preventDrag: boolean = false;
</script>

<span class={`${variant} ${$$restProps.class ?? ''} ${preventDrag ? 'preventDrag' : ''}`} {...$$restProps}>
  <slot />
</span>

<style>
  span {
    color: var(--color-text-default);
  }

  span.title {
    font-size: 40px;
  }

  span.subtitle {
    font-size: 20px;
  }

  span.body {
    font-size: 16px;
  }

  span.code {
    font-size: 14px;
    white-space: pre-wrap;
  }

  span.preventDrag {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
</style>
