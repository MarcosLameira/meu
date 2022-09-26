import { SelectCharacterSceneName } from "./SelectCharacterScene";
import { ResizableScene } from "./ResizableScene";
import { loginSceneVisibleIframeStore, loginSceneVisibleStore } from "../../Stores/LoginSceneStore";
import { localUserStore } from "../../Connexion/LocalUserStore";
import { connectionManager } from "../../Connexion/ConnectionManager";
import { gameManager } from "../Game/GameManager";
import { analyticsClient } from "../../Administration/AnalyticsClient";
import { isUserNameValid } from "../../Connexion/LocalUser";

export const LoginSceneName = "LoginScene";

export class LoginScene extends ResizableScene {
    private name = "";

    constructor() {
        super({
            key: LoginSceneName,
        });
        this.name = gameManager.getPlayerName() || "";
    }

    preload() {}

    create() {
        loginSceneVisibleIframeStore.set(false);
        //If authentication is mandatory, push authentication iframe
        if (
            localUserStore.getAuthToken() == undefined &&
            gameManager.currentStartedRoom &&
            gameManager.currentStartedRoom.authenticationMandatory
        ) {
            const redirect = connectionManager.loadOpenIDScreen();
            if (redirect !== null) {
                window.location.assign(redirect.toString());
            }
            loginSceneVisibleIframeStore.set(true);
        }
        loginSceneVisibleStore.set(true);
    }

    public login(name: string): boolean {
        analyticsClient.validationName();

        if (isUserNameValid(name)) {
            name = name.trim();
            gameManager.setPlayerName(name);
        } else {
            return false;
        }

        this.scene.stop(LoginSceneName);
        gameManager.tryResumingGame(SelectCharacterSceneName);
        this.scene.remove(LoginSceneName);
        loginSceneVisibleStore.set(false);
        return true;
    }

    update(time: number, delta: number): void {}

    public onResize(): void {}
}
