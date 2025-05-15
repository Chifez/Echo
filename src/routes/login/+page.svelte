<script>
  import { Button } from '$lib/components/ui/button';
  import { PUBLIC_GOOGLE_CLIENT_ID, PUBLIC_BASE_URL } from '$env/static/public';
  import { page } from '$app/stores';
  import { onMount } from 'svelte';

  // Get the returnTo URL from the query parameters
  $: returnTo = $page.url.searchParams.get('returnTo') || '/editor';
  let debugInfo = '';

  onMount(() => {
    debugInfo = `Return To: ${returnTo}, PROD: ${import.meta.env.PROD}, BASE_URL: ${PUBLIC_BASE_URL}`;
    console.log('Login page mounted');
    console.log('Return To:', returnTo);
    console.log('Is Production:', import.meta.env.PROD);
    console.log('Base URL:', PUBLIC_BASE_URL);
  });

  function handleGoogleLogin() {
    const redirectUri = import.meta.env.PROD
      ? `${PUBLIC_BASE_URL}/auth/callback/google`
      : 'http://localhost:5173/auth/callback/google';

    console.log('Login initiated');
    console.log('Redirect URI:', redirectUri);
    console.log('Return To:', returnTo);
    
    const scope = 'email profile';
    const responseType = 'code';
    const accessType = 'offline';
    const prompt = 'consent';

    const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    url.searchParams.append('client_id', PUBLIC_GOOGLE_CLIENT_ID);
    url.searchParams.append('redirect_uri', redirectUri);
    url.searchParams.append('scope', scope);
    url.searchParams.append('response_type', responseType);
    url.searchParams.append('access_type', accessType);
    url.searchParams.append('prompt', prompt);
    // Add state parameter to preserve returnTo URL
    url.searchParams.append('state', encodeURIComponent(returnTo));

    console.log('Full OAuth URL:', url.toString());
    window.location.href = url.toString();
  }
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-50">
  <div class="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
    <div>
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Sign in to your account
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Access the blog editor
      </p>
    </div>
    <div class="mt-8 space-y-6">
      <Button
        on:click={handleGoogleLogin}
        class="w-full flex justify-center items-center gap-2 transition-all duration-300 hover:scale-[1.02]"
      >
        <svg class="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="currentColor"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="currentColor"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Sign in with Google
      </Button>
      
      {#if import.meta.env.DEV}
        <div class="mt-4 p-4 bg-gray-100 rounded text-xs text-gray-600">
          <p>Debug Info (DEV only):</p>
          <p>{debugInfo}</p>
        </div>
      {/if}
    </div>
  </div>
</div>