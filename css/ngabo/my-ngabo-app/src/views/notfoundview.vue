<template>
    <div class="hud">
      <div class="huditem"><b>Score:</b> {{ score }}</div>
      <div class="huditem"><b>Best:</b> {{ best }}</div>
      <div class="huditem">
        <b>Lives:</b>
        <span class="lives">{{ hearts }}</span>
      </div>
      <div class="huditem"><b>Level:</b> {{ level }}</div>
      <div class="huditem status" :class="statusClass">
        {{ statusLabel }}
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed } from "vue";
  
  const props = defineProps({
    score: Number,
    best: Number,
    lives: Number,
    level: Number,
    status: String
  });
  
  const hearts = computed(() =>
    "❤️".repeat(Math.max(0, props.lives ?? 0))
  );
  
  const statusLabel = computed(() =>
    (props.status ?? "idle").toUpperCase()
  );
  
  const statusClass = computed(() =>
    `s-${props.status ?? "idle"}`
  );
  </script>
  