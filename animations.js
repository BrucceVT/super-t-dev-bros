export const createAnimations = (game) => {
  // Animaciones de Mario
  game.anims.create({
    key: "mario-walk",
    frames: game.anims.generateFrameNumbers("mario", { start: 1, end: 3 }),
    frameRate: 12,
    repeat: -1,
  });

  game.anims.create({
    key: "mario-idle",
    frames: [{ key: "mario", frame: 0 }],
  });

  game.anims.create({
    key: "mario-jump",
    frames: [{ key: "mario", frame: 5 }],
  });

  game.anims.create({
    key: "mario-dead",
    frames: [{ key: "mario", frame: 4 }],
  });

  // Animaciones del Koopa
  game.anims.create({
    key: "koopa-walk",
    frames: game.anims.generateFrameNumbers("koopa", { start: 0, end: 1 }),
    frameRate: 5,
    repeat: -1,
  });

  game.anims.create({
    key: 'koopa-dead',
    frames: [
      { key: 'shell', frame: 0 },
      { key: 'shell', frame: 1 }
    ],
    frameRate: 5,
    repeat: 0
  });

  game.anims.create({
    key: 'koopa-shell',
    frames: [{ key: 'shell', frame: 0 }]
  });
};
