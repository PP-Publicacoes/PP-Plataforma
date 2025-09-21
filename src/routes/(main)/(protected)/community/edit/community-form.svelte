<script lang="ts">
  import { DELAY_MS } from '$lib/consts/forms';
    import { communitySchema, type CommunitySchema } from '$lib/schemas/social';
  import type { PublicUser } from '$lib/server/db/views/auth';
  import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
  import { zod4Client } from 'sveltekit-superforms/adapters';

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
  const { delayed: communityDelayed, submitting: communitySubmitting } = communityForm;
  const { form: communityFormData, enhance: enchanceCommunity } = communityForm;
</script>


