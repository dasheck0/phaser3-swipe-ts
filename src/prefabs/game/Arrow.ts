import BaseSprite from "../BaseSprite";
import BaseScene from "../../scenes/BaseScene";
import { EnvironmentDto } from "../../dtos/Environment.dto";
import { ArrowDirection } from "./ArrowGrid";
import { sample } from 'lodash';
import { ArrowEffectDto } from "./dtos/ArrowEffect";

export default class Arrow extends BaseSprite {
    private effect: ArrowEffectDto;
    private effectProbability: number;

    constructor(name: string, scene: BaseScene, options: any, envs: EnvironmentDto) {
        super(name, scene, options, envs);

        this.angle = (options.orientation * 90) % 360.0;
        this.tint = Phaser.Display.Color.HexStringToColor(options.colors[options.colorKey]).color;

        if (!this.options.skipEffects) {
            const interolation = this.options.currentLevel > 100 ? 1 : this.options.currentLevel / 100;

            this.effect = this.sampleEffect();
            this.effectProbability = this.getArrowEffectProbability(this.effect, interolation);

            if (Math.random() <= this.effectProbability) {
                this.applyEffect(this.effect);
            }
        }
    }

    getOrientation(): ArrowDirection {
        return this.options.orientation;
    }

    private applyEffect(effect: ArrowEffectDto) {
        if (this.effect.name === 'pulsating') {
            this.scene.tweens.add({
                targets: this,
                scaleX: { from: 1.1, to: 0.9 },
                scaleY: { from: 1.1, to: 0.9 },
                ease: 'Quintic.easeInOut',
                duration: 300,
                yoyo: false,
                repeat: -1
            });
        }

        if (this.effect.name === 'flashing') {
            this.scene.tweens.add({
                targets: this,
                alpha: { from: 1, to: 0.5 },
                ease: 'Quintic.easeInOut',
                duration: 300,
                yoyo: false,
                repeat: -1
            });
        }

        if (this.effect.name === 'swinging') {
            this.scene.tweens.add({
                targets: this,
                angle: '+=30',
                ease: 'Quintic.easeInOut',
                duration: 300,
                yoyo: true,
                repeat: -1
            });
        }

        if (this.effect.name === 'disappearing') {
            this.scene.tweens.add({
                targets: this,
                alpha: { from: 1, to: 0 },
                ease: 'Quintic.easeInOut',
                duration: 500,
                delay: 500,
                yoyo: false,
                repeat: 0
            });
        }
    }

    private sampleEffect(): ArrowEffectDto {
        return sample([
            {
                name: 'pulsating',
                startValue: 1,
                asymptoticValue: -2,
                fraction: -4
            }, {
                name: 'flashing',
                startValue: 1,
                asymptoticValue: -2,
                fraction: -4
            }, {
                name: 'swinging',
                startValue: 1,
                asymptoticValue: -2,
                fraction: -2
            }, {
                name: 'disappearing',
                startValue: 1,
                asymptoticValue: -2,
                fraction: -1.3
            },
        ]);
    }

    private getArrowEffectProbability(effect: ArrowEffectDto, interolation: number): number {
        return effect.startValue + effect.asymptoticValue * Math.exp(effect.fraction * interolation);
    }
}