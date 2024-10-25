<script>
  import { Button } from '$lib/components/ui/button';
  import Menu from 'carbon-icons-svelte/lib/Menu.svelte';
  import LogoX from 'carbon-icons-svelte/lib/LogoX.svelte';
  import LogoLinkedin from 'carbon-icons-svelte/lib/LogoLinkedin.svelte';
  import LogoGithub from 'carbon-icons-svelte/lib/LogoGithub.svelte';
  import CloseLarge from 'carbon-icons-svelte/lib/CloseLarge.svelte';
  import { Menu as hamburger } from '$lib/store';
  import { goto } from '$app/navigation';

  const downloadCV = () => {
    const link = document.createElement('a');
    link.href =
      'https://docs.google.com/document/d/1iGeSujz4xtPuaIRFoLJfPJhe6XvzI-eH1HyTXI2UPKU//export?format=pdf';
    link.download = 'Emmanuel_Resume';
    link.click();
  };
</script>

<nav
  class="px-7 md:px-14 flex items-center backdrop-blur-sm fixed top-0 w-full h-20 z-50"
>
  <div
    class="bg-gray-50 py-2 px-6 rounded-full w-full md:w-[90%] h-fit mx-auto"
  >
    <span class="flex items-center justify-between">
      <p
        class="text-xl font-bold bg-gradient-to-r from-[#C41740] to-[#EA9C28] inline-block text-transparent bg-clip-text"
      >
        <a href="/"> Echo. </a>
      </p>
      <button
        class="block lg:hidden"
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
        class={` text-lg overflow-hidden transition-all font-semibold absolute flex lg:hidden flex-col items-center justify-center space-y-10 left-0 top-20  bg-gray-50 ${
          $hamburger.isOpen
            ? 'h-[calc(100dvh-5rem)] w-screen z-[1000]'
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
        <p class="hover:bg-slate-200 rounded-full px-2 py-1">
          <a
            href="#contact"
            on:click={() => {
              $hamburger.isOpen = !$hamburger.isOpen;
            }}>Contact</a
          >
        </p>
        <Button on:click={downloadCV} class="h-fit rounded-full"
          >Download CV</Button
        >
        <div class="flex space-x-10 absolute bottom-6">
          <LogoX size={32} />
          <LogoLinkedin size={32} />
          <LogoGithub size={32} />
        </div>
      </div>
      <!-- desktop nav links -->

      <div class="hidden lg:flex items-center space-x-10 font-medium">
        <p class="hover:bg-slate-200 rounded-full px-2 py-1">
          <a href="#about">About</a>
        </p>
        <p class="hover:bg-slate-200 rounded-full px-2 py-1">
          <a href="#posts">Posts</a>
        </p>
        <p class="hover:bg-slate-200 rounded-full px-2 py-1">
          <a href="#contact">Contact</a>
        </p>
      </div>

      <div class="hidden lg:flex items-center gap-1">
        <a href="https://www.github.com/Chifez4u" target="_blank">
          <LogoGithub size={24} />
        </a>
        <Button on:click={downloadCV} class="h-fit rounded-full"
          >Download CV</Button
        >
      </div>
    </span>
  </div>
</nav>
