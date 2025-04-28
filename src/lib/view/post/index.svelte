<script>
  import { Button } from '$lib/components/ui/button';
  import PostCard from './PostCard.svelte';
  import { createInfiniteQuery } from '@tanstack/svelte-query';

  const POSTS_PER_PAGE = 6;

  const postsQuery = createInfiniteQuery({
    queryKey: ['posts'],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await fetch(
        `/api/posts?page=${pageParam}&limit=${POSTS_PER_PAGE}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      return response.json();
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.hasMore) {
        return lastPage.posts.length / POSTS_PER_PAGE + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });

  $: posts = $postsQuery.data?.pages.flatMap((page) => page.posts) ?? [];
  $: hasMore =
    $postsQuery.data?.pages[$postsQuery.data.pages.length - 1]?.hasMore ??
    false;
  $: isLoading = $postsQuery.isLoading;
  $: isError = $postsQuery.isError;
</script>

<section id="posts" class="min-h-full space-y-10 py-10 px-7 md:px-14">
  <h1 class="text-4xl font-semibold text-center mt-10">Posts</h1>

  {#if isError}
    <div class="text-center text-red-500">
      Error loading posts. Please try again later.
    </div>
  {:else}
    <div class="flex flex-col items-center gap-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        {#each posts as post}
          <PostCard {post} />
        {/each}
      </div>

      {#if hasMore}
        <Button
          on:click={() => $postsQuery.fetchNextPage()}
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Load more'}
        </Button>
      {/if}
    </div>
  {/if}
</section>
