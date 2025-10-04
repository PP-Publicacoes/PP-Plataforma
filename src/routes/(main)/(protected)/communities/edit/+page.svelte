<script lang="ts">
  import type { PageData } from './$types';
  import CommunityForm from './community-form.svelte';

  let { data }: { data: PageData } = $props();
</script>

<div class="flex h-full w-full flex-col items-center justify-center">
  <CommunityForm data={{ user: data.user!, communityForm: data.commnunityForm }} />
</div>
