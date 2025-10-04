<script lang="ts">
  import CommunityCard from '$lib/components/social/community-card.svelte';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
  let { community, creator } = data;
</script>

<div class="mt-4 flex flex-col gap-4">
  <CommunityCard
    {community}
    creator={creator!}
    members={data.members}
  />
</div>
