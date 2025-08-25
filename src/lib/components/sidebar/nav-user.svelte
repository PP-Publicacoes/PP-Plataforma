<script lang="ts">
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
  import * as Sidebar from '$lib/components/ui/sidebar/index.js';
  import { useSidebar } from '$lib/components/ui/sidebar/index.js';
  import BellIcon from '@lucide/svelte/icons/bell';
  import ChevronsUpDownIcon from '@lucide/svelte/icons/chevrons-up-down';
  import { Button } from '$lib/components/ui/button/index.js';
  import LogOutIcon from '@lucide/svelte/icons/log-out';
  import { goto } from '$app/navigation';
  import type { PublicUser } from '$lib/types/public-user';
  import AvatarTile from '../avatar/avatar-tile.svelte';
  import { m } from '$lib/paraglide/messages';
  import { AuthTab } from '$lib/enums/auth-tab';
  import UserRound from '@lucide/svelte/icons/user-round';

  // Preferível expor a prop como export let (padrão Svelte).
  // Se você continua usando $props() adapte conforme necessário.
  let { user }: { user: PublicUser } = $props();
  const sidebar = useSidebar();

  // Navegação programática (opcional)
  function goToLogin() {
    goto('auth/');
  }
  function goToRegister() {
    goto(`auth/?t=${AuthTab.register}`);
  }
  function goToProfile() {
    goto('/my-profile');
  }
  function goToNotifications() {
    goto('/notifications');
  }
</script>

<Sidebar.Menu>
  {#if user}
    {@const { username, slug } = user}
    <!-- Quando existir usuário: mostra dropdown com avatar e opção de logout (form) -->
    <Sidebar.MenuItem>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          {#snippet child({ props })}
            <Sidebar.MenuButton
              size="lg"
              class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              {...props}
            >
              <AvatarTile
                {username}
                {slug}
              />
              <ChevronsUpDownIcon class="ml-auto size-4" />
            </Sidebar.MenuButton>
          {/snippet}
        </DropdownMenu.Trigger>

        <DropdownMenu.Content
          class="w-(--bits-dropdown-menu-anchor-width) min-w-56 rounded-lg"
          side={sidebar.isMobile ? 'bottom' : 'right'}
          align="end"
          sideOffset={4}
        >
          <DropdownMenu.Label class="p-0 font-normal">
            <div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <AvatarTile
                {username}
                {slug}
              />
            </div>
          </DropdownMenu.Label>

          <!-- <DropdownMenu.Separator /> -->
          <!-- <DropdownMenu.Group> -->
          <!-- 	<DropdownMenu.Item> -->
          <!-- 		<SparklesIcon /> -->
          <!-- 		Upgrade to Pro -->
          <!-- 	</DropdownMenu.Item> -->
          <!-- </DropdownMenu.Group> -->

          <DropdownMenu.Separator />
          <Button
            variant="ghost"
            class="w-full justify-start"
            onclick={goToProfile}
          >
            <UserRound />
            {m['nav_user.profile']()}
          </Button>
          <!-- <DropdownMenu.Item> -->
          <!-- 	<CreditCardIcon /> -->
          <!-- 	Billing -->
          <!-- </DropdownMenu.Item> -->
          <Button
            variant="ghost"
            class="w-full justify-start p-1"
            onclick={goToNotifications}
          >
            <BellIcon />
            {m['nav_user.notifications']()}
          </Button>

          <DropdownMenu.Separator />

          <!-- Logout via named action -->
          <!-- Se o seu +page.server.ts com `actions.logout` estiver na mesma rota deste componente,
					     use action="?/logout". Caso esteja em /demo/lucia, use "/demo/lucia?/logout". -->
          <form
            method="POST"
            action="/auth?/logout"
            class="m-0"
          >
            <!-- botão estilizado para se comportar como item do dropdown -->
            <Button
              type="submit"
              variant="ghost"
              aria-label="Log out"
              class="w-full justify-start"
            >
              <LogOutIcon />
              {m['logout.label']()}
            </Button>
          </form>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </Sidebar.MenuItem>
  {:else}
    <!-- Quando não houver usuário: mostra botões Login / Registrar -->
    <Sidebar.MenuItem>
      <!-- Botões simples (links) -->
      <div class="grid grid-cols-2 gap-2 px-2">
        <!-- usar <a> é a forma mais simples; goto() permite navegação programática se preferir -->
        <Button onclick={goToLogin}>{m['auth_tab.login']()}</Button>
        <Button onclick={goToRegister}>{m['auth_tab.register']()}</Button>
      </div>
    </Sidebar.MenuItem>
  {/if}
</Sidebar.Menu>
