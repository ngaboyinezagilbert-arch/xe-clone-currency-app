import { clamp } from "./utils.js";

export class Bubble {
  constructor({ x, y, r, vy, drift, hue, lifeMs }) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.vy = vy;       // upward speed (px/s)
    this.drift = drift; // sideways drift (px/s)
    this.hue = hue;
    this.lifeMs = lifeMs;
    this.age = 0;
    this.popped = false;
  }

  containsPoint(px, py) {
    const dx = px - this.x;
    const dy = py - this.y;
    return dx * dx + dy * dy <= this.r * this.r;
  }

  update(dt) {
    if (this.popped) return;
    this.age += dt * 1000;
    this.y -= this.vy * dt;
    this.x += this.drift * dt;

    // gentle drift bounce boundaries are handled by the game
  }

  draw(ctx) {
    if (this.popped) return;

    const alpha = clamp(1 - this.age / this.lifeMs, 0.25, 1);

    // outer bubble
    ctx.save();
    ctx.globalAlpha = alpha;

    const grad = ctx.createRadialGradient(
      this.x - this.r * 0.25, this.y - this.r * 0.35, this.r * 0.2,
      this.x, this.y, this.r
    );
    grad.addColorStop(0, hsla(${this.hue}, 90%, 80%, 0.85));
    grad.addColorStop(0.5, hsla(${this.hue + 30}, 90%, 70%, 0.35));
    grad.addColorStop(1, hsla(${this.hue + 60}, 90%, 60%, 0.10));

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();

    // highlight
    ctx.beginPath();
    ctx.arc(this.x - this.r * 0.25, this.y - this.r * 0.25, this.r * 0.22, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    ctx.fill();

    // edge stroke
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = rgba(255,255,255,0.22);
    ctx.stroke();

    ctx.restore();
  }
}
``