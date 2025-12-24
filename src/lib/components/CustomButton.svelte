<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import type { Component, ComponentProps } from "svelte";
  import { LoaderCircle } from "@lucide/svelte";

  type Props = ComponentProps<Button> & {
    icon?: Component;
    loading?: boolean;
  };

  let {
    icon: Icon,
    loading = false,
    disabled = false,
    children,
    class: className = "",
    ...restProps
  }: Props = $props();
</script>

<Button
  disabled={disabled || loading}
  class="cursor-pointer {className}"
  {...restProps}
>
  {@render children?.()}
  {#if loading}
    <LoaderCircle class="animate-spin" />
  {:else if Icon}
    <Icon this={Icon} />
  {/if}
</Button>
