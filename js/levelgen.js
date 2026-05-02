// Procedural parkour level generator. Each call returns a different layout.
// Tuned for ages 4–6: every gap is comfortably jumpable, every height
// difference is reachable, and there is always a long flat finishing
// stretch in front of the castle so reaching the goal is never a
// guessing game.

const TILE = 70;
const GROUND_Y = 648;

// Player physics — must match ParkourScene
const RUN_SPEED = 240;
const JUMP_V = 660;
const GRAVITY = 1100;

// Max upward delta from previous platform top, with safety margin
const MAX_UP = Math.floor((JUMP_V * JUMP_V) / (2 * GRAVITY)) - 20;   // ~178
// Max horizontal gap that's clearable from a standing-jump apex
const MAX_GAP = Math.floor((RUN_SPEED * 2 * JUMP_V) / GRAVITY) - 60; // ~228

const MIN_PLATFORM_TILES = 2;
const MAX_PLATFORM_TILES = 4;
const MIN_GAP_PX = 90;
const MAX_GAP_PX = Math.min(200, MAX_GAP);
const HIGHEST_Y = 320;
const LOWEST_Y = 600;

function rand(min, max) {
  return min + Math.random() * (max - min);
}

function randInt(min, max) {
  return Math.floor(rand(min, max + 1));
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateLevel() {
  const platforms = [];
  const snowflakes = [];

  // 1. Always start with a generous flat ground so spawn is safe
  platforms.push({ x: 0, y: GROUND_Y, w: 6 });
  snowflakes.push({ x: 240, y: GROUND_Y - 50 });
  snowflakes.push({ x: 360, y: GROUND_Y - 50 });

  let x = 6 * TILE + 60;
  let lastY = GROUND_Y;

  // 2. Body — 9 to 12 random platforms with controlled height changes
  const numPlatforms = randInt(9, 12);
  for (let i = 0; i < numPlatforms; i++) {
    const w = randInt(MIN_PLATFORM_TILES, MAX_PLATFORM_TILES);

    // Pick a target Y that's within jump range of the previous platform
    // and within the playable band. Bias slightly toward variety.
    const dy = rand(-160, MAX_UP);          // can fall freely, climb up to ~MAX_UP
    let y = Math.round((lastY - dy) / 20) * 20;
    y = Math.max(HIGHEST_Y, Math.min(LOWEST_Y, y));

    // Every now and then, force a "rest stop" back at ground level so
    // there are a couple of catch-your-breath moments per level.
    if (Math.random() < 0.18) y = GROUND_Y;

    platforms.push({ x, y, w });

    // Snowflake centered above this platform
    snowflakes.push({ x: x + (w * TILE) / 2, y: y - 50 });
    // Sometimes a floating snowflake between this and the next platform
    if (Math.random() < 0.45) {
      snowflakes.push({ x: x + w * TILE + 60, y: y - 90 });
    }

    const gap = randInt(MIN_GAP_PX, MAX_GAP_PX);
    x += w * TILE + gap;
    lastY = y;
  }

  // 3. Always land on ground for the final approach + castle
  const finalGroundW = 9;
  const finalGroundX = x;
  platforms.push({ x: finalGroundX, y: GROUND_Y, w: finalGroundW });

  // Castle goal: anchored on the final ground, near its right end
  const goalX = finalGroundX + (finalGroundW - 2) * TILE;
  const worldWidth = finalGroundX + finalGroundW * TILE + 200;

  return { platforms, snowflakes, goalX, worldWidth };
}
