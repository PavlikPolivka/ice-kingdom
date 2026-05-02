import { GAME_WIDTH, GAME_HEIGHT } from './main.js';

const SNOW_TEX_KEY = '__snow_dot__';
const SPARK_TEX_KEY = '__spark_dot__';

function ensureSnowTexture(scene) {
  if (scene.textures.exists(SNOW_TEX_KEY)) return;
  const g = scene.make.graphics({ x: 0, y: 0, add: false });
  g.fillStyle(0xffffff, 1);
  g.fillCircle(4, 4, 4);
  g.generateTexture(SNOW_TEX_KEY, 8, 8);
  g.destroy();
}

function ensureSparkTexture(scene) {
  if (scene.textures.exists(SPARK_TEX_KEY)) return;
  const g = scene.make.graphics({ x: 0, y: 0, add: false });
  g.fillStyle(0xbfeaff, 1);
  g.fillCircle(3, 3, 3);
  g.generateTexture(SPARK_TEX_KEY, 6, 6);
  g.destroy();
}

export function createSnow(scene, opts = {}) {
  ensureSnowTexture(scene);
  const emitter = scene.add.particles(0, -10, SNOW_TEX_KEY, {
    x: { min: 0, max: GAME_WIDTH },
    y: -10,
    lifespan: 8000,
    speedY: { min: 40, max: 110 },
    speedX: { min: -25, max: 25 },
    scale: { min: 0.4, max: 1.2 },
    alpha: { start: 0.85, end: 0.35 },
    quantity: opts.quantity ?? 2,
    frequency: opts.frequency ?? 120,
    blendMode: 'NORMAL',
  });
  emitter.setDepth(opts.depth ?? 5);
  // For scrolling worlds, lock to the camera so snow blankets the visible area
  // wherever the player travels.
  if (opts.screenSpace) emitter.setScrollFactor(0);
  return emitter;
}

export function sparkleBurst(scene, x, y, count = 30) {
  ensureSparkTexture(scene);
  const emitter = scene.add.particles(x, y, SPARK_TEX_KEY, {
    speed: { min: 80, max: 260 },
    angle: { min: 0, max: 360 },
    lifespan: 700,
    scale: { start: 1.4, end: 0 },
    alpha: { start: 1, end: 0 },
    quantity: count,
    blendMode: 'ADD',
    emitting: false,
  });
  emitter.explode(count, x, y);
  scene.time.delayedCall(900, () => emitter.destroy());
}
