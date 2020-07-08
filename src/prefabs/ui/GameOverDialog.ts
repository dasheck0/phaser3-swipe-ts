import BaseObject from "../BaseObject";
import BaseScene from "../../scenes/BaseScene";
import { EnvironmentDto } from "../../dtos/Environment.dto";
import BaseText from "../BaseText";

export default class GameOverDialog extends BaseObject {
    private captionText: BaseText;
    private scoreText: BaseText;
    private scoreLabelText: BaseText;
    private background: any;
    private buttonIcons: Phaser.GameObjects.Sprite[];
    private button: any;
    private callbacks: Function[];
    private callbackScope: any;
    private sizer: any;

    private isShowing: boolean;
    private isAnimating: boolean;

    constructor(name: string, scene: BaseScene, options: any, envs: EnvironmentDto) {
        super(name, scene, options, envs);

        this.isShowing = true;
        this.isAnimating = false;

        this.background = this.scene['ui'].add.roundRectangle(0, 0, 575, 500, 15).setFillStyle(0xD0E3C4, 1);

        this.captionText = new BaseText('captionText', this.scene, {
            position: { x: 0, y: 0 },
            text: 'Game Over!',
            fontFamily: `raleway-regular`,
            fontSize: 72,
            fontColor: 0x503047
        }, this.envs);

        this.scoreText = new BaseText('scoreText', this.scene, {
            position: { x: 0, y: 0 },
            text: 367,
            fontFamily: ' raleway-regular',
            fontSize: 144,
            fontColor: 0x503047
        }, this.envs);

        this.scoreLabelText = new BaseText('scoreLabelText', this.scene, {
            position: { x: 0, y: 0 },
            text: `Current Score`,
            fontFamily: ' raleway-regular',
            fontSize: 32,
            fontColor: 0x503047
        }, this.envs);

        this.buttonIcons = ['back-button-icon', 'start-button-icon', 'reload-button-icon'].map(iconName => this.scene.add.sprite(0, 0, iconName));

        this.button = this.scene['ui'].add.buttons({
            anchor: { centerX: 'center', centerY: 'center' },
            orientation: 'x',
            space: 50,
            buttons: this.buttonIcons.map(buttonIcon => (
                this.scene['ui'].add.label({
                    width: 100,
                    height: 100,
                    icon: buttonIcon,
                    iconMask: false
                })
            ))
        });

        this.button.on('button.click', function (button, index, pointer, event) {
            this.scene.tweens.add({
                targets: this.buttonIcons[index],
                scale: this.buttonIcons[index].scale * 0.9,
                duration: 50,
                repeat: 0,
                yoyo: true,
                ease: 'Cubic'
            });

            if (this.callbacks && this.callbacks[index]) {
                this.callbacks[index].call(this.callbackScope || this, button, index, pointer, event);
            }
        }, this);

        this.sizer = this.scene['ui'].add.sizer({
            anchor: {
                centerX: 'center',
                centerY: 'center'
            },
            width: 575,
            height: 500,
            orientation: 'y'
        })
            .addBackground(this.background)
            .add(this.captionText, { padding: { top: 40 } })
            .add(this.scoreText)
            .add(this.scoreLabelText)
            .add(this.button, { padding: { top: 30 } })
            .layout();

        this.sizer.setDepth(10);

        this.hideDialog(false);
    }

    setCaption(caption: string) {
        this.captionText.setText(caption);
    }

    setScore(score: number) {
        this.scoreText.setText(String(score));
        this.sizer.layout();
    }

    setColor(color: string) {
        console.log("fdhjkfh", this.background);
        const colorObject = Phaser.Display.Color.HexStringToColor(color);
        const darkerColor = colorObject.darken(8);

        this.background.fillColor = colorObject.color;

        this.buttonIcons.forEach((buttonIcon) => {
            buttonIcon.setTint(darkerColor.color);
        });
    }

    setCallbacks(callbacks, callbackScope) {
        this.callbacks = callbacks;
        this.callbackScope = callbackScope;
    }

    showDialog(animate: boolean = true, delay: number = 0) {
        if (!this.isShowing) {
            if (!this.isAnimating && animate) {
                this.isAnimating = true;
                this.scene.tweens.add({
                    targets: this.sizer,
                    delay,
                    y: { from: this.envs.height * 1.5, to: this.envs.height / 2 },
                    ease: 'Bounce.easeOut',
                    onComplete: function () {
                        this.isAnimating = false;
                        this.isShowing = true;
                    },
                    onCompleteScope: this
                });
            } else {
                this.sizer.y = this.envs.height / 2;
                this.isAnimating = false;
                this.isShowing = true;
            }
        }
    }

    hideDialog(animate: boolean = true, delay: number = 0) {
        if (this.isShowing) {
            if (!this.isAnimating && animate) {
                this.isAnimating = true;
                this.scene.tweens.add({
                    targets: this.sizer,
                    y: { from: this.envs.height / 2, to: this.envs.height * 1.5 },
                    ease: 'Cubic.In',
                    delay,
                    onComplete: function () {
                        this.isAnimating = false;
                        this.isShowing = false;
                    },
                    onCompleteScope: this
                });
            } else {
                this.sizer.y = this.envs.height * 1.5;
                this.isAnimating = false;
                this.isShowing = false;
            }
        }
    }
}