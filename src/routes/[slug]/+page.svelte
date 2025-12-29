<script lang="ts">
  import { tick } from "svelte";
  import { enhance } from "$app/forms";
  import { goto } from "$app/navigation";
  import { resolve } from "$app/paths";
  import { ArrowDown, ArrowUp, Loader, Undo2 } from "@lucide/svelte";

  import type { Chat, ResponseError } from "$lib/types";
  import { cn } from "$lib/utils";

  import CustomButton from "$lib/components/CustomButton.svelte";
  import * as Avatar from "$lib/components/ui/avatar/index.js";
  import * as InputGroup from "$lib/components/ui/input-group/index.js";
  import * as Card from "$lib/components/ui/card";
  import Button from "$lib/components/ui/button/button.svelte";
  import Separator from "$lib/components/ui/separator/separator.svelte";

  // Scrollbar
  let scrollContainer: HTMLDivElement;
  let showScrollButton = $state(false);

  function checkScroll() {
    if (!scrollContainer) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 10;
    showScrollButton = !isAtBottom;
  }

  function scrollToBottom() {
    if (scrollContainer) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }

  // Textbox enter to send
  function handleKeydown(e: KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      const form = (e.currentTarget as HTMLElement).closest("form");
      form?.requestSubmit();
    }
  }

  const maxInputLength = 200;
  const totalMessageCount = 5;

  let userMessageCount = $state<number>(0);
  let isMessageLimitReached = $state<boolean>(false);
  let isLoading = $state<boolean>(false);
  let errorResponse = $state<ResponseError>();
  let currentMessage = $state<string>("");
  const { data } = $props();
  let messages = $state<Chat[]>(data.messages);

  $effect(() => {
    messages = data.messages || [];
    isMessageLimitReached = data.messageLimit || false;
    userMessageCount = data.messagesCount || 0;
    scrollToBottom();
  });
</script>

<Card.Root class="w-full max-w-5xl gap-4">
  <Card.Header>
    <Card.Title class="flex items-center gap-4">
      <Avatar.Root class="h-8 w-8">
        <Avatar.Image
          src="https://cdn-icons-png.flaticon.com/512/10479/10479785.png"
          alt="shopping-bot"
        />
        <Avatar.Fallback>Bot</Avatar.Fallback>
      </Avatar.Root>
      <div class="flex flex-col gap-1">
        <span class="text-md"> Shopping Bot </span>
        <p class="text-muted-foreground text-xs">bot@shopping.com</p>
      </div>
      <CustomButton
        class="ml-auto"
        variant="outline"
        onclick={() => goto(resolve("/"))}
        icon={Undo2}
      >
        Back
      </CustomButton>
    </Card.Title>
  </Card.Header>

  <Separator />

  <div
    class="flex flex-col px-6 h-100 scrollbar"
    bind:this={scrollContainer}
    onscroll={checkScroll}
  >
    {#each messages as chat (chat.id)}
      <div
        class={cn(
          "flex flex-col my-2",
          !chat.isBot ? "items-end" : "items-start",
        )}
      >
        <p
          class={cn(
            "px-3 py-2 rounded-lg bg-muted max-w-[70%] w-fit",
            !chat.isBot
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-primary-background",
          )}
        >
          {chat.message}
        </p>
      </div>
    {/each}
    {#if isLoading}
      <div class="flex flex-col my-2 items-start">
        <p
          class="px-3 py-2 rounded-lg bg-muted max-w-[70%] w-fit bg-muted text-primary-background flex flex-row items-center gap-x-2"
        >
          Agent is typing <Loader class="animate-spin w-4 h-4" />
        </p>
      </div>
    {:else if errorResponse}
      <div class="flex flex-col my-2 items-start">
        <p
          class="px-3 py-2 rounded-lg bg-muted max-w-[70%] w-fit bg-muted text-red-500 flex flex-row items-center gap-x-2"
        >
          Agent has failed to respond due to {errorResponse.detail}.
        </p>
      </div>
    {/if}
    {#if showScrollButton}
      <div class="absolute self-center">
        <Button
          variant="outline"
          size="icon"
          class="rounded-full h-8 w-8 p-0 flex items-center justify-center bg-muted dark:bg-muted hover:bg-muted hover:dark:bg-muted cursor-pointer"
          onclick={scrollToBottom}
        >
          <ArrowDown class="h-4 w-4" />
        </Button>
      </div>
    {/if}
  </div>

  <Card.Footer>
    <form
      class="relative w-full"
      method="POST"
      action="?/sendMessage"
      use:enhance={() => {
        errorResponse = undefined;
        isLoading = true;

        currentMessage = currentMessage.trim();
        if (currentMessage) {
          messages.push({
            id: `temp-${Date.now()}`,
            message: currentMessage,
            isBot: false,
          });
        }

        currentMessage = "";

        tick().then(() => {
          scrollToBottom();
        });

        return async ({ result, update }) => {
          await update();
          isLoading = false;
          if (result.type === "failure") {
            errorResponse = result.data as ResponseError;
          }

          tick().then(() => {
            scrollToBottom();
          });
        };
      }}
    >
      <InputGroup.Root>
        <InputGroup.Textarea
          name="message"
          placeholder="Ask your query..."
          bind:value={currentMessage}
          disabled={isLoading || isMessageLimitReached}
          maxlength={maxInputLength}
          onkeydown={handleKeydown}
          required
        />
        <InputGroup.Addon align="block-end">
          <InputGroup.Text
            class={cn(
              "text-xs",
              maxInputLength === currentMessage.trim().length
                ? "text-red-500"
                : "text-muted-foreground",
            )}
          >
            {maxInputLength - currentMessage.trim().length} character(s) left
          </InputGroup.Text>
          <InputGroup.Text
            class={cn(
              "text-xs ms-auto",
              isMessageLimitReached ? "text-red-500" : "text-lime-600",
            )}
          >
            <p>
              {totalMessageCount - userMessageCount} message(s) left
            </p>
          </InputGroup.Text>
          <Separator orientation="vertical" class="!h-5" />
          <InputGroup.Button
            type="submit"
            variant="default"
            class="rounded-full cursor-pointer"
            size="icon-sm"
            disabled={!currentMessage.trim() ||
              isLoading ||
              isMessageLimitReached}
          >
            {#if isLoading}
              <Loader class="animate-spin" />
            {:else}
              <ArrowUp />
            {/if}
            <span class="sr-only">Send</span>
          </InputGroup.Button>
        </InputGroup.Addon>
      </InputGroup.Root>
    </form>
  </Card.Footer>
</Card.Root>
