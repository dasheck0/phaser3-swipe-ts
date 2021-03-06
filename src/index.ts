import 'phaser';

import config from './assets/config/index';
import MenuScene from './scenes/MenuScene';
import GameScene from './scenes/GameScene';

const game = new Phaser.Game({
    width: config.width,
    height: config.height,
    scene: [MenuScene, GameScene],
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

game.scene.start('Menu', {
    configFile: `assets/states/menu.yml`,
    envs: config
});
