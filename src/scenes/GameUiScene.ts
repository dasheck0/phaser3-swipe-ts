import BaseScene from "./BaseScene";
const { version } = require('../../package.json');

export default class GameUiScene extends BaseScene {
    constructor() {
        super('gameUi');
    }

    create(data) {
        super.create(data);

        this.getPrefab('gameOverDialog')?.setCallback(function() {
            this.getScene('game').restartGame();
        }, this);
    }
}