<script lang="ts">
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import * as Card from "$lib/components/ui/card/index.js";
  import CustomButton from "$lib/components/CustomButton.svelte";

  import { ArrowRight, Plus } from "@lucide/svelte";

  let isLoading = $state<boolean>(false);
  let errorMsg = $state<string>("");

  async function handleCreateChat() {
    errorMsg = "";
    isLoading = true;

    try {
      // create chat, on success redirect to chat page
      console.log("created chat");
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
      // verify the sessionId, on success redirect to chat page
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
      Create a new chat or enter chat session ID
    </Card.Description>

    <CustomButton
      class="w-full capitalize"
      onclick={() => handleCreateChat()}
      loading={isLoading}
      icon={Plus}
    >
      Create new chat
    </CustomButton>

    <div class="relative py-3">
      <div class="absolute inset-0 flex items-center">
        <span class="w-full border-t border-border"></span>
      </div>
      <div class="relative flex justify-center text-xs uppercase">
        <span class="bg-card px-2 text-muted-foreground font-mono">
          or continue with
        </span>
      </div>
    </div>

    <div class="space-y-4">
      <div class="space-y-2">
        <Label for="sessionId">Session ID</Label>
        <Input
          id="sessionId"
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
