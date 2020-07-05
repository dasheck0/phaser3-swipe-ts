import { EnvironmentDto } from "../dtos/Environment.dto";
import BaseScene from "../scenes/BaseScene";

export default class BaseSprite extends Phaser.Physics.Arcade.Sprite {
    constructor(
        name: string, 
        scene: BaseScene, 
        private readonly options: any, 
        private readonly envs: EnvironmentDto) {
        super(scene, options.position?.x, options.position?.y, options.key);

        if(options.position?.relative) {
            const x = envs.width * options.position.x;
            const y = envs.height * options.position.x;

            this.setPosition(x,y);
        }

        if(options.anchor) {
            this.setOrigin(options.anchor.x, options.anchor.y || options.anchor.x);
        }

        if(options.scale) {
            this.setScale(options.scale.x, options.scale.y || options.scale.x);
        }

        if(options.angle) {
            this.angle = options.angle;
        }

        if(options.alpha || options.alpha === 0) {
            this.alpha = options.alpha;
        }

        scene.add.existing(this);

        if(options.group) {
            const group = scene.getGroup(options.group);
            this.setDepth(group?.depth);
            group?.group.add(this);
        }
    }
}