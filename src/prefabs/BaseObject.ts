import { EnvironmentDto } from "../dtos/Environment.dto";

export default class BaseObject {
    constructor(
        protected readonly name: string, 
        protected readonly scene: Phaser.Scene,
        protected readonly options: any,
        protected readonly envs: EnvironmentDto) {}
}