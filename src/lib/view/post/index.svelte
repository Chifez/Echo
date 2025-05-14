<script>
  import { Button } from '$lib/components/ui/button';
  import PostCard from './PostCard.svelte';
  import PostFilter from '$lib/components/post-filter.svelte';
  import { createInfiniteQuery } from '@tanstack/svelte-query';

  const POSTS_PER_PAGE = 6;
  let filterParams = {
    type: 'date',
    date: 'newest',
    tag: '',
  };

  const postsQuery = createInfiniteQuery({
    queryKey: ['posts', filterParams],
    queryFn: async ({ pageParam = 1 }) => {
      const params = new URLSearchParams({
        page: pageParam.toString(),
        limit: POSTS_PER_PAGE.toString(),
        ...filterParams,
      });

      const response = await fetch(`/api/posts?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
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

  $: console.log('ui post', $postsQuery.data);
  $: posts = $postsQuery.data?.pages.flatMap((page) => page.posts) ?? [];
  $: hasMore =
    $postsQuery.data?.pages[$postsQuery.data.pages.length - 1]?.hasMore ??
    false;
  $: isLoading = $postsQuery.isLoading;
  $: isPending = $postsQuery.isPending;
  $: isError = $postsQuery.isError;

  /**
   * @param {{ detail: { type: string; date: string; tag: string; }; }} event
   */
  function handleFilter(event) {
    filterParams = event.detail;
    $postsQuery.refetch();
  }

  // Extract unique tags from posts
  $: tags = [...new Set(posts.flatMap((post) => post.tags || []))].filter(
    Boolean
  );
</script>

<section id="posts" class="min-h-full space-y-10 py-10 px-7 md:px-14">
  <h1 class="text-4xl font-semibold text-center mt-10">Posts</h1>
  {#if isLoading}
    Loading...
  {:else}
    <PostFilter {tags} on:filter={handleFilter} />
    {#if posts.length === 0 && isError}
      <div class="text-center text-red-500">
        Error loading posts. Please try again later.
      </div>
    {:else if posts.length === 0}
      <div class="text-center text-gray-500">No posts found.</div>
    {/if}

    {#if posts.length > 0}
      <div class="flex flex-col items-center gap-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          {#each posts as post}
            <PostCard {post} />
          {/each}
        </div>

        {#if hasMore}
          <Button
            on:click={() => $postsQuery.fetchNextPage()}
            disabled={isPending}
          >
            {isPending ? 'Loading...' : 'Load more'}
          </Button>
        {/if}
      </div>
    {/if}
  {/if}
</section>
