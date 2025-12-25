<script lang="ts">
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import * as Card from "$lib/components/ui/card/index.js";
  import CustomButton from "$lib/components/CustomButton.svelte";
  import CustomSeparator from "$lib/components/CustomSeparator.svelte";

  import { ArrowRight, Plus } from "@lucide/svelte";
  import { goto } from "$app/navigation";
  import { resolve } from "$app/paths";

  let isLoading = $state<boolean>(false);
  let errorMsg = $state<string>("");

  async function handleCreateChat() {
    errorMsg = "";
    isLoading = true;

    try {
      // create chat, on success redirect to chat page
      console.log("created chat");
      await goto(resolve("/app"));
    } catch (err) {
      errorMsg = String(err);
      console.log(err);
    } finally {
      isLoading = false;
    }
  }

  async function handleGoToChat() {
    errorMsg = "";
    isLoading = true;

    try {
      // verify the conversationId, on success redirect to chat page
      console.log("going to chat");
    } catch (err) {
      errorMsg = String(err);
      console.log(err);
    } finally {
      isLoading = false;
    }
  }
</script>

<Card.Root class="w-full max-w-sm">
  <Card.Header>
    <Card.Title class="text-lg grid grid-cols-2 items-center">
      Create chat
    </Card.Title>

    <Card.Description class="mb-1">
      Create a new chat or enter the chat conversation ID
    </Card.Description>

    <CustomButton
      class="w-full capitalize"
      onclick={() => handleCreateChat()}
      loading={isLoading}
      icon={Plus}
    >
      Create new chat
    </CustomButton>

    <CustomSeparator label="Or continue with" />

    <div class="space-y-4">
      <div class="space-y-2">
        <Label for="conversationId">Conversation ID</Label>
        <Input
          id="conversationId"
          type="text"
          placeholder="019b507f-c521-701a-adb1-e7e9b805495d"
        />
        {#if errorMsg != ""}
          <p id="go-to-chat-error" class="text-red-500 text-xs">{errorMsg}</p>
        {/if}
      </div>

      <CustomButton
        class="w-full capitalize"
        onclick={() => handleGoToChat()}
        loading={isLoading}
        icon={ArrowRight}
      >
        Go to chat
      </CustomButton>
    </div>
  </Card.Header>
</Card.Root>
