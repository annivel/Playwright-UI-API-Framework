# Deep Analysis: Playwright UI-API Framework

## PHASE 1: Framework Overview & Architecture Map

### 1. Project Structure Diagram

```
Playwright-UI-API-Framework/
├── .github/
│   ├── agents/                          # [AI Prompts] GitHub Copilot agent prompts
│   │   ├── playwright-test-generator.agent.md
│   │   ├── playwright-test-healer.agent.md
│   │   └── playwright-test-planner.agent.md
│   └── workflows/                       # [CI/CD Pipeline]
│       ├── playwright.yml               #   Main 3-stage CI pipeline
│       └── copilot-setup-steps.yml      #   Copilot MCP setup
├── .vscode/                             # [IDE Config]
│   ├── mcp.json                         #   MCP server configuration
│   └── settings.json                    #   VS Code workspace settings
├── config/
│   └── test.config.ts                   # [Config] Central typed config loader
├── docs/
│   └── onboarding.md                    # [Documentation] Onboarding guide
├── scripts/
│   └── test-and-report.sh               # [Utility] Shell script: run tests + Allure
├── src/
│   ├── components/                      # [Component Objects] Reusable UI section wrappers
│   │   ├── BaseComponent.ts             #   Abstract base for all components
│   │   ├── NavigationComponent.ts       #   Header nav bar
│   │   ├── HeroComponent.ts             #   Hero/header section
│   │   ├── GameCardsComponent.ts        #   Game logo cards row
│   │   ├── FeaturesComponent.ts         #   "How Mobalytics helps" section
│   │   ├── ImprovementLoopComponent.ts  #   4-stage improvement loop
│   │   ├── StatisticsComponent.ts       #   Stats section (27%, LCS)
│   │   ├── CommunityComponent.ts        #   Community stats section
│   │   ├── CookieBannerComponent.ts     #   Cookie consent banner
│   │   ├── FooterComponent.ts           #   Footer links and sections
│   │   └── TemplateComponent.ts         #   Boilerplate for new components
│   ├── data/                            # [Test Data] Centralized data & queries
│   │   ├── test-data.ts                 #   URLs, UI strings, credentials
│   │   ├── graphql-queries.ts           #   GraphQL mutations/queries + types
│   │   └── tags.ts                      #   Test tag constants
│   ├── errors/                          # [Error Handling] Custom error classes
│   │   └── test-errors.ts               #   PageLoadError, ElementNotFoundError, etc.
│   ├── fixtures/                        # [Fixtures] Playwright fixture definitions
│   │   └── test.fixtures.ts             #   Page objects, components, auth, screenshots
│   ├── helpers/                         # [Helpers] Auth and utility functions
│   │   └── auth.helper.ts              #   API login via GraphQL
│   ├── pages/                           # [Page Objects] Full page representations
│   │   ├── BasePage.ts                  #   Abstract base page with shared methods
│   │   ├── HomePage.ts                  #   Home page (composes 8 components)
│   │   ├── LolPage.ts                   #   League of Legends page
│   │   ├── POE2Page.ts                  #   Path of Exile 2 page
│   │   └── TemplatePage.ts              #   Boilerplate for new pages
│   └── utils/                           # [Utilities] Logging, waits, strings
│       ├── logger.ts                    #   Structured colored logger
│       ├── element-wait.utils.ts        #   Shared wait-for-element logic
│       └── string.utils.ts             #   randomString, formatDate, timestamp
├── tests/
│   ├── api/                             # [API Tests] GraphQL endpoint tests
│   │   ├── mobalytics-graphql-endpoint.spec.ts   # Endpoint health & edge cases
│   │   ├── mobalytics-graphql-auth.spec.ts       # Authentication tests
│   │   ├── mobalytics-graphql-account.spec.ts    # Account query tests
│   │   ├── mobalytics-graphql-signin-extended.spec.ts  # SignIn edge cases
│   │   └── template-api.spec.ts                  # Boilerplate (excluded from runs)
│   └── ui/                              # [UI Tests] Browser-driven tests
│       ├── mobalytics-home-smoke.spec.ts         # Smoke (critical paths)
│       ├── mobalytics-home.spec.ts               # Full regression home page
│       ├── mobalytics-home-navigation.spec.ts    # Navigation-specific tests
│       ├── mobalytics-home-extended.spec.ts      # Extended regression (footer, legal)
│       ├── mobalytics-cookie.spec.ts             # Cookie consent banner
│       ├── mobalytics-lol.spec.ts                # League of Legends page
│       ├── mobalytics-poe2-guides.spec.ts        # Path of Exile 2 + guides
│       ├── mobalytics-responsive.spec.ts         # Mobile viewport tests
│       └── template-ui.spec.ts                   # Boilerplate (excluded from runs)
├── playwright.config.ts                 # [Config] Main Playwright configuration
├── tsconfig.json                        # [Config] TypeScript compiler settings
├── eslint.config.js                     # [Config] ESLint rules
├── .prettierrc.json                     # [Config] Prettier formatting
├── .env.example                         # [Config] Environment variables template
└── package.json                         # [Config] Dependencies & npm scripts
```

### 2. Tech Stack Inventory

| Dependency | Version | Purpose | Necessary? |
|---|---|---|---|
| `@playwright/test` | ^1.58.2 | Core test runner & browser automation | Essential |
| `allure-playwright` | ^3.4.5 | Allure test reporter integration | Essential for reporting |
| `allure-commandline` | ^2.36.0 | CLI to generate/serve Allure HTML reports | Essential for reporting |
| `dotenv` | ^17.2.4 | Loads `.env` file into `process.env` | Essential for config |
| `eslint` | ^10.0.1 | Static code analysis / linting | Essential for quality |
| `eslint-config-prettier` | ^10.1.8 | Disables ESLint rules that conflict with Prettier | Essential (avoids rule clashes) |
| `eslint-plugin-playwright` | ^2.7.1 | Playwright-specific lint rules (no-wait-for-timeout, etc.) | Essential |
| `typescript-eslint` | ^8.56.1 | TypeScript parser + rules for ESLint | Essential |
| `prettier` | ^3.8.1 | Opinionated code formatter | Essential for consistency |
| `ts-node` | ^10.9.2 | Runs TypeScript directly (used by config loading) | Essential |
| `tsconfig-paths` | ^4.2.0 | Resolves path aliases (`@pages/*`, etc.) at runtime | Essential for aliases |
| `@types/node` | ^25.2.3 | Node.js type definitions | Essential for TS |
| `@executeautomation/playwright-mcp-server` | ^1.0.12 | MCP server for AI-assisted test generation | Nice-to-have / experimental |

**Flags:**
- All dependencies are current versions (no outdated packages detected)
- `@executeautomation/playwright-mcp-server` is the only "experimental" dependency — it enables AI tooling integration but is not required for test execution

### 3. Configuration Breakdown

#### `playwright.config.ts` (L1-145)

| Option | Value | What It Controls | Alternatives |
|---|---|---|---|
| `testDir` (L9) | `"./tests"` | Root directory for test discovery | Any path; could split `api/` and `ui/` into separate configs |
| `testIgnore` (L13) | `"**/template-*.spec.ts"` | Excludes template boilerplate files | Could use `.skip` in files instead, but this is cleaner |
| `fullyParallel` (L16) | `true` | Every test file and test within runs in parallel | `false` for sequential; useful for shared-state scenarios |
| `forbidOnly` (L19) | `!!process.env.CI` | Fails CI build if `test.only` is left in code | `false` to allow `.only` in CI (bad idea) |
| `retries` (L22) | `config.retryCount` (1 local, 2 CI) | How many times to retry a failed test | `0` for strict; `3` for flaky environments |
| `workers` (L25) | `config.workers` (auto-scaled to 50% CPU) | Number of parallel workers | Fixed number; `"50%"` string also works |
| `timeout` (L33) | `30000` (30s) | Max time per test before it's killed | 60s for slow environments; 10s for unit-like API tests |
| `reporter` (L36-63) | CI: junit+json+allure+list; Local: html+allure+list | Output format for test results | `"dot"` for minimal; `["blob"]` for merge-later |
| `baseURL` (L68) | `config.baseURL` | Prepended to relative `page.goto("/path")` calls | Any URL |
| `trace` (L71) | `"on-first-retry"` or `"off"` | When to capture trace files | `"on"` always; `"retain-on-failure"` to keep only failures |
| `screenshot` (L74) | `"only-on-failure"` or `"off"` | When to take screenshots | `"on"` always |
| `video` (L77) | `"retain-on-failure"` or `"off"` | When to record video | `"on"` always |
| `actionTimeout` (L80) | `15000` (15s) | Timeout for individual actions (click, fill) | 5s-30s typical range |
| `navigationTimeout` (L81) | `30000` (30s) | Timeout for page navigations | 10s-60s typical range |
| `viewport` (L84) | `1920x1080` | Default browser viewport size | `1366x768`, `1280x720` for common sizes |
| `ignoreHTTPSErrors` (L87) | `true` | Ignores SSL certificate errors | `false` to enforce SSL validity |
| `projects[0]` (L108-113) | `chromium` | Primary browser project | Could add channel: `"chrome"` for branded Chrome |
| `projects[1-2]` (L116-133) | `firefox`, `webkit` (conditional) | Cross-browser, activated by `CROSS_BROWSER=true` | Always-on, or separate config files |
| `projects[3]` (L136-143) | `mobile-chrome` (Pixel 7) | Mobile viewport for `@responsive` tests | Custom viewports; iPhone 14, iPad |

#### `tsconfig.json` (L1-44)

| Option | Value | Impact |
|---|---|---|
| `target` (L3) | `ES2022` | Output JS uses ES2022 features (top-level await, etc.) |
| `module` (L4) | `commonjs` | Required for `ts-node` and Playwright's module loading |
| `strict` (L9) | `true` | Enables all strict type checks (`noImplicitAny`, `strictNullChecks`, etc.) |
| `skipLibCheck` (L10) | `true` | Skips type-checking `.d.ts` files — faster compilation |
| `forceConsistentCasingInFileNames` (L11) | `true` | Prevents case-sensitivity bugs on macOS/Windows |
| `paths` (L21-26) | `@pages/*`, `@fixtures/*`, `@utils/*`, `@config/*` | Path aliases for cleaner imports |
| `sourceMap` (L15) | `true` | Enables source maps for debugging (step through `.ts` files) |
| `declaration` (L13) | `true` | Generates `.d.ts` files — not needed for a test-only project |

#### `.github/workflows/playwright.yml` (L1-249)

See **Phase 3** below for the full pipeline analysis.

#### `eslint.config.js` (L1-90)

Key rules and their purpose:

| Rule | Setting | Why |
|---|---|---|
| `no-explicit-any` (L37) | `warn` | Gradual adoption — allows existing `any` while flagging new uses |
| `no-floating-promises` (L50) | `error` | **Critical** — catches `await` omissions that cause silent failures in async tests |
| `consistent-type-imports` (L53) | `error` | Enforces `import type { X }` to reduce runtime bundle |
| `no-wait-for-timeout` (L81) | `warn` | Catches `page.waitForTimeout()` anti-pattern |
| `prefer-web-first-assertions` (L82) | `warn` | Encourages `expect(locator).toBeVisible()` over manual checks |
| `require-top-level-describe` (L84) | `error` | Forces organized test structure |
| `expect-expect` (L86) | `off` | Disabled because page object methods contain assertions internally |

#### `.prettierrc.json` (L1-13)

Standard Prettier config: double quotes, semicolons, 100-char line width, 2-space tabs, trailing commas. Consistent and well-chosen for a TypeScript project.

### 4. Architecture Pattern Identification

#### Pattern 1: Page Object Model (POM)
**Where:** `src/pages/BasePage.ts`, `HomePage.ts`, `LolPage.ts`, `POE2Page.ts`
**Rating: 9/10**

Excellent implementation. `BasePage` provides shared navigation, click, fill, wait, and assertion methods. Concrete pages inherit from it and compose components. Page objects return raw data (e.g., `Buffer` for screenshots) rather than coupling to test infrastructure — a clean separation.

**One deduction:** `HomePage.verifyPageTitle()` (L72-77) throws a plain `Error` instead of using `expect()`, which creates an inconsistency with the rest of the assertion methods.

#### Pattern 2: Component Object Pattern (Composition over monolithic POM)
**Where:** `src/components/BaseComponent.ts`, all component files
**Rating: 10/10**

This is a **best-practice pattern** that many frameworks miss. Instead of a 500-line `HomePage` class, each UI section is a standalone component (`NavigationComponent`, `HeroComponent`, `FooterComponent`, etc.). Components are:
- Composed inside page objects: `homePage.navigation.navLOL`
- Directly injectable as fixtures: `test(async ({ navigation }) => { ... })`
- Independently testable and maintainable

#### Pattern 3: Fixtures Pattern (Playwright Custom Fixtures)
**Where:** `src/fixtures/test.fixtures.ts` (L33-131)
**Rating: 9/10**

Well-structured custom fixtures for:
- Page objects (`homePage`, `poe2Page`, `lolPage`)
- Components (`navigation`, `hero`, `gameCards`, `footer`)
- Authenticated sessions (`authenticatedPage`, `authenticatedPoe2Page`)
- Auto-fixture (`screenshotOnFailure`) for failure capture

**One deduction:** The `authenticatedPage` and `authenticatedPoe2Page` fixtures duplicate the login logic (L93-108 vs L115-128). A shared `authenticatedContext` fixture could be extracted.

#### Pattern 4: Centralized Test Data Registry
**Where:** `src/data/test-data.ts`, `src/data/tags.ts`, `src/data/graphql-queries.ts`
**Rating: 9/10**

Single source of truth for all test data: URLs, URL patterns (regex), UI strings, credentials, GraphQL operations. Uses `requireEnv()` with descriptive errors for mandatory env vars. The `as const` assertion on arrays enables TypeScript literal type narrowing.

**One deduction:** Could benefit from a factory/builder pattern for generating dynamic test data (parameterized tests).

#### Pattern 5: Custom Error Hierarchy
**Where:** `src/errors/test-errors.ts` (L1-76)
**Rating: 8/10**

Five domain-specific error classes (`PageLoadError`, `ElementNotFoundError`, `NavigationError`, `AuthenticationError`, `ApiError`) with descriptive messages. Used consistently throughout helpers and page objects. The `ApiError` class exposes `statusCode` and `endpoint` as public fields — good for debugging.

**Deduction:** None of the custom errors set `Error.captureStackTrace` for cleaner stack traces, and the `name` property is set manually rather than using `this.name = this.constructor.name`.

#### Pattern 6: API-First Authentication
**Where:** `src/helpers/auth.helper.ts` (L20-64)
**Rating: 9/10**

Tests use the GraphQL `SignIn` mutation for authentication instead of slow UI login flows. Cookies are automatically propagated through the browser context. This is a **Playwright best practice** — it makes tests faster and more reliable.

#### Patterns NOT Found:
- **Screenplay pattern** — not used (appropriate; POM + components is sufficient)
- **Builder pattern** — not used for test data (could improve parameterized tests)
- **Factory pattern** — not used (no dynamic data generation)

---

## PHASE 2: Code Quality Analysis

### TypeScript Analysis

**Strict mode:** Enabled (`tsconfig.json:L9`). This is correct and catches many bugs at compile time.

**Type usage:**
- Interfaces defined for: `TestConfig` (`config/test.config.ts:L6-35`), `AccountData` (`graphql-queries.ts:L17-24`), `AuthResponse` (`auth.helper.ts:L11-15`), `MyFixtures` (`test.fixtures.ts:L15-31`), `Tag` type alias (`tags.ts:L81`)
- `any` usage: Minimal. Only in `eslint.config.js:L5` (justified — JS config file), and a single `(e: { message: string })` cast in `auth.helper.ts:L54` (acceptable)
- Union types used well: `"chromium" | "firefox" | "webkit"` (`test.config.ts:L9`), `string | RegExp` (`BasePage.ts:L161`)
- `as const` assertions on `TestData` and `Tags` objects enable literal type inference

**Type safety issues:**
- `BasePage.isVisible()` (L68-75) uses a try/catch with a hardcoded 5000ms timeout that differs from the configurable `config.timeouts.default` — potential inconsistency
- `config.browser` cast at `test.config.ts:L40` (`process.env.BROWSER as "chromium" | ..."`) is an unsafe cast — if `BROWSER=opera` it won't error at compile time

### Playwright Best Practices Audit

| Check | Status | Details |
|---|---|---|
| **Locator strategy** | **Excellent** | Uses `getByRole()` for nav links (`NavigationComponent.ts:L34-53`), `getByRole("link")` with `exact: true`, stable IDs for cookie banner (`#cookie-law-info-bar`). Very few CSS selectors, and those used are stable (`[href*="twitter"]`). |
| **Auto-waiting** | **Excellent** | No `waitForTimeout()` or `sleep()` calls found anywhere. The `waitForElement()` utility (`element-wait.utils.ts:L15-25`) uses `locator.waitFor()` which works with Playwright's auto-wait. |
| **Web-first assertions** | **Excellent** | Consistently uses `expect(locator).toBeVisible()` (`BaseComponent.ts:L39-41`), `expect(page).toHaveURL()`, `expect(locator).toHaveAttribute()`. No instances of the anti-pattern `expect(await locator.isVisible()).toBe(true)`. |
| **Test isolation** | **Excellent** | Each test gets a fresh `page` via fixtures. `beforeEach` navigates cleanly. No shared mutable state between tests. |
| **Test hooks** | **Good** | `beforeEach` used for navigation in all UI suites. No `afterEach`/`afterAll` needed since fixtures handle cleanup. |
| **Fixtures** | **Excellent** | Custom fixtures for page objects, components, auth, and auto-screenshot. Properly composed and typed. |
| **API for setup** | **Excellent** | `loginViaAPI()` uses GraphQL mutation for auth instead of UI flow (`auth.helper.ts:L20-64`). |
| **Assertions** | **Excellent** | Every test has meaningful assertions. `test.step()` used consistently for structured reporting. |
| **Parallelism** | **Excellent** | `fullyParallel: true` in config. Workers auto-scale to 50% CPU. CI uses 6-8 workers with 3 shards. |
| **Retries & flakiness** | **Good** | 1 retry local, 2 in CI. `networkidle` wait has a catch-and-continue (`BasePage.ts:L96-98`) — prevents flaky timeouts. |
| **Reporting** | **Excellent** | Allure + HTML + JUnit + JSON reporters. Screenshots auto-attached via `screenshotOnFailure` fixture. Allure deployed to GitHub Pages. |
| **Authentication** | **Good** | API-based login. Cookies propagated via context. `storageState` commented out but ready (`playwright.config.ts:L94`). |

### Anti-Patterns Found

#### Anti-Pattern 1: Redundant `waitForElement` before Playwright actions
**File:** `src/pages/BasePage.ts:L42-46`
```typescript
async click(locator: Locator): Promise<void> {
    await this.waitForElement(locator);  // <-- redundant
    await locator.click();               // click() already auto-waits
}
```
**Why it's problematic:** Playwright's `locator.click()` already waits for the element to be visible and actionable. The explicit `waitForElement` doubles the wait time on slow elements and masks real timing issues.

**Fix:**
```typescript
async click(locator: Locator): Promise<void> {
    this.log.debug("Clicking element", { locator: locator.toString() });
    await locator.click();
}
```
Same applies to `fill()` at L50-55.

#### Anti-Pattern 2: Manual text assertion instead of `expect()`
**File:** `src/pages/HomePage.ts:L72-77`
```typescript
async verifyPageTitle(expectedTitle: string): Promise<void> {
    const title = await this.getTitle();
    if (!title.includes(expectedTitle)) {
      throw new Error(`Expected title to contain "${expectedTitle}", but got "${title}"`);
    }
}
```
**Why it's problematic:** This bypasses Playwright's auto-retry mechanism. `expect(page).toHaveTitle()` retries automatically until the assertion passes or times out.

**Fix:**
```typescript
async verifyPageTitle(expectedTitle: string): Promise<void> {
    await expect(this.page).toHaveTitle(new RegExp(expectedTitle, "i"));
}
```

#### Anti-Pattern 3: Non-retrying `assertNavigatesTo`
**File:** `src/pages/BasePage.ts:L161-173`
```typescript
async assertNavigatesTo(locator: Locator, expectedPattern: string | RegExp): Promise<void> {
    await this.click(locator);
    await this.page.waitForLoadState("domcontentloaded");
    const actual = this.page.url();           // snapshot, no retry
    const matches = /* manual check */;
    if (!matches) throw new NavigationError(actual, expectedPattern);
}
```
**Why it's problematic:** Takes a single URL snapshot without retrying. If navigation completes but the URL hasn't updated yet, this will fail intermittently.

**Fix:**
```typescript
async assertNavigatesTo(locator: Locator, expectedPattern: string | RegExp): Promise<void> {
    await this.click(locator);
    await expect(this.page).toHaveURL(expectedPattern);
}
```

#### Anti-Pattern 4: `isVisible()` snapshot check in sanity test
**File:** `tests/ui/mobalytics-home-smoke.spec.ts:L89-92`
```typescript
const gameCardsVisible =
    (await homePage.gameCards.lolGameCard.isVisible()) ||
    (await homePage.gameCards.tftGameCard.isVisible());
expect(gameCardsVisible).toBeTruthy();
```
**Why it's problematic:** `locator.isVisible()` is a snapshot — it doesn't auto-retry. If the element is loading, this returns `false` immediately.

**Fix:**
```typescript
await expect(
    homePage.gameCards.lolGameCard.or(homePage.gameCards.tftGameCard)
).toBeVisible();
```

#### Anti-Pattern 5: Hardcoded timeout in `isVisible()`
**File:** `src/pages/BasePage.ts:L68-75`
```typescript
async isVisible(locator: Locator): Promise<boolean> {
    try {
        await locator.waitFor({ state: "visible", timeout: 5000 }); // hardcoded!
        return true;
    } catch {
        return false;
    }
}
```
**Why it's problematic:** The 5000ms timeout is hardcoded, ignoring `config.timeouts.default`. Also, swallowing errors makes debugging harder.

**Fix:** Use `config.timeouts.default` or remove the method entirely (Playwright's `locator.isVisible()` exists).

#### Anti-Pattern 6: `networkidle` wait strategy
**File:** `src/pages/BasePage.ts:L94-99`
```typescript
async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState("domcontentloaded");
    await this.page.waitForLoadState("networkidle", { timeout: 10000 }).catch(() => {
      this.log.warn("Network idle timed out — continuing anyway");
    });
}
```
**Why it's problematic:** `networkidle` is unreliable — it waits until no network requests for 500ms, which can fail on sites with analytics, websockets, or polling. The `.catch()` shows the author already knows it's flaky.

**Fix:** Remove `networkidle`. Use `domcontentloaded` or wait for a specific element that signals the page is ready.

---

## PHASE 3: CI/CD Pipeline Analysis

### 1. Pipeline Architecture

```
Trigger: push to main / workflow_dispatch
         │
         ▼
┌─────────────────────────────────┐
│  Stage 1: SMOKE & CRITICAL      │ ← Chromium only, 8 workers
│  Tests: @smoke | @critical      │ ← ~3 min
│  Purpose: Fast gate             │
└────────────┬────────────────────┘
             │ passes
     ┌───────┴───────┐
     ▼               ▼
┌────────────┐  ┌──────────────────┐
│ Stage 2:   │  │ Stage 3:          │ ← Only on main or release/*
│ REGRESSION │  │ CROSS-BROWSER     │
│ 3 shards   │  │ Firefox + WebKit  │
│ 6 workers  │  │ @smoke only       │
│ ~8 min     │  │ ~5 min/browser    │
└─────┬──────┘  └──────────────────┘
      │ completes
      ▼
┌─────────────────────────────────┐
│  Stage 4: REPORT                │
│  Merge shard results            │
│  Generate Allure report         │
│  Deploy to GitHub Pages         │
└─────────────────────────────────┘
```

### 2. Trigger Analysis
- **`push` to `main`** — runs the full pipeline (L23-24)
- **`workflow_dispatch`** — manual trigger with optional grep filter and worker count (L25-34)
- **Missing:** No `pull_request` trigger. This means PRs don't run tests automatically — developers must push to `main` to see results. **This is a significant gap.**

### 3. Caching Strategy
- **npm cache:** `actions/setup-node@v4` with `cache: "npm"` (L56-57) — caches `node_modules` based on `package-lock.json` hash. Effective.
- **Playwright browser cache:** **Not implemented.** Browsers are downloaded fresh in every job (3 smoke + 3 regression + 2 cross-browser = 8 downloads). This is the **biggest performance bottleneck**.

### 4. Browser Installation
- Smoke (L63): `npx playwright install chromium --with-deps` — installs only Chromium
- Regression (L120): Same — Chromium only
- Cross-browser (L175): `npx playwright install ${{ matrix.browser }} --with-deps` — installs only the needed browser

Good strategy (only install what's needed), but no caching.

### 5. Parallelization
- **Smoke:** 8 workers on 1 runner
- **Regression:** 3 shards x 6 workers = 18 effective parallel tests
- **Cross-browser:** 2 matrix entries x 4 workers = 8 effective parallel tests
- `fail-fast: false` on regression and cross-browser — all shards complete even if one fails. Good.

### 6. Reporting
- **Smoke:** Uploads `test-results/` (7-day retention)
- **Regression:** Uploads `test-results/` + `allure-results/` (14-day retention)
- **Allure report:** Generated from merged shard results, uploaded as artifact (30-day retention), deployed to GitHub Pages on main
- **Missing:** No PR comment with test results or link to report

### 7. Environment Management
- Secrets: `BASE_URL`, `API_BASE_URL`, `USER_EMAIL`, `USER_PASSWORD`, `USER_USERNAME` — properly stored in GitHub Secrets
- Fallback values: `BASE_URL` defaults to `https://mobalytics.gg` if secret not set (L69)
- No hardcoded secrets found

### 8. Failure Handling
- Stage 2 blocks on Stage 1 (`needs: smoke`)
- Stage 3 blocks on Stage 1 (`needs: smoke`)
- Report runs `if: always()` — generates report even when tests fail
- **Missing:** No Slack/email notifications on failure. No PR status checks configured.

### 9. Performance
- Smoke: ~3 min
- Regression: ~8 min (with sharding)
- Cross-browser: ~5 min/browser
- **Total cold start:** ~15-20 min including dependency install
- **Bottleneck:** Repeated `npm ci` + browser install in every job (no cross-job caching of browsers)

### 10. Security
- No hardcoded secrets — all in GitHub Secrets
- `permissions: contents: read` at top level (L19-20) — principle of least privilege
- Report job has `permissions: contents: write` (L211-212) — needed for GitHub Pages, scoped correctly
- `concurrency` with `cancel-in-progress: true` (L38-39) — prevents duplicate runs

### Pipeline Maturity Rating: **Intermediate / Advanced**

Strong 3-stage strategy with sharding, proper artifact management, and Allure reporting. Missing PR triggers, browser caching, and failure notifications prevent it from being production-grade.

---

## PHASE 4: Learning Roadmap

### Playwright Concepts to Learn

| # | Concept | Where in this project | What to study | Practice exercise |
|---|---|---|---|---|
| 1 | **Locator strategies** | `src/components/NavigationComponent.ts:L31-57` | `getByRole()` with `exact: true` vs CSS selectors for social links. Study why `getByRole("link", { name: "LoL" })` is more resilient than `page.locator(".nav-lol")` | Change all CSS `[href*="twitter"]` selectors to `getByRole` equivalents |
| 2 | **Auto-waiting mechanism** | `src/utils/element-wait.utils.ts:L15-25` and `src/pages/BasePage.ts:L42-46` | Compare manual `waitForElement()` vs Playwright's built-in auto-wait in `click()`. Read the [Playwright auto-waiting docs](https://playwright.dev/docs/actionability) | Remove redundant `waitForElement()` calls from `BasePage.click()` and `BasePage.fill()`, run tests, observe they still pass |
| 3 | **Custom fixtures** | `src/fixtures/test.fixtures.ts:L33-131` | Study how `base.extend<MyFixtures>()` creates typed fixtures. Note the auto-fixture pattern at L40-55 (`{ auto: true }`). Understand fixture scoping (test vs worker) | Create a new fixture `cookieBanner` that provides `CookieBannerComponent` and use it in cookie tests |
| 4 | **Page Object Model** | `src/pages/BasePage.ts:L7-174` and `src/pages/HomePage.ts:L25-96` | Study inheritance (`HomePage extends BasePage`), component composition (L27-34), and how page objects encapsulate locators + interactions | Create a new `TFTPage` by copying `LolPage.ts` pattern |
| 5 | **Component composition** | `src/components/BaseComponent.ts:L17-46` | Study how `BaseComponent` provides shared methods, and how `HomePage` composes 8 independent components | Extract a new component from an existing page object (e.g., `TestimonialsComponent`) |
| 6 | **API testing** | `tests/api/mobalytics-graphql-endpoint.spec.ts:L58-82` | Study how `request.post()` sends GraphQL queries, validates HTTP status AND body structure. Note: API tests import from `@playwright/test`, not custom fixtures (no browser needed) | Write a new API test that validates the `__schema` introspection query |
| 7 | **Test tagging & filtering** | `src/data/tags.ts:L21-79` and `tests/ui/mobalytics-home-smoke.spec.ts:L11` | Study `{ tag: [Tags.ui, Tags.smoke] }` on describe blocks and individual tests. See `playwright.config.ts:L142` for `grep: /@responsive/` on the mobile project | Add a `@performance` tag to an existing test and run only that tag with `--grep @performance` |
| 8 | **Trace viewer & debugging** | `playwright.config.ts:L71` | `trace: "on-first-retry"` captures a trace when a test is retried after failure. Learn to open traces with `npx playwright show-trace` | Run tests with `npx playwright test --trace on`, then open the trace file and step through test actions |
| 9 | **Test configuration & projects** | `playwright.config.ts:L106-144` | Study how `projects` defines browser configs, how `CROSS_BROWSER` env var conditionally includes Firefox/WebKit, and how `grep: /@responsive/` limits which tests run on mobile | Add an iPad viewport project that only runs `@responsive` tests |
| 10 | **Visual testing** | `tests/ui/mobalytics-home.spec.ts:L239-267` | Study `takeFullPageScreenshot()` → `testInfo.attach()` pattern. Note: this is manual screenshot comparison, not automated pixel-diff | Add `toHaveScreenshot()` (Playwright's built-in visual comparison) to the hero section test |
| 11 | **Authentication with storageState** | `src/fixtures/test.fixtures.ts:L93-128` and `playwright.config.ts:L94` | Study how `loginViaAPI()` authenticates via API, and the commented-out `storageState` line for persistent auth | Implement `globalSetup` that saves auth state to a file, then uncomment the `storageState` config line |
| 12 | **test.step() for reporting** | `tests/ui/mobalytics-home-smoke.spec.ts:L17-23` | Study how `test.step()` creates nested sections in Allure/HTML reports. Each step has a clear Given/When/Then name | Add `test.step()` to an existing test that doesn't use it |

### TypeScript Concepts to Learn

| # | Concept | Where in this project | What to study | Practice exercise |
|---|---|---|---|---|
| 1 | **Interfaces** | `config/test.config.ts:L6-35`, `src/data/graphql-queries.ts:L17-24` | `TestConfig` defines the shape of the config object. `AccountData` types the GraphQL response. | Add a new field to `TestConfig` and use it in `playwright.config.ts` |
| 2 | **Type aliases & union types** | `src/data/tags.ts:L81`, `config/test.config.ts:L9` | `type Tag = (typeof Tags)[keyof typeof Tags]` creates a union of all tag strings. `"chromium" \| "firefox" \| "webkit"` constrains the browser option | Create a `type GameName` union from the nav link names |
| 3 | **`as const` assertions** | `src/data/test-data.ts:L155`, `src/data/tags.ts:L79` | `as const` makes objects deeply readonly and narrows string literals. `TestData.ui.navigation.expectedLinks` is `readonly ["LoL", "TFT", ...]` not `string[]` | Remove `as const` from `Tags`, observe how `Tag` type changes from union to `string` |
| 4 | **Async/await patterns** | `src/pages/BasePage.ts:L18-28`, `src/helpers/auth.helper.ts:L20-64` | Every page method is `async`. `loginViaAPI` uses try/catch with async. Note how errors propagate correctly through async chains | Rewrite `loginViaAPI` using `.then()` chains to understand why `async/await` is cleaner |
| 5 | **Module system (imports/exports)** | `src/fixtures/test.fixtures.ts:L1-11, L131` | Named imports (`import { HomePage }`), re-exports (`export { expect }`), type-only imports (`import type { Page }`) | Create a barrel export file `src/pages/index.ts` that re-exports all page objects |
| 6 | **Generics** | `src/fixtures/test.fixtures.ts:L33` | `base.extend<MyFixtures>({...})` — the generic type parameter tells Playwright what fixtures are available | Read Playwright's `TestType.extend` generic signature in the `.d.ts` file |
| 7 | **Class inheritance** | `src/pages/BasePage.ts:L7-174`, `src/pages/HomePage.ts:L25` | `class HomePage extends BasePage` inherits all base methods. `protected readonly log` is visible to subclasses | Add a `protected` helper method to `BasePage` and use it in `HomePage` |
| 8 | **Getter properties** | `src/data/test-data.ts:L27-33` | `get validUser()` is a getter that computes on access — calls `requireEnv()` lazily. Not evaluated until a test actually needs credentials | Change `invalidUser` to a getter and add runtime validation |
| 9 | **Type guards** | `src/helpers/auth.helper.ts:L58` | `error instanceof ApiError` is a type guard — TypeScript narrows the type inside the `if` block | Add a custom type guard `isGraphQLError(body: unknown): body is { errors: Array<...> }` |
| 10 | **Utility types** | Not currently used | `Partial<TestConfig>` would allow partial config overrides; `Pick<AccountData, "uid" \| "email">` for selective field queries | Refactor `getAccountInfo` to accept `Pick<AccountData, ...>` for flexible field selection |

### CI/CD Concepts to Learn

| # | Concept | Where in this project | What to study | Practice exercise |
|---|---|---|---|---|
| 1 | **Workflow triggers** | `.github/workflows/playwright.yml:L22-34` | `push` to `main`, `workflow_dispatch` with inputs. Study how `inputs.grep` flows to the run step | Add a `pull_request` trigger that only runs smoke tests |
| 2 | **Job dependencies** | `playwright.yml:L98` (`needs: smoke`) | `regression` and `cross-browser` wait for `smoke`. If smoke fails, downstream jobs are skipped | Add a `lint` job that runs in parallel with `smoke` |
| 3 | **Matrix strategies** | `playwright.yml:L103-106` (shards), `playwright.yml:L160-161` (browsers) | `shardIndex: [1,2,3]` creates 3 parallel jobs. `browser: [firefox, webkit]` creates 2. `fail-fast: false` means all complete | Add WebKit to the matrix and observe the pipeline graph |
| 4 | **Artifact management** | `playwright.yml:L84-90, L137-145, L225-230` | `upload-artifact` saves test results; `download-artifact` merges shards. `merge-multiple: true` combines matching patterns | Download an artifact from a real run and inspect its contents |
| 5 | **Secrets & env vars** | `playwright.yml:L67-73` | `${{ secrets.BASE_URL \|\| 'fallback' }}` — uses secret if set, otherwise fallback. `CI: "true"` is a convention, not a secret | Add a new secret `SLACK_WEBHOOK` and a failure notification step |
| 6 | **Concurrency control** | `playwright.yml:L37-39` | `group: ${{ github.workflow }}-${{ github.ref }}` — cancels duplicate runs for the same branch | Change to `cancel-in-progress: false` and observe queuing behavior |
| 7 | **Conditional execution** | `playwright.yml:L154` | `if: github.ref == 'refs/heads/main'` — cross-browser only on main. `if: always()` — report runs even on failure | Add a condition that skips cross-browser on `[skip-xb]` in commit message |
| 8 | **GitHub Pages deployment** | `playwright.yml:L242-249` | `peaceiris/actions-gh-pages@v4` deploys the Allure report to `gh-pages` branch under `/allure/` path | Visit the deployed report URL after a successful main build |

---

## PHASE 5: Improvement Recommendations

### Critical (fix now)

**1. Add `pull_request` trigger to CI pipeline**
- **What:** The workflow only runs on `push` to `main`. PRs don't get test feedback.
- **Why:** Without PR triggers, broken code can reach `main` before tests catch it.
- **Effort:** S
- **Skill:** CI/CD

```yaml
# Before (playwright.yml:L22-24)
on:
  push:
    branches: [main]

# After
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
```

**2. Fix non-retrying assertions in page objects**
- **What:** `HomePage.verifyPageTitle()` and `BasePage.assertNavigatesTo()` use manual checks instead of auto-retrying `expect()`.
- **Why:** Causes flaky tests — if the title or URL hasn't updated yet, the assertion fails immediately.
- **Effort:** S
- **Skill:** Playwright

```typescript
// Before (HomePage.ts:L72-77)
async verifyPageTitle(expectedTitle: string): Promise<void> {
    const title = await this.getTitle();
    if (!title.includes(expectedTitle)) {
      throw new Error(...);
    }
}

// After
async verifyPageTitle(expectedTitle: string): Promise<void> {
    await expect(this.page).toHaveTitle(new RegExp(expectedTitle, "i"));
}
```

### Important (fix soon)

**3. Remove redundant `waitForElement()` before auto-waiting actions**
- **What:** `BasePage.click()` and `BasePage.fill()` call `waitForElement()` before `locator.click()`/`locator.fill()`, which already auto-wait.
- **Why:** Doubles wait time on slow elements; hides real timing issues; adds unnecessary test duration.
- **Effort:** S
- **Skill:** Playwright

**4. Cache Playwright browsers in CI**
- **What:** Add a cache step for `~/.cache/ms-playwright/` keyed on Playwright version.
- **Why:** Browser downloads (~150MB each) are the biggest CI time waster. Caching saves ~1-2 min per job, and you have 8 jobs.
- **Effort:** M
- **Skill:** CI/CD

```yaml
- name: Cache Playwright browsers
  uses: actions/cache@v4
  id: playwright-cache
  with:
    path: ~/.cache/ms-playwright
    key: playwright-${{ hashFiles('package-lock.json') }}

- name: Install Playwright browsers
  if: steps.playwright-cache.outputs.cache-hit != 'true'
  run: npx playwright install chromium --with-deps
```

**5. Replace `networkidle` with element-based waits**
- **What:** `BasePage.waitForPageLoad()` uses `networkidle` which is unreliable.
- **Why:** `networkidle` fails on sites with analytics, websockets, or polling (which mobalytics.gg likely has). The catch-and-continue proves it's already causing issues.
- **Effort:** S
- **Skill:** Playwright

```typescript
// Before (BasePage.ts:L94-99)
async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState("domcontentloaded");
    await this.page.waitForLoadState("networkidle", { timeout: 10000 }).catch(() => {
      this.log.warn("Network idle timed out — continuing anyway");
    });
}

// After
async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState("domcontentloaded");
}
```

**6. DRY up authenticated fixture login logic**
- **What:** `authenticatedPage` (L93-108) and `authenticatedPoe2Page` (L115-128) duplicate `loginViaAPI()` call + error handling.
- **Why:** Violates DRY. If login logic changes, you must update both places.
- **Effort:** S
- **Skill:** TypeScript / Playwright

```typescript
// Extract shared helper
async function authenticateContext(context: BrowserContext): Promise<void> {
  const authResult = await loginViaAPI(context.request);
  if (!authResult.success) {
    throw new AuthenticationError("loginViaAPI failed. Check env vars.");
  }
  log.info("Authenticated via API");
}

// Then use in both fixtures
authenticatedPage: async ({ page, context }, use) => {
    await authenticateContext(context);
    await use(page);
},
authenticatedPoe2Page: async ({ page, context }, use) => {
    await authenticateContext(context);
    await use(new POE2Page(page));
},
```

### Nice to have (improve over time)

**7. Remove `declaration: true` and `declarationMap: true` from tsconfig**
- **What:** `tsconfig.json:L13-14` generates `.d.ts` files.
- **Why:** This is a test project, not a library. No one imports your types. It adds compilation overhead.
- **Effort:** S
- **Skill:** TypeScript

**8. Add `toHaveScreenshot()` for true visual regression**
- **What:** Visual tests currently just capture screenshots (`mobalytics-home.spec.ts:L243-251`) without comparing them.
- **Why:** Manual screenshots don't catch visual regressions automatically. Playwright's `toHaveScreenshot()` does pixel-by-pixel comparison with baseline images.
- **Effort:** M
- **Skill:** Playwright

```typescript
// Before
const screenshot = await homePage.takeFullPageScreenshot();
await testInfo.attach("home-page-full", { body: screenshot, contentType: "image/png" });

// After
await expect(homePage.page).toHaveScreenshot("home-page-full.png", {
    fullPage: true,
    maxDiffPixelRatio: 0.01,
});
```

**9. Implement `globalSetup` with `storageState` for authenticated tests**
- **What:** The commented-out `storageState` at `playwright.config.ts:L94` shows intent but isn't implemented.
- **Why:** Currently, every authenticated test calls `loginViaAPI()` separately. `storageState` performs login once and reuses the session file.
- **Effort:** M
- **Skill:** Playwright

**10. Add PR status comment with test results**
- **What:** Use `github-script` or a dedicated action to comment on PRs with test summary.
- **Why:** Developers currently have to click into the Actions tab to see results. A PR comment surfaces the data.
- **Effort:** M
- **Skill:** CI/CD

### Future enhancements

**11. Add test data factories / builders**
- **What:** Create dynamic test data generators for parameterized tests.
- **Why:** Currently all test data is static. For data-driven testing (e.g., testing multiple game pages), you'd want a factory that generates test scenarios.
- **Effort:** L
- **Skill:** TypeScript

**12. Add Slack/Teams notifications on pipeline failure**
- **What:** Post a message to a channel when tests fail on `main`.
- **Why:** Faster feedback loop — team learns about failures without checking GitHub.
- **Effort:** M
- **Skill:** CI/CD

**13. Add performance testing (Web Vitals)**
- **What:** Use `page.evaluate(() => performance.getEntriesByType('navigation'))` to capture LCP, FCP, TTI.
- **Why:** Performance regressions caught automatically.
- **Effort:** L
- **Skill:** Playwright

---

## PHASE 6: Quick Reference Cheat Sheet

### Common Playwright Commands

```bash
# Run all tests
npx playwright test

# Run specific file
npx playwright test tests/ui/mobalytics-home-smoke.spec.ts

# Run by tag
npx playwright test --grep "@smoke"
npx playwright test --grep "@smoke|@critical"
npx playwright test --grep-invert "@visual"

# Run specific browser
npx playwright test --project=chromium

# Headed mode (see browser)
npx playwright test --headed

# Debug mode (step through)
npx playwright test --debug

# UI mode (interactive)
npx playwright test --ui

# Specific test by name
npx playwright test -g "should load home page"

# Parallel control
npx playwright test --workers=4
npx playwright test --workers=1  # sequential

# Record a test
npx playwright codegen https://mobalytics.gg

# Generate report
npx playwright show-report
```

### Common Assertions

```typescript
// Element visibility
await expect(locator).toBeVisible();
await expect(locator).toBeHidden();
await expect(locator).toBeAttached();

// Text content
await expect(locator).toHaveText("exact text");
await expect(locator).toContainText("partial");
await expect(locator).toHaveText(/regex/i);

// Attributes
await expect(locator).toHaveAttribute("href", /pattern/);
await expect(locator).toHaveClass(/active/);

// Page-level
await expect(page).toHaveURL(/pattern/);
await expect(page).toHaveTitle("Title");

// Count
await expect(locator).toHaveCount(5);

// Input values
await expect(locator).toHaveValue("text");
await expect(locator).toBeChecked();
await expect(locator).toBeDisabled();

// Visual
await expect(page).toHaveScreenshot("name.png");
```

### TypeScript Patterns in This Project

```typescript
// Type-only import (reduces runtime cost)
import type { Page, Locator } from "@playwright/test";

// Interface for structured data
interface TestConfig {
  baseURL: string;
  timeouts: { default: number; navigation: number };
}

// Union type for constrained values
type Browser = "chromium" | "firefox" | "webkit";

// as const for literal types
const Tags = { smoke: "@smoke", critical: "@critical" } as const;
type Tag = (typeof Tags)[keyof typeof Tags]; // "@smoke" | "@critical"

// Getter for lazy evaluation
get validUser() { return { email: requireEnv("USER_EMAIL") }; }

// Custom error class
class ApiError extends Error {
  constructor(public readonly statusCode: number, message: string) {
    super(`API error (HTTP ${statusCode}): ${message}`);
    this.name = "ApiError";
  }
}
```

### GitHub Actions Workflow Syntax

```yaml
# Trigger
on:
  push: { branches: [main] }
  pull_request: { branches: [main] }
  workflow_dispatch:
    inputs:
      grep: { description: "Filter", required: false, default: "" }

# Job with dependencies
jobs:
  smoke:
    runs-on: ubuntu-latest
    steps: [...]

  regression:
    needs: smoke          # waits for smoke
    strategy:
      fail-fast: false
      matrix:
        shardIndex: [1, 2, 3]
        shardTotal: [3]

# Conditional execution
if: github.ref == 'refs/heads/main'
if: always()  # runs even on failure

# Secrets with fallback
env:
  BASE_URL: ${{ secrets.BASE_URL || 'https://default.url' }}

# Artifacts
- uses: actions/upload-artifact@v4
  with: { name: results, path: test-results/, retention-days: 7 }
```

### Debugging Commands

```bash
# Open Playwright Inspector (pause + step through)
npx playwright test --debug

# Open UI mode (interactive test runner)
npx playwright test --ui

# Run with trace always on
npx playwright test --trace on

# View a trace file
npx playwright show-trace test-results/trace.zip

# Run headed with slowmo
HEADLESS=false npx playwright test --headed

# Verbose logging
LOG_LEVEL=debug npx playwright test

# Generate Allure report
npm run allure:serve

# Open HTML report
npx playwright show-report

# Run specific test in debug
npx playwright test -g "should load home page" --debug --project=chromium
```

### Project-Specific Commands

```bash
# Smoke tests (fast gate)
npm run test:smoke

# Full regression
npm run test:regression

# API tests only
npm run test:api

# Cross-browser
npm run test:cross-browser

# Mobile/responsive
npm run test:responsive

# Run + open Allure report
npm run test:report

# Lint + format check
npm run check

# Auto-fix lint issues
npm run lint:fix

# Format all files
npm run format

# Clean all reports
npm run clean
```

---

**Summary:** This is a well-architected framework — **8/10 overall**. The component composition pattern, API-first auth, typed fixtures, and 3-stage CI pipeline are all production-quality. The main areas for improvement are: (1) adding PR triggers to CI, (2) replacing manual checks with auto-retrying Playwright assertions, (3) caching browsers in CI, and (4) implementing true visual regression with `toHaveScreenshot()`. The codebase is clean, well-typed, and follows Playwright best practices with only minor deviations documented above.
