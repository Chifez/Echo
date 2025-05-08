<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Card } from '$lib/components/ui/card';
  import { onMount } from 'svelte';
  import { Trash2, Edit } from 'lucide-svelte';

  let posts: any[] = [];
  let isLoading = true;
  let error = '';

  async function fetchPosts() {
    try {
      const response = await fetch('/api/posts/admin');
      if (!response.ok) throw new Error('Failed to fetch posts');
      posts = await response.json();
    } catch (err: any) {
      error = err.message;
    } finally {
      isLoading = false;
    }
  }

  async function deletePost(slug: string) {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const response = await fetch(`/api/posts/${slug}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete post');

      // Remove post from list
      posts = posts.filter((post) => post.slug !== slug);
    } catch (err: any) {
      error = err.message;
    }
  }

  onMount(fetchPosts);
</script>

<div class="container mx-auto px-4 py-8">
  <div class="flex justify-between items-center mb-8">
    <h1 class="text-2xl font-bold">Manage Posts</h1>
    <Button href="/editor">Create New Post</Button>
  </div>

  {#if error}
    <div
      class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
    >
      {error}
    </div>
  {/if}

  {#if isLoading}
    <div class="text-center">Loading posts...</div>
  {:else if posts.length === 0}
    <div class="text-center">No posts found</div>
  {:else}
    <div class="grid gap-4">
      {#each posts as post}
        <Card class="p-4">
          <div class="flex items-center justify-between">
            <div class="space-y-1">
              <h2 class="text-xl font-semibold">{post.title}</h2>
              <p class="text-sm text-gray-500">
                {new Date(post.date).toLocaleDateString()}
              </p>
            </div>
            <div class="flex items-center gap-2">
              <Button variant="ghost" size="sm" href={`/editor/${post.slug}`}>
                <Edit class="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                on:click={() => deletePost(post.slug)}
              >
                <Trash2 class="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      {/each}
    </div>
  {/if}
</div>
