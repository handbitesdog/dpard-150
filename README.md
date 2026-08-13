# Dallas Parks & Rec

Cross-platform mobile app for collecting digital stamps at Dallas parks, listening to
guided audio, and learning about the city.

See `HIGH_LEVEL_OVERVIEW.md` for architecture and `IMPLEMENTATION.md` for the phased
build plan.

## Requirements

- Node 22 LTS
- A custom dev client. The stack uses MMKV and (from Phase 6) `react-native-maps`, so
  **Expo Go will not run this app.**

## Setup

```bash
npm install
```

## Running

The dev client has to be built and installed once before `npm start` is useful.

```bash
npm install -g eas-cli
eas login
eas init
```

Then build a dev client for each platform. `development` produces an
internal-distribution build you install on a physical device via the QR code EAS
prints — no local Xcode or Android Studio needed:

```bash
eas build --profile development --platform ios
```

```bash
eas build --profile development --platform android
```

If you have Xcode installed and want an iOS Simulator build instead, use the
`development-simulator` profile.

iOS builds need a paid Apple Developer account — even `development`, internal-distribution
ones. Until that's set up, development and testing happen on Android only; nothing in the
app is Android-specific.

With the dev client installed, start the bundler:

```bash
npm start
```

## Scripts

| Script                            | Does                                     |
| --------------------------------- | ---------------------------------------- |
| `npm start`                       | Bundler for the dev client               |
| `npm run start:skip-intro`        | Same, with onboarding skipped (dev only) |
| `npm run typecheck`               | `tsc --noEmit`                           |
| `npm run lint`                    | ESLint, warnings treated as failures     |
| `npm run format` / `format:check` | Prettier                                 |
| `npm test`                        | Jest unit + component tests              |

## Skipping onboarding

Three ways, all dev-only:

1. `npm run start:skip-intro` — sets `EXPO_PUBLIC_SKIP_ONBOARDING=1`.
2. The **Replay onboarding** and **Reset all local state** buttons at `/dev`.
3. Neither works in a production build. The flag is read in one place
   (`src/lib/onboarding.ts`) and `shouldShowOnboarding` ignores it unless `__DEV__` is
   true, so a production bundle always shows the intro exactly once.

Metro caches the transform that inlines `EXPO_PUBLIC_*`, so toggling the flag may need
`--clear` to take effect.

## Repo layout

`app/` holds routing only, `src/components/` never touches a store, and
`src/services/` never imports React. ESLint enforces the last two — anything with real
logic belongs in `src/lib/` or `src/services/`, where it can be tested without a
renderer.

## Tests

```bash
npm test
```

End-to-end flows live in `maestro/` and need Maestro plus a built dev client. They are
not part of CI — see the note at the bottom of `.github/workflows/ci.yml`.

```bash
maestro test maestro/onboarding.yaml
```

Each flow starts with `clearState`, which also wipes the dev client's saved Metro
connection. `launchApp` then opens the dev client's native "Development servers"
picker instead of the app — tap the listed server there by hand once the emulator/
device screen is up; Maestro can't do this for you, since it's outside the RN view
tree. Once tapped, the rest of the flow runs unattended. A standalone or preview
build has no such picker and doesn't need this step.
