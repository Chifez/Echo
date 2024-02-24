<script>
  import { Input } from '$lib/components/ui/input';
  import { Button } from '$lib/components/ui/button';
  import Textarea from '$lib/components/ui/textarea/textarea.svelte';
</script>

<section
  id="contact"
  class="bg-gray-50 min-h-full space-y-10 py-10 px-7 md:px-14"
>
  <h1 class="text-4xl font-semibold text-center mt-10">Contact</h1>

  <div class="space-y-4">
    <p class="w-full md:w-[60%]">
      if you have any questions about my blog post or would lke to collaborate
      on a project,feel free to reach out to me using the contact form below
    </p>
    <form class="w-full md:w-[40%] space-y-4">
      <Input placeholder="Name" />
      <Input type="email" placeholder="Email" />
      <div class="grid w-full gap-2">
        <Textarea placeholder="Type your message here." />
        <Button>Send message</Button>
      </div>
    </form>
  </div>
</section>
