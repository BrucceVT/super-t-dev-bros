import { createAnimations } from "./animations.js";
import { levels } from "./levels.js";

const config = {
  type: Phaser.AUTO,
  width: 256,
  height: 244,
  backgroundColor: "#049cd8",
  parent: "game",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },
  scene: {
    preload,
    create,
    update,
  },
};

new Phaser.Game(config);

function preload() {
  console.log("Preload started");
  this.load.image("cloud1", "assets/scenery/overworld/cloud1.png");
  this.load.image("floorbricks", "assets/scenery/overworld/floorbricks.png");
  this.load.spritesheet("mario", "assets/entities/mario.png", {
    frameWidth: 18,
    frameHeight: 16,
  });
  this.load.spritesheet("koopa", "assets/entities/koopa.png", {
    frameWidth: 16,
    frameHeight: 24,
  });
  this.load.image("shell", "assets/entities/shell.png", {
    frameWidth: 16,
    frameHeight: 15,
  });
  this.load.audio("gameover", "assets/sound/music/gameover.mp3");
}

function create() {
  console.log("Create started");
  this.add.image(100, 50, "cloud1").setOrigin(0, 0).setScale(0.15);

  this.floor = this.physics.add.staticGroup();
  this.enemies = this.physics.add.group();

  this.currentLevel = 0;
  loadLevel.call(this, this.currentLevel);

  this.mario = this.physics.add
    .sprite(50, 100, "mario")
    .setOrigin(0, 1)
    .setCollideWorldBounds(true)
    .setGravityY(300);

  this.physics.world.setBounds(0, 0, 2000, config.height);
  this.physics.add.collider(this.mario, this.floor);
  this.physics.add.collider(this.mario, this.enemies, hitEnemy, null, this);
  this.physics.add.collider(this.enemies, this.floor);

  this.cameras.main.setBounds(0, 0, 2000, config.height);
  this.cameras.main.startFollow(this.mario);

  createAnimations(this);

  this.keys = this.input.keyboard.createCursorKeys();
}

function loadLevel(levelIndex) {
  console.log("Loading level:", levelIndex);
  const level = levels[levelIndex];
  this.floor.clear(true, true);
  this.enemies.clear(true, true);

  level.floor.forEach((block) => {
    this.floor
      .create(block.x, block.y, "floorbricks")
      .setOrigin(0, 0.5)
      .refreshBody();
  });

  level.enemies.forEach((enemy) => {
    const sprite = this.enemies.create(enemy.x, enemy.y, "koopa");
    sprite.setOrigin(0, 2);
    sprite.anims.play("koopa-walk", true);
    sprite.setVelocityX(-20);
    sprite.setCollideWorldBounds(true);
    sprite.body.setBounce(1, 0);
  });
}

function hitEnemy(mario, enemy) {
  if (mario.body.touching.down && enemy.texture.key !== "shell") {
    console.log("shell 1")
    enemy.setTexture("shell");
    enemy.body.setVelocity(0);
    enemy.body.setImmovable(true);
    enemy.anims.stop();
    enemy.anims.play("koopa-shell");
    mario.setVelocityY(-300);
  } else if (enemy.texture.key === "shell") {
    mario.isDead = true;
    mario.anims.play("mario-dead");
    mario.setCollideWorldBounds(false);
    this.sound.add("gameover", { volume: 0.2 }).play();

    setTimeout(() => {
      mario.setVelocityY(-350);
    }, 100);

    setTimeout(() => {
      this.scene.restart();
    }, 2000);
  }

  if (enemy.body.touching.down && enemy.texture.key === "shell") {
    console.log("shell 2")
    enemy.anims.play("koopa-dead", true);
    enemy.body.setImmovable(true);
    enemy.body.setVelocityY(0);
    enemy.setVelocityX(0);
    enemy.setCollideWorldBounds(true);
    enemy.body.setAllowGravity(true);
  }
}

function update() {
  if (this.mario.isDead) return;

  if (this.keys.left.isDown) {
    this.mario.anims.play("mario-walk", true);
    this.mario.setVelocityX(-100);
    this.mario.flipX = true;
  } else if (this.keys.right.isDown) {
    this.mario.anims.play("mario-walk", true);
    this.mario.setVelocityX(100);
    this.mario.flipX = false;
  } else {
    this.mario.anims.play("mario-idle", true);
    this.mario.setVelocityX(0);
  }

  if (this.keys.up.isDown && this.mario.body.touching.down) {
    this.mario.setVelocityY(-300);
    this.mario.anims.play("mario-jump", true);
  }

  if (this.mario.y >= config.height) {
    this.mario.isDead = true;
    this.mario.anims.play("mario-dead");
    this.mario.setCollideWorldBounds(false);
    this.sound.add("gameover", { volume: 0.2 }).play();

    setTimeout(() => {
      this.mario.setVelocityY(-350);
    }, 100);

    setTimeout(() => {
      this.scene.restart();
    }, 2000);
  }

  if (this.mario.x >= 2000) {
    this.currentLevel++;
    if (this.currentLevel < levels.length) {
      loadLevel.call(this, this.currentLevel);
      this.mario.setPosition(50, 100);
    } else {
      alert("¡Has completado todos los niveles!");
      this.scene.restart();
    }
  }
}
