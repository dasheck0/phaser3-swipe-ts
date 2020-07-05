import BaseScene from "./BaseScene";
const { version } = require('../../package.json');

export default class MenuScene extends BaseScene {
    constructor() {
        super('Menu');
    }

    create(data) {
        super.create(data);

        this.getPrefab('startButton')?.setCallback(function() {
            console.log("JHello");
        }, this);

        this.getPrefab('versionText')?.setText(`v${version}`);
    }
}