import { GAME_WIDTH, GAME_HEIGHT } from '../main.js';
import { cs } from '../locale.js';
import { createSnow, sparkleBurst } from '../particles.js';
import { playWin } from '../sfx.js';

export class WinScene extends Phaser.Scene {
  constructor() {
    super('Win');
  }

  create() {
    this.cameras.main.setBackgroundColor('#0b1a3a');
    createSnow(this, { quantity: 3, depth: 4 });

    const cx = GAME_WIDTH / 2;

    this.add.text(cx, 220, cs.win, {
      fontFamily: 'sans-serif',
      fontSize: '88px',
      color: '#ffffff',
      stroke: '#3b6fb0',
      strokeThickness: 8,
    }).setOrigin(0.5);

    const flakes = this.registry.get('snowflakes') ?? 0;
    this.add.text(cx, 340, cs.snowflakesFinal(flakes), {
      fontFamily: 'sans-serif',
      fontSize: '40px',
      color: '#bfeaff',
    }).setOrigin(0.5);

    sparkleBurst(this, cx, 280, 60);
    playWin();
    this.time.addEvent({
      delay: 500,
      loop: true,
      callback: () => sparkleBurst(this, cx + Phaser.Math.Between(-300, 300), 280 + Phaser.Math.Between(-50, 50), 25),
    });

    const btn = this.add.rectangle(cx, 540, 460, 110, 0xbfeaff)
      .setStrokeStyle(6, 0xffffff)
      .setInteractive({ useHandCursor: true });
    const label = this.add.text(cx, 540, cs.playAgain, {
      fontFamily: 'sans-serif',
      fontSize: '52px',
      color: '#0b1a3a',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    const restart = () => {
      this.registry.set('snowflakes', 0);
      this.scene.start('Title');
    };

    btn.on('pointerdown', restart);
    this.input.keyboard.on('keydown-SPACE', restart);
    this.input.keyboard.on('keydown-ENTER', restart);
  }
}
