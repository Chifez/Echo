<script>
  import { Input } from '$lib/components/ui/input';
  import { Button } from '$lib/components/ui/button';
</script>

<section
  style="background-image: url('./background.jpg')"
  class="bg-center bg-cover w-full min-h-screen flex justify-center items-center"
>
  <div
    class="w-full md:w-[50%] flex flex-col mt-20 md:mt-10 items-center space-y-6 text-center py-4 px-7 md:px-14"
  >
    <div
      class=" border border-blue-100 rounded-full bg-[#F2F4F7] text-xs font-semibold text-center p-2"
    >
      <p>👋 Get in touch</p>
    </div>

    <h1
      class="py-1 text-4xl font-inter font-bold bg-gradient-to-r from-[#C41740] to-[#EA9C28] inline-block text-transparent bg-clip-text"
    >
      Echo: Learning,building and sharing Ideas
    </h1>

    <p class="text-gray-300 w-full font-semibold text-center">
      Welcome to Echo, where I share my adventures and lessons as a frontend
      developer. Join me as I explore new technologies, tackle challenges, and
      build exciting projects. From beginner tips to advanced concepts, Echo
      offers a space for both learning and inspiration.
    </p>

    <div class="w-full md:w-[80%] pt-8 space-y-2">
      <p class="text-gray-300 font-semibold">
        Sign up to get updates on my latest blog posts
      </p>
      <form class="w-full flex items-center space-x-2">
        <Input
          type="email"
          placeholder="Email"
          class="py-5 rounded-full text-white caret-white"
        />
        <Button type="submit" class="p-3 h-fit rounded-full">Subscribe</Button>
      </form>
    </div>
  </div>
</section>
