import BaseObject from '../BaseObject';

export default class ImageButton extends BaseObject {
    private callback: any;
    private callbackScope: any;
    private icon: Phaser.GameObjects.Sprite;
    private button: any;

    constructor(name, scene, options, envs) {
        super(name, scene, options, envs);

        this.callback = null;
        this.callbackScope = null;

        this.icon = this.scene.add.sprite(0, 0, options.key);

        this.button = this.scene['ui'].add.buttons({
            anchor: options.anchor || {},
            orientation: options.orientation || 'y',
            buttons: [
                this.scene['ui'].add.label({
                    width: this.options.size.x || 50,
                    height: this.options.size.y || 50,
                    icon: this.icon,
                    iconMask: options.iconMask || false,
                    space: options.margin || {}
                })
            ]
        })
            .layout();

        if (options.bounds && options.bounds.draw) {
            this.button.drawBounds(this.scene.add.graphics(), options.bounds.color || 0xffffff);
        }

        this.button.on('button.click', function (button, index, pointer, event) {
            if (options.animated) {
                this.scene.tweens.add({
                    targets: this.icon,
                    scale: this.icon.scale * 0.9,
                    duration: 50,
                    repeat: 0,
                    yoyo: true,
                    ease: 'Cubic'
                });
            }

            if (this.callback) {
                this.callback.call(this.callbackScope || this, button, index, pointer, event);
            }
        }, this);
    }

    setCallback(callback, callbackScope) {
        this.callback = callback;
        this.callbackScope = callbackScope;
    }

    unsetCallback() {
        this.callback = null;
    }
}