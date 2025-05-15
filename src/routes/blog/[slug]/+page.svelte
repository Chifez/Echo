<script lang="ts">
  import { ChevronLeft } from 'carbon-icons-svelte';
  import { Button } from '$lib/components/ui/button';
  import LikeButton from '$lib/components/LikeButton.svelte';
  import SEO from '$lib/components/SEO.svelte';
  import { onMount } from 'svelte';

  export let data;
  let isLoading = true;
  let error: string | null = null;

  onMount(() => {
    isLoading = false;
  });
</script>

<SEO
  title={data?.meta?.title || 'Blog Post'}
  description={data?.meta?.description || ''}
  type="article"
  url={`/blog/${data.slug}`}
  image={data?.meta?.image?.url || ''}
  keywords={data?.meta?.tags || []}
  author={data?.meta?.author}
  publishedTime={data?.meta?.date}
/>

<div class="min-h-screen">
  {#if isLoading}
    <div class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div
          class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"
        ></div>
        <p class="mt-4 text-gray-600">Loading post...</p>
      </div>
    </div>
  {:else if error}
    <div class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <h2 class="text-2xl font-semibold text-red-600 mb-4">
          Error Loading Post
        </h2>
        <p class="text-gray-600 mb-4">{error}</p>
        <Button variant="outline" href="/#posts">Back to Posts</Button>
      </div>
    </div>
  {:else}
    <article class="py-8">
      <main class="mx-auto max-w-screen-md px-4 lg:px-8">
        <!-- Banner Image -->
        {#if data.meta.image?.url}
          <div class="w-full h-[400px] mb-8 rounded-lg overflow-hidden">
            <img
              src={data.meta.image.url}
              alt={data.meta.title}
              class="w-full h-full object-cover"
            />
          </div>
        {/if}

        <!-- Title -->
        <hgroup
          class="flex flex-col items-center justify-center text-center w-full mb-8"
        >
          <p class="text-sm text-gray-500">{data.meta.date}</p>
          <h1 class="font-bold text-3xl md:text-4xl py-2 text-center">
            {data.meta.title}
          </h1>
          {#if data.meta.description}
            <p class="text-gray-600 mt-2 max-w-2xl">
              {data.meta.description}
            </p>
          {/if}
        </hgroup>

        <!-- Author Info -->
        <div
          class="flex items-center justify-between gap-4 my-6 border-y border-gray-200 py-4"
        >
          <div class="flex items-center gap-4">
            {#if data.meta.avatar}
              <img
                src={data.meta.avatar}
                alt={data.meta.author}
                class="w-12 h-12 rounded-full"
              />
            {/if}
            <div>
              <p class="font-semibold">{data.meta.author}</p>
              {#if data.meta.role}
                <p class="text-gray-500 text-sm">{data.meta.role}</p>
              {/if}
            </div>
          </div>
          <LikeButton
            slug={data.slug}
            initialLikesCount={data.meta.likesCount}
          />
        </div>

        <!-- Content -->
        <div class="prose prose-lg max-w-none pt-4 pb-8">
          {@html data.content}
        </div>

        <!-- Content Images -->
        <!-- {#if data.meta.contentImages && data.meta.contentImages.length > 0}
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
            {#each data.meta.contentImages as image}
              <div class="relative aspect-video rounded-lg overflow-hidden">
                <img
                  src={image.url}
                  alt="Content banner"
                  class="w-full h-full object-cover"
                />
              </div>
            {/each}
          </div>
        {/if} -->

        <!-- Tags -->
        {#if data.meta.tags && data.meta.tags.length > 0}
          <div class="flex flex-wrap gap-2 py-4 border-t border-gray-200">
            {#each data.meta.tags as tag}
              <div
                class="text-sm bg-slate-100 text-slate-700 px-3 py-1 rounded-full"
              >
                {tag}
              </div>
            {/each}
          </div>
        {/if}

        <!-- Back Button -->
        <div class="mt-8">
          <Button
            variant="ghost"
            class="flex items-center gap-2 text-slate-700"
            href="/#posts"
          >
            <ChevronLeft />
            Back to all posts
          </Button>
        </div>
      </main>
    </article>
  {/if}
</div>

<style>
  :global(.prose) {
    max-width: none;
  }

  :global(.prose img) {
    margin: 2rem auto;
    border-radius: 0.5rem;
  }

  :global(.prose h2) {
    margin-top: 2rem;
    margin-bottom: 1rem;
  }

  :global(.prose p) {
    margin-bottom: 1.5rem;
    line-height: 1.8;
  }
</style>
