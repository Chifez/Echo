<script>
  import { Input } from '$lib/components/ui/input';
  import { Button } from '$lib/components/ui/button';
  import Textarea from '$lib/components/ui/textarea/textarea.svelte';

  let to = 'chifez1@gmail.com';
  let from = '';
  let name = '';
  let content = '';
  let sending = false;
  let error = null;
  let isSent = false;

  let nameError = '';
  let emailError = '';
  let contentError = '';

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function validateInputs() {
    nameError = name ? '' : 'Name is required';
    emailError =
      from && emailPattern.test(from) ? '' : 'Valid email is required';
    contentError = content ? '' : 'Message cannot be empty';

    if (nameError || emailError || contentError) {
      return false;
    }
    error = null;
    return true;
  }

  const handleSubmit = async () => {
    if (!validateInputs()) {
      sending = false;
      return;
    }

    sending = true;
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        body: JSON.stringify({
          from,
          to,
          subject: `[New message]: Contact message from ${name}`,
          content,
        }),
      });

      if (response.ok) {
        name = '';
        from = '';
        content = '';
        isSent = true;
        setTimeout(() => (isSent = false), 2000);
      } else {
        error = await response.text();
      }
    } catch (err) {
      console.error('Error sending email:', err);
      error = 'An error occurred. Please try again later.';
    } finally {
      sending = false;
    }
  };
</script>

<section
  id="contact"
  class="bg-gray-50 min-h-full space-y-10 py-10 px-7 md:px-14"
>
  <h1 class="text-4xl font-semibold text-center mt-10">Contact</h1>

  <div class="space-y-4">
    <p class="w-full md:w-[40%]">
      If you have any questions about my blog post or would like to collaborate
      on a project, feel free to reach out to me using the contact form below.
    </p>
    <form
      class="w-full md:w-[40%] space-y-4"
      on:submit|preventDefault={handleSubmit}
    >
      <div class="space-y-1">
        <Input
          placeholder="Name"
          value={name}
          class={nameError ? 'border-red-500' : ''}
          on:change={(e) => (name = e.target?.value)}
        />
        {#if nameError}
          <p class="text-sm text-red-500">{nameError}</p>
        {/if}
      </div>

      <div class="space-y-1">
        <Input
          type="email"
          placeholder="Email"
          value={from}
          class={emailError ? 'border-red-500' : ''}
          on:change={(e) => (from = e.target?.value)}
        />
        {#if emailError}
          <p class="text-sm text-red-500">{emailError}</p>
        {/if}
      </div>

      <div class="space-y-1">
        <Textarea
          placeholder="Type your message here."
          class="min-h-28 {contentError ? 'border-red-500' : ''}"
          value={content}
          on:change={(e) => (content = e.target?.value)}
        />
        {#if contentError}
          <p class="text-sm text-red-500">{contentError}</p>
        {/if}
      </div>

      {#if error}
        <p class="text-sm text-red-500">{error}</p>
      {/if}

      <!-- Button with transition effect for "Sent" status -->
      <Button
        on:click={handleSubmit}
        disabled={sending}
        class="transition duration-300 ease-in-out w-full"
      >
        {#if isSent}
          Sent
        {:else if sending}
          Sending...
        {:else}
          Send Message
        {/if}
      </Button>
    </form>
  </div>
</section>
