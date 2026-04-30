<template>
  <section class="card">
    <div class="row space">
      <div>
        <h1>Game</h1>
        <p class="muted">Difficulty affects bubble speed and spawn rate.</p>
      </div>

      <div class="row gap">
        <select class="select" v-model="difficulty" :disabled="store.isRunning || store.isPaused">
          <option value="easy">Easy</option>
          <option value="normal">Normal</option>
          <option value="hard">Hard</option>
        </select>

        <PrimaryButton v-if="store.status === 'idle' || store.isGameOver" @click="start">
          Start
        </PrimaryButton>

        <PrimaryButton v-else-if="store.isRunning" @click="store.pause()">
          Pause
        </PrimaryButton>

        <PrimaryButton v-else-if="store.isPaused" @click="store.resume()">
          Resume
        </PrimaryButton>

        <PrimaryButton variant="ghost" @click="reset">
          Reset
        </PrimaryButton>
      </div>
    </div>

    <HudBar
      :score="store.score"
      :best="store.bestScore"
      :lives="store.lives"
      :level="store.level"
      :status="store.status"
    />

    <GameCanvas
      :status="store.status"
      :level="store.level"
      :difficulty="store.difficulty"
      @scored="store.addScore"
      @missed="store.loseLife"
      @gameover="store.endGame"
    />

    <p v-if="store.isGameOver" class="muted center" style="margin-top: 12px;">
      Game over! Hit <b>Start</b> to play again.
    </p>
  </section>
</template>

<script setup>
import { computed, watch } from "vue";
import { useGameStore } from "../store/gameStore.js";
import GameCanvas from "../components/GameCanvas.vue";
import HudBar from "../components/HudBar.vue";
import PrimaryButton from "../components/PrimaryButton.vue";

const store = useGameStore();

const difficulty = computed({
  get: () => store.difficulty,
  set: (v) => store.setDifficulty(v)
});

function start() {
  store.startNewGame();
}

function reset() {
  store.status = "idle";
  store.score = 0;
  store.lives = 3;
  store.level = 1;
}

// If difficulty changes while not playing, keep store updated (computed setter already does)
watch(() => store.difficulty, () => {});
</script>