import { BrowserContext, Page } from "@playwright/test";
import MatrixApi from "./matrixApi";

const DEFAULT_PASSPHRASE = "defaultPassphrase";

class ChatUtils {
  public async openChat(page: Page) {
    await page.click("button.chat-btn");
  }

  public async openCreateRoomDialog(page: Page) {
    await page.getByTestId("openCreateRoomModalButton").click();
  }

  public getRandomName() {
    return `RoomTest_${Math.floor(Math.random() * 10000)}`;
  }

  public async resetMatrixDatabase() {
    await MatrixApi.resetMatrixUsers();
  }

  public async initEndToEndEncryption(page: Page, context: BrowserContext) {
    const oidcPagePromise = context.waitForEvent("page");
    await page.getByText("Continue with SSO").click();
    const oidcPage = await oidcPagePromise;
    await oidcPage.getByText("Continue with OIDC Server Mock").click();

    await page.getByText("Finish").click();
    await page.getByTestId("passphraseInput").fill(DEFAULT_PASSPHRASE);
    await page.getByText("Generate").click();
    await page.getByTestId("downloadRecoveryKeyButton").click();
    await page.getByText("Continue").click();
  }

  public async restoreEncryption(page: Page) {
    await page.getByTestId("passphraseInput").fill(DEFAULT_PASSPHRASE);
    await page.getByText("Confirm").click();
  }

  public async restoreEncryptionFromButton(page: Page) {
    await page.getByTestId("restoreEncryptionButton").click();
    await this.restoreEncryption(page);
  }

  public async closeChat(page: Page) {
    await page.getByTestId("closeChatButton").click();
  }
}

export default new ChatUtils();
