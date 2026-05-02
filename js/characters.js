// Procedurally drawn princess characters and snowflake. Generated once
// at boot into Phaser textures so the rest of the game treats them like
// any sprite. No external character art needed.

const W = 72;
const H = 108;
const SKIN = 0xfdd9b5;
const SHOE = 0x3a2a1f;
const EYE = 0x2c2c2c;
const MOUTH = 0xc23a5b;
const CROWN_GOLD = 0xfff48f;
const CROWN_GEM = 0xff5577;

function drawPrincess(scene, key, opts) {
  const g = scene.make.graphics({ x: 0, y: 0, add: false });
  const cx = W / 2;
  const dress = opts.dress;
  const hair = opts.hair;
  const jump = !!opts.jump;
  const longHair = !!opts.longHair;
  const tallCrown = !!opts.tallCrown;

  // --- Legs ---
  g.fillStyle(SKIN, 1);
  g.fillRect(cx - 10, H - 26, 7, 18);
  g.fillRect(cx + 3, H - 26, 7, 18);

  // Shoes
  g.fillStyle(SHOE, 1);
  g.fillRoundedRect(cx - 12, H - 10, 11, 6, 2);
  g.fillRoundedRect(cx + 1, H - 10, 11, 6, 2);

  // --- Skirt ---
  g.fillStyle(dress, 1);
  g.fillTriangle(cx - 22, H - 26, cx + 22, H - 26, cx, H - 60);

  // Skirt trim
  g.fillStyle(0xffffff, 0.85);
  g.fillRect(cx - 22, H - 28, 44, 3);

  // --- Torso (bodice) ---
  g.fillStyle(dress, 1);
  g.fillRoundedRect(cx - 11, H - 64, 22, 18, 3);

  // --- Arms ---
  if (jump) {
    // Arms up (sleeves)
    g.fillStyle(dress, 1);
    g.fillRect(cx - 17, H - 76, 6, 12);
    g.fillRect(cx + 11, H - 76, 6, 12);
    // Hands
    g.fillStyle(SKIN, 1);
    g.fillCircle(cx - 14, H - 78, 4);
    g.fillCircle(cx + 14, H - 78, 4);
  } else {
    // Arms down at sides
    g.fillStyle(dress, 1);
    g.fillRect(cx - 17, H - 62, 6, 16);
    g.fillRect(cx + 11, H - 62, 6, 16);
    // Hands
    g.fillStyle(SKIN, 1);
    g.fillCircle(cx - 14, H - 44, 4);
    g.fillCircle(cx + 14, H - 44, 4);
  }

  // --- Neck ---
  g.fillStyle(SKIN, 1);
  g.fillRect(cx - 5, H - 68, 10, 6);

  // --- Hair: long behind head (drawn first so it sits behind) ---
  if (longHair) {
    g.fillStyle(hair, 1);
    g.fillRoundedRect(cx - 18, H - 88, 36, 32, 8);
  }

  // --- Head ---
  g.fillStyle(SKIN, 1);
  g.fillCircle(cx, H - 80, 14);

  // --- Hair top + bangs (over head) ---
  g.fillStyle(hair, 1);
  g.fillEllipse(cx, H - 90, 30, 18);
  g.fillRect(cx - 14, H - 90, 5, 16);
  g.fillRect(cx + 9, H - 90, 5, 16);
  // Soft bangs across forehead
  g.fillEllipse(cx, H - 88, 22, 8);

  // --- Crown ---
  g.fillStyle(CROWN_GOLD, 1);
  const crownY = H - 100;
  const peakY = tallCrown ? crownY - 8 : crownY - 4;
  g.fillTriangle(cx - 10, crownY, cx - 4, peakY + 2, cx - 1, crownY);
  g.fillTriangle(cx - 1, crownY, cx, peakY, cx + 1, crownY);
  g.fillTriangle(cx + 1, crownY, cx + 4, peakY + 2, cx + 10, crownY);
  // Crown band
  g.fillRect(cx - 10, crownY, 20, 3);
  // Gem
  g.fillStyle(CROWN_GEM, 1);
  g.fillCircle(cx, crownY + 1, 1.6);

  // --- Eyes ---
  g.fillStyle(0xffffff, 1);
  g.fillCircle(cx - 5, H - 80, 2.5);
  g.fillCircle(cx + 5, H - 80, 2.5);
  g.fillStyle(EYE, 1);
  g.fillCircle(cx - 5, H - 80, 1.4);
  g.fillCircle(cx + 5, H - 80, 1.4);

  // --- Cheeks ---
  g.fillStyle(0xffb6c1, 0.6);
  g.fillCircle(cx - 8, H - 76, 2);
  g.fillCircle(cx + 8, H - 76, 2);

  // --- Smile ---
  g.fillStyle(MOUTH, 1);
  g.fillRect(cx - 3, H - 73, 6, 1.6);

  g.generateTexture(key, W, H);
  g.destroy();
}

function drawIceCastle(scene, key) {
  const W = 320;
  const H = 360;
  const g = scene.make.graphics({ x: 0, y: 0, add: false });

  const ICE_LIGHT = 0xeaf6ff;
  const ICE_MED = 0xbfeaff;
  const ICE_DARK = 0x9bdcff;
  const ICE_SHADE = 0x7ec0e8;
  const SNOW = 0xffffff;
  const WINDOW = 0x2a4a6a;
  const FLAG = 0xff8fb0;

  // --- Central back tower (tallest) ---
  g.fillStyle(ICE_DARK, 1);
  g.fillRect(132, 70, 56, 200);
  g.fillStyle(ICE_SHADE, 0.45);
  g.fillRect(132, 70, 14, 200);
  // Spire
  g.fillStyle(ICE_MED, 1);
  g.fillTriangle(124, 72, 196, 72, 160, 4);
  // Snow on spire
  g.fillStyle(SNOW, 1);
  g.fillTriangle(154, 18, 166, 18, 160, 4);
  // Flag
  g.fillStyle(FLAG, 1);
  g.fillTriangle(160, 8, 178, 14, 160, 22);
  // Window
  g.fillStyle(WINDOW, 1);
  g.fillRect(154, 130, 12, 22);
  g.fillCircle(160, 130, 6);

  // --- Main wall ---
  g.fillStyle(ICE_MED, 1);
  g.fillRect(40, 200, 240, 160);
  g.fillStyle(ICE_SHADE, 0.35);
  g.fillRect(40, 200, 30, 160);

  // Battlements (crenellations) on top of wall
  g.fillStyle(ICE_MED, 1);
  for (let i = 0; i < 6; i++) {
    g.fillRect(46 + i * 40, 178, 26, 22);
  }
  // Snow caps on battlements
  g.fillStyle(SNOW, 1);
  for (let i = 0; i < 6; i++) {
    g.fillRect(46 + i * 40, 178, 26, 5);
  }

  // --- Left tower ---
  g.fillStyle(ICE_MED, 1);
  g.fillRect(20, 130, 60, 230);
  g.fillStyle(ICE_SHADE, 0.4);
  g.fillRect(20, 130, 14, 230);
  // Spire
  g.fillStyle(ICE_DARK, 1);
  g.fillTriangle(14, 132, 86, 132, 50, 64);
  // Snow on spire
  g.fillStyle(SNOW, 1);
  g.fillTriangle(45, 78, 55, 78, 50, 64);
  // Flag
  g.fillStyle(FLAG, 1);
  g.fillTriangle(50, 68, 64, 74, 50, 80);
  // Window
  g.fillStyle(WINDOW, 1);
  g.fillRect(43, 200, 14, 24);
  g.fillCircle(50, 200, 7);

  // --- Right tower (mirror) ---
  g.fillStyle(ICE_MED, 1);
  g.fillRect(240, 130, 60, 230);
  g.fillStyle(ICE_SHADE, 0.4);
  g.fillRect(240, 130, 14, 230);
  g.fillStyle(ICE_DARK, 1);
  g.fillTriangle(234, 132, 306, 132, 270, 64);
  g.fillStyle(SNOW, 1);
  g.fillTriangle(265, 78, 275, 78, 270, 64);
  g.fillStyle(FLAG, 1);
  g.fillTriangle(270, 68, 284, 74, 270, 80);
  g.fillStyle(WINDOW, 1);
  g.fillRect(263, 200, 14, 24);
  g.fillCircle(270, 200, 7);

  // --- Gate (arched) ---
  g.fillStyle(WINDOW, 1);
  g.fillRect(140, 280, 40, 80);
  g.fillCircle(160, 280, 20);
  // Gate trim
  g.fillStyle(ICE_LIGHT, 1);
  g.fillRect(138, 358, 44, 4);

  // Sparkle accents on the wall
  g.fillStyle(ICE_LIGHT, 0.8);
  g.fillCircle(110, 240, 3);
  g.fillCircle(220, 250, 3);
  g.fillCircle(130, 320, 2);
  g.fillCircle(210, 330, 2);

  g.generateTexture(key, W, H);
  g.destroy();
}

function drawSnowflake(scene, key) {
  const S = 36;
  const g = scene.make.graphics({ x: 0, y: 0, add: false });
  const c = S / 2;
  const outer = 16;
  const inner = 5;

  const points = [];
  for (let i = 0; i < 12; i++) {
    const a = (Math.PI * 2 * i) / 12 - Math.PI / 2;
    const r = (i % 2 === 0) ? outer : inner;
    points.push({ x: c + Math.cos(a) * r, y: c + Math.sin(a) * r });
  }
  g.fillStyle(0xeaf6ff, 1);
  g.fillPoints(points, true);

  // Inner accents
  g.fillStyle(0xffffff, 1);
  g.fillCircle(c, c, 3);
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI * 2 * i) / 6 - Math.PI / 2;
    g.fillCircle(c + Math.cos(a) * 9, c + Math.sin(a) * 9, 1.6);
  }

  g.generateTexture(key, S, S);
  g.destroy();
}

export const PRINCESSES = [
  { name: 'Anna',   key: 'pc_anna',   dress: 0xff8fb0, hair: 0xb04a2a, longHair: false },
  { name: 'Líza',   key: 'pc_liza',   dress: 0xc9b3ff, hair: 0xf2d57a, longHair: false },
  { name: 'Eliška', key: 'pc_eliska', dress: 0x9bdcff, hair: 0xf6f0d4, longHair: true  },
];

export const ELSA = {
  key: 'pc_elsa',
  dress: 0xbfeaff,
  hair: 0xf6f0d4,
  longHair: true,
  tallCrown: true,
};

export function createGeneratedTextures(scene) {
  for (const p of PRINCESSES) {
    drawPrincess(scene, `${p.key}_stand`, { dress: p.dress, hair: p.hair, longHair: p.longHair, jump: false });
    drawPrincess(scene, `${p.key}_jump`,  { dress: p.dress, hair: p.hair, longHair: p.longHair, jump: true });
  }
  drawPrincess(scene, `${ELSA.key}_stand`, { dress: ELSA.dress, hair: ELSA.hair, longHair: ELSA.longHair, tallCrown: ELSA.tallCrown, jump: false });
  drawSnowflake(scene, 'snowflake_real');
  drawIceCastle(scene, 'ice_castle');
}
