You are my senior QA automation mentor. I'm new to Playwright, TypeScript, and CI/CD with GitHub Actions. I need you to perform a deep analysis of this test automation framework and turn it into a learning experience for me.

## PHASE 1: Framework Overview & Architecture Map

Scan the entire project and give me:

1. **Project Structure Diagram** — Show the full directory tree and explain what each folder/file is responsible for. Label each with its architectural role (e.g., "Page Objects", "Test Data", "Utilities", "Config", "CI/CD Pipeline").

2. **Tech Stack Inventory** — List every dependency from `package.json` (dev and prod), what each one does, and why it's in this project. Flag any outdated or unnecessary dependencies.

3. **Configuration Breakdown** — Analyse every config file:
   - `playwright.config.ts` — explain every single option, what it controls, what the current values mean, and what alternatives exist
   - `tsconfig.json` — explain compiler options and their impact on the test framework
   - `.github/workflows/*.yml` — explain every step, trigger, job, and environment variable
   - Any `.env`, `.eslintrc`, `.prettierrc`, or other config files

4. **Architecture Pattern Identification** — What design patterns does this framework use?
   - Page Object Model (POM)?
   - Fixtures pattern?
   - Factory pattern for test data?
   - Builder pattern?
   - Screenplay pattern?
   - Custom abstractions?
   
   For each pattern found: explain what it is, show where it's used, and rate how well it's implemented (1-10) with justification.

## PHASE 2: Code Quality Analysis

Perform a thorough code review as if you were reviewing a PR:

### TypeScript Analysis
- Are types being used effectively or is there excessive use of `any`?
- Are interfaces/types defined for page objects, test data, API responses?
- Is there proper use of enums, union types, generics?
- Are there type safety issues or potential runtime errors?
- Is `strict` mode enabled in tsconfig? Should it be?

### Playwright Best Practices Audit
For EVERY test file and page object, check:

- [ ] **Locator strategy** — Are locators resilient? Using `getByRole`, `getByText`, `getByTestId` vs fragile CSS/XPath selectors?
- [ ] **Auto-waiting** — Is the code fighting Playwright's auto-wait with unnecessary `waitForTimeout`, `page.waitForSelector`, or `sleep` calls?
- [ ] **Web-first assertions** — Using `expect(locator).toBeVisible()` vs `expect(await locator.isVisible()).toBe(true)`?
- [ ] **Test isolation** — Does each test run independently? Any shared state between tests?
- [ ] **Test hooks** — Proper use of `beforeEach`, `afterEach`, `beforeAll`, `afterAll`?
- [ ] **Fixtures** — Are Playwright fixtures used for setup/teardown? Are they composed properly?
- [ ] **API for setup** — Are tests using API calls for preconditions instead of slow UI flows?
- [ ] **Assertions** — Are assertions meaningful and specific? Are there tests without assertions?
- [ ] **Parallelism** — Is parallel execution configured and working correctly?
- [ ] **Retries & flakiness** — How are retries configured? Are there flaky test patterns?
- [ ] **Reporting** — What reporters are configured? Is there trace/screenshot/video on failure?
- [ ] **Authentication** — How is auth handled? Using `storageState`? Global setup?

### Anti-Patterns Found
List every anti-pattern with:
- File and line number
- What the anti-pattern is
- Why it's problematic
- The correct way to do it (with code example)

## PHASE 3: CI/CD Pipeline Analysis

For every GitHub Actions workflow file:

1. **Pipeline Architecture** — Draw the flow: triggers → jobs → steps → artifacts
2. **Trigger Analysis** — When does it run? Is it optimal?
3. **Caching Strategy** — Is dependency caching implemented? Is it effective?
4. **Browser Installation** — How are Playwright browsers installed? Is it cached?
5. **Parallelization** — Are tests sharded across multiple runners?
6. **Reporting** — Are test results/artifacts uploaded? Can you view them in PRs?
7. **Environment Management** — How are secrets, env vars, and test environments handled?
8. **Failure Handling** — What happens when tests fail? Notifications? Blocking merges?
9. **Performance** — How long does the pipeline take? What are the bottlenecks?
10. **Security** — Any hardcoded secrets, tokens, or credentials?

Rate the pipeline maturity: Basic / Intermediate / Advanced / Production-Grade

## PHASE 4: Learning Roadmap (Personalised from this codebase)

Based on what you found, create a structured learning plan:

### Playwright Concepts to Learn (ordered by priority)
For each concept, point to the EXACT file in this project where I can see it in action:

| # | Concept | Where in this project | What to study | Practice exercise |
|---|---------|----------------------|---------------|-------------------|
| 1 | ... | `path/to/file.ts:L15-L30` | ... | ... |

Cover at minimum:
- Locator strategies and best practices
- Auto-waiting mechanism
- Fixtures (built-in and custom)
- Page Object Model implementation
- API testing with Playwright
- Visual regression testing
- Test configuration and projects
- Trace viewer and debugging
- Parameterized tests
- Test tagging and filtering

### TypeScript Concepts to Learn
Same format — point to real code in this project:
- Basic types, interfaces, and type aliases
- Generics and their use in test frameworks
- Async/await patterns
- Module system (imports/exports)
- Utility types (Partial, Pick, Omit, etc.)
- Type guards and narrowing
- Declaration files and ambient types

### CI/CD Concepts to Learn
Same format — point to the workflow files:
- GitHub Actions syntax and structure
- Workflow triggers and events
- Job dependencies and matrix strategies
- Caching and artifact management
- Environment variables and secrets
- Reusable workflows and composite actions
- Branch protection and required checks

## PHASE 5: Improvement Recommendations

Create a prioritised backlog of improvements:

### 🔴 Critical (fix now)
### 🟡 Important (fix soon)  
### 🟢 Nice to have (improve over time)
### 🔵 Future enhancements

For each item provide:
- What to change
- Why it matters
- Before/after code example
- Estimated effort (S/M/L)
- Which skill it teaches me (Playwright/TS/CI-CD)

## PHASE 6: Quick Reference Cheat Sheet

Generate a cheat sheet I can refer back to:
- Common Playwright commands and assertions
- TypeScript patterns used in this project
- GitHub Actions workflow syntax
- Debugging commands (trace viewer, headed mode, step-through)
- CLI commands for running specific tests, generating reports, etc.

---

**Format your entire response with clear headers, code blocks, tables, and file references. Be specific — always point to exact files and line numbers. Don't be gentle — I need honest, actionable feedback to learn fast.**