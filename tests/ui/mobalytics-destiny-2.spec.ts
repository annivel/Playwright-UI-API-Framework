import { test, expect } from "../../src/fixtures/test.fixtures";
import { Tags } from "../../src/data/tags";
import { TestData } from "../../src/data/test-data";
import config from "../../config/test.config";

test.describe("Destiny Navigation Flow", { tag: [Tags.ui, Tags.smoke, Tags.destiny2] }, () => {
  test("should navigate to destiny 2 page", { tag: Tags.smoke }, async ({ destiny2Page }) => {
    await test.step("Navigate directly to destiny 2 page", async () => {
      await destiny2Page.goto(`${config.baseURL}${TestData.urls.destiny2}`);
      await destiny2Page.waitForPageLoad();
    });

    await test.step("Verify Destiny2 page title is successfully loaded", async () => {
      await expect(destiny2Page.page).toHaveTitle(TestData.ui.destiny2.pageTitle);
    });
  });
});