import { GAME_WIDTH, GAME_HEIGHT } from '../main.js';
import { cs } from '../locale.js';
import { createSnow } from '../particles.js';
import { unlockAudio } from '../sfx.js';

export class TitleScene extends Phaser.Scene {
  constructor() {
    super('Title');
  }

  create() {
    this.cameras.main.setBackgroundColor('#0b1a3a');

    // Subtle aurora-ish gradient strips
    const g = this.add.graphics();
    g.fillGradientStyle(0x0b1a3a, 0x0b1a3a, 0x183a7a, 0x2a5fa8, 1);
    g.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Distant snowy hills
    g.fillStyle(0xffffff, 0.18);
    g.fillEllipse(200, GAME_HEIGHT - 40, 700, 220);
    g.fillEllipse(900, GAME_HEIGHT - 20, 900, 260);
    g.fillStyle(0xffffff, 0.32);
    g.fillEllipse(GAME_WIDTH / 2, GAME_HEIGHT + 40, 1500, 280);

    createSnow(this, { quantity: 3, frequency: 90, depth: 4 });

    const cx = GAME_WIDTH / 2;

    this.add.text(cx, 180, cs.title, {
      fontFamily: 'sans-serif',
      fontSize: '88px',
      color: '#ffffff',
      stroke: '#3b6fb0',
      strokeThickness: 8,
      shadow: { offsetX: 0, offsetY: 4, color: '#000000', blur: 10, fill: true },
    }).setOrigin(0.5);

    // Big play button
    const btn = this.add.rectangle(cx, 460, 360, 120, 0xbfeaff)
      .setStrokeStyle(6, 0xffffff)
      .setInteractive({ useHandCursor: true });
    const label = this.add.text(cx, 460, cs.play, {
      fontFamily: 'sans-serif',
      fontSize: '64px',
      color: '#0b1a3a',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    const press = () => {
      unlockAudio();
      this.tweens.add({
        targets: [btn, label],
        scale: 0.95,
        duration: 80,
        yoyo: true,
        onComplete: () => this.scene.start('CharacterSelect'),
      });
    };

    btn.on('pointerover', () => btn.setFillStyle(0xd9f3ff));
    btn.on('pointerout', () => btn.setFillStyle(0xbfeaff));
    btn.on('pointerdown', press);

    this.input.keyboard.on('keydown-SPACE', press);
    this.input.keyboard.on('keydown-ENTER', press);

    this.add.text(cx, GAME_HEIGHT - 60, 'Stiskni mezerník nebo klikni na tlačítko', {
      fontFamily: 'sans-serif',
      fontSize: '24px',
      color: '#cfe1ff',
    }).setOrigin(0.5);
  }
}
