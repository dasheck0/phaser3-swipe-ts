import BaseScene from "../scenes/BaseScene";
import { EnvironmentDto } from "../dtos/Environment.dto";

export default class BaseText extends Phaser.GameObjects.Text {
    constructor(
        name: string,
        scene: BaseScene,
        private readonly options: any,
        private readonly envs: EnvironmentDto) {
        super(scene, options.position?.x, options.position?.y, options.text, {});

        if (options.position?.relative) {
            const x = envs.width * options.position.x;
            const y = envs.height * options.position.y;

            this.setPosition(x, y);
        }

        if (options.anchor) {
            this.setOrigin(options.anchor.x, options.anchor.y);
        }

        if (options.scale) {
            this.setScale(options.scale.x, options.scale.y);
        }

        if (options.angle) {
            this.angle = options.angle;
        }

        if (options.alpha || options.alpha === 0) {
            this.alpha = options.alpha;
        }

        scene.add.existing(this);

        if (options.group) {
            const group = scene.getGroup(options.group);
            this.setDepth(group?.depth);
            console.log("group is", group);

            group?.group.add(this);
        }

        if (options.fontFamily) {
            this.setFontFamily(options.fontFamily);
        }

        if (options.fontSize) {
            this.setFontSize(options.fontSize);
        }

        if (options.shadow && options.shadow.enabled) {
            this.setShadow(
                options.shadow.x || 2,
                options.shadow.y || 2,
                options.color || '#000',
                options.blur || 0,
                options.enableStroke || true,
                options.enableFill || true
            );
        }

        if (options.fontColor) {
            this.setColor(options.fontColor);
        }

        scene.add.existing(this);
    }
}