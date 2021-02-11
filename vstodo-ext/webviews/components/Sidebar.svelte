<script lang="ts">
  import { onMount } from "svelte";

  import HelloWorld from "./HelloWorld.svelte";

  let todos: Array<{ text: string; completed: boolean }> = [];
  let text = "";

  onMount(() => {
    window.addEventListener("message", (event) => {
      const message = event.data;
      switch (message.type) {
        case "new-todo":
          todos = [...todos, { text: message.value, completed: false }];
          break;
      }
    });
  });
</script>

<div>
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
