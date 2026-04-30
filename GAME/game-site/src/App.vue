<template>
  <div class="app">
    <header class="topbar">
      <div class="brand">🫧 Bubble Pop</div>
      <nav class="nav">
        <RouterLink to="/" class="navlink">Home</RouterLink>
        <RouterLink to="/game" class="navlink">Play</RouterLink>
        <RouterLink to="/about" class="navlink">About</RouterLink>
      </nav>
    </header>

    <main class="page">
      <RouterView />
    </main>

    <footer class="footer">
      <span>Made with Vue 3 + Vite</span>
    </footer>
  </div>
</template>

<script setup>
import { RouterLink, RouterView } from "vue-router";
</script>