<script>
  import { Button } from '$lib/components/ui/button';
  import Menu from 'carbon-icons-svelte/lib/Menu.svelte';
  import LogoX from 'carbon-icons-svelte/lib/LogoX.svelte';
  import LogoLinkedin from 'carbon-icons-svelte/lib/LogoLinkedin.svelte';
  import LogoGithub from 'carbon-icons-svelte/lib/LogoGithub.svelte';
  import CloseLarge from 'carbon-icons-svelte/lib/CloseLarge.svelte';
  import { Menu as hamburger } from '$lib/store';
  import { goto } from '$app/navigation';
</script>

<nav
  class="px-7 md:px-14 flex items-center backdrop-blur-sm fixed top-0 w-full h-20"
>
  <div class="bg-gray-50 py-2 px-6 rounded-full w-full h-fit">
    <span class="flex items-center justify-between">
      <p
        class="text-xl font-bold bg-gradient-to-r from-[#C41740] to-[#EA9C28] inline-block text-transparent bg-clip-text"
      >
        <a href="/"> Echo. </a>
      </p>
      <button
        class="block md:hidden"
        on:click={() => {
          $hamburger.isOpen = !$hamburger.isOpen;
        }}
      >
        {#if $hamburger.isOpen === true}
          <CloseLarge size={24} />
        {:else}
          <Menu size={24} />
        {/if}
      </button>
      <div
        class={`z-10 text-lg overflow-hidden transition-all font-semibold absolute flex md:hidden flex-col items-center justify-center space-y-10 left-0 top-20  bg-gray-50 ${
          $hamburger.isOpen
            ? 'h-[calc(100vh-5rem)] w-screen'
            : 'h-0 w-0 opacity-0'
        }`}
      >
        <div class="flex flex-col items-center justify-center space-y-4">
          <p>
            <a
              href="#about"
              on:click={() => {
                $hamburger.isOpen = !$hamburger.isOpen;
              }}>About</a
            >
          </p>
          <p>
            <a
              href="#posts"
              on:click={() => {
                $hamburger.isOpen = !$hamburger.isOpen;
              }}>Posts</a
            >
          </p>
        </div>
        <p>
          <Button
            on:click={() => {
              goto('/#contact');
              $hamburger.isOpen = !$hamburger.isOpen;
            }}
            type="submit"
            class="h-fit text-lg rounded-full">Contact</Button
          >
        </p>
        <div class="flex space-x-10 absolute bottom-6">
          <LogoX size={32} />
          <LogoLinkedin size={32} />
          <LogoGithub size={32} />
        </div>
      </div>
      <!-- desktop nav links -->
      <ul
        class="hidden md:flex items-center font-semibold gap-8 justify-around"
      >
        <div class="flex items-center space-x-4">
          <p>
            <a href="#about">About</a>
          </p>
          <p>
            <a href="#posts">Posts</a>
          </p>
        </div>
        <li>
          <Button
            on:click={() => goto('/#contact')}
            type="submit"
            class="h-fit rounded-full">Contact</Button
          >
        </li>
      </ul>
    </span>
  </div>
</nav>
