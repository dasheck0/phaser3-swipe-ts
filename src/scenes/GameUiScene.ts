import BaseScene from "./BaseScene";
const { version } = require('../../package.json');

export default class GameUiScene extends BaseScene {
    constructor() {
        super('gameUi');
    }

    create(data) {
        super.create(data);

        const backToMenuCallback = function () {
            console.log("back to menu");
            
            this.getScene('game').shutdown();
            this.scene.stop('game');
            this.scene.start('menu', {
                configFile: `assets/states/menu.yml`,
                envs: this.envs
            });

            console.log("hfdjkhfdjfhdjkhfjdk");
        };

        const reloadCallback = function () {
            console.log("reoload");
            this.getScene('game').restartGame();
        };

        this.getPrefab('gameOverDialog')?.setCallbacks(
            [
                backToMenuCallback,
                reloadCallback,
                reloadCallback
            ],
            this);
    }
}