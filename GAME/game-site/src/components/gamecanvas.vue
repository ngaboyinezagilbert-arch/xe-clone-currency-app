<template>
  <div class="canvasWrap">
    <canvas ref="canvas" class="gameCanvas" />
    <div class="hint muted">
      Tip: On mobile, tap bubbles. On desktop, click bubbles.
    </div>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { BubbleGame } from "../game/BubbleGame.js";

const props = defineProps({
  status: { type: String, required: true },
  level: { type: Number, required: true },
  difficulty: { type: String, required: true }
});

const emit = defineEmits(["scored", "missed", "gameover"]);

const canvas = ref(null);
let game = null;

function resizeToContainer(c) {
  const rect = c.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  c.width = Math.floor(rect.width * dpr);
  c.height = Math.floor(rect.height * dpr);
  const ctx = c.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // scale drawing to CSS pixels
}

onMounted(() => {
  const c = canvas.value;
  // Set a stable visible size with CSS; we set real pixel size based on that.
  resizeToContainer(c);

  game = new BubbleGame({
    canvas: c,
    onScore: (pts) => emit("scored", pts),
    onMiss: () => emit("missed"),
    onGameOver: () => emit("gameover"),
    getDifficulty: () => props.difficulty,
    getLevel: () => props.level,
    getStatus: () => props.status
  });

  game.attach();
  game.startLoop();

  const onResize = () => {
    resizeToContainer(c);
    game?.onResize();
  };
  window.addEventListener("resize", onResize);

  onBeforeUnmount(() => {
    window.removeEventListener("resize", onResize);
  });
});

onBeforeUnmount(() => {
  game?.detach();
  game = null;
});

// React to status changes (pause/resume)
watch(
  () => props.status,
  (s) => {
    if (!game) return;
    if (s === "paused" || s === "idle" || s === "gameover") game.setPaused(true);
    if (s === "running") game.setPaused(false);
    if (s === "idle") game.reset();
    if (s === "gameover") game.setPaused(true);
  }
);
</script>

<style scoped>
.canvasWrap { width: 100%; }
.gameCanvas {
  width: 100%;
  height: 520px;
  border-radius: 14px;
  background: radial-gradient(1200px 700px at 30% 20%, rgba(255,255,255,0.35), rgba(255,255,255,0.05)),
              linear-gradient(135deg, rgba(74,125,255,0.25), rgba(115,255,214,0.12));
  border: 1px solid rgba(255,255,255,0.12);
  display: block;
}
.hint { margin-top: 10px; text-align: center; }
</style>