<script>
  import { slide, fade } from 'svelte/transition';
  import ChevronDown from 'carbon-icons-svelte/lib/ChevronDown.svelte';

  let isOpen = false;
  export let selectedOption = 'experience';

  const options = ['experience', 'work'];

  function selectOption(option) {
    selectedOption = option;
    isOpen = false;
  }
</script>

<div class="relative">
  <button
    on:click={() => (isOpen = !isOpen)}
    class="p-2 flex items-center justify-between w-40 min-w-20 border rounded-md"
  >
    <p>
      {selectedOption}
    </p>

    <ChevronDown />
  </button>

  {#if isOpen}
    <div on:click={() => (isOpen = false)}></div>

    <div class="dialog" transition:fade={{ duration: 300 }}>
      <div class="dialog-content" transition:slide={{ duration: 300 }}>
        <ul>
          {#each options as option}
            <li
              on:click={() => selectOption(option)}
              class="option text-sm font-medium capitalize"
            >
              {option}
            </li>
          {/each}
        </ul>
      </div>
    </div>
  {/if}
</div>

<style>
  .dialog {
    position: absolute;
    top: 50px;
    right: 0;
    width: 160px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    z-index: 10;
  }

  .dialog-content {
    padding: 2px;
  }

  .option {
    padding: 8px;
    cursor: pointer;
    border-radius: 6px;
    list-style: none;
  }

  .option:hover {
    background-color: #f4f1f1;
  }
</style>
