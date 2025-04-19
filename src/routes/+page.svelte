<script>
  import Header from '$lib/components/Header.svelte';
  import Hero from '$lib/components/Hero.svelte';
  import Services from '$lib/components/Services.svelte';
  import Approach from '$lib/components/Approach.svelte';
  import Solutions from '$lib/components/Solutions.svelte';
  import Companies from '$lib/components/Companies.svelte';
  import Contact from '$lib/components/Contact.svelte';
  import Footer from '$lib/components/Footer.svelte';
</script>

<div class="flex flex-col min-h-screen">
  <Header />
  <Hero />
  <Companies />
  <Services />
  <Approach />
  <Solutions />
  <Contact />
  <Footer />
</div>