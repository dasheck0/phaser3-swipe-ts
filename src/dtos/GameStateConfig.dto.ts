import { AssetDtoType } from "./Asset.dto";
import { PrefabDto } from "./Prefab.dto";

export interface GameStateConfigDto {
    assets: AssetDtoType;
    scenes: string[];
    groups: string[];
    prefabs: PrefabDto[];
}