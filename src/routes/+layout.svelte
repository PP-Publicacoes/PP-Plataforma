<script lang="ts">
  import '../app.css';
  import favicon from '$lib/assets/favicon.svg';
  import { Toaster } from '$lib/components/ui/sonner/index.js';
  import { getFlash } from 'sveltekit-flash-message';
  import { page } from '$app/state';
  import { toast } from 'svelte-sonner';
  import { ModeWatcher } from 'mode-watcher';
  import ThemeToggle from '$lib/components/theme-toggle.svelte';

  const flash = getFlash(page, {
    clearAfterMs: 5000,
  });

  $effect(() => {
    if (!$flash) return;

    if ($flash.type === 'success') {
      toast.success($flash.message);
    } else if ($flash.type === 'error') {
      toast.error($flash.message);
    } else if ($flash.type === 'info') {
      toast.info($flash.message);
    } else if ($flash.type === 'warning') {
      toast.warning($flash.message);
    }

    $flash = undefined;
  });
  let { children } = $props();
</script>

<svelte:head>
  <link
    rel="icon"
    href={favicon}
  />
</svelte:head>

<ThemeToggle />
<ModeWatcher />
<Toaster
  position="top-center"
  richColors
/>

{@render children?.()}
