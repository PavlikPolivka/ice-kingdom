import { GAME_WIDTH, GAME_HEIGHT } from '../main.js';
import { cs } from '../locale.js';
import { createGeneratedTextures } from '../characters.js';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  preload() {
    this.cameras.main.setBackgroundColor('#0b1a3a');

    const cx = GAME_WIDTH / 2;
    const cy = GAME_HEIGHT / 2;

    this.add.text(cx, cy - 40, cs.loading, {
      fontFamily: 'sans-serif',
      fontSize: '48px',
      color: '#ffffff',
    }).setOrigin(0.5);

    const barW = 480;
    const barH = 28;
    const bg = this.add.rectangle(cx, cy + 30, barW, barH, 0x1f3260).setStrokeStyle(2, 0xffffff);
    const fill = this.add.rectangle(cx - barW / 2 + 2, cy + 30, 1, barH - 6, 0x9bdcff).setOrigin(0, 0.5);

    this.load.on('progress', (p) => {
      fill.width = (barW - 4) * p;
    });

    this.load.on('complete', () => {
      bg.destroy();
      fill.destroy();
    });

    // Snow / ice tiles + igloo (player characters and snowflake are drawn in code)
    for (const t of [
      'tundraLeft', 'tundraMid', 'tundraRight', 'tundraCenter',
      'snowLeft', 'snowMid', 'snowRight',
      'iceBlock', 'iceBlockAlt',
      'igloo', 'iglooRoof', 'iglooRoofLeft', 'iglooRoofRight', 'iglooDoor',
      'treeTopSnow', 'treeBranchesSnowLeft', 'treeBranchesSnowRight',
    ]) {
      this.load.image(t, `assets/tiles/${t}.png`);
    }
  }

  create() {
    // Generate procedural textures (princesses + snowflake)
    createGeneratedTextures(this);

    const target = window.__START_SCENE__ || 'Title';
    this.scene.start(target);
  }
}
