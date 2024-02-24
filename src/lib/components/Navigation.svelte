<script>
  import { Button } from '$lib/components/ui/button';
</script>

<nav
  class="px-7 md:px-14 flex items-center backdrop-blur-sm fixed top-0 w-full h-20"
>
  <div class="bg-gray-100 py-3 px-6 rounded-full w-full h-fit">
    <span class="flex items-center justify-between">
      <p
        class="text-xl font-bold bg-gradient-to-r from-[#C41740] to-[#EA9C28] inline-block text-transparent bg-clip-text"
      >
        Echo.
      </p>

      <ul class="flex items-center font-medium gap-8 justify-around">
        <div class="flex items-center space-x-4">
          <li>
            <a href="/#"> About</a>
          </li>
          <li>
            <a href="/#"> Posts</a>
          </li>
        </div>
        <li>
          <Button type="submit" class="h-fit">Contact</Button>
        </li>
      </ul>
    </span>
  </div>
</nav>
