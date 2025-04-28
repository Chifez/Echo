<script lang="ts">
  import { Button } from '$lib/components/ui/button';

  export let post: any;

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  }
</script>

<section class="bg-gray-100 rounded-lg shadow-lg overflow-hidden">
  <div class="relative h-48 w-full">
    <img
      src={post.bannerImage}
      alt={post.title}
      class="w-full h-full object-cover"
    />
  </div>
  <div class="p-4">
    <div>
      <h1 class="text-xl font-semibold my-1">
        {post.title}
      </h1>
      <p class="text-sm font-medium text-gray-500 my-1">
        Posted on {formatDate(post.date)}
      </p>
    </div>
    <div class="line-clamp-3">
      {post.description}
    </div>
    <Button variant="link" href={`/blog/${post.slug}`} class="-ml-4"
      >Read more</Button
    >
  </div>
</section>
