<template>
  <section class="card center">
    <h1>404</h1>
    <p class="muted">That page doesn't exist.</p>
    <PrimaryButton @click="$router.push('/')">Go Home</PrimaryButton>
  </section>
</template>

<script setup>
import PrimaryButton from "../components/PrimaryButton.vue";
</script>