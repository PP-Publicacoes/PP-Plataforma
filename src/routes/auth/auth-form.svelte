<script lang="ts">
  import * as Form from '$lib/components/ui/form/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
  import { zod4Client } from 'sveltekit-superforms/adapters';
  import {
    loginSchema,
    registerSchema,
    type LoginSchema,
    type RegisterSchema,
  } from '$lib/schemas/auth';
  import { m } from '$lib/paraglide/messages.js';
  import * as Tabs from '$lib/components/ui/tabs/index.js';
  import { AuthTab } from '$lib/enums/auth-tab';
  import { DELAY_MS } from '$lib/consts/forms';
  import Loader2Icon from '@lucide/svelte/icons/loader-2';

  let {
    data,
  }: {
    data: {
      loginForm: SuperValidated<Infer<LoginSchema>>;
      registerForm: SuperValidated<Infer<RegisterSchema>>;
      tab: AuthTab;
    };
  } = $props();

  const loginForm = superForm(data.loginForm, {
    validators: zod4Client(loginSchema),
    delayMs: DELAY_MS,
  });
  const { delayed: loginDelayed, submitting: loginSubmitting } = loginForm;
  const registerForm = superForm(data.registerForm, {
    validators: zod4Client(registerSchema),
    delayMs: DELAY_MS,
  });
  const { delayed: registerDelayed, submitting: registerSubmitting } = registerForm;

  const { form: loginFormData, enhance: enhanceLogin } = loginForm;
  const { form: registerFormData, enhance: enhanceRegister } = registerForm;
</script>

<Tabs.Root value={data.tab}>
  <Tabs.List class="mb-4 flex w-full justify-center">
    <Tabs.Trigger value={AuthTab.login}>{m['auth_tab.login']()}</Tabs.Trigger>
    <Tabs.Trigger value={AuthTab.register}>{m['auth_tab.register']()}</Tabs.Trigger>
  </Tabs.List>

  <!-- Login -->
  <Tabs.Content value={AuthTab.login}>
    <form
      method="POST"
      use:enhanceLogin
      action="?/{AuthTab.login}"
      class="flex flex-col gap-1"
    >
      <!-- Header -->
      <div class="mb-4 flex flex-col items-center gap-2 text-center">
        <h1 class="text-2xl font-bold">{m['login.title']()}</h1>
        <p class="text-muted-foreground text-sm text-balance">
          {m['login.description']()}
        </p>
      </div>

      <!-- Username -->
      <Form.Field
        form={loginForm}
        name="username"
      >
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>{m['login.username.label']()}</Form.Label>
            <Input
              {...props}
              bind:value={$loginFormData.username}
            />
          {/snippet}
        </Form.Control>
        <Form.Description>{m['login.username.description']()}</Form.Description>
        <Form.FieldErrors />
      </Form.Field>
      <!-- Password -->
      <Form.Field
        form={loginForm}
        name="password"
      >
        <Form.Control>
          {#snippet children({ props })}
            <div class="flex items-center">
              <Form.Label>
                {m['login.password.label']()}
              </Form.Label>
              <a
                href="##"
                class="ml-auto text-sm underline-offset-4 hover:underline"
              >
                {m['login.forgot_password']()}
              </a>
            </div>
            <Input
              {...props}
              bind:value={$loginFormData.password}
              type="password"
            />
          {/snippet}
        </Form.Control>
        <Form.Description>{m['login.password.description']()}</Form.Description>
        <Form.FieldErrors />
      </Form.Field>

      <!-- Button -->
      <Form.Button
        class="w-full"
        disabled={$loginSubmitting}
      >
        {#if $loginDelayed}
          <Loader2Icon class="animate-spin" />
        {:else}
          {m['auth_tab.login']()}
        {/if}
      </Form.Button>

      <!-- Footer -->
      <div class="mt-2 text-center text-sm">
        {m['login.footer']()}
        <a
          href="?t={AuthTab.register}"
          class="underline underline-offset-4">{m['auth_tab.register']()}</a
        >
      </div>
    </form>
  </Tabs.Content>

  <!-- Register -->
  <Tabs.Content value={AuthTab.register}>
    <form
      method="POST"
      use:enhanceRegister
      action="?/{AuthTab.register}"
      class="flex flex-col gap-1"
    >
      <!-- Header -->
      <div class="mb-4 flex flex-col items-center gap-2 text-center">
        <h1 class="text-2xl font-bold">{m['register.title']()}</h1>
        <p class="text-muted-foreground text-sm text-balance">
          {m['register.description']()}
        </p>
      </div>

      <!-- Username -->
      <Form.Field
        form={registerForm}
        name="username"
      >
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>{m['register.username.label']()}</Form.Label>
            <Input
              {...props}
              bind:value={$registerFormData.username}
            />
          {/snippet}
        </Form.Control>
        <Form.Description>{m['register.username.description']()}</Form.Description>
        <Form.FieldErrors />
      </Form.Field>
      <!-- Email -->
      <Form.Field
        form={registerForm}
        name="email"
      >
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>{m['register.email.label']()}</Form.Label>
            <Input
              {...props}
              bind:value={$registerFormData.email}
            />
          {/snippet}
        </Form.Control>
        <Form.Description>{m['register.email.description']()}</Form.Description>
        <Form.FieldErrors />
      </Form.Field>
      <!-- Password -->
      <Form.Field
        form={registerForm}
        name="password"
      >
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>
              {m['register.password.label']()}
            </Form.Label>
            <Input
              {...props}
              bind:value={$registerFormData.password}
              type="password"
            />
          {/snippet}
        </Form.Control>
        <Form.Description>{m['register.password.description']()}</Form.Description>
        <Form.FieldErrors />
      </Form.Field>
      <!-- Confirm Password -->
      <Form.Field
        form={registerForm}
        name="confirmPassword"
      >
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>
              {m['register.confirm_password.label']()}
            </Form.Label>
            <Input
              {...props}
              bind:value={$registerFormData.confirmPassword}
              type="password"
            />
          {/snippet}
        </Form.Control>
        <Form.Description>{m['register.confirm_password.description']()}</Form.Description>
        <Form.FieldErrors />
      </Form.Field>

      <!-- Button -->
      <Form.Button
        class="w-full"
        disabled={$registerSubmitting}
      >
        {#if $registerDelayed}
          <Loader2Icon class="animate-spin" />
        {:else}
          {m['auth_tab.register']()}
        {/if}
      </Form.Button>

      <!-- Footer -->
      <div class="mt-2 text-center text-sm">
        {m['register.footer']()}
        <a
          href="?t={AuthTab.login}"
          class="underline underline-offset-4">{m['auth_tab.login']()}</a
        >
      </div>
    </form>
  </Tabs.Content>
</Tabs.Root>
