<script lang="ts">
  import { onMount } from "svelte";

  import HelloWorld from "./HelloWorld.svelte";

  let todos: Array<{ text: string; completed: boolean }> = [];
  let text = "";
  let loading = true;
  let user: { name: string; id: number } | null = null;
  let accessToken = "";

  onMount(async () => {
    window.addEventListener("message", async (event) => {
      const message = event.data;
      switch (message.type) {
        case "new-todo":
          todos = [...todos, { text: message.value, completed: false }];
          break;
        case "token":
          accessToken = message.value;
          const resp = await fetch(`${apiBaseUri}/me`, {
            headers: { authorization: `Bearer ${accessToken}` },
          });
          const data = await resp.json();
          user = data.user;
          loading = false;
          break;
      }
    });
    tsvscode.postMessage({ type: "get-token", value: undefined });
  });
</script>

<div>
  {#if loading}
    <div>loading ...</div>
  {:else if user}
    <pre>{JSON.stringify(user, null, 2)}</pre>
  {:else}
    <div>No user is logged in.</div>
  {/if}
  <button
    on:click={() => {
      tsvscode.postMessage({ type: "onInfo", value: "info message" });
    }}>Info</button
  >
  <button
    on:click={() => {
      tsvscode.postMessage({ type: "onError", value: "error message" });
    }}>Error</button
  >
  <form
    on:submit|preventDefault={() => {
      todos = [...todos, { text, completed: false }];
      text = "";
    }}
  >
    <input bind:value={text} />
  </form>

  <ul>
    {#each todos as todo (todo)}
      <li
        on:click={() => (todo.completed = !todo.completed)}
        class:completed={todo.completed}
      >
        {todo.text}
      </li>
    {/each}
  </ul>
</div>

<style>
  ul {
    list-style-type: none;
  }
  .completed {
    text-decoration: line-through;
  }
  li {
    padding: 0.5rem;
  }
</style>
