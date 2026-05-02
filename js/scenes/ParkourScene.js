import { GAME_WIDTH, GAME_HEIGHT } from '../main.js';
import { cs } from '../locale.js';
import { createSnow, sparkleBurst } from '../particles.js';
import { CHARACTER_DATA } from './CharacterSelectScene.js';
import { ELSA } from '../characters.js';
import { controls, tickControls } from '../controls.js';
import { playJump, playPickup, playRespawn, playWin } from '../sfx.js';
import { generateLevel } from '../levelgen.js';

const TILE = 70;
const RUN_SPEED = 240;
const JUMP_VELOCITY = -660;
const COYOTE_MS = 150;
const BUFFER_MS = 150;

export class ParkourScene extends Phaser.Scene {
  constructor() {
    super('Parkour');
  }

  create() {
    // Roll a fresh random level for this run
    const level = generateLevel();
    this.level = level;
    this.worldWidth = level.worldWidth;
    this.goalX = level.goalX;
    this.totalSnowflakes = level.snowflakes.length;

    this.physics.world.setBounds(0, -200, this.worldWidth, GAME_HEIGHT + 600);
    this.cameras.main.setBounds(0, 0, this.worldWidth, GAME_HEIGHT);

    // Reset all per-run state — Phaser reuses the scene instance across restarts
    this.finished = false;
    this.snowflakeCount = 0;
    this.lastSafeX = 100;
    this.lastSafeY = level.platforms[0].y - 60;
    this.lastGroundedAt = 0;
    this.lastJumpPressedAt = -10000;

    this.drawBackground();
    this.drawTrees();
    createSnow(this, { quantity: 4, frequency: 80, depth: 6, screenSpace: true });

    this.buildPlatforms();
    this.buildSnowflakes();
    this.buildGoal();
    this.buildPlayer();
    this.buildHUD();

    this.physics.add.collider(this.player, this.platformGroup, () => {
      if (this.player.body.blocked.down || this.player.body.touching.down) {
        this.lastGroundedAt = this.time.now;
        this.lastSafeX = this.player.x;
        this.lastSafeY = this.player.y - 80;
      }
    });

    this.physics.add.overlap(this.player, this.snowflakeGroup, (_p, flake) => {
      flake.disableBody(true, true);
      this.snowflakeCount += 1;
      this.flakeText.setText(cs.snowflakes(this.snowflakeCount));
      sparkleBurst(this, flake.x, flake.y, 18);
      playPickup();
    });

    this.physics.add.overlap(this.player, this.goalSensor, () => {
      if (this.finished) return;
      this.finished = true;
      this.registry.set('snowflakes', this.snowflakeCount);
      sparkleBurst(this, this.player.x, this.player.y - 40, 60);
      playWin();
      this.time.delayedCall(900, () => this.scene.start('Win'));
    });

    this.cameras.main.startFollow(this.player, true, 0.12, 0.12);
    this.cameras.main.setDeadzone(160, 200);
  }

  drawBackground() {
    const g = this.add.graphics();
    g.fillGradientStyle(0x183a7a, 0x183a7a, 0x4f86c8, 0x9bdcff, 1);
    g.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    g.setScrollFactor(0);

    const hills = this.add.graphics();
    hills.fillStyle(0xffffff, 0.22);
    for (let x = -200; x < this.worldWidth + 200; x += 600) {
      hills.fillEllipse(x, GAME_HEIGHT - 20, 800, 280);
      hills.fillEllipse(x + 280, GAME_HEIGHT - 60, 700, 240);
    }
    hills.setScrollFactor(0.6);

    const fg = this.add.graphics();
    fg.fillStyle(0xeaf6ff, 1);
    fg.fillRect(0, GAME_HEIGHT - 18, this.worldWidth, 18);
    fg.setDepth(0);
  }

  drawTrees() {
    // Scatter trees along the world width
    const treeCount = Math.floor(this.worldWidth / 200);
    for (let i = 0; i < treeCount; i++) {
      const x = 60 + i * 200 + Math.random() * 80;
      const scale = 0.7 + (i % 3) * 0.15;
      this.add.image(x, GAME_HEIGHT - 18, 'treeTopSnow')
        .setOrigin(0.5, 1)
        .setScale(scale)
        .setDepth(1)
        .setScrollFactor(0.85);
    }
  }

  buildPlatforms() {
    this.platformGroup = this.physics.add.staticGroup();

    this.level.platforms.forEach((p) => {
      for (let i = 0; i < p.w; i++) {
        let key;
        if (p.w === 1) key = 'tundraCenter';
        else if (i === 0) key = 'tundraLeft';
        else if (i === p.w - 1) key = 'tundraRight';
        else key = 'tundraMid';
        const tile = this.platformGroup.create(p.x + TILE / 2 + i * TILE, p.y + TILE / 2, key);
        tile.setDepth(2);
        const capKey = (p.w > 1 && i === 0) ? 'snowLeft'
                     : (p.w > 1 && i === p.w - 1) ? 'snowRight'
                     : 'snowMid';
        this.add.image(p.x + TILE / 2 + i * TILE, p.y + TILE / 2, capKey).setDepth(3);
      }
    });
  }

  buildSnowflakes() {
    this.snowflakeGroup = this.physics.add.group({ allowGravity: false, immovable: true });
    this.level.snowflakes.forEach((s) => {
      const flake = this.snowflakeGroup.create(s.x, s.y, 'snowflake_real')
        .setScale(1.1)
        .setDepth(4);
      flake.body.setSize(36, 36);
      this.tweens.add({
        targets: flake,
        y: s.y - 8,
        duration: 1100,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
      });
      this.tweens.add({
        targets: flake,
        angle: 360,
        duration: 6000,
        repeat: -1,
        ease: 'linear',
      });
    });
  }

  buildGoal() {
    const baseY = 648;
    // Ice castle (procedurally drawn)
    const castle = this.add.image(this.goalX, baseY + 4, 'ice_castle')
      .setOrigin(0.5, 1)
      .setDepth(2);
    // Slow magical bobble on the castle so it feels alive
    this.tweens.add({
      targets: castle,
      y: baseY + 1,
      duration: 2400,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
    });

    // Elsa standing in front of the castle waiting for the player
    const elsa = this.add.image(this.goalX - 150, baseY, `${ELSA.key}_stand`)
      .setOrigin(0.5, 1)
      .setScale(1.5)
      .setDepth(4);
    this.tweens.add({
      targets: elsa,
      y: baseY - 6,
      duration: 1200,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
    });

    // Sensor right in front of Elsa — touching her finishes the level
    this.goalSensor = this.physics.add.staticImage(this.goalX - 150, baseY - 60, 'snowflake_real')
      .setVisible(false)
      .setSize(140, 150)
      .refreshBody();
  }

  buildPlayer() {
    const charIdx = this.registry.get('character') ?? 0;
    const charDef = CHARACTER_DATA[charIdx];
    this.charDef = charDef;

    const debugX = new URLSearchParams(location.search).get('x');
    const startX = debugX ? parseInt(debugX, 10) : 100;
    const startY = this.level.platforms[0].y - 60;
    this.player = this.physics.add.sprite(startX, startY, charDef.stand);
    this.player.setOrigin(0.5, 1);
    this.player.setDepth(10);
    this.player.body.setSize(38, 96).setOffset(17, 8);
    this.player.setMaxVelocity(RUN_SPEED, 1400);
    this.player.setCollideWorldBounds(false);
  }

  buildHUD() {
    this.flakeText = this.add.text(24, 18, cs.snowflakes(0), {
      fontFamily: 'sans-serif',
      fontSize: '36px',
      color: '#ffffff',
      stroke: '#0b1a3a',
      strokeThickness: 5,
    }).setScrollFactor(0).setDepth(50);

    this.add.text(GAME_WIDTH - 24, 18, '← → ↑ skok', {
      fontFamily: 'sans-serif',
      fontSize: '22px',
      color: '#cfe1ff',
      stroke: '#0b1a3a',
      strokeThickness: 4,
    }).setOrigin(1, 0).setScrollFactor(0).setDepth(50);
  }

  update(_time, _delta) {
    tickControls();
    if (this.finished) return;

    const onGround = this.player.body.blocked.down || this.player.body.touching.down;
    const now = this.time.now;
    if (onGround) this.lastGroundedAt = now;

    if (controls.left && !controls.right) {
      this.player.setVelocityX(-RUN_SPEED);
      this.player.setFlipX(true);
    } else if (controls.right && !controls.left) {
      this.player.setVelocityX(RUN_SPEED);
      this.player.setFlipX(false);
    } else {
      this.player.setVelocityX(0);
    }

    if (controls.jumpJustPressed) this.lastJumpPressedAt = now;

    const canCoyote = now - this.lastGroundedAt <= COYOTE_MS;
    const bufferActive = now - this.lastJumpPressedAt <= BUFFER_MS;
    if (bufferActive && canCoyote) {
      this.player.setVelocityY(JUMP_VELOCITY);
      this.lastGroundedAt = -10000;
      this.lastJumpPressedAt = -10000;
      playJump();
    }

    if (!controls.jump && this.player.body.velocity.y < -200) {
      this.player.setVelocityY(this.player.body.velocity.y * 0.5);
    }

    const inAir = !onGround;
    const desired = inAir ? this.charDef.jump : this.charDef.stand;
    if (this.player.texture.key !== desired) {
      this.player.setTexture(desired);
    }

    if (this.player.y > GAME_HEIGHT + 200) {
      this.respawn();
    }
  }

  respawn() {
    this.player.setVelocity(0, 0);
    this.player.setPosition(this.lastSafeX, this.lastSafeY);
    sparkleBurst(this, this.lastSafeX, this.lastSafeY - 40, 25);
    playRespawn();
  }
}
