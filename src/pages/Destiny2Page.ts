import { BasePage } from "./BasePage";
import { type Page } from "@playwright/test";

export class Destiny2Page extends BasePage {
  constructor(page: Page) {
    super(page);
  }
  async navigateFromHome() {}
}
