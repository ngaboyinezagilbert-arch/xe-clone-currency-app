&lt;template&gt;
  &lt;section class=&quot;card&quot;&gt;
    &lt;div class=&quot;row space&quot;&gt;
      &lt;div&gt;
        &lt;h1&gt;Game&lt;/h1&gt;
        &lt;p class=&quot;muted&quot;&gt;Difficulty affects bubble speed and spawn rate.&lt;/p&gt;
      &lt;/div&gt;

      &lt;div class=&quot;row gap&quot;&gt;
        &lt;select class=&quot;select&quot; v-model=&quot;difficulty&quot; :disabled=&quot;store.isRunning ||
store.isPaused&quot;&gt;
          &lt;option value=&quot;easy&quot;&gt;Easy&lt;/option&gt;
          &lt;option value=&quot;normal&quot;&gt;Normal&lt;/option&gt;
          &lt;option value=&quot;hard&quot;&gt;Hard&lt;/option&gt;
        &lt;/select&gt;

        &lt;PrimaryButton v-if=&quot;store.status === &#39;idle&#39; || store.isGameOver&quot; @click=&quot;start&quot;&gt;

          Start
        &lt;/PrimaryButton&gt;

        &lt;PrimaryButton v-else-if=&quot;store.isRunning&quot; @click=&quot;store.pause()&quot;&gt;
          Pause
        &lt;/PrimaryButton&gt;

        &lt;PrimaryButton v-else-if=&quot;store.isPaused&quot; @click=&quot;store.resume()&quot;&gt;
          Resume
        &lt;/PrimaryButton&gt;

        &lt;PrimaryButton variant=&quot;ghost&quot; @click=&quot;reset&quot;&gt;
          Reset
        &lt;/PrimaryButton&gt;
      &lt;/div&gt;
    &lt;/div&gt;

    &lt;HudBar
      :score=&quot;store.score&quot;
      :best=&quot;store.bestScore&quot;
      :lives=&quot;store.lives&quot;
      :level=&quot;store.level&quot;
      :status=&quot;store.status&quot;
    /&gt;

    &lt;GameCanvas
      :status=&quot;store.status&quot;

      :level=&quot;store.level&quot;
      :difficulty=&quot;store.difficulty&quot;
      @scored=&quot;store.addScore&quot;
      @missed=&quot;store.loseLife&quot;
      @gameover=&quot;store.endGame&quot;
    /&gt;

    &lt;p v-if=&quot;store.isGameOver&quot; class=&quot;muted center&quot; style=&quot;margin-top: 12px;&quot;&gt;
      Game over! Hit &lt;b&gt;Start&lt;/b&gt; to play again.
    &lt;/p&gt;
  &lt;/section&gt;
&lt;/template&gt;

&lt;script setup&gt;
import { computed, watch } from &quot;vue&quot;;
import { useGameStore } from &quot;../store/gameStore.js&quot;;
import GameCanvas from &quot;../components/GameCanvas.vue&quot;;
import HudBar from &quot;../components/HudBar.vue&quot;;
import PrimaryButton from &quot;../components/PrimaryButton.vue&quot;;

const store = useGameStore();

const difficulty = computed({
  get: () =&gt; store.difficulty,
  set: (v) =&gt; store.setDifficulty(v)
});

function start() {
  store.startNewGame();
}

function reset() {
  store.status = &quot;idle&quot;;
  store.score = 0;
  store.lives = 3;
  store.level = 1;
}

// If difficulty changes while not playing, keep store updated (computed setter already
does)
watch(() =&gt; store.difficulty, () =&gt; {});
</script>