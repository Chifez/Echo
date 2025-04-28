<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import Editor from '$lib/components/Editor.svelte';
  import { Card } from '$lib/components/ui/card';

  let title = '';
  let description = '';
  let content = '';
  let tags = '';
  let bannerImage = '';
  let isPublishing = false;
  let error = '';

  async function handlePublish() {
    try {
      isPublishing = true;
      error = '';

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          content,
          bannerImage,
          tags: tags.split(',').map((tag) => tag.trim()),
          author: 'Nwosu Emmanuel',
          avatar: '/corporate.jpg',
          role: 'Frontend Engineer',
          published: true,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to publish post');
      }

      // Reset form
      title = '';
      description = '';
      content = '';
      tags = '';
      bannerImage = '';
    } catch (err: any) {
      error = err.message;
    } finally {
      isPublishing = false;
    }
  }
</script>

<div class="container mx-auto px-4 py-8">
  <div class="flex justify-between items-center mb-8">
    <h1 class="text-2xl font-bold">Blog Editor</h1>
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

    <div class="flex justify-end">
      <Button
        on:click={handlePublish}
        disabled={isPublishing ||
          !title ||
          !description ||
          !content ||
          !bannerImage}
      >
        {isPublishing ? 'Publishing...' : 'Publish Post'}
      </Button>
    </div>
  </div>
</div>

<style>
  :global(.prose pre) {
    background-color: #1b1b1b;
    color: #fff;
    padding: 1rem;
    border-radius: 0.5rem;
    overflow-x: auto;
  }

  :global(.prose code) {
    background-color: #f3f4f6;
    padding: 0.2rem 0.4rem;
    border-radius: 0.25rem;
    font-size: 0.875em;
  }

  :global(.prose pre code) {
    background-color: transparent;
    padding: 0;
    border-radius: 0;
    font-size: 1em;
  }
</style>
