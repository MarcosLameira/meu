import {expect, test} from '@playwright/test';
import {login} from './utils/roles';
import Map from "./utils/map";
// import { resetWamMaps } from './utils/map-editor/uploader';
// import Menu from "./utils/menu";
// import MapEditor from "./utils/mapeditor";
// import AreaEditor from "./utils/map-editor/areaEditor";
import {publicTestMapUrl} from "./utils/urls";

test.describe('Meeting actions test', () => {

    test.beforeEach(
        "Ignore tests on mobilechromium because map editor not available for mobile devices",
        ({browserName}, {project}) => {
            //Map Editor not available on mobile
            if (project.name === "mobilechromium") {
                //eslint-disable-next-line playwright/no-skipped-test
                test.skip();
                return;
            }

            //WebKit has issue with camera
            if (browserName === "webkit") {
                //eslint-disable-next-line playwright/no-skipped-test
                test.skip();
                return;
            }
        }
    );

    test('Meeting action to mute microphone & video', async ({page, browser}, {project}) => {
        // Go to the empty map
        await page.goto(publicTestMapUrl("tests/E2E/empty.json", "meeting"));
        // Login user "Alice"
        await login(page, 'Alice', 2, 'en-US', project.name === "mobilechromium");

        // Move user
    await Map.walkTo(page, 'ArrowRight', 5000);

        const newBrowser = await browser.browserType().launch();
        const userBob = await newBrowser.newPage();
        // Go to the empty map
        await userBob.goto(publicTestMapUrl("tests/E2E/empty.json", "meeting"));
        // Login user "Bob"
        await login(userBob, 'Bob', 5, 'en-US', project.name === "mobilechromium");
        // Move user
    await Map.walkTo(userBob, 'ArrowRight', 5000);

        // The user in the bubble meeting should be visible
    await expect(page.locator('#container-media')).toBeVisible({timeout: 30_000});
        // The user in the bubble meeting should have action button
    await expect(page.locator('#cameras-container #unique-mycam')).toBeVisible({timeout: 30_000});

        // Click on the action button of "Alice"
    await page.click('#cameras-container #camera-box #video-media-box #user-menu-btn');

        // Click on the mute button
    await page.click('#cameras-container #camera-box #video-media-box #user-menu #mute-audio-user');

        // Check if "Bob" user receive the request to be metued
    await expect(userBob.locator('.interact-menu')).toBeVisible({timeout: 30_000});
        // Click on the accept button
        await userBob.click('.interact-menu .accept-request');

        // Check if the user has been muted
    await expect(page.locator('.cameras-container .other-cameras .video-container .muted-video')).toBeVisible({timeout: 20_000});
        // Click on the mute video button
    await page.click('#cameras-container #camera-box #video-media-box .action-button#mute-video-user');

        // Check if "Bob" user receive the request to be muted
        await expect(userBob.locator('.interact-menu')).toBeVisible({timeout: 30_000});
        // Click on the accept button
        await userBob.click('.interact-menu .accept-request');

        // Check if the user has been muted
    await page.getByTestId('test-class-video');
    await expect(page.locator('#cameras-container #camera-box #video-media-box')).toBeVisible({timeout: 30_000});

    page.close();
    userBob.close();
  });

  test('Jitsi meeting action to mute microphone & video', async ({ page, browser, request }, { project }) => {
    // Skip test for mobile device
    if(project.name === "mobilechromium") {
      //eslint-disable-next-line playwright/no-skipped-test
      test.skip();
      return;
    }

    if(browser.browserType() === webkit) {
      //eslint-disable-next-line playwright/no-skipped-test
      test.skip();
      return;
    }

    await resetWamMaps(request);

    await page.goto(Map.url("empty"));

    // await page.goto(publicTestMapUrl("tests/E2E/empty.json", "meeting"));

    //await page.evaluate(() => { localStorage.setItem('debug', '*'); });
    //await page.reload();
    await login(page, "Alice", 3);

    // For the moment skip the map editor part because it's broken so we can't create the speaker zone

    // Open the map editor
    await menu.openMapEditor(page);
    // Create a new area
    await MapEditor.openAreaEditor(page);
    // Draw the area
    await AreaEditor.drawArea(page, {x: 0*32*1.5, y: 5}, {x: 9*32*1.5, y: 4*32*1.5});
    // Add a property Speaker zone to create new Jitsi meeting zone
    await AreaEditor.addProperty(page, 'Speaker zone');
    // Set the speaker zone property
    await AreaEditor.setSpeakerMegaphoneProperty(page, `${browser.browserType().name()}SpeakerZone`);
    // Close the map editor
    await Menu.closeMapEditor(page);

    // Move user "Alice" to the new area
    await Map.walkTo(page, 'ArrowRight', 2000);

    // Add a second user "Bob"
    const newBrowser = await browser.browserType().launch();
    const userBob = await newBrowser.newPage();
    await userBob.goto(Map.url("empty"));
    // Login user "Bob"
    await login(userBob, "Bob", 3);
    // Move user "Bob" to the new area
    // FIME: the teleportToPosition does not work ??
    await Map.walkTo(userBob, 'ArrowUp', 2000);

    // The user in the bubble meeting should be visible
    await expect(page.locator('#cameras-container #camera-box .jitsi-video')).toBeVisible({timeout: 10_000});
    // The user in the bubble meeting should have action button
    await expect(page.locator('#cameras-container #camera-box .jitsi-video .action-button')).toBeVisible({timeout: 10_000});

    // Click on the action button of "Alice"
    await page.click('#cameras-container #camera-box .jitsi-video .action-button#more-action');
    // Click on the mute button
    await page.click('#cameras-container #camera-box .jitsi-video .action-button#mute-audio-user');

    // Check if "Bob" user receive the request to be metued
    await expect(userBob.locator('.interact-menu')).toBeVisible({timeout: 10_000});
    // Click on the accept button
    await userBob.click('.interact-menu .accept-request');

    // Check if the user has been muted
    await expect(page.locator('#cameras-container #camera-box .jitsi-video .voice-meter-cam-off')).toBeVisible({timeout: 10_000});
    // Click on the mute video button
    await page.click('#cameras-container #camera-box .jitsi-video .action-button#mute-video-user');

    // Check if "Bob" user receive the request to be metued
    await expect(userBob.locator('.interact-menu')).toBeVisible({timeout: 10_000});
    // Click on the accept button
    await userBob.click('.interact-menu .accept-request');

    // Check if the user has been muted
    await expect(page.locator('#cameras-container #camera-box .jitsi-video video')).toBeHidden({timeout: 10_000});

    });
});
