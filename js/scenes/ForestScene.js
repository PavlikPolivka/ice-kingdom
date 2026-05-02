import { GAME_WIDTH, GAME_HEIGHT } from '../main.js';
import { cs } from '../locale.js';
import { createSnow } from '../particles.js';
import { CHARACTER_DATA } from './CharacterSelectScene.js';
import { ELSA } from '../characters.js';

const groundY = () => GAME_HEIGHT - 80;

function drawSky(scene) {
  const g = scene.add.graphics();
  g.fillGradientStyle(0x183a7a, 0x183a7a, 0x4f86c8, 0x9bdcff, 1);
  g.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
}

function drawHillsAndGround(scene) {
  const gy = groundY();
  const g = scene.add.graphics();
  g.fillStyle(0xffffff, 0.25);
  g.fillEllipse(180, gy - 30, 700, 240);
  g.fillEllipse(950, gy - 60, 900, 280);
  g.fillEllipse(1450, gy - 30, 700, 220);
  g.fillStyle(0xeaf6ff, 1);
  g.fillRect(0, gy, GAME_WIDTH, GAME_HEIGHT - gy);
}

function placeTrees(scene) {
  const gy = groundY();
  const positions = [120, 300, 520, 770, 980, 1180];
  positions.forEach((x, i) => {
    const scale = 0.7 + (i % 3) * 0.15;
    const y = gy - 90 * scale;
    const top = scene.add.image(x, y, 'treeTopSnow').setOrigin(0.5, 1).setScale(scale);
    top.setDepth(1);
  });
}

function speechBubble(scene, x, y, text) {
  const padX = 28;
  const padY = 22;
  const t = scene.add.text(0, 0, text, {
    fontFamily: 'sans-serif',
    fontSize: '32px',
    color: '#0b1a3a',
    align: 'center',
    wordWrap: { width: 520 },
    lineSpacing: 6,
  }).setOrigin(0.5);

  const w = t.width + padX * 2;
  const h = t.height + padY * 2;

  const bg = scene.add.graphics();
  bg.fillStyle(0xffffff, 0.97);
  bg.lineStyle(4, 0x3b6fb0, 1);
  bg.fillRoundedRect(x - w / 2, y - h / 2, w, h, 22);
  bg.strokeRoundedRect(x - w / 2, y - h / 2, w, h, 22);
  // Tail pointing down-left toward princess
  bg.fillTriangle(x - w / 2 + 60, y + h / 2 - 1, x - w / 2 + 110, y + h / 2 - 1, x - w / 2 + 50, y + h / 2 + 28);
  bg.lineStyle(4, 0x3b6fb0, 1);
  bg.strokeTriangle(x - w / 2 + 60, y + h / 2 - 1, x - w / 2 + 110, y + h / 2 - 1, x - w / 2 + 50, y + h / 2 + 28);

  t.setPosition(x, y);
  t.setDepth(20);
  bg.setDepth(19);
  return { bg, text: t };
}

export class ForestScene extends Phaser.Scene {
  constructor() {
    super('Forest');
  }

  create() {
    const gy = groundY();
    drawSky(this);
    drawHillsAndGround(this);
    placeTrees(this);
    createSnow(this, { quantity: 2, depth: 5 });

    const charIdx = this.registry.get('character') ?? 0;
    const charDef = CHARACTER_DATA[charIdx];

    // Player on the left
    const player = this.add.image(120, gy, charDef.stand).setOrigin(0.5, 1).setScale(1.4);
    player.setTint(charDef.tint);
    player.setDepth(10);

    // Princess on the right
    const princess = this.add.image(GAME_WIDTH - 280, gy, `${ELSA.key}_stand`).setOrigin(0.5, 1).setScale(1.6);
    princess.setDepth(10);

    // Auto-walk player toward princess
    const targetX = princess.x - 180;
    this.tweens.add({
      targets: player,
      x: targetX,
      duration: 2400,
      ease: 'sine.inOut',
      onUpdate: () => {
        // Bob slightly while walking
        player.y = gy + Math.sin(this.time.now / 80) * 4;
      },
      onComplete: () => {
        player.y = gy;
        showDialogue();
      },
    });

    const showDialogue = () => {
      speechBubble(this, princess.x - 80, princess.y - 200, cs.princessGreeting);

      const cx = GAME_WIDTH / 2;
      const btnY = GAME_HEIGHT - 60;
      const btn = this.add.rectangle(cx, btnY, 320, 80, 0xbfeaff).setStrokeStyle(5, 0xffffff).setInteractive({ useHandCursor: true });
      const lbl = this.add.text(cx, btnY, cs.continue, {
        fontFamily: 'sans-serif',
        fontSize: '36px',
        color: '#0b1a3a',
        fontStyle: 'bold',
      }).setOrigin(0.5);
      btn.setDepth(30); lbl.setDepth(31);

      const go = () => this.scene.start('Parkour');
      btn.on('pointerdown', go);
      this.input.keyboard.once('keydown-SPACE', go);
      this.input.keyboard.once('keydown-ENTER', go);
    };
  }
}
