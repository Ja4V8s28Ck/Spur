<script lang="ts">
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import * as Card from "$lib/components/ui/card/index.js";
  import CustomButton from "$lib/components/CustomButton.svelte";
  import CustomSeparator from "$lib/components/CustomSeparator.svelte";

  import type { ConversationResponseSuccess } from "$lib/types";

  import { ArrowRight, Plus } from "@lucide/svelte";
  import { enhance } from "$app/forms";
  import { goto } from "$app/navigation";
  import { resolve } from "$app/paths";

  const { form } = $props();
  let isCreateConversationLoading = $state<boolean>(false);
  let isGetConversationLoading = $state<boolean>(false);
</script>

<Card.Root class="w-full max-w-sm">
  <Card.Header>
    <Card.Title class="text-lg grid grid-cols-2 items-center">
      Create chat
    </Card.Title>

    <Card.Description class="mb-1">
      Create a new chat or enter the chat conversation ID
    </Card.Description>

    <form
      class="space-y-2"
      method="POST"
      action="?/createConversation"
      use:enhance={() => {
        isCreateConversationLoading = true;

        return async ({ update }) => {
          await update();
          isCreateConversationLoading = false;
        };
      }}
    >
      <CustomButton
        type="submit"
        class="w-full capitalize"
        loading={isCreateConversationLoading}
        icon={Plus}
        disabled={isGetConversationLoading}
      >
        Create new chat
      </CustomButton>
      {#if form?.action === "createConversation"}
        {#if form.error}
          <div class="flex flex-col gap-1 text-xs font-semibold">
            <span class="text-red-500">{form.detail}</span>
          </div>
        {:else}
          <p class="text-green-700 text-xs font-semibold">
            Created conversation. Redirecting to chat ...
          </p>
        {/if}
      {/if}
    </form>

    <CustomSeparator label="Or continue with" />

    <form
      class="space-y-4"
      method="POST"
      action="?/getConversation"
      use:enhance={() => {
        isGetConversationLoading = true;

        return async ({ result, update }) => {
          await update();
          isGetConversationLoading = false;

          if (result.type === "success") {
            const response = result.data as ConversationResponseSuccess;
            goto(resolve(`/${response.conversationId}`));
          }
        };
      }}
    >
      <div class="space-y-2">
        <Label for="conversationId">Conversation ID</Label>
        <Input
          id="conversationId"
          name="conversationId"
          type="text"
          placeholder="019b507f-c521-701a-adb1-e7e9b805495d"
          minlength={36}
          maxlength={36}
        />
        {#if form?.action === "getConversation"}
          {#if form.error}
            <div class="flex flex-col gap-1 text-xs font-semibold">
              <span class="text-red-500">{form.detail}</span>
            </div>
          {:else}
            <p class="text-green-700 text-xs font-semibold">
              Found conversation. Redirecting to chat ...
            </p>
          {/if}
        {/if}
      </div>

      <CustomButton
        type="submit"
        class="w-full capitalize"
        loading={isGetConversationLoading}
        icon={ArrowRight}
        disabled={isCreateConversationLoading}
      >
        Go to chat
      </CustomButton>
    </form>
  </Card.Header>
</Card.Root>
