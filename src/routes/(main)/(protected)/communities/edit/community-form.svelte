<script lang="ts">
  import * as Form from '$lib/components/ui/form/index.js';
  import * as RadioGroup from '$lib/components/ui/radio-group/index.js';
  import { DELAY_MS } from '$lib/consts/forms';
  import { m } from '$lib/paraglide/messages';
  import { communitySchema, type CommunitySchema } from '$lib/schemas/social';
  import type { PublicUser } from '$lib/server/db/schema';
  import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
  import { zod4Client } from 'sveltekit-superforms/adapters';
  import { Input } from '$lib/components/ui/input/index';
  import { Textarea } from '$lib/components/ui/textarea/index';
  import Loader2Icon from '@lucide/svelte/icons/loader-2';
  import { Route } from '$lib/enums/routes';

  let {
    data,
  }: {
    data: {
      user: PublicUser;
      communityForm: SuperValidated<Infer<CommunitySchema>>;
    };
  } = $props();

  const communityForm = superForm(data.communityForm, {
    validators: zod4Client(communitySchema),
    delayMs: DELAY_MS,
  });
  const { form, enhance, delayed, submitting } = communityForm;

  let visibility = $state($form.public ? 'public' : 'private');

  $effect(() => {
    const nextBool = visibility === 'public';
    if ($form.public !== nextBool) $form.public = nextBool;
  });
</script>

<div class="flex flex-col gap-4">
  <form
    method="POST"
    use:enhance
    action="?/{Route.edit}"
    class="flex flex-col gap-1"
  >
    <!-- Header -->
    <div class="mb-4 flex flex-col items-center gap-2 text-center">
      <h1 class="text-2xl font-bold">{m['community.title']()}</h1>
      <p class="text-muted-foreground text-sm text-balance">
        {m['community.description_form']()}
      </p>
    </div>

    <!-- Name -->
    <Form.Field
      form={communityForm}
      name="name"
    >
      <Form.Control>
        {#snippet children({ props })}
          <Form.Label>{m['community.name.label']()}</Form.Label>
          <Input
            {...props}
            bind:value={$form.name}
          />
        {/snippet}
      </Form.Control>
      <Form.Description>{m['community.name.description']()}</Form.Description>
      <Form.FieldErrors />
    </Form.Field>

    <!-- Description -->
    <Form.Field
      form={communityForm}
      name="description"
    >
      <Form.Control>
        {#snippet children({ props })}
          <div class="flex items-center">
            <Form.Label>
              {m['community.description.label']()}
            </Form.Label>
          </div>
          <Textarea
            {...props}
            bind:value={$form.description}
          />
        {/snippet}
      </Form.Control>
      <Form.Description>{m['community.description.description']()}</Form.Description>
      <Form.FieldErrors />
    </Form.Field>

    <!-- Visibility -->
    <Form.Fieldset
      form={communityForm}
      name="public"
      class="space-y-3"
    >
      <Form.Legend>{m['community.visibility.label']()}</Form.Legend>
      <RadioGroup.Root
        bind:value={visibility}
        class="flex flex-col space-y-1"
        name="public"
      >
        <div class="flex items-center space-y-0 space-x-3">
          <Form.Control>
            {#snippet children({ props })}
              <RadioGroup.Item
                value="public"
                {...props}
              />
              <Form.Label>{m['community.public.label']()}</Form.Label>
              <Form.Description>
                {m['community.public.description']()}
              </Form.Description>
            {/snippet}
          </Form.Control>
        </div>
        <div class="flex items-center space-y-0 space-x-3">
          <Form.Control>
            {#snippet children({ props })}
              <RadioGroup.Item
                value="private"
                {...props}
              />
              <Form.Label>{m['community.private.label']()}</Form.Label>
              <Form.Description class="mt-1">
                {m['community.private.description']()}
              </Form.Description>
            {/snippet}
          </Form.Control>
        </div>
      </RadioGroup.Root>
      <Form.FieldErrors />
    </Form.Fieldset>

    <!-- Button -->
    <Form.Button
      class="w-full"
      disabled={$submitting}
    >
      {#if $delayed}
        <Loader2Icon class="animate-spin" />
      {:else}
        {m['community.button.edit']()}
      {/if}
    </Form.Button>
  </form>
</div>
