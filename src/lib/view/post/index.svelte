<script>
  import Button from '$lib/components/ui/button/button.svelte';
  import PostCard from './PostCard.svelte';

  export let postData;
  // let posts = JSON.stringify(postData);
  // let posts = new Array(4).fill(4);
</script>

<section id="posts" class="min-h-full space-y-10 py-10 px-7 md:px-14">
  <h1 class="text-4xl font-semibold text-center mt-10">Posts</h1>
  <div class="flex flex-col items-center gap-4">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- {JSON.stringify(postData)} -->
      {#each postData.posts as post, index}
        <PostCard {post} />
      {/each}
    </div>
    <Button>Load more</Button>
  </div>
</section>
