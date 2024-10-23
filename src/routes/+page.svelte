<script>
  import Navigation from '$lib/components/Navigation.svelte';
  import { Button } from '$lib/components/ui/button';
  import About from '$lib/view/About.svelte';
  import Contact from '$lib/view/Contact.svelte';
  import Hero from '$lib/view/Hero.svelte';
  import Posts from '$lib/view/post/index.svelte';
  import Work from '$lib/view/Work.svelte';

  export let data;
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
  <Posts postData={data} />
  <Contact />
</div>

<style>
</style>
