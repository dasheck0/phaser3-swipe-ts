import 'phaser';

import TestScene from './scenes/TestScene';
import config from './assets/config/index';

const game = new Phaser.Game({
    width: config.width,
    height: config.height,
    scene: [TestScene],
    backgroundColor: config.window.backgroundColor,
    physics: {
        default: 'arcade',
        arcade: {
            debug: config.debug
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    render: {
        transparent: true
    },
    parent: 'phaser-container'
});

game.scene.start('Test', {
    configFile: `assets/states/test.yml`,
    envs: config
});
