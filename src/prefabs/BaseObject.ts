import { EnvironmentDto } from "../dtos/Environment.dto";
import BaseScene from "../scenes/BaseScene";

export default class BaseObject {
    constructor(
        protected readonly name: string, 
        protected readonly scene: BaseScene,
        protected readonly options: any,
        protected readonly envs: EnvironmentDto) {}
}