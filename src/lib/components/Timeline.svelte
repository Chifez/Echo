<script lang="ts">
  import { ContentDeliveryNetwork, LogoGithub } from 'carbon-icons-svelte';

  export let items: {
    name: string;
    detail: string;
    live?: string;
    github?: string;
    date?: string;
    description: string;
  }[] = [];
</script>

<div class="relative w-fit flex justify-center space-x-8 md:space-x-10">
  <div
    class="w-[3px] md:w-[2px] bg-blue-600 mt-10 before:bg-gradient-to-t before:from-white before:to-transparent before:w-[4px] before:h-[9rem] before:absolute before:bottom-0"
  />
  <div class="space-y-8">
    {#each items as card, index}
      <div
        class="md:w-[35rem] w-full border-2 rounded-lg px-4 py-8 space-y-4 bg-white"
      >
        <div class="flex items-start">
          <div
            class={`z-50 absolute -left-3 ${
              index > 0 &&
              'before:bg-gradient-to-t before:from-white before:to-transparent before:w-[4px] before:h-[9rem] before:absolute before:-top-36'
            } flex items-center justify-center w-7 h-7 bg-blue-100 rounded-full`}
          >
            <div class="w-4 h-4 bg-blue-800 rounded-full z-50" />
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h1 class="text-lg font-bold text-blue-800 capitalize">
                {card.name}
              </h1>
              <div class="flex items-center gap-2">
                {#if card.github}
                  <a href={card.github} target="_blank">
                    <LogoGithub size={20} />
                  </a>
                {/if}
                {#if card.live}
                  <a href={card.live} target="_blank">
                    <ContentDeliveryNetwork size={20} />
                  </a>
                {/if}
              </div>
            </div>
            <h1 class="text-sm font-bold">{card.detail}</h1>
            {#if card.date}
              <h1 class="text-sm">{card.date}</h1>
            {/if}
          </div>
        </div>
        <p class="text-base text-gray-500">
          {card.description}
        </p>
      </div>
    {/each}
  </div>
</div>
