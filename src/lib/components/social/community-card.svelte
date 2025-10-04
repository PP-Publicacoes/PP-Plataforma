<script lang="ts">
  import * as Card from '$lib/components/ui/card/index.js';
  import { m } from '$lib/paraglide/messages';
  import type { Community, Member, PublicUser } from '$lib/server/db/schema';
  import { tailwindGradientFromSlug } from '$lib/utils/gradient';
  import * as Avatar from '../ui/avatar/';
  import { getAvatar } from '$lib/utils/robohash';

  let {
    community,
    creator,
    height = 24,
    members,
  }: { community: Community; creator: PublicUser; height?: number; members?: Member[] } = $props();
  let gradient = tailwindGradientFromSlug(community.slug).class;
</script>

<Card.Root class="overflow-hidden pt-0">
  <div class="h-{height} {gradient}"></div>
  <Card.Header class="flex w-full gap-4">
    <Avatar.Root class="size-9 rounded-lg border">
      <Avatar.Image
        src={getAvatar(community.slug, 36)}
        alt={community.name}
      />
      <Avatar.Fallback class="rounded-lg">{community.name.slice(2)}</Avatar.Fallback>
    </Avatar.Root>
    <div class="flex flex-col">
      <Card.Title>{community.name}</Card.Title>
      <Card.Description>{community.slug}</Card.Description>
    </div>
    <span class="text-muted-foreground ml-auto items-start text-end text-sm italic">
      {m['community.date.created']({ date: community.createdAt.toLocaleString() })}
      <br />
      {m['community.creator.by']({ username: creator.username })}
    </span>
  </Card.Header>
  {#if community.description}
    <Card.Content class="text-muted-foreground text-sm">
      {community.description}
    </Card.Content>
  {/if}
  {#if members}
    <Card.Footer>
      <h1>Membros ({members.length})</h1>
      {#each members as member}
        <Card.Root>
          <Card.Title>{member.nickname}</Card.Title>
          <Card.Description>
            {m['community.date.since']({ date: member.joinedAt.toLocaleDateString() })}
          </Card.Description>
        </Card.Root>
      {/each}
    </Card.Footer>
  {/if}
</Card.Root>
