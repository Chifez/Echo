<script>
  import Navigation from '$lib/components/navigation.svelte';
  import About from '$lib/view/about.svelte';
  import Contact from '$lib/view/contact.svelte';
  import Hero from '$lib/view/hero.svelte';
  import Posts from '$lib/view/post/index.svelte';
  import Work from '$lib/view/work.svelte';
</script>

<svelte:head>
  <title>Echo. - Personal blog</title>
  <meta name="description" content="Personal blog for echo" />
</svelte:head>
<div>
  <Navigation />
  <Hero />
  <About />
  <Work />
  <Posts />
  <Contact />
</div>
