<script lang="ts">
  import { ChevronLeft } from 'carbon-icons-svelte';

  export let data;
</script>

<!-- SEO -->
<svelte:head>
  <title>{data.meta.title}</title>
  <meta property="og:type" content="article" />
  <meta property="og:title" content={data.meta.title} />
</svelte:head>

<div class=" mt-[10%] md:mt-16">
  {#if data}
    <article class="py-16">
      <!-- Title -->
      <hgroup
        class="flex flex-col items-center justify-center text-center w-full"
      >
        <p class="text-sm text-gray-500">{data.meta.date}</p>
        <p class="font-bold text-3xl py-2 text-center md:w-[60%]">
          {data.meta.title}
        </p>
      </hgroup>
      <main class="mx-auto max-w-screen-md px-4 lg:px-8">
        <div
          class="flex items-center justify-start gap-4 my-2 border-y border-gray-200 py-4"
        >
          <img
            src={data.meta.avatar}
            alt="avatar"
            class="w-10 h-10 rounded-full"
          />
          <span>
            <p class="font-semibold">{data.meta.author}</p>
            <p class="text-gray-500">{data.meta.role}</p>
          </span>
        </div>

        <!-- Post -->
        <div class="prose pt-2 pb-4 border-b border-gray-200">
          <svelte:component this={data.content} />
          <!-- Tags -->
          <div class="flex gap-2 py-4">
            {#each data.meta.tags as tag}
              <div
                class="text-xs bg-slate-300 h-fit w-fit rounded-full px-3 py-1"
              >
                {tag}
              </div>
            {/each}
          </div>
        </div>

        <a
          href="/#posts"
          class="flex font-medium items-center gap-2 text-slate-700 text-lg underline my-10"
        >
          <ChevronLeft />
          Back to all posts
        </a>
      </main>
    </article>
  {/if}
</div>

<style>
  article {
    margin-inline: auto;
  }

  h1 {
    text-transform: capitalize;
  }
</style>
