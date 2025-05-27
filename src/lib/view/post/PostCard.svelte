<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { ArrowRight, ArrowRightIcon, Clock, Hash } from 'lucide-svelte';

  export let post: {
    title: string;
    excerpt: string;
    readTime: string;
    category: string;
    image: {
      url: string;
      publicId: string;
    };
    author: {
      name: string;
      avatar?: string;
      role: string;
    };
    tags?: string[];
    slug: string;
    createdAt: string;
  };

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  }
</script>

<article class="flex flex-col h-full bg-white rounded-lg shadow-md">
  <!-- Image -->
  <div class="relative h-48 w-full">
    <img
      src={post.image.url}
      alt={post.title}
      class="w-full h-full object-cover"
    />
    <!-- Category Badge -->
    <div class="absolute top-4 left-4">
      <span
        class="px-3 py-1 text-sm font-medium rounded-full bg-white/90 text-slate-800"
      >
        {post.category}
      </span>
    </div>
  </div>

  <!-- Content -->
  <div class="flex flex-col flex-grow h-fit p-6">
    <h2 class="text-xl font-semibold mb-2 line-clamp-2">
      {post.title}
    </h2>

    <p class="text-gray-600 mb-4 line-clamp-3">
      {post.excerpt}
    </p>

    <!-- Tags -->
    {#if post.tags && post.tags.length > 0}
      <div class="flex flex-wrap gap-2 mb-4">
        {#each post.tags as tag}
          <span
            class="text-xs font-bold text-slate-600 flex items-center gap-1"
          >
            <Hash size={12} />
            {tag}
          </span>
        {/each}
      </div>
    {/if}

    <!-- Meta -->
    <div class="mt-auto">
      <div
        class="flex flex-col items-start justify-between text-sm text-gray-500"
      >
        <div class="flex items-center justify-between w-full mb-4">
          <div class="inline-flex items-center gap-2">
            {#if post.author.avatar}
              <img
                src={post.author.avatar}
                alt={post.author.name}
                class="w-6 h-6 rounded-full"
              />
            {/if}
            <span>{post.author.name}</span>
          </div>

          <span class="flex items-center gap-1">
            <Clock size={16} />
            {post.readTime}
          </span>
        </div>
        <div class="flex justify-between items-center w-full">
          <span>{formatDate(post.createdAt)}</span>

          <Button
            variant="link"
            class="flex items-center gap-1"
            href="/blog/{post.slug}"
          >
            Read More
            <ArrowRightIcon size={12} />
          </Button>
        </div>
      </div>
    </div>
  </div>

  <!-- Read More Button -->
</article>
