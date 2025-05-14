<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import Editor from '$lib/components/editor.svelte';
  import { Card } from '$lib/components/ui/card';
  import { goto } from '$app/navigation';
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from '$lib/components/ui/select';
  import { calculateReadTime } from '$lib/utils/helpers';

  export let data;

  const categories = [
    { value: 'development', label: 'Development' },
    { value: 'personal', label: 'Personal' },
  ] as const;

  console.log('page data', data);

  let title = data.post.title;
  let slug = data.post.slug;
  let excerpt = data.post.excerpt;
  let category: any = categories.find(
    (cat) => cat.value === data.post.category
  );
  let contentImages = data.post.contentImages;
  let content = data.post.content;
  let tags = data.post.tags.join(', ');
  let image = data.post.image;
  let isPublishing = false;
  let likesCount = data.post.likesCount || 0;
  let isPublished = data.post.isPublished;
  let readTime = data.post.readTime;
  let error = '';

  interface ImageMetadata {
    url: string;
    publicId: string;
  }

  async function handleUpdate() {
    try {
      isPublishing = true;
      error = '';
      readTime = calculateReadTime(content);
      console.log('data', category, readTime);
      const response = await fetch(`/api/posts/${slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          excerpt,
          category: category?.value,
          readTime,
          isPublished,
          likesCount,
          content,
          image,
          tags: tags.split(',').map((tag: string) => tag.trim()),
          author: {
            name: 'Nwosu Emmanuel',
            avatar: '/corporate.jpg',
            role: 'Frontend Engineer',
          },
          contentImages,
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

  function handleBannerImageUpdate(imageData: ImageMetadata) {
    image = imageData;
  }

  $: console.log('category', category);
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
          <label for="title" class="block text-sm font-medium mb-2">
            Title
          </label>
          <Input bind:value={title} placeholder="Enter post title" id="title" />
        </div>

        <div>
          <label for="description" class="block text-sm font-medium mb-2">
            Description
          </label>
          <Input
            bind:value={excerpt}
            placeholder="Enter post description"
            id="description"
          />
        </div>

        <div>
          <label for="tags" class="block text-sm font-medium mb-2">
            Tags (comma-separated)
          </label>
          <Input
            bind:value={tags}
            placeholder="e.g. javascript, web, tutorial"
            id="tags"
          />
        </div>

        <div>
          <label for="category" class="block text-sm font-medium mb-2">
            Category
          </label>
          <Select
            selected={category}
            onSelectedChange={(cat) => (category = cat)}
          >
            <SelectTrigger class="w-[180px]">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {#each categories as cat}
                <SelectItem value={cat.value}>
                  {cat.label}
                </SelectItem>
              {/each}
            </SelectContent>
          </Select>
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
        onBannerImageUpdate={handleBannerImageUpdate}
        initialImage={image}
      />
    </Card>

    <div class="flex justify-end gap-4">
      <Button variant="outline" on:click={() => goto('/admin')}>Cancel</Button>
      <Button
        on:click={handleUpdate}
        disabled={isPublishing || !title || !excerpt || !content || !image}
      >
        {isPublishing ? 'Updating...' : 'Update Post'}
      </Button>
    </div>
  </div>
</div>
