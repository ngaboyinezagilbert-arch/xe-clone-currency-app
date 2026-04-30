<template>
  <section class="card">
    <h1>About</h1>
    <p>
      This is a tiny arcade game built with Vue 3. The game loop runs on a canvas using
      <code>requestAnimationFrame</code>.
    </p>

    <ul class="list">
      <li>Click/tap bubbles to pop them.</li>
      <li>Letting a bubble escape costs a life.</li>
      <li>Level increases with score, increasing difficulty over time.</li>
    </ul>

    <PrimaryButton variant="ghost" @click="$router.push('/game')">Play</PrimaryButton>
  </section>
</template>

<script setup>
import PrimaryButton from "../components/PrimaryButton.vue";
</script>