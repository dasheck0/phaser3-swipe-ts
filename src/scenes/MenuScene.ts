import BaseScene from "./BaseScene";
const { version } = require('../../package.json');

export default class MenuScene extends BaseScene {
    constructor() {
        super('Menu');
    }

    create(data) {
        super.create(data);

        this.getPrefab('startButton')?.setCallback(function() {
            this.scene.start('Game', {
                configFile: `assets/states/game.yml`,
                envs: this.envs
            });
        }, this);

        this.getPrefab('versionText')?.setText(`v${version}`);
    }
}