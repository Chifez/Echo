<script lang="ts">
  import { Input } from '$lib/components/ui/input';
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from '$lib/components/ui/select';
  import { Button } from '$lib/components/ui/button';
  import { createEventDispatcher } from 'svelte';

  export let tags: string[] = [];
  export let isAdmin = false;

  const dispatch = createEventDispatcher<{
    filter: {
      type: 'date' | 'tags' | 'category';
      date: 'newest' | 'oldest';
      category: string;
      tag: string;
    };
  }>();

  let selectedType: any | undefined = 'date';
  let selectedDate: any | undefined = 'newest';
  let selectedCategory: any | undefined = 'all';
  let selectedTag: any | undefined = '';

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'development', label: 'Development' },
    { value: 'personal', label: 'Personal' },
  ] as const;

  function handleFilter() {
    dispatch('filter', {
      type: selectedType as 'date' | 'tags' | 'category',
      date: selectedDate as 'newest' | 'oldest',
      category: selectedCategory,
      tag: selectedTag,
    });
  }

  function handleReset() {
    selectedType = 'date';
    selectedDate = 'newest';
    selectedCategory = 'all';
    selectedTag = '';
    handleFilter();
  }

  function handleFilterTypeChange() {
    // This function is no longer used in the new version
  }
</script>

<div class="w-full max-w-4xl mx-auto space-y-4 p-4">
  <div class="flex flex-col md:flex-row gap-4 items-center justify-center mb-8">
    <!-- Category Filter -->
    <Select
      selected={selectedCategory}
      onSelectedChange={(value) => {
        selectedCategory = value;
        handleFilter();
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

    <!-- Date Filter -->
    <Select
      selected={selectedDate}
      onSelectedChange={(value) => {
        selectedDate = value;
        handleFilter();
      }}
    >
      <SelectTrigger class="w-[180px]">
        <SelectValue placeholder="Sort by date" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="newest">Newest First</SelectItem>
        <SelectItem value="oldest">Oldest First</SelectItem>
      </SelectContent>
    </Select>

    <!-- Tag Filter -->
    {#if tags.length > 0}
      <Select
        selected={selectedTag}
        onSelectedChange={(value) => {
          selectedTag = value;
          handleFilter();
        }}
      >
        <SelectTrigger class="w-[180px]">
          <SelectValue placeholder="Filter by tag" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All Tags</SelectItem>
          {#each tags as tag}
            <SelectItem value={tag}>{tag}</SelectItem>
          {/each}
        </SelectContent>
      </Select>
    {/if}

    <!-- Reset Button -->
    <Button variant="outline" on:click={handleReset}>Reset Filters</Button>
  </div>
</div>
