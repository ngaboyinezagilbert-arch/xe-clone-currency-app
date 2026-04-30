export function clamp(v, a, b) {
  return Math.max(a, Math.min(b, v));
}

export function rand(min, max) {
  return Math.random() * (max - min) + min;
}

export function pick(arr) {
  return arr[(Math.random() * arr.length) | 0];
}

export function now() {
  return performance.now();
}