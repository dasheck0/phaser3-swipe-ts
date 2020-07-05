import { EnvironmentWindowDto } from "./EnvironmentWindow.dto";

export interface EnvironmentDto {
    width: number;
    height: number;
    debug: boolean;
    window: EnvironmentWindowDto;
    game: any;
}