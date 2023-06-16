import CancelablePromise from "cancelable-promise";
import type { SuperLoaderPlugin } from "../Services/SuperLoaderPlugin";
import { PlayerTexturesKey } from "./PlayerTextures";
import type { ResourceDescriptionInterface, PlayerTextures } from "./PlayerTextures";
import Texture = Phaser.Textures.Texture;
import LoaderPlugin = Phaser.Loader.LoaderPlugin;

export interface FrameConfig {
    frameWidth: number;
    frameHeight: number;
}

export const loadAllLayers = (
    load: LoaderPlugin,
    playerTextures: PlayerTextures
): ResourceDescriptionInterface[][] => {
    const returnArray: ResourceDescriptionInterface[][] = [];
    playerTextures.getLayers().forEach((layer) => {
        const layerArray: ResourceDescriptionInterface[] = [];
        Object.values(layer).forEach((textureDescriptor) => {
            layerArray.push(textureDescriptor);
            load.spritesheet(textureDescriptor.id, textureDescriptor.img, { frameWidth: 32, frameHeight: 32 });
        });
        returnArray.push(layerArray);
    });
    return returnArray;
};
export const loadAllDefaultModels = (
    load: LoaderPlugin,
    playerTextures: PlayerTextures
): ResourceDescriptionInterface[] => {
    const returnArray = Object.values(playerTextures.getTexturesResources(PlayerTexturesKey.Woka));
    returnArray.forEach((playerResource: ResourceDescriptionInterface) => {
        load.spritesheet(playerResource.id, playerResource.img, { frameWidth: 32, frameHeight: 32 });
    });
    return returnArray;
};

export const loadWokaTexture = (
    superLoaderPlugin: SuperLoaderPlugin,
    texture: ResourceDescriptionInterface
): CancelablePromise<Texture> => {
    return superLoaderPlugin.spritesheet(texture.id, texture.img, {
        frameWidth: 32,
        frameHeight: 32,
    });
};

export const lazyLoadPlayerCharacterTextures = (
    superLoaderPlugin: SuperLoaderPlugin,
    textures: ResourceDescriptionInterface[]
): CancelablePromise<string[]> => {
    const promisesList: CancelablePromise<Texture>[] = [];
    for (const texture of textures) {
        promisesList.push(
            superLoaderPlugin.spritesheet(texture.id, texture.img, {
                frameWidth: 32,
                frameHeight: 32,
            })
        );
    }
    const returnPromise: CancelablePromise<Texture[]> = CancelablePromise.all(promisesList);

    return returnPromise.then(() =>
        textures.map((key) => {
            return key.id;
        })
    );
};
