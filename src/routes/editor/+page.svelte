<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import Editor from '$lib/components/editor.svelte';
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from '$lib/components/ui/select';
  import { Card } from '$lib/components/ui/card';
  import { Textarea } from '$lib/components/ui/textarea';
  import { calculateReadTime, slugify } from '$lib/utils/helpers';

  let title = '';
  let excerpt = '';
  let category: any = 'development';
  let content = '';
  let tags = '';
  let likesCount = 0;
  let image = { url: '', publicId: '' };
  let isPublishing = false;
  let error = '';
  let isPublished = true;
  let readTime = '0 mins read';

  const categories = [
    { value: 'development', label: 'Development' },
    { value: 'personal', label: 'Personal' },
  ] as const;

  async function handlePublish() {
    try {
      isPublishing = true;
      error = '';
      const slug = slugify(title);
      readTime = calculateReadTime(content);
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          excerpt,
          content,
          category,
          readTime,
          image,
          slug,
          likesCount,
          tags: tags.split(',').map((tag) => tag.trim()),
          author: {
            name: 'Nwosu Emmanuel',
            avatar: '/corporate.jpg',
            role: 'Frontend Engineer',
          },
          isPublished,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to publish post');
      }

      // Reset form
      title = '';
      excerpt = '';
      isPublished = true;
      readTime = '0 mins read';
      category = 'development';
      content = '';
      tags = '';
      image = { url: '', publicId: '' };
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
        <div class="flex flex-row items-center gap-2 w-full">
          <div>
            <label for="title" class="block text-sm font-medium mb-2">
              Title
            </label>
            <Input
              bind:value={title}
              placeholder="Enter post title"
              id="title"
            />
          </div>
          <div>
            <label for="tags" class="block text-sm font-medium mb-2">Tags</label
            >
            <Input
              bind:value={tags}
              placeholder="e.g. javascript, web, tutorial"
              id="tags"
            />
          </div>
          <Select
            selected={category}
            onSelectedChange={(cat) => {
              category = cat?.value;
            }}
          >
            <SelectTrigger class="w-[180px]">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {#each categories as category}
                <SelectItem value={category.value}>
                  {category.label}
                </SelectItem>
              {/each}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label for="description" class="block text-sm font-medium mb-2"
            >Description</label
          >
          <Textarea bind:value={excerpt} placeholder="Enter post description" />
        </div>

        <div class="flex items-center space-x-2">
          <input
            type="checkbox"
            id="isPublished"
            bind:checked={isPublished}
            class="h-4 w-4 rounded border-gray-300"
          />
          <label for="isPublished" class="text-sm font-medium">
            Publish immediately
          </label>
        </div>
      </div>
    </Card>

    <Card class="p-6">
      <Editor
        {content}
        onUpdate={(newContent) => (content = newContent)}
        onBannerImageUpdate={(url) => (image = url)}
      />
    </Card>

    <div class="flex justify-end">
      <Button
        on:click={handlePublish}
        disabled={isPublishing || !title || !excerpt || !content || !image}
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
