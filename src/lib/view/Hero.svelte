<script>
  import { Input } from '$lib/components/ui/input';
  import { Button } from '$lib/components/ui/button';
  import { PUBLIC_TO } from '$env/static/public';

  let formData = '';
  let isLoading = false;

  const handleSubmit = async () => {
    isLoading = true;

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData || !emailPattern.test(formData)) {
      alert('Please enter a valid email address.');
      isLoading = false;
      return;
    }

    try {
      console.log(formData);
      const response = await fetch('/api/send-email', {
        method: 'POST',
        body: JSON.stringify({
          from: formData,
          to: PUBLIC_TO,
          subject: `[New subscriber]`,
          content: `
          <p>${formData} just subscribed to your blog<p>
          `,
        }),
      });
      console.log(response);
    } catch (error) {
      console.log(error);
    } finally {
      isLoading = false;
    }
  };
</script>

<section
  style="background-image: url('./background.jpg')"
  class="bg-center bg-cover w-full min-h-screen flex justify-center items-center"
>
  <div
    class="w-full md:w-[80%] lg:w-[50%] flex flex-col lg:mt-10 items-center space-y-6 text-center py-4 px-7 lg:px-14"
  >
    <a
      href="/#contact"
      class=" border border-blue-100 rounded-full bg-[#F2F4F7] text-xs font-semibold text-center p-2 cursor-pointer"
    >
      <p>👋 Get in touch</p>
    </a>

    <h1
      class="py-1 text-4xl font-inter font-bold bg-gradient-to-r from-[#C41740] to-[#EA9C28] inline-block text-transparent bg-clip-text"
    >
      Echo: Learning,Building and Sharing Ideas
    </h1>

    <p class="text-gray-300 w-full text-sm font-medium text-center">
      Welcome to Echo,my name is Emmanuel and this is where I share my
      adventures and lessons as a frontend developer. Join me as I explore new
      technologies, tackle challenges, and build exciting projects. From
      beginner tips to advanced concepts, Echo offers a space for both learning
      and inspiration.
    </p>

    <div class="w-full md:w-[70%] lg:w-[80%] pt-8 space-y-4">
      <p class="text-gray-300 font-medium text-sm w-[90%] text-center mx-auto">
        Sign up to get updates on my latest blog posts
      </p>
      <form
        class="w-full flex items-center space-x-2"
        on:submit|preventDefault={handleSubmit}
      >
        <Input
          type="email"
          placeholder="Email"
          bind:value={formData}
          class="py-5 rounded-full text-white caret-white"
        />
        <Button
          disabled={isLoading}
          type="submit"
          class="p-3 h-fit rounded-full"
          >{isLoading ? 'Sending' : 'Subscribe'}</Button
        >
      </form>
    </div>
  </div>
</section>
