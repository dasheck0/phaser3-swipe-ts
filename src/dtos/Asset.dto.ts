export enum AssetDtoType {
    IMAGE = 'image',
    PLUGIN = 'plugin',
    SCENE_PLUGIN = 'scenePlugin',
    AUDIO = 'audio',
    SPRITE_SHEET = 'spritesheet'
};

export interface AssetDto {
    type: AssetDtoType;

    // works for most types (i.e. image, audio)
    src?: string;

    // for plugins and scene plugins
    url?: string;
    sceneKey?: string;

    // when type is spritesheet
    frameWidth?: number;
    frameHeight?: number;
    frames?: number;
}