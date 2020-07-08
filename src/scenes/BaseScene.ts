import * as YAML from 'yamljs';
import { forEach, map } from 'lodash';

import { EnvironmentDto } from "../dtos/Environment.dto";
import { SceneOptionsDto } from "../dtos/SceneOptions.dto";
import { GameStateConfigDto } from '../dtos/GameStateConfig.dto';
import { AssetDtoType, AssetDto } from '../dtos/Asset.dto';
import { GroupDto } from './dtos/Group.dto';
import { SceneDto } from './dtos/Scene.dto';
import { PrefabDto } from './dtos/Prefab.dto';
import { Store } from '../prefabs/index';

export default class BaseScene extends Phaser.Scene {
    protected envs: EnvironmentDto;
    protected config: GameStateConfigDto;
    private groups: GroupDto[];
    private scenes: SceneDto[];
    private prefabs: PrefabDto[];

    constructor(key: string) {
        super({ key });
    }

    init(options) {
        this.envs = options.envs;
        this.config = YAML.load(options.configFile);
    }

    preload() {
        forEach(this.config.assets, (asset: AssetDto, name: string) => {
            if (asset.type === AssetDtoType.IMAGE) {
                this.load.image(name, asset.src);
            }

            if (asset.type === AssetDtoType.AUDIO) {
                this.load.audio(name, asset.src);
            }

            if (asset.type === AssetDtoType.SCENE_PLUGIN) {
                this.load.scenePlugin({
                    key: name,
                    url: asset.url,
                    sceneKey: asset.sceneKey
                });
            }

            if (asset.type === AssetDtoType.PLUGIN) {
                if (!this.plugins.plugins.find(plugin => plugin.key === name)) {
                    this.load.plugin(name, asset.url, true);
                }
            }
        });
    }

    create(data) {
        console.log("da", this);


        // groups
        this.groups = map(this.config.groups, (name, index) => {
            const groupToAdd = this.add.group();

            groupToAdd.setDepth(index + 1);
            groupToAdd.runChildUpdate = true;

            return {
                name,
                depth: index,
                group: groupToAdd
            };
        });

        // prefabs
        this.prefabs = map(this.config.prefabs, (prefab, name) => {
            return {
                name,
                prefab: new (Store[prefab.type])(name, this, prefab.options, this.envs)
            }
        });

        // scenes
        forEach(this.config.scenes, (name, index) => {
            this.scene.launch(name, {
                configFile: `assets/states/${name}.yml`,
                envs: this.envs
            });
        });

        this.postCreate();
    }

    shutdown() {
    }

    private postCreate() {
        map(this.prefabs, (prefab: PrefabDto) => {
            if (prefab.prefab.create) {
                prefab.prefab.create();
            }
        });
    }

    getGroup(name: string): GroupDto {
        return this.groups.find(group => group.name === name);
    }

    getScene(name: string): BaseScene {
        return this.scene.get(name) as BaseScene;
    }

    getPrefab(name: string): any {
        return this.prefabs?.find(prefab => prefab.name === name)?.prefab;
    }
}