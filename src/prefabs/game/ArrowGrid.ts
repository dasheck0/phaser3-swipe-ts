import BaseObject from "../BaseObject";
import BaseScene from "../../scenes/BaseScene";
import { EnvironmentDto } from "../../dtos/Environment.dto";
import Arrow from "./Arrow";

import { times, flatten, sample } from 'lodash';

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
    private backgroundRectangle: Phaser.GameObjects.Graphics;

    constructor(name: string, scene: BaseScene, options: any, envs: EnvironmentDto) {
        super(name, scene, options, envs);

        this.initialize();
    }

    initialize() {
        this.columnCount = this.options.columnCount || 2;
        this.rowCount = this.options.rowCount || 2;
        this.currentLevel = 1;

        this.backgroundRectangle = this.scene.add.graphics({ x: 0, y: 0 });
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

        const colorConfiguration = this.sampleColorConfiguration();

        this.backgroundRectangle.clear();
        this.backgroundRectangle.fillStyle(Phaser.Display.Color.HexStringToColor(colorConfiguration.backgroundColor).color, 1);
        this.backgroundRectangle.fillRect(0,0,this.envs.width, this.envs.height);

        this.arrows = flatten(times(this.rowCount, (rowIndex) => {
            return times(this.columnCount, (columnIndex) => {
                const x = (this.envs.width - fullWidth + size) / 2 + columnIndex * (size + spacing);
                const y = (this.envs.height - fullHeight + size) / 2 + rowIndex * (size + spacing);
                const index = (rowIndex * this.columnCount + columnIndex);
                const offset = rowIndex % 2 * (this.columnCount+1) % 2;

                return new Arrow(`arrow_${columnIndex}${rowIndex}`, this.scene, {
                    position: { x, y },
                    key: 'arrow',
                    group: this.options.pool,
                    anchor: { x: 0.5, y: 0.5 },
                    orientation: index === specialIndex ? orientation + 2 : orientation,
                    colors: [colorConfiguration.arrowColor1, colorConfiguration.arrowColor2],
                    colorKey: (index + offset) % 2
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

    private sampleColorConfiguration() {
        return sample([
            { backgroundColor: "432990", arrowColor1: "50E3C2", arrowColor2: "FFFFFF" },
            { backgroundColor: "40BAFD", arrowColor1: "3D94FC", arrowColor2: "8CFFE5" },
            { backgroundColor: "774CFB", arrowColor1: "CAF780", arrowColor2: "FD65E1" },
            { backgroundColor: "DC934F", arrowColor1: "FEC576", arrowColor2: "F3FD37" },
            { backgroundColor: "9C65FC", arrowColor1: "1EB1ED", arrowColor2: "FD65E1" },
            { backgroundColor: "FBD645", arrowColor1: "EE9425", arrowColor2: "FEFEFB" },
            { backgroundColor: "FA726C", arrowColor1: "58E2C2", arrowColor2: "ED1551" },
            { backgroundColor: "58E2C2", arrowColor1: "B9E88B", arrowColor2: "8F2CFA" },
            { backgroundColor: "B9E88B", arrowColor1: "EE9425", arrowColor2: "FEFEFB" },
            { backgroundColor: "76E77F", arrowColor1: "2982B0", arrowColor2: "459825" },
            { backgroundColor: "2824FB", arrowColor1: "8F2CFA", arrowColor2: "B9E88B" },
            { backgroundColor: "B9B9B9", arrowColor1: "454545", arrowColor2: "6DFEDD" },
            { backgroundColor: "5CD2D2", arrowColor1: "7884FC", arrowColor2: "4824F7" },
            { backgroundColor: "F890CC", arrowColor1: "3A3EB0", arrowColor2: "23CAFD" },
            { backgroundColor: "8C51FC", arrowColor1: "FD41FB", arrowColor2: "20BEFD" },
            { backgroundColor: "45D684", arrowColor1: "D5FFEF", arrowColor2: "3D5A1F" },
            { backgroundColor: "D3D3D3", arrowColor1: "A3A3A3", arrowColor2: "4824F7" },
            { backgroundColor: "84DBF4", arrowColor1: "237AB4", arrowColor2: "DBFFE0" },
            { backgroundColor: "9DB4BF", arrowColor1: "E1FBFC", arrowColor2: "5D6B73" },
            { backgroundColor: "4945EC", arrowColor1: "000400", arrowColor2: "9B9FCC" },
            { backgroundColor: "E68876", arrowColor1: "484A48", arrowColor2: "FEC7B8" },
            { backgroundColor: "534E56", arrowColor1: "837F9B", arrowColor2: "F8F1FF" },
            { backgroundColor: "9CC1BC", arrowColor1: "5D586A", arrowColor2: "E6EBE0" },
            { backgroundColor: "A5C2BD", arrowColor1: "E7513E", arrowColor2: "F6F7EC" },
            { backgroundColor: "381E2A", arrowColor1: "C4D5B1", arrowColor2: "B8562C" },
            { backgroundColor: "F4D6BB", arrowColor1: "ACC2A7", arrowColor2: "2D2D53" },
            { backgroundColor: "440F7F", arrowColor1: "5AE5FE", arrowColor2: "EA3C8D" },
            { backgroundColor: "FEA5A6", arrowColor1: "440F7F", arrowColor2: "FED6C1" },
            { backgroundColor: "F1F7ED", arrowColor1: "92C6B1", arrowColor2: "544A4B" },
            { backgroundColor: "414F7A", arrowColor1: "92A984", arrowColor2: "F1F7EE" }
        ]);
    }
}