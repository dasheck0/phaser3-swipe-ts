import BaseObject from "../BaseObject";
import BaseScene from "../../scenes/BaseScene";
import { EnvironmentDto } from "../../dtos/Environment.dto";
import Arrow from "./Arrow";

import { times, flatten, cloneDeep } from 'lodash';

export enum ArrowDirection {
    up = 0,
    right = 1,
    down = 2,
    left = 3
};

export class ArrowGrid extends BaseObject {
    private columnCount: number;
    private rowCount: number;
    private currentDirection: ArrowDirection;
    private arrows: Arrow[];
    private tempArrows: Arrow[];
    private currentLevel: number;

    constructor(name: string, scene: BaseScene, options: any, envs: EnvironmentDto) {
        super(name, scene, options, envs);

        this.initialize();
    }

    initialize() {
        this.columnCount = this.options.columnCount || 2;
        this.rowCount = this.options.rowCount || 2;
        this.currentLevel = 1;
    }

    createArrowGrid() {
        const size = 40;
        const spacing = 10;

        const fullWidth = size * this.columnCount + spacing * (this.columnCount - 1);
        const fullHeight = size * this.rowCount + spacing * (this.rowCount - 1);

        const specialIndex = Phaser.Math.Between(0, (this.rowCount - 1) * this.columnCount + this.columnCount - 1);
        const orientation = Phaser.Math.Between(0, 3);
        this.currentDirection = (orientation + 2) % 4;

        if (this.arrows?.length > 0) {
            this.arrows.map((arrow) => {
                arrow.destroy();
            });
        }

        this.arrows = flatten(times(this.rowCount, (rowIndex) => {
            return times(this.columnCount, (columnIndex) => {
                const x = (this.envs.width - fullWidth + size) / 2 + columnIndex * (size + spacing);
                const y = (this.envs.height - fullHeight + size) / 2 + rowIndex * (size + spacing);
                const index = (rowIndex * this.columnCount + columnIndex);

                return new Arrow(`arrow_${columnIndex}${rowIndex}`, this.scene, {
                    position: { x, y },
                    key: 'arrow',
                    group: this.options.pool,
                    anchor: { x: 0.5, y: 0.5 },
                    orientation: index === specialIndex ? orientation + 2 : orientation,
                    colors: ['#C05746', '#503047'],
                    colorKey: index % 2
                }, this.envs)
            });
        }));

        this.scene.tweens.add({
            targets: this.arrows,
            scaleX: { from: 1, to: 1 },
            scaleY: { from: 1, to: 1 },
            alpha: { from: 0.5, to: 1 },
            ease: 'Quintic.easeInOut',
            duration: 150,
            yoyo: false,
            repeat: 0,
        });
    }

    guessDirection(direction: ArrowDirection) {
        if (this.currentDirection !== direction) {
            this.scene.cameras.main.shake(250, 0.01, true);
            return false;
        }

        this.killCurrentGrid(direction);
        return true;
    }

    killCurrentGrid(intoDirection: ArrowDirection) {
        let xOffset = "+=0";
        let yOffset = "+=0";
        const distance = 90;
        const duration = 150;

        this.tempArrows = this.cloneArrowGrid(this.arrows);

        switch (intoDirection) {
            case ArrowDirection.up:
                yOffset = `-=${distance}`;
                break;

            case ArrowDirection.right:
                xOffset = `+=${distance}`;
                break;

            case ArrowDirection.down:
                yOffset = `+=${distance}`;
                break;

            case ArrowDirection.left:
                xOffset = `-=${distance}`;
                break;
        }

        this.scene.tweens.add({
            targets: this.tempArrows,
            x: xOffset,
            y: yOffset,
            alpha: { from: 0.5, to: 0 },
            ease: 'Quintic.easeInOut',
            duration,
            yoyo: false,
            repeat: 0,
            onComplete: function (tween, targets) {
                targets.forEach((target) => {
                    console.log("destroying");
                    target.destroy();
                });
            },
            onCompleteScope: this
        });

        this.currentLevel += 1;
        const size = Math.min(10, Math.floor(Math.sqrt(this.currentLevel) + 2));

        this.columnCount = size;
        this.rowCount = size;

        this.createArrowGrid();
    }

    private cloneArrowGrid(gridToClone: Arrow[]) {
        return gridToClone.map((arrow, index) => {
            return new Arrow(`arrowCopy_${index}`, this.scene, {
                position: { x: arrow.getCenter().x, y: arrow.getCenter().y },
                key: 'arrow',
                group: this.options.tempPool,
                anchor: { x: 0.5, y: 0.5 },
                orientation: arrow.getOrientation(),
                colors: ['#C05746', '#503047'],
                colorKey: index % 2
            }, this.envs);
        });
    }
}