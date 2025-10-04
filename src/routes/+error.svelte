<script lang="ts">
  import { page } from '$app/state';
  import Button from '$lib/components/ui/button/button.svelte';
</script>

<div class="flex h-screen flex-col items-center justify-center p-[20%]">
  <h2 class="text-xl font-bold md:text-2xl lg:text-3xl">Oops...</h2>
  <h1 class="mg:text-[16rem] text-[12rem] leading-none font-extrabold lg:text-[20rem]">
    {page.status}
  </h1>
  <h3 class="text-muted-foreground mt-8 text-center text-xl leading-12 font-bold">
    Desculpa. A página
    <br />
    {page.url}
    <br />
    não está disponível.
  </h3>

  <Button
    href="/"
    size="lg"
    variant="secondary"
    class="mt-12"
  >
    Go to Homepage
  </Button>
</div>
