<script lang="ts">
  import { Input } from '$lib/components/ui/input';
  import { Select } from '$lib/components/ui/select/index';
  import { Button } from '$lib/components/ui/button';
  import { createEventDispatcher } from 'svelte';

  export let tags: string[] = [];
  export let isAdmin = false;

  const dispatch = createEventDispatcher<{
    filter: {
      type: 'date' | 'tags';
      date: 'newest' | 'oldest';
      tag: string;
    };
  }>();

  let selectedFilter: 'date' | 'tags' = 'date';
  let dateFilter: 'newest' | 'oldest' = 'newest';
  let tagSearch = '';
  let showTagSearch = false;

  function handleFilter() {
    dispatch('filter', {
      type: selectedFilter,
      date: dateFilter,
      tag: tagSearch,
    });
  }

  function handleReset() {
    selectedFilter = 'date';
    dateFilter = 'newest';
    tagSearch = '';
    showTagSearch = false;
    dispatch('filter', {
      type: 'date',
      date: 'newest',
      tag: '',
    });
  }

  function handleFilterTypeChange() {
    showTagSearch = selectedFilter === 'tags';
    if (!showTagSearch) {
      tagSearch = '';
    }
  }
</script>

<div class="w-full max-w-4xl mx-auto space-y-4 p-4">
  <div class="flex flex-col md:flex-row gap-4">
    <select
      bind:value={selectedFilter}
      on:change={handleFilterTypeChange}
      class="w-full md:w-48 p-2 border rounded-md"
    >
      <option value="date">Filter by Date</option>
      <option value="tags">Filter by Tags</option>
    </select>

    {#if selectedFilter === 'date'}
      <select
        bind:value={dateFilter}
        class="w-full md:w-48 p-2 border rounded-md"
      >
        <option value="newest">Newest First</option>
        <option value="oldest">Oldest First</option>
      </select>
    {:else}
      <div class="flex-1">
        <Input
          type="text"
          placeholder="Search by tag..."
          bind:value={tagSearch}
          class="w-full"
        />
      </div>
    {/if}

    <div class="flex gap-2">
      <Button on:click={handleFilter}>Filter</Button>
      <Button variant="outline" on:click={handleReset}>Reset</Button>
    </div>
  </div>
</div>
