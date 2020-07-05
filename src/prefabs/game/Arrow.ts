import BaseSprite from "../BaseSprite";
import BaseScene from "../../scenes/BaseScene";
import { EnvironmentDto } from "../../dtos/Environment.dto";
import { ArrowDirection } from "./ArrowGrid";

export default class Arrow extends BaseSprite {
    constructor(name: string, scene: BaseScene, options: any, envs: EnvironmentDto) {
        super(name, scene, options, envs);

        this.angle = (options.orientation * 90) % 360.0;
        this.tint =  Phaser.Display.Color.HexStringToColor(options.colors[options.colorKey]).color;
    }

    getOrientation(): ArrowDirection {
        return this.options.orientation;
    }
}