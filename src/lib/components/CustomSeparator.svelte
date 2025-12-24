<script lang="ts">
  import { Separator } from "$lib/components/ui/separator";

  type Props = {
    label: string;
    class?: string;
  };

  let { label, class: className = "" }: Props = $props();
</script>

<div class="relative my-4 {className}">
  <Separator />
  <span
    class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground font-mono font-semibold"
  >
    {label}
  </span>
</div>
