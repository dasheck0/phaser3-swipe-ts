import BaseScene from "./BaseScene";
import { ArrowDirection } from '../prefabs/game/ArrowGrid'

export default class GameScene extends BaseScene {
    private upKey: Phaser.Input.Keyboard.Key;
    private rightKey: Phaser.Input.Keyboard.Key;
    private downKey: Phaser.Input.Keyboard.Key;
    private leftKey: Phaser.Input.Keyboard.Key;

    private currentTime: number;
    private triesUntilCorrect: number;
    private timer: Phaser.Time.TimerEvent;
    private swipeTimer: Phaser.Time.TimerEvent;

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
        this.overlay.setDepth(9);
        this.overlay.setDefaultStyles({
            fillStyle: {
                color: 0x000000,
                alpha: 0.5
            }
        });

        this.restartGame();
    }

    shutdown() {
        super.shutdown();

        this.swipeTimer?.destroy();
        this.swipeTimer = null;

        this.timer?.destroy();
        this.timer = null;
    }

    startSwipeTimer() {
        console.log("Swipteim", this.swipeTimer);

        if (this.swipeTimer) {
            this.swipeTimer.reset({
                startAt: 0,
                delay: this.currentTime * 1000
            });
        } else {
            this.swipeTimer = this.time.delayedCall(this.currentTime * 1000, () => { });
        }
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
            const elapsed = this.swipeTimer.elapsed;
            console.log("Elapsed", elapsed);

            this.getPrefab('gameScoreManager')?.addGameSnapshot({ triesBeforeCorrect: this.triesUntilCorrect, elapsedInMillies: elapsed });

            this.startSwipeTimer();
            this.triesUntilCorrect = 0;
        } if (result === false) {
            this.addToTimer(-2);
            this.triesUntilCorrect += 1;
        }

    }

    private addToTimer(newTime: number) {
        this.currentTime = Math.max(this.currentTime + newTime, 0);
        this.getPrefab('timeText')?.setText(`${this.currentTime}s`);
        this.getPrefab('scoreText')?.setText(Math.ceil(this.getPrefab('gameScoreManager')?.getCurrentGameScore().score));

        if (this.currentTime <= 0) {
            this.showLoosingDialog();
        }
    }

    private showLoosingDialog() {
        if (!this.lost) {
            this.lost = true;

            this.overlay.clear();
            this.overlay.alpha = 1;
            this.overlay.fillRect(0, 0, this.envs.width, this.envs.height);

            this.getPrefab('gameScoreManager')?.finishGame();
            this.getScene('gameUi')?.getPrefab('gameOverDialog')?.setScore(Math.ceil(this.getPrefab('gameScoreManager')?.getCurrentGameScore().score));
            this.getScene('gameUi')?.getPrefab('gameOverDialog')?.showDialog();

            this.scene.pause();
        }
    }

    restartGame() {
        this.lost = false;
        this.scene.resume();

        this.getScene('gameUi')?.getPrefab('gameOverDialog')?.hideDialog();

        this.tweens.add({
            targets: this.overlay,
            alpha: { from: 1, to: 0 },
            ease: 'Quintic.easeInOut',
            yoyo: false,
            repeat: 0,
            onComplete: function () {
                this.overlay.clear();
                this.overlay.alpha = 1;
            },
            onCompleteScope: this
        });

        this.currentTime = 30;
        this.triesUntilCorrect = 0;
        this.getPrefab('arrowGrid')?.initialize();
        this.getPrefab('arrowGrid')?.createArrowGrid();
        this.getPrefab('gameScoreManager')?.startNewGame();

        this.startSwipeTimer();
    }
}