import { EnvironmentDto } from "../dtos/Environment.dto";

export default class BaseObject {
    constructor(
        private readonly name: string, 
        private readonly scene: Phaser.Scene,
        private readonly options: any,
        private readonly envs: EnvironmentDto) {}
}