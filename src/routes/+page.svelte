<script>
  import Navigation from '$lib/components/navigation.svelte';
  import About from '$lib/view/about.svelte';
  import Contact from '$lib/view/contact.svelte';
  import Hero from '$lib/view/hero.svelte';
  import Posts from '$lib/view/post/index.svelte';
  import Work from '$lib/view/work.svelte';
  import SEO from '$lib/components/SEO.svelte';
</script>

<SEO
  title="Echo. - Learn, Build, and Share"
  description="Welcome to my personal blog where I share my thoughts on development, technology, and personal experiences."
  type="website"
  keywords={[
    'blog',
    'development',
    'technology',
    'personal',
    'web development',
  ]}
/>

<div>
  <Navigation />
  <Hero />
  <About />
  <Work />
  <Posts />
  <Contact />
</div>
