<script lang="ts">
  import { Heart } from 'lucide-svelte';
  import { Button } from '$lib/components/ui/button';
  import { onMount } from 'svelte';

  export let slug: string;
  export let initialLikesCount = 0;

  let likesCount = initialLikesCount;
  let hasLiked = false;
  let isLoading = true;
  let isUpdating = false;

  async function fetchLikeStatus() {
    try {
      const response = await fetch(`/api/posts/${slug}/like`);
      if (!response.ok) throw new Error('Failed to fetch like status');
      const data = await response.json();
      console.log('data', data);
      likesCount = data.likesCount;
      hasLiked = data.hasLiked;
    } catch (error) {
      console.error('Error fetching like status:', error);
    } finally {
      isLoading = false;
    }
  }

  async function toggleLike() {
    if (isUpdating) return;

    try {
      isUpdating = true;
      const response = await fetch(`/api/posts/${slug}/like`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to update like');

      const data = await response.json();
      likesCount = data.likesCount;
      hasLiked = data.liked;
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      isUpdating = false;
    }
  }

  onMount(fetchLikeStatus);
</script>

<Button
  variant="ghost"
  size="sm"
  class="flex items-center gap-2 {hasLiked
    ? 'text-red-500 hover:text-red-600'
    : 'text-gray-500 hover:text-gray-600'}"
  on:click={toggleLike}
  disabled={isLoading || isUpdating}
>
  <span class:animate-pulse={isUpdating}>
    <Heart class="h-5 w-5 {hasLiked ? 'fill-current' : ''}" />
  </span>
  <span class="font-medium">{likesCount}</span>
</Button>
