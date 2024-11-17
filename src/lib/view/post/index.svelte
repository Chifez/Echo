<script>
  import Button from '$lib/components/ui/button/button.svelte';
  import PostCard from './PostCard.svelte';

  export let postData;

  // Default number of posts to display
  const DEFAULT_POSTS = 2;
  let visiblePosts = [];
  let showLoadMore = false;

  // Initialize visible posts and button visibility
  $: {
    visiblePosts = postData.posts.slice(0, DEFAULT_POSTS);
    showLoadMore = postData.posts.length > DEFAULT_POSTS;
  }

  // Function to load more posts
  function loadMore() {
    const newCount = visiblePosts.length + DEFAULT_POSTS;
    visiblePosts = postData.posts.slice(0, newCount);

    // Hide the button if we've loaded all posts
    if (visiblePosts.length >= postData.posts.length) {
      showLoadMore = false;
    }
  }
</script>

<section id="posts" class="min-h-full space-y-10 py-10 px-7 md:px-14">
  <h1 class="text-4xl font-semibold text-center mt-10">Posts</h1>
  <div class="flex flex-col items-center gap-4">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- {JSON.stringify(postData)} -->
      {#each visiblePosts as post}
        <PostCard {post} />
      {/each}
    </div>

    <!-- Conditionally show the button -->
    {#if showLoadMore}
      <Button on:click={loadMore}>Load more</Button>
    {/if}
  </div>
</section>
