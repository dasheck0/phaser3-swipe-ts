import BaseScene from "./BaseScene";
import { ArrowDirection } from '../prefabs/game/ArrowGrid'

export default class GameScene extends BaseScene {
    private upKey: Phaser.Input.Keyboard.Key;
    private rightKey: Phaser.Input.Keyboard.Key;
    private downKey: Phaser.Input.Keyboard.Key;
    private leftKey: Phaser.Input.Keyboard.Key;

    constructor() {
        super('Game');
    }

    create(data) {
        super.create(data);

        this.upKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.rightKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        this.downKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        this.leftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);

        this.getPrefab('arrowGrid')?.createArrowGrid();
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.upKey)) {
            this.getPrefab('arrowGrid')?.guessDirection(ArrowDirection.up);
        } else if (Phaser.Input.Keyboard.JustDown(this.rightKey)) {
            this.getPrefab('arrowGrid')?.guessDirection(ArrowDirection.right);
        } else if (Phaser.Input.Keyboard.JustDown(this.downKey)) {
            this.getPrefab('arrowGrid')?.guessDirection(ArrowDirection.down);
        } else if (Phaser.Input.Keyboard.JustDown(this.leftKey)) {
            this.getPrefab('arrowGrid')?.guessDirection(ArrowDirection.left);
        }
    }
}