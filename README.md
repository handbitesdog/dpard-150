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

Copy `.env.example` to `.env` and fill in `GOOGLE_MAPS_API_KEY` — a Google Cloud API
key with the "Maps SDK for Android" enabled, restricted to this app's package name
(`gov.dallascityhall.parks`) and signing certificate fingerprint. It's read by
`app.config.ts` and baked into the native Android manifest at prebuild time, so a
new key requires a native rebuild (`expo run:android` / a new dev client build), not
just a Metro reload. iOS uses Apple Maps and needs no key.

`EXPO_PUBLIC_CDN_BASE_URL` is optional and unset by default — see [Content CDN](#content-cdn).

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

## Content CDN

Photography, stamp art, guide audio, and the Connect feed are served from a static file
host. **No host is provisioned yet, and the app is built to ship without one.** Leave
`EXPO_PUBLIC_CDN_BASE_URL` unset and every screen falls back to bundled placeholder art
and the bundled audio fixture — the same thing it displayed before any of this existed.
Nothing surfaces an error, because a missing CDN is not a user-facing failure.

Set it to the origin (no trailing slash) to switch the app over:

```
EXPO_PUBLIC_CDN_BASE_URL=https://cdn.dallasparks.org
```

Metro inlines `EXPO_PUBLIC_*` at build time, so changing it needs `expo start --clear`.
A value that isn't an `http(s)` origin is treated as unset.

Expected layout on the host, matching the paths in `src/data/*.json`:

| Path | Serves | Cache headers |
| --- | --- | --- |
| `/parks/{parkId}/{photo}.jpg` | Park photography (`park.photos[].source`) | Long |
| `/figures/{figureId}/portrait.jpg` | Figure portraits (`figure.portrait.source`) | Long |
| `/stamps/{parkId}.png` | Stamp art (`park.stamp.image`) | Long |
| `/guides/{guideId}/{locale}.m4a` | Guide audio (`guide.audioPath`), AAC mono, range requests required for seeking | Long |
| `/feed.json` | Curated Connect feed | Short |

Resolution lives in `src/lib/cdn.ts`; catalog paths stay host-independent so the host can
change without touching content. Images resolve through `src/data/assets.ts`, which pairs
each CDN URL with its bundled stand-in, and `RemoteImage` swaps that stand-in in if the
remote image fails to load. Audio prefers a completed download, then the stream, then the
fixture. Per-guide downloads themselves are still unimplemented (Phase 9), so the download
branch is inert until `downloadService` writes real local paths.

Merch photography is the one exception: `merch.json` has no image field, so shop items
still use the bundled `MERCH_PHOTOS` map.

### `feed.json`

A JSON array of posts. Unknown fields are ignored, and an invalid post is skipped rather
than failing the whole feed, so a curator can extend this without a client release:

```json
[
  {
    "id": "post-1",
    "imageUrl": "/posts/post-1.jpg",
    "caption": "Morning at White Rock Lake",
    "permalink": "https://instagram.com/p/abc123",
    "publishedAt": 1700000000000
  }
]
```

`imageUrl` may be a CDN-relative path or an absolute URL. `publishedAt` is epoch
milliseconds. The feed is cached to disk after the first successful fetch, so a later
outage shows the last good feed instead of an error.

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
