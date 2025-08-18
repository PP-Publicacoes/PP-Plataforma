<script lang="ts">
  let { data } = $props();
  let { user } = data;
</script>

<p>Opa, salve{user ? ` ${user.username}!` : '!'}</p>
