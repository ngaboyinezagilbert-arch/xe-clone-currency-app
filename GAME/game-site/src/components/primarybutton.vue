<template>
  <button class="btn" :class="variantClass" @click="$emit('click')">
    <slot />
  </button>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  variant: { type: String, default: "solid" } // solid | ghost
});

defineEmits(["click"]);

const variantClass = computed(() =>
  props.variant === "ghost" ? "btn-ghost" : "btn-solid"
);
</script>