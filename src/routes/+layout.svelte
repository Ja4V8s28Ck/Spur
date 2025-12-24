<script lang="ts">
	import { ModeWatcher } from "mode-watcher";
	import SunIcon from "@lucide/svelte/icons/sun";
	import MoonIcon from "@lucide/svelte/icons/moon";

	import { toggleMode } from "mode-watcher";
	import { Button } from "$lib/components/ui/button/index.js";
	import * as Item from "$lib/components/ui/item/index.js";

	import "./layout.css";
	import favicon from "$lib/assets/favicon.svg";

	let { children } = $props();
</script>

<ModeWatcher />

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<Item.Root class="justify-center flex-col">
	<Item.Content>
		<nav class="flex m-3 flex-row-reverse">
			<Button onclick={toggleMode} variant="outline" size="icon">
				<SunIcon
					class="scale-100 rotate-0 !transition-all dark:scale-0 dark:-rotate-90"
				/>
				<MoonIcon
					class="absolute scale-0 rotate-90 !transition-all dark:scale-100 dark:rotate-0"
				/>
			</Button>
		</nav>
	</Item.Content>
	{@render children()}
</Item.Root>
