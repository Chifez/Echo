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

  const handleSubmit = async () => {
    sending = true;
    if (!name) {
      throw Error('incomplete details');
    }
    try {
      console.log(from, to, content);
      const response = await fetch('/api/send-email', {
        method: 'POST',
        body: JSON.stringify({
          from,
          to,
          subject: `Contact message from ${name}`,
          content,
        }),
      });

      if (response.ok) {
        name = '';
        content = '';
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
      on a project,feel free to reach out to me using the contact form below
    </p>
    <form class="w-full md:w-[40%] space-y-4">
      <Input
        placeholder="Name"
        value={name}
        on:change={(e) => (name = e.target?.value)}
      />
      <Input
        type="email"
        placeholder="Email"
        value={from}
        on:change={(e) => (from = e.target?.value)}
      />
      <div class="grid w-full gap-2">
        <Textarea
          placeholder="Type your message here."
          class="min-h-28"
          value={content}
          on:change={(e) => (content = e.target?.value)}
        />
        <Button on:click={handleSubmit} disabled={sending}
          >{sending ? 'sending' : 'Send message'}</Button
        >
      </div>
    </form>
  </div>
</section>
