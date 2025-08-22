<script lang="ts">
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import '../../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import AppSidebar from '$lib/components/sidebar/app-sidebar.svelte';

	import { page } from '$app/stores';
	import { derived } from 'svelte/store';
	import { m } from '$lib/paraglide/messages';
    import ThemeToggle from '$lib/components/theme-toggle.svelte';

	const titleize = (s: string) =>
		decodeURIComponent(s)
			.replace(/[-_]+/g, ' ')
			.replace(/\s+/g, ' ')
			.trim()
			.replace(/\b\w/g, (m) => m.toUpperCase());

	const breadcrumbItems = derived(page, ($page) => {
		const { pathname } = $page.url;
		const segments = pathname.split('/').filter(Boolean);

		const paths = segments.map((_, i) => '/' + segments.slice(0, i + 1).join('/'));

		const overrides: Record<string, string> = ($page.data?.breadcrumbs ?? {}) as any;

		const items = segments.map((seg, i) => {
			const href = paths[i];
			const label = overrides[href] ?? titleize(seg);
			return { label, href, isLast: i === segments.length - 1 };
		});

		if (items.length === 0) {
			return [{ label: m['home'](), href: '/', isLast: true }];
		}

		return [{ label: m['home'](), href: '/', isLast: false }, ...items];
	});
	let { children, data } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<Sidebar.Provider>
	<AppSidebar user={data.user} />
	<Sidebar.Inset>
		<header
			class="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12"
		>
			<div class="flex items-center gap-2 px-4">
				<Sidebar.Trigger class="-ml-1" />
				<Separator orientation="vertical" class="mr-2 data-[orientation=vertical]:h-4" />

				<Breadcrumb.Root>
					<Breadcrumb.List>
						{#each $breadcrumbItems as item, i}
							<Breadcrumb.Item class="hidden md:block">
								{#if item.isLast}
									<Breadcrumb.Page aria-current="page">{item.label}</Breadcrumb.Page>
								{:else}
									<Breadcrumb.Link href={item.href}>{item.label}</Breadcrumb.Link>
								{/if}
							</Breadcrumb.Item>
							{#if i < $breadcrumbItems.length - 1}
								<Breadcrumb.Separator class="hidden md:block" />
							{/if}
						{/each}
					</Breadcrumb.List>
				</Breadcrumb.Root>
			</div>
		</header>
		<div class="flex flex-1 flex-col gap-4 p-4 pt-0">
			{@render children?.()}
		</div>
	</Sidebar.Inset>
</Sidebar.Provider>
