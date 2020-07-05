import BaseScene from "./BaseScene";
import { ArrowDirection } from '../prefabs/game/ArrowGrid'

export default class GameScene extends BaseScene {
    private upKey: Phaser.Input.Keyboard.Key;
    private rightKey: Phaser.Input.Keyboard.Key;
    private downKey: Phaser.Input.Keyboard.Key;
    private leftKey: Phaser.Input.Keyboard.Key;

    private currentTime: number;
    private timer: Phaser.Time.TimerEvent;

    private overlay: Phaser.GameObjects.Graphics;

    private lost: boolean;

    constructor() {
        super('game');
    }

    create(data) {
        super.create(data);

        this.upKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.rightKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        this.downKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        this.leftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);

        this.timer = this.time.addEvent({
            delay: 1000,
            callback: function () {
                this.addToTimer(-1);
            },
            callbackScope: this,
            repeat: -1
        });

        this.overlay = this.add.graphics({ x: 0, y: 0 });
        this.overlay.setDefaultStyles({
            fillStyle: {
                color: 0x000000,
                alpha: 0.5
            }
        });

        this.restartGame();
    }

    update() {
        let result = null;

        if (Phaser.Input.Keyboard.JustDown(this.upKey)) {
            result = this.getPrefab('arrowGrid')?.guessDirection(ArrowDirection.up);
        } else if (Phaser.Input.Keyboard.JustDown(this.rightKey)) {
            result = this.getPrefab('arrowGrid')?.guessDirection(ArrowDirection.right);
        } else if (Phaser.Input.Keyboard.JustDown(this.downKey)) {
            result = this.getPrefab('arrowGrid')?.guessDirection(ArrowDirection.down);
        } else if (Phaser.Input.Keyboard.JustDown(this.leftKey)) {
            result = this.getPrefab('arrowGrid')?.guessDirection(ArrowDirection.left);
        }

        if (result) {
            this.addToTimer(1);
        } if (result === false) {
            this.addToTimer(-2);
        }

    }

    private addToTimer(newTime: number) {
        this.currentTime = Math.max(this.currentTime + newTime, 0);
        this.getPrefab('timeText')?.setText(`${this.currentTime}s`);

        if (this.currentTime <= 0) {
            this.showLoosingDialog();
        }
    }

    private showLoosingDialog() {
        this.lost = true;

        this.overlay.clear();
        this.overlay.fillRect(0, 0, this.envs.width, this.envs.height);

        this.getScene('gameUi')?.getPrefab('gameOverDialog')?.showDialog();

        this.scene.pause();
    }

    restartGame() {
        this.lost = false;
        this.scene.resume();

        this.getScene('gameUi')?.getPrefab('gameOverDialog')?.hideDialog();
        this.overlay.clear();

        this.currentTime = 30;
        this.getPrefab('arrowGrid')?.initialize();
        this.getPrefab('arrowGrid')?.createArrowGrid();
    }
}