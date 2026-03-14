<script lang="ts">
  let count = $state(0);

  function increment() {
    count += 1;
  }
</script>

<main>
  <h1>Welcome to svelte-demo</h1>
  <button onclick={increment}>
    count is {count}
  </button>
</main>
