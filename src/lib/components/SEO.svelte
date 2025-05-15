<script lang="ts">
  export let title: string;
  export let description: string;
  export let image: string = '/og-image.jpg'; // Default OG image
  export let type: 'website' | 'article' = 'website';
  export let url: string = ''; // Canonical URL
  export let keywords: string[] = [];
  export let author: string = 'Nwosu Emmanuel';
  export let publishedTime: string = ''; // For blog posts
  export let modifiedTime: string = ''; // For blog posts

  // Base URL for absolute URLs
  const baseUrl = import.meta.env.PROD
    ? import.meta.env.PUBLIC_BASE_URL
    : 'http://localhost:5173';

  // Construct full URL
  $: fullUrl = url ? `${baseUrl}${url}` : baseUrl;

  // Construct full image URL
  $: fullImageUrl = image.startsWith('http') ? image : `${baseUrl}${image}`;
</script>

<svelte:head>
  <!-- Basic Meta Tags -->
  <title>{title}</title>
  <meta name="description" content={description} />
  {#if keywords.length > 0}
    <meta name="keywords" content={keywords.join(', ')} />
  {/if}
  <meta name="author" content={author} />

  <!-- Canonical URL -->
  <link rel="canonical" href={fullUrl} />

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content={type} />
  <meta property="og:url" content={fullUrl} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={fullImageUrl} />

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:url" content={fullUrl} />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={fullImageUrl} />
  <meta name="twitter:creator" content="@chifez4u" />
  <meta name="twitter:site" content="@chifez4u" />

  <!-- Article specific meta tags -->
  {#if type === 'article'}
    <meta property="article:author" content={author} />
    {#if publishedTime}
      <meta property="article:published_time" content={publishedTime} />
    {/if}
    {#if modifiedTime}
      <meta property="article:modified_time" content={modifiedTime} />
    {/if}
  {/if}

  <!-- Favicon -->
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
  <link rel="manifest" href="/site.webmanifest" />
  <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
  <meta name="msapplication-TileColor" content="#da532c" />
  <meta name="theme-color" content="#ffffff" />
</svelte:head>
