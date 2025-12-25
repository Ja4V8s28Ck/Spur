<script lang="ts">
  import { Button, type ButtonProps } from "$lib/components/ui/button";
  import type { Component } from "svelte";
  import { LoaderCircle } from "@lucide/svelte";

  type Props = ButtonProps & {
    icon?: Component;
    loading?: boolean;
  };

  let {
    icon: Icon,
    loading = false,
    disabled = false,
    children,
    class: className,
    ...restProps
  }: Props = $props();
</script>

<Button
  disabled={disabled || loading}
  class="cursor-pointer {className}"
  {...restProps}
>
  {@render children?.()}
  {#if Icon && loading}
    <LoaderCircle class="animate-spin" />
  {:else if Icon}
    <Icon />
  {/if}
</Button>
