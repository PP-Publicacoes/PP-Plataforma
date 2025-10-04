<script lang="ts">
  import { goto } from '$app/navigation';
  import * as Avatar from '$lib/components/ui/avatar/index.js';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
  import * as Sidebar from '$lib/components/ui/sidebar/index.js';
  import { useSidebar } from '$lib/components/ui/sidebar/index.js';
  import { m } from '$lib/paraglide/messages';
  import type { SidebarCommunity } from '$lib/server/db/schema/social';
  import { getAvatar } from '$lib/utils/robohash';
  import { capitalize } from '$lib/utils/text';
  import ChevronsUpDownIcon from '@lucide/svelte/icons/chevrons-up-down';
  import PlusIcon from '@lucide/svelte/icons/plus';

  let { communities }: { communities: SidebarCommunity[] } = $props();
  const sidebar = useSidebar();

  let activeCommunity = $state(communities[0]);
  const goToEditCommunity = () => goto('/communities/edit');
</script>

<Sidebar.Menu>
  <Sidebar.MenuItem>
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        {#snippet child({ props })}
          <Sidebar.MenuButton
            {...props}
            size="lg"
            class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <div
              class="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg"
            >
              <Avatar.Root class="size-8 rounded-lg">
                <Avatar.Image
                  src={getAvatar(activeCommunity.slug, 32)}
                  alt={activeCommunity.name}
                />
                <Avatar.Fallback class="rounded-lg">
                  {activeCommunity.name.slice(2)}
                </Avatar.Fallback>
              </Avatar.Root>
            </div>
            <div class="grid flex-1 text-left text-sm leading-tight">
              <span class="truncate font-medium">
                {activeCommunity.name}
              </span>
              <span class="truncate text-xs">{activeCommunity.nickname}</span>
            </div>
            <ChevronsUpDownIcon class="ml-auto" />
          </Sidebar.MenuButton>
        {/snippet}
      </DropdownMenu.Trigger>
      <DropdownMenu.Content
        class="w-(--bits-dropdown-menu-anchor-width) min-w-56 rounded-lg"
        align="start"
        side={sidebar.isMobile ? 'bottom' : 'right'}
        sideOffset={4}
      >
        <DropdownMenu.Label class="text-muted-foreground text-xs">
          {capitalize(m['community.label.plural']())}
        </DropdownMenu.Label>
        {#each communities as community, index (community.name)}
          <DropdownMenu.Item
            onSelect={() => (activeCommunity = community)}
            class="gap-2 p-2"
          >
            <div class="flex size-6 items-center justify-center rounded-md border">
              <Avatar.Root class="size-5 rounded-lg">
                <Avatar.Image
                  src={getAvatar(activeCommunity.slug, 20)}
                  alt={activeCommunity.name}
                />
                <Avatar.Fallback class="rounded-lg">
                  {activeCommunity.name.slice(2)}
                </Avatar.Fallback>
              </Avatar.Root>
            </div>
            {community.name}
            <DropdownMenu.Shortcut>⌘{index + 1}</DropdownMenu.Shortcut>
          </DropdownMenu.Item>
        {/each}
        <DropdownMenu.Separator />
        <DropdownMenu.Item
          class="gap-2 p-2"
          onSelect={() => goToEditCommunity()}
        >
          <div class="flex size-6 items-center justify-center rounded-md border bg-transparent">
            <PlusIcon class="size-4" />
          </div>
          <div class="text-muted-foreground font-medium">{m['community.switcher.add']()}</div>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  </Sidebar.MenuItem>
</Sidebar.Menu>
