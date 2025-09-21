<script lang="ts">
  // import NavMain from './nav-main.svelte';
  // import NavProjects from './nav-projects.svelte';
  import NavUser from './nav-user.svelte';
  import * as Sidebar from '$lib/components/ui/sidebar/index.js';
  import type { ComponentProps } from 'svelte';
  import { m } from '$lib/paraglide/messages';
  import type { PublicUser } from '$lib/server/db/views/auth';
  import type { SidebarCommunity } from '$lib/server/db/views/table';
  import CommunitySwitcher from './community-switcher.svelte';

  let {
    ref = $bindable(null),
    collapsible = 'icon',
    user = null,
    communities,
    ...restProps
  }: ComponentProps<typeof Sidebar.Root> & {
    user: PublicUser | null;
    communities: SidebarCommunity[];
  } = $props();

  // This is sample data.
  const data = {
    communities: [
      {
        name: 'Geral',
        slug: 'geral',
        nickname: user?.username ?? m['community.switcher.unknown'](),
      },
      ...communities.map(c => ({
        name: c.name,
        slug: c.slug,
        nickname: c.nickname,
      })),
    ] satisfies SidebarCommunity[],
    // navMain: [
    //   {
    //     title: 'Playground',
    //     url: '#',
    //     icon: SquareTerminalIcon,
    //     isActive: true,
    //     items: [
    //       {
    //         title: 'History',
    //         url: '#',
    //       },
    //       {
    //         title: 'Starred',
    //         url: '#',
    //       },
    //       {
    //         title: 'Settings',
    //         url: '#',
    //       },
    //     ],
    //   },
    //   {
    //     title: 'Models',
    //     url: '#',
    //     icon: BotIcon,
    //     items: [
    //       {
    //         title: 'Genesis',
    //         url: '#',
    //       },
    //       {
    //         title: 'Explorer',
    //         url: '#',
    //       },
    //       {
    //         title: 'Quantum',
    //         url: '#',
    //       },
    //     ],
    //   },
    //   {
    //     title: 'Documentation',
    //     url: '#',
    //     icon: BookOpenIcon,
    //     items: [
    //       {
    //         title: 'Introduction',
    //         url: '#',
    //       },
    //       {
    //         title: 'Get Started',
    //         url: '#',
    //       },
    //       {
    //         title: 'Tutorials',
    //         url: '#',
    //       },
    //       {
    //         title: 'Changelog',
    //         url: '#',
    //       },
    //     ],
    //   },
    //   {
    //     title: 'Settings',
    //     url: '#',
    //     icon: Settings2Icon,
    //     items: [
    //       {
    //         title: 'General',
    //         url: '#',
    //       },
    //       {
    //         title: 'Team',
    //         url: '#',
    //       },
    //       {
    //         title: 'Billing',
    //         url: '#',
    //       },
    //       {
    //         title: 'Limits',
    //         url: '#',
    //       },
    //     ],
    //   },
    // ],
    // projects: [
    //   {
    //     name: 'Design Engineering',
    //     url: '#',
    //     icon: FrameIcon,
    //   },
    //   {
    //     name: 'Sales & Marketing',
    //     url: '#',
    //     icon: ChartPieIcon,
    //   },
    //   {
    //     name: 'Travel',
    //     url: '#',
    //     icon: MapIcon,
    //   },
    // ],
  };
</script>

<Sidebar.Root
  {collapsible}
  {...restProps}
>
  <Sidebar.Header>
    <CommunitySwitcher communities={data.communities} />
  </Sidebar.Header>
  <Sidebar.Content>
    <!-- <NavMain items={data.navMain} /> -->
    <!-- <NavProjects projects={data.projects} /> -->
  </Sidebar.Content>
  <Sidebar.Footer>
    <NavUser {user} />
  </Sidebar.Footer>
  <Sidebar.Rail />
</Sidebar.Root>
