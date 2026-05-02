import { BootScene } from './scenes/BootScene.js';
import { TitleScene } from './scenes/TitleScene.js';
import { CharacterSelectScene } from './scenes/CharacterSelectScene.js';
import { ForestScene } from './scenes/ForestScene.js';
import { ParkourScene } from './scenes/ParkourScene.js';
import { WinScene } from './scenes/WinScene.js';

export const GAME_WIDTH = 1280;
export const GAME_HEIGHT = 720;

const config = {
  type: Phaser.AUTO,
  parent: 'game',
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  backgroundColor: '#0b1a3a',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 1100 },
      debug: false,
    },
  },
  scene: [
    BootScene,
    TitleScene,
    CharacterSelectScene,
    ForestScene,
    ParkourScene,
    WinScene,
  ],
};

// Debug shortcut: ?scene=Parkour jumps straight to a scene after Boot.
// BootScene reads this and dispatches there instead of Title.
const params = new URLSearchParams(location.search);
window.__START_SCENE__ = params.get('scene') || 'Title';

new Phaser.Game(config);

// Show touch overlay on devices with a coarse pointer (iPad, phone) OR with
// a true touch screen. matchMedia handles iPad Safari correctly.
const isTouch =
  (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) ||
  (navigator.maxTouchPoints && navigator.maxTouchPoints > 0) ||
  'ontouchstart' in window;

if (isTouch) {
  document.getElementById('touch-controls').classList.remove('hidden');
}
