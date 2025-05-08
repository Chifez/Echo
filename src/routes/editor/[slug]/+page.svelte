<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import Editor from '$lib/components/editor.svelte';
  import { Card } from '$lib/components/ui/card';
  import { goto } from '$app/navigation';

  export let data;

  let title = data.post.title;
  let description = data.post.description;
  let content = data.post.content;
  let tags = data.post.tags.join(', ');
  let bannerImage = data.post.bannerImage;
  let isPublishing = false;
  let error = '';

  async function handleUpdate() {
    try {
      isPublishing = true;
      error = '';

      const response = await fetch(`/api/posts/${data.post.slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          content,
          bannerImage,
          tags: tags.split(',').map((tag: string) => tag.trim()),
          author: 'Nwosu Emmanuel',
          avatar: '/corporate.jpg',
          role: 'Frontend Engineer',
          published: true,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update post');
      }

      // Redirect to admin page
      goto('/admin');
    } catch (err: any) {
      error = err.message;
    } finally {
      isPublishing = false;
    }
  }
</script>

<div class="container mx-auto px-4 py-8">
  <div class="flex justify-between items-center mb-8">
    <h1 class="text-2xl font-bold">Edit Post</h1>
  </div>

  {#if error}
    <div
      class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
    >
      {error}
    </div>
  {/if}

  <div class="space-y-6">
    <Card class="p-6">
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-2">Title</label>
          <Input bind:value={title} placeholder="Enter post title" />
        </div>

        <div>
          <label class="block text-sm font-medium mb-2">Description</label>
          <Input
            bind:value={description}
            placeholder="Enter post description"
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-2"
            >Tags (comma-separated)</label
          >
          <Input
            bind:value={tags}
            placeholder="e.g. javascript, web, tutorial"
          />
        </div>
      </div>
    </Card>

    <Card class="p-6">
      <Editor
        {content}
        onUpdate={(newContent) => (content = newContent)}
        onBannerImageUpdate={(url) => (bannerImage = url)}
      />
    </Card>

    <div class="flex justify-end gap-4">
      <Button variant="outline" on:click={() => goto('/admin')}>Cancel</Button>
      <Button
        on:click={handleUpdate}
        disabled={isPublishing ||
          !title ||
          !description ||
          !content ||
          !bannerImage}
      >
        {isPublishing ? 'Updating...' : 'Update Post'}
      </Button>
    </div>
  </div>
</div>
