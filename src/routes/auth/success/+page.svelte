<script>
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';

  $: returnTo = $page.url.searchParams.get('returnTo') || '/admin';

  onMount(() => {
    setTimeout(() => goto(returnTo), 1500);
  });
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-50">
  <div
    class="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg text-center"
  >
    <div class="animate-pulse">
      <svg
        class="w-16 h-16 mx-auto text-green-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </div>
    <h2 class="mt-6 text-3xl font-extrabold text-gray-900">
      Login Successful!
    </h2>
    <p class="mt-2 text-sm text-gray-600">
      Redirecting you to {returnTo}...
    </p>
  </div>
</div>
