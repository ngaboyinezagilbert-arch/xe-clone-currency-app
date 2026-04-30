import { defineStore } from &quot;pinia&quot;;

const BESTKEY = &quot;bubblepopbestScorev1&quot;;

function loadBest() {

  const v = Number(localStorage.getItem(BESTKEY));
  return Number.isFinite(v) ? v : 0;
}

function saveBest(v) {
  localStorage.setItem(BEST_KEY, String(v));
}

export const useGameStore = defineStore(&quot;game&quot;, {
  state: () =&gt; ({
    status: &quot;idle&quot;, // idle | running | paused | gameover
    score: 0,
    bestScore: loadBest(),
    lives: 3,
    level: 1,
    difficulty: &quot;normal&quot; // easy | normal | hard
  }),

  getters: {
    isRunning: (s) =&gt; s.status === &quot;running&quot;,
    isPaused: (s) =&gt; s.status === &quot;paused&quot;,
    isGameOver: (s) =&gt; s.status === &quot;gameover&quot;
  },

  actions: {
    setDifficulty(d) {
      this.difficulty = d;

    },
    startNewGame() {
      this.score = 0;
      this.lives = 3;
      this.level = 1;
      this.status = &quot;running&quot;;
    },
    pause() {
      if (this.status === &quot;running&quot;) this.status = &quot;paused&quot;;
    },
    resume() {
      if (this.status === &quot;paused&quot;) this.status = &quot;running&quot;;
    },
    addScore(points) {
      this.score += points;
      // level up every 500 points
      this.level = Math.max(1, Math.floor(this.score / 500) + 1);

      if (this.score &gt; this.bestScore) {
        this.bestScore = this.score;
        saveBest(this.bestScore);
      }
    },
    loseLife() {
      this.lives -= 1;
      if (this.lives &lt;= 0) {
        this.status = &quot;gameover&quot;;

      }
    },
    endGame() {
      this.status = &quot;gameover&quot;;
      if (this.score &gt; this.bestScore) {
        this.bestScore = this.score;
        saveBest(this.bestScore);
      }
    }
  }
});