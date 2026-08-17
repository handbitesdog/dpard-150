# CLAUDE.md

## Project Overview

Name: Dallas Parks and Recreation mobile app.
Description: Cross platform mobile app where users can collect digital stamps for visiting different parks, listen to guided tours, and learn more about the city.

## Code style

- Only use comments for properly documenting files/functions and explaining code that may be confusing. Never narrate your actions using comments.
- Repo layout is enforced by ESLint, not just convention: `app/` is routing only. `src/components/**` must never import from `@/stores` — read state in a route/feature and pass it down as props. `src/services/**` and `src/lib/**` must never import `react` or `react-native` — they need to stay testable without a renderer. Import alias `@/*` maps to `src/*` (see `tsconfig.json`).

## Testing

- Development and testing happen on **Android only** right now — no paid Apple Developer account yet, and the stack uses MMKV plus (from Phase 6) `react-native-maps`, so Expo Go can't run this app either (see README). Don't reach for iOS Simulator tools on this project.
- There's no dedicated Android emulator tool — drive it with raw `adb` via Bash. `adb` isn't on PATH by default:
  ```
  export PATH="$PATH:/Users/jackson/Library/Android/sdk/platform-tools"
  ```
  AVD name `dpard_pixel`, package `gov.dallascityhall.parks`, main activity `.MainActivity`.
- Screenshot: `adb exec-out screencap -p > file.png`, then read it with the Read tool. Tap: `adb shell input tap X Y` — use the PNG's **actual pixel resolution**, not the scaled "displayed at WxH" size the Read tool reports; mixing these up taps the wrong element.
- `adb shell am force-stop <pkg>` clears the dev client's cached Metro connection (same effect as Maestro's `clearState`) — the app self-reconnects in ~4s without a manual tap.
- Metro health: `curl http://localhost:8081/status`. To check for compile errors, fetch the actual bundle URL rather than `/index.bundle` (which 404s under expo-router) — read the real path out of the served HTML's `<script src=...bundle...>` tag; it's under `/node_modules/expo-router/entry.bundle?platform=...`.
- Metro caches the transform that inlines `EXPO_PUBLIC_*` env vars — toggling one (e.g. `EXPO_PUBLIC_SKIP_ONBOARDING`) may need `expo start --clear` to take effect.
- Maestro e2e flows (`maestro/`) are deliberately not in CI (see the note at the bottom of `.github/workflows/ci.yml`) — they need a built dev client on a macOS runner. Each flow's `clearState` step also wipes the dev client's saved Metro connection, so `launchApp` lands on the native "Development servers" picker instead of the app; tap the listed server by hand once the emulator screen is up, then the rest of the flow runs unattended.

## Git conventions

- Don't commit work to `main`. Run `git branch --show-current` before the first commit of a session; if it's `main`, create a branch first. The one exception is bootstrapping a repository with no commits yet — `main` has to exist before anything can branch from it.
- Branch from up-to-date `main`: `git switch main && git pull && git switch -c <name>`.
- Branch names: `<type>/<kebab-description>` using the same types as commits — `feat/card-component`, `fix/button-focus-ring`, `docs/custom-properties`.
- Conventional Commits: `<type>(<scope>): <subject>`. Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `build`, `chore`. Scope is the component or section touched — `feat(card):`, `fix(reset):`. Omit scope for repo-wide changes.
- Subject line: imperative mood, lowercase, no trailing period, under ~50 chars. "add pill button variant", not "Added pill button variant."
- Body only when the change needs justification — a workaround, a breaking rename, a non-obvious tradeoff. Wrap at 72. Describe the change and why, never the conversation that produced it. No "as requested", no "per feedback".
- Breaking changes: `!` after the type/scope and a `BREAKING CHANGE:` footer.
- One logical change per commit. Stage explicit paths (`git add lisa.css demo.html`), never `git add -A` or `git add .`.
- Show me `git status` and `git diff --staged` before committing. Don't commit and report afterward.
- Don't amend or rebase anything already pushed.
- Don't add `Co-Authored-By` or generated-with trailers to commits.

## Safety

- Never commit secrets. If .env is touched, verify .gitignore before any commit.
- Never run rm -rf, git reset --hard, git push --force, DROP TABLE, or similar destructive operations without explicit confirmation.

## Mindset

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.