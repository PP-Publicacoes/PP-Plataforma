<script lang="ts">
  import * as Avatar from '$lib/components/ui/avatar/index.js';
  import type { User } from '$lib/server/db/schema/auth';
  import { getAvatar } from '$lib/utils/robohash';

  let { slug, username }: Pick<User, 'username' | 'slug'> = $props();
</script>

<Avatar.Root class="size-8 rounded-lg">
  <Avatar.Image
    src={getAvatar(slug, 32)}
    alt={username}
  />
  <Avatar.Fallback class="rounded-lg">{username.slice(2)}</Avatar.Fallback>
</Avatar.Root>
<div class="grid flex-1 text-left text-sm leading-tight">
  <span class="truncate font-medium">{username}</span>
  <span class="truncate text-xs">{slug}</span>
</div>
