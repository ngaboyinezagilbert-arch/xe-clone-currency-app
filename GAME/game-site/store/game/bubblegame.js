import { Bubble } from "./Bubble.js";
import { clamp, now, rand } from "./utils.js";

const DIFFICULTY = {
  easy:   { spawnPerSec: 0.9, speed: 55, life: 5200 },
  normal: { spawnPerSec: 1.3, speed: 70, life: 4700 },
  hard:   { spawnPerSec: 1.8, speed: 88, life: 4200 }
};

export class BubbleGame {
  constructor({ canvas, onScore, onMiss, onGameOver, getDifficulty, getLevel, getStatus }) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");

    this.onScore = onScore;
    this.onMiss = onMiss;
    this.onGameOver = onGameOver;

    this.getDifficulty = getDifficulty;
    this.getLevel = getLevel;
    this.getStatus = getStatus;

    this.bubbles = [];
    this.paused = true;

    this.raf = 0;
    this.last = now();
    this.accumSpawn = 0;

    // bound handlers
    this.onPointer = this.onPointer.bind(this);
    this.loop = this.loop.bind(this);
  }

  attach() {
    this.canvas.addEventListener("pointerdown", this.onPointer, { passive: true });
  }

  detach() {
    this.canvas.removeEventListener("pointerdown", this.onPointer);
    cancelAnimationFrame(this.raf);
  }

  startLoop() {
    this.last = now();
    this.raf = requestAnimationFrame(this.loop);
  }

  setPaused(v) {
    this.paused = v;
  }

  reset() {
    this.bubbles = [];
    this.accumSpawn = 0;
    this.last = now();
    this.draw(); // clear screen
  }

  onResize() {
    // nothing special currently; boundaries are read per frame
  }

  _settings() {
    const d = DIFFICULTY[this.getDifficulty?.() || "normal"] || DIFFICULTY.normal;
    const level = clamp(this.getLevel?.() || 1, 1, 999);

    // scale challenge by level: slightly more spawns and speed per level
    return {
      spawnPerSec: d.spawnPerSec * (1 + (level - 1) * 0.08),
      speed: d.speed * (1 + (level - 1) * 0.06),
      life: Math.max(1800, d.life - (level - 1) * 90)
    };
  }

  _loop(t) {
    const dt = Math.min(0.033, (t - this.last) / 1000);
    this.last = t;

    const status = this.getStatus?.() || "idle";
    const shouldRun = status === "running" && !this.paused;

    if (shouldRun) {
      this.update(dt);
    }
    this.draw();

    this.raf = requestAnimationFrame(this.loop);
  }

  update(dt) {
    const { spawnPerSec, speed, life } = this.settings();
    const w = this.canvas.clientWidth;
    const h = this.canvas.clientHeight;

    // spawn accumulator
    this.accumSpawn += dt * spawnPerSec;
    while (this.accumSpawn >= 1) {
      this.accumSpawn -= 1;
      this.spawnBubble({ w, h, speed, life });
    }

    // update bubbles
    for (const b of this.bubbles) {
      b.update(dt);

      // bounce horizontally inside bounds
      if (b.x - b.r < 0) { b.x = b.r; b.drift *= -1; }
      if (b.x + b.r > w) { b.x = w - b.r; b.drift *= -1; }
    }

    // bubbles that escaped (top) count as miss
    const before = this.bubbles.length;
    this.bubbles = this.bubbles.filter((b) => {
      if (b.popped) return false;
      if (b.y + b.r < -10 || b.age > b.lifeMs) return false;
      return true;
    });
    const removed = before - this.bubbles.length;
    if (removed > 0) {
      // each removed bubble = miss
      for (let i = 0; i < removed; i++) this.onMiss?.();
      // store controls actual lives -> if it hits zero it will emit gameover from Vue layer
      // but we also support direct callback if desired
    }
  }

  _spawnBubble({ w, h, speed, life }) {
    const r = rand(18, 60);
    const x = rand(r + 4, w - r - 4);
    const y = h + r + 10;

    const vy = speed * rand(0.85, 1.25) * (62 / r); // smaller bubbles move faster
    const drift = rand(-28, 28);
    const hue = rand(170, 320);

    this.bubbles.push(
      new Bubble({
        x, y, r,
        vy,
        drift,
        hue,
        lifeMs: life
      })
    );
  }

  _onPointer(ev) {
    const rect = this.canvas.getBoundingClientRect();
    const px = ev.clientX - rect.left;
    const py = ev.clientY - rect.top;

    const status = this.getStatus?.() || "idle";
    if (status !== "running" || this.paused) return;

    // top-most hit: iterate reverse
    for (let i = this.bubbles.length - 1; i >= 0; i--) {
      const b = this.bubbles[i];
      if (b.popped) continue;
      if (b.containsPoint(px, py)) {
        b.popped = true;

        // scoring: smaller = more points
        const pts = Math.round(clamp(120 - b.r * 1.6, 15, 110));
        this.onScore?.(pts);

        // remove popped bubble quickly
        this.bubbles.splice(i, 1);
        break;
      }
    }
  }

  _draw() {
    const ctx = this.ctx;
    const w = this.canvas.clientWidth;
    const h = this.canvas.clientHeight;

    // clear
    ctx.clearRect(0, 0, w, h);

    // subtle stars / particles background
    ctx.save();
    ctx.globalAlpha = 0.25;
    for (let i = 0; i < 28; i++) {
      const x = (i * 97) % w;
      const y = (i * 53) % h;
      ctx.fillStyle = "rgba(255,255,255,0.18)";
      ctx.fillRect(x, y, 1, 1);
    }
    ctx.restore();

    // bubbles
    for (const b of this.bubbles) b.draw(ctx);

    // overlay if paused/idle/gameover
    const status = this.getStatus?.() || "idle";
    if (status !== "running" || this.paused) {
      ctx.save();
      ctx.fillStyle = "rgba(0,0,0,0.18)";
      ctx.fillRect(0, 0, w, h);

      ctx.fillStyle = "rgba(255,255,255,0.9)";
      ctx.font = "600 22px system-ui, -apple-system, Segoe UI, Roboto, Arial";
      ctx.textAlign = "center";
      ctx.fillText(
        status === "gameover" ? "Game Over" : status === "paused" ? "Paused" : "Ready",
        w / 2,
        h / 2 - 6
      );

      ctx.fillStyle = "rgba(255,255,255,0.7)";
      ctx.font = "14px system-ui, -apple-system, Segoe UI, Roboto, Arial";
      ctx.fillText(
        status === "gameover" ? "Press Start to play again" : "Press Start to begin",
        w / 2,
        h / 2 + 22
      );

      ctx.restore();
    }
  }
}