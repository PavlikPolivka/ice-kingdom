import { GAME_WIDTH, GAME_HEIGHT } from '../main.js';
import { cs } from '../locale.js';
import { createSnow } from '../particles.js';
import { PRINCESSES } from '../characters.js';

const CHARACTERS = PRINCESSES.map((p) => ({
  name: p.name,
  stand: `${p.key}_stand`,
  jump: `${p.key}_jump`,
  tint: 0xffffff,
}));

export const CHARACTER_DATA = CHARACTERS;

export class CharacterSelectScene extends Phaser.Scene {
  constructor() {
    super('CharacterSelect');
  }

  create() {
    this.cameras.main.setBackgroundColor('#0b1a3a');

    // Background hills
    const g = this.add.graphics();
    g.fillStyle(0xffffff, 0.18);
    g.fillEllipse(200, GAME_HEIGHT - 40, 700, 220);
    g.fillEllipse(900, GAME_HEIGHT - 20, 900, 260);
    g.fillStyle(0xffffff, 0.32);
    g.fillEllipse(GAME_WIDTH / 2, GAME_HEIGHT + 40, 1500, 280);

    createSnow(this, { quantity: 2, depth: 4 });

    const cx = GAME_WIDTH / 2;

    this.add.text(cx, 100, cs.chooseCharacter, {
      fontFamily: 'sans-serif',
      fontSize: '64px',
      color: '#ffffff',
      stroke: '#3b6fb0',
      strokeThickness: 6,
    }).setOrigin(0.5);

    let selected = 0;
    const cards = [];

    const cardW = 280;
    const gap = 60;
    const totalW = cardW * 3 + gap * 2;
    const startX = cx - totalW / 2 + cardW / 2;

    for (let i = 0; i < 3; i++) {
      const x = startX + i * (cardW + gap);
      const y = 380;

      const card = this.add.rectangle(x, y, cardW, 380, 0x1f3260).setStrokeStyle(4, 0xffffff);
      const portrait = this.add.image(x, y + 30, CHARACTERS[i].stand)
        .setOrigin(0.5, 1)
        .setScale(1.7);
      portrait.setTint(CHARACTERS[i].tint);

      const name = this.add.text(x, y + 140, CHARACTERS[i].name, {
        fontFamily: 'sans-serif',
        fontSize: '40px',
        color: '#ffffff',
      }).setOrigin(0.5);

      card.setInteractive({ useHandCursor: true });
      card.on('pointerdown', () => {
        selected = i;
        updateHighlight();
        this.time.delayedCall(120, confirm);
      });

      cards.push({ card, portrait, name });
    }

    const updateHighlight = () => {
      cards.forEach((c, i) => {
        const on = i === selected;
        c.card.setStrokeStyle(on ? 8 : 4, on ? 0xfff7a8 : 0xffffff);
        c.card.setScale(on ? 1.05 : 1);
        c.portrait.setScale(on ? 1.85 : 1.7);
      });
    };
    updateHighlight();

    const confirm = () => {
      this.registry.set('character', selected);
      this.scene.start('Forest');
    };

    this.input.keyboard.on('keydown-LEFT', () => {
      selected = (selected + 2) % 3;
      updateHighlight();
    });
    this.input.keyboard.on('keydown-RIGHT', () => {
      selected = (selected + 1) % 3;
      updateHighlight();
    });
    this.input.keyboard.on('keydown-SPACE', confirm);
    this.input.keyboard.on('keydown-ENTER', confirm);

    this.add.text(cx, GAME_HEIGHT - 40, '← →  vyber  •  mezerník potvrď', {
      fontFamily: 'sans-serif',
      fontSize: '24px',
      color: '#cfe1ff',
    }).setOrigin(0.5);
  }
}
