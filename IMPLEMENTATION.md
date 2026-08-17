# Dallas Parks & Rec App — Implementation Plan

Companion to `HIGH_LEVEL_OVERVIEW.md`. That document settles *why*; this one settles *what gets built, in what order, and how we know it works*.

Each phase below has **Deliverables**, **Tests**, and **Exit criteria**. A phase is not done until its tests are written and passing — tests are the exit criteria, not a follow-up task.

---

## Decisions made in this pass

`HIGH_LEVEL_OVERVIEW.md` has been amended to match the five-tab structure, the three-entity content model, and the expanded role of the CDN — so the two documents no longer disagree and there is no reconciliation layer to keep in your head. What follows is only what *this* pass decided, recorded here because the reasoning is implementation-level rather than architectural.

| Decision | Resolution |
|---|---|
| How curated hashtag posts reach the app | **Remote JSON on the same static host as the audio.** A curator uploads `feed.json` plus images; the app fetches on launch, validates, caches to disk, and falls back to last-known content offline. No API, no tokens, no server to operate. |
| What a historic figure *is* | Biographical only — portrait, bio, related parks. No coordinates, no directions link, no stamp, no audio guide. |
| Guide ↔ park relationship | An `AudioGuide` belongs to exactly one park; a park may have many. Listen is a flattened, searchable view across all of them. |
| Shop | An external storefront opened in the system browser. No in-app commerce, no payment handling. *(Open question 1.)* |
| Settings / credits / legal | The five-tab structure leaves them homeless. Suggested: a header button on Connect. *(Open question 2.)* |
| Test depth | Unit + component + Maestro E2E, with tests as each phase's exit criteria rather than a follow-up. See Appendix D. |

### Two live issues

**Historic figure detail pages will not have a directions link.** Your description said the shared detail page has "an overview, link to directions, etc.", but you then scoped figures as biographical-only. Those are incompatible, and the plan is built around biographical-only. The detail-page shell takes location as an optional prop and omits the directions row for figures. If figures are actually statues or memorials with a physical location, this reverses cheaply in Phase 3 — but it has to reverse before Phase 5.

**The palette fails WCAG contrast.** Measured, not estimated — see Appendix A. White text fails AA against *every* color in the palette, including the four the palette sheet itself sets white text on. Navy `#0f3357` is the only foreground that reliably passes, and even navy on sky or slate falls just short for body copy. Since a City of Dallas app will be held to public-sector accessibility standards, this needs a designer decision before page-building starts in Phase 4. It does not block Phase 1 or Phase 3 at all. In Phase 2 it blocks only the disputed pairings: the theme declares the pairs Appendix A measured as safe, the contrast test runs green over those, and any pairing a Figma screen needs that isn't on the safe list is left undeclared and recorded as blocked. Phase 2 exits on that basis — it does not wait for the designer, and it also does not declare a pair it knows to be failing.

---

## Stack

| Concern | Choice | Note |
|---|---|---|
| Framework | Expo, custom dev client via EAS Build | Per overview. Versions pinned at scaffold time. |
| Language | TypeScript, `strict: true` | |
| Navigation | Expo Router (file-based) | |
| State | Zustand + `react-native-mmkv` persistence | MMKV needs the dev client — already assumed. |
| Audio | `expo-audio` | Lock-screen metadata support verified by spike at the **start of Phase 4**, before anything is built on it; `react-native-track-player` is the fallback. |
| Location | `expo-location` (foreground only) | |
| Files | `expo-file-system` | Downloads + feed cache. |
| Map | `react-native-maps` | Apple Maps on iOS, Google Maps on Android (needs an API key + config plugin). |
| Data validation | Zod | Validates bundled JSON at build time and remote feed at runtime. |
| Unit/component tests | Jest (`jest-expo`) + React Native Testing Library | |
| E2E | Maestro | YAML flows, runs against simulator/emulator. |
| Lint/format | ESLint + Prettier | |

### Repo layout

```
app/                          # expo-router routes only — no logic
  _layout.tsx                 #   root: font load, store hydration, onboarding gate
  onboarding/
    index.tsx                 #   welcome screen
    [step].tsx                #   slides 1–4
  (tabs)/
    _layout.tsx               #   tab bar + mini-player slot
    discover.tsx  listen.tsx  explore.tsx  passport.tsx  connect.tsx
  park/[id].tsx
  figure/[id].tsx
  guide/[id].tsx              #   full-screen player
  dev/                        #   __DEV__ only: component gallery, state reset
src/
  design/                     # tokens, theme, typography
  components/                 # presentational, no store access
  features/                   # screen-level composition per tab
  data/                       # parks.json, guides.json, figures.json + schemas
  stores/                     # zustand slices, all persisted+versioned
  services/                   # stamp, location, playback, download, feed
  lib/                        # pure helpers (geo math, formatting)
tests/
  unit/  components/  fixtures/
maestro/                      # e2e flows
```

The rule that keeps this testable: **`app/` holds routing only, `components/` never touches a store, `services/` never imports React.** Anything with real logic ends up in `lib/` or `services/`, where it can be tested without a renderer.

---

## Phase 1 — Project setup and navigable skeleton

**Goal:** the app launches, runs the intro once, and lands on five empty tabs. No content, no design system.

### Deliverables
1. Scaffold Expo + TypeScript + Expo Router. ESLint, Prettier, `strict` TS, path aliases (`@/`).
2. EAS project configured; dev client builds for iOS and Android. iOS build/verification is deferred until a paid Apple Developer account is set up — see the note under Exit criteria.
3. Five tab routes with placeholder screens and the correct tab bar labels/icons.
4. Onboarding: welcome screen with "Get started" → 4 slides, each with "Next", the last with "Let's go!" → main app. Slides carry a progress indicator and can be swiped as well as tapped.
5. `prefsStore` (hook export `usePrefsStore`) with `onboardingCompletedAt`, persisted through MMKV. Phase 3 extends it rather than replacing it.
6. **Onboarding skip**, three ways:
   - `EXPO_PUBLIC_SKIP_ONBOARDING=1` → `npm run start:skip-intro`
   - dev-only "Replay onboarding" and "Reset all local state" buttons in `app/dev/`
   - the flag is read through a single pure resolver, guarded by `__DEV__` so a production build can never skip
7. The tab layout leaves a mounted slot above the tab bar for the mini-player (empty for now).
8. Jest + RNTL + Maestro wired up; CI runs typecheck, lint, and unit/component tests on every push.

```ts
// src/lib/onboarding.ts — the whole gate, so it can be tested without a renderer
export function shouldShowOnboarding(s: {
  completedAt: number | null;
  skipFlag: boolean;
  isDev: boolean;
}): boolean {
  if (s.isDev && s.skipFlag) return false;
  return s.completedAt === null;
}
```

### Tests
- Unit: `shouldShowOnboarding` across all eight input combinations — critically, that `skipFlag` is ignored when `isDev` is false.
- Component: each of the five tab screens renders; onboarding advances 1→2→3→4 and "Let's go!" sets `onboardingCompletedAt`.
- Maestro `onboarding.yaml`: fresh install → welcome → 4 slides → Discover. Relaunch → straight to Discover, no intro.
- Maestro `skip-intro.yaml`: launched with the flag, lands on Discover directly.

### Exit criteria
Dev client runs on both platforms. Intro appears exactly once. Skip flag works and is provably dev-only. CI green.

**Status:** verified on Android (emulator build, manual walkthrough, and `maestro/onboarding.yaml`). iOS is unverified — there's no Apple Developer account yet, and `eas build --platform ios` needs one even for internal-distribution dev-client builds. Nothing in the code is Android-specific; this is a build/verification gap, not a design decision, and it blocks Phase 1 sign-off on iOS until the account exists.

---

## Phase 2 — Design system and component library

**Goal:** every visual primitive exists, is tested, and is viewable in one place — so Phase 4 onward is composition, not invention.

### Deliverables
1. **Tokens** (`src/design/`): colors, spacing, typography, radii, shadows, durations. See Appendices A–C. The palette ships whole, but only Appendix A's safe pairings are declared as foreground/background combinations; the disputed ones stay undeclared pending the designer decision.
2. **Theme access** via a typed hook; no raw hex or magic numbers anywhere outside `src/design/`. An ESLint rule enforces this.
3. **Component gallery** at `app/dev/gallery.tsx` — every component in every state, on one scrollable screen. This is how spacing and type get eyeballed and corrected against Figma.
4. **Components:**

   | Group | Components |
   |---|---|
   | Layout | `Screen`, `Section`, `SectionHeader` (title + "See all"), `Divider`, ~~`Sheet`~~ |
   | Typography | `Text` with variants; scales with Dynamic Type |
   | Actions | `Button` (primary/secondary/tertiary, 3 sizes, loading/disabled/icon), ~~`IconButton`~~, `LinkRow` |
   | Content | `Card`, `ParkCard`, `FigureCard`, `Carousel` (snap-scrolling), ~~`Chip`~~ |
   | Input | `SearchBar` (debounced, clearable) |
   | Audio | ~~`GuideRow`~~, `MiniPlayer`, ~~`FullPlayer`~~, ~~`Scrubber`~~, ~~`DownloadButton`~~ |
   | Stamps | `StampBadge` (collected/uncollected/locked), `PassportSummary`, ~~`CompletionBadge`~~ |
   | Feedback | `EmptyState`, `ErrorState`, `Skeleton`, `Toast` |
   | Map | `MapPin`, `MapCallout` |

   Struck-through items were descoped from this phase — see the note below.

5. Every component takes an `accessibilityLabel`, has a ≥44×44pt touch target, and renders correctly at the largest Dynamic Type setting.

> **Descoped from Phase 2.** `Sheet`, `IconButton`, `Chip`, `GuideRow`, `FullPlayer`, `Scrubber`, `DownloadButton`, and `CompletionBadge` were cut from this phase. Each is chrome for a screen or flow that doesn't exist yet, so building it now means guessing at its API instead of deriving it from a real caller. They move to whichever phase actually consumes them: `GuideRow`, `FullPlayer`, `Scrubber`, and `DownloadButton` to Phase 4 (Listen tab — see that phase's note, since its deliverables originally assumed these shipped here), `CompletionBadge` to whichever phase renders full-passport completion, and `Sheet`/`IconButton`/`Chip` wherever the first consuming screen needs them. `ErrorState`, `Skeleton`, `Toast`, and `MapPin` — also absent from the original table pass — were added and built in this phase; `MapPin` renders `map-pin-icon.svg` directly (full-color art with its own drop shadow) rather than a recolored glyph in a highlight container, so it has no `selected` variant.

### Tests
- Component tests per component: renders, honors `disabled`, fires handlers, exposes an accessible role and label.
- **Contrast test** (`tests/unit/contrast.test.ts`): computes WCAG ratios for every foreground/background pair the theme actually declares and asserts each meets its target (4.5:1 normal, 3:1 large). This test is what stops a Figma screenshot from quietly reintroducing white-on-lime in Phase 4.
- Dynamic Type: render the gallery at the largest scale and assert no clipped or zero-height text nodes.
- `StampBadge` uncollected state exposes a **non-color** indicator (per the overview's accessibility rule).

### Exit criteria
Gallery renders every component built in this phase, in every state. Contrast test passes for every declared pair, and the pairs blocked on the designer decision are listed rather than silently omitted. Spacing and type reconciled against at least one real Figma screen.

---

## Phase 3 — Data layer, stores, and services

**Inserted before page-building deliberately.** Pages need typed content and persisted state to render anything real; building this per-page means five incompatible half-versions of it and a rewrite. It is also the layer where correctness actually matters — the geofence math and the migrations are the two things that can silently lose a user's forty stamps.

### Deliverables

**1. Content schemas and bundled data** (Zod + inferred TS types):

```ts
type PhotoRef = {
  source: string;                // bundled asset path
  alt: string;                   // required — screen reader description
  credit?: string;
};

type Park = {
  id: string;                    // stable, never reused
  name: string; neighborhood: string;
  description: string; amenities: string[]; hours: string;
  photos: PhotoRef[];
  location: { latitude: number; longitude: number };
  stampRadiusMeters: number;     // tuned per park
  stamp: { image: string; label: string };
};

type AudioGuide = {
  id: string;
  parkId: string;                // always park-owned
  title: string; narrator?: string;
  durationSeconds: number;
  audioPath: string;             // "/guides/{guideId}.m4a", resolved against CDN base
  transcript: string;            // required — accessibility
  chapters?: { title: string; startSeconds: number }[];
};

type HistoricFigure = {
  id: string;
  name: string; lifespan?: string;
  portrait: PhotoRef;
  biography: string;
  relatedParkIds: string[];      // no location, no stamp, no guides
};
```

Content is hand-authored (per the overview), so: keep the JSON readable, and **validate at build time** via a `npm run validate:content` script wired into CI and the prebuild step. A malformed park fails the build loudly instead of crashing a user's app. Validation covers required `alt` text on every `PhotoRef`, since an accessibility requirement left to an author's memory is one that eventually gets forgotten.

> **Gate — settle localization before authoring content.** The overview commits to catalog schemas that can carry per-language description, biography, and audio. That commitment has to be honored *here*, at the moment the schema is written, because everything downstream hardens around the shape chosen: the catalog gets hand-authored against it, all five tabs read it, and per-language audio changes the `/guides/{guideId}.m4a` path convention the CDN is provisioned around. Deciding later is not a schema change, it is a re-authoring plus a pass over every screen — the exact rewrite the overview set out to avoid. Answer open question 4 (is Spanish required for v1?) before writing these types. If the answer is no, say so explicitly in the schema comments and accept flat strings as a deliberate choice; if it is yes or unknown, adopt a localized shape now and hide it behind a single accessor in `lib/` so components never branch on it.

**2. Persisted stores**, each versioned with a migration function from day one:

| Store | Holds |
|---|---|
| `stampStore` | `{ parkId, collectedAt, coordinates }[]` |
| `progressStore` | per-guide last position + completed flag |
| `downloadStore` | guideId → `{ status, localPath, bytes }` |
| `prefsStore` | onboarding, permission history, locale — **extends** the store Phase 1 created |
| `feedStore` | cached Connect feed + `fetchedAt` |

**3. Services** (no React imports):
- `lib/geo.ts` — haversine distance. Pure.
- `locationService` — permission request, reading with an accuracy threshold, retry, Android mock-location rejection.
- `stampService` — the whole collect flow as a state machine: `idle → checking → locating → (success | too_far | low_accuracy | denied | already_collected)`. Idempotent.
- `feedService` — fetch, validate, cache, fall back to cache on failure.
- `playbackService` and `downloadService` — interfaces defined here, implemented in Phases 4 and 9.

### Tests
This phase carries the heaviest test weight in the project.
- `geo.distance` against known coordinate pairs with published distances, including the equator/antimeridian edge cases and identical points.
- `stampService`: every terminal state, with location mocked. Explicitly: exactly at the radius boundary, 1m inside, 1m outside, accuracy worse than threshold, permission denied, permission "ask again", already-collected (asserting no duplicate is written).
- **Migrations**: a fixture store at each historical version migrates forward with zero stamp loss. This test grows by one case per schema change, forever.
- Store hydration from empty, from valid, and from corrupt MMKV payloads.
- Content validation: a fixture with a bad park (missing coords, negative radius, guide pointing at a nonexistent park, photo missing `alt`) fails the validator.

### Exit criteria
100% branch coverage on `lib/geo.ts` and `stampService`. Migration tests pass. `npm run validate:content` passes on real data and fails on the bad fixture.

---

## Page-building phases (4–8)

One deviation from your tab order: **Listen comes before Discover.** The park detail page embeds a list of that park's guides and launches playback from them, so the player and playback store have to exist first. Building Discover first means shipping a park detail page with a dead section and revisiting it. The rest follow your order.

Every page phase assumes bundled fixture audio, not the CDN. Phase 9 swaps in real URLs.

---

## Phase 4 — Listen tab and playback

### Deliverables

**0. Audio library spike — first, before any of the below.** Confirm `expo-audio` delivers background playback, lock-screen controls, and now-playing metadata on both platforms. Everything else in this phase is built on that answer, so it has to be settled here rather than in Phase 9 where the integration work lands: by Phase 9 the transport, seek behavior, and resume semantics all depend on it, and the `playbackService` interface from Phase 3 contains only some of that blast radius. A throwaway build answers it in a day. If the answer is no, swap to `react-native-track-player` now and build the rest of the phase against it.

1. Listen screen: all guides across all parks, ~~grouped or filterable by park~~, each row showing title, park, duration, download state, and progress.
2. ~~`SearchBar` filtering across guide title, park name, and narrator. Debounced, with an empty-results state.~~
3. `playbackService` — a single global player instance. Play, pause, seek, skip ±15s, playback speed.
4. `MiniPlayer` mounted in the tab layout slot, visible across all tabs while audio plays, tappable to expand.
5. ~~`FullPlayer` route: artwork, scrubber, transport, speed, transcript sheet.~~
6. Resume position persisted per guide via `progressStore`, restored on replay.
7. ~~Download UI wired to `downloadService` — progress, cancel, delete, and total storage used. Against local files for now.~~

`MiniPlayer` is not rebuilt here — Phase 2 already built it as a presentational component. `GuideRow`, `FullPlayer`, `Scrubber`, and `DownloadButton` were descoped from Phase 2 (see that phase's note) and were slated to get built fresh here as presentational components first, then wired to `playbackService`, per the layering rule above. See the descope note below for what actually shipped.

> **Descoped from this pass.** Only 3, 4, and 6 landed: `playbackService` (play/pause/seek/skip/speed, unit-tested against a fake player — see `tests/unit/playbackService.test.ts`), `MiniPlayer` wired into both the tab-bar slot and the Listen screen rows and kept in full sync through a shared `playbackStore`, and resume position written to `progressStore` on pause and on guide switch. `GuideRow` did not get built as its own component — the Listen screen renders `MiniPlayer` (`variant="row"`) directly rather than wrapping it, since there was no second caller yet to justify a separate shape. `SearchBar` filtering, the `FullPlayer` route (and with it `Scrubber`), and download UI wired to `downloadService` (`DownloadButton`) are still cut, for the same reason Phase 2 gave: each is chrome for a flow that doesn't exist yet, so building it now means guessing at its API instead of deriving it from a real caller. Skip ±15s and playback-speed are implemented and tested on `playbackService` but have no UI control invoking them — that lands with `FullPlayer`. Listen-screen grouping/filtering by park is also unbuilt; the screen is a flat list today. Resume-across-a-full-app-restart (the exit criterion below) hasn't been explicitly verified — only resume-across-pause/switch within a session was checked on-device — though `progressStore` is itself MMKV-persisted, so a relaunch should read the last saved position.

### Tests
- Component: search filters correctly and handles no-match; `GuideRow` renders all download states; `MiniPlayer` hides when nothing is playing and survives tab switches.
- Unit: playback reducer transitions (play → pause → seek → complete); resume position writes on pause and on unmount; a completed guide resets to 0 rather than resuming at the end.
- Maestro `listen.yaml`: search → open guide → play → navigate to another tab → mini-player still present → expand → transcript opens.

### Exit criteria
The audio library is settled by spike, not assumed. Audio plays from a bundled fixture, survives navigation, and resumes where it left off after a full app restart.

---

## Phase 5 — Discover tab and detail pages

### Deliverables
1. Discover screen: park carousel, historic figures carousel, an audio guides showcase section, and a shop section. Each section has a `SectionHeader` with "See all" routing to the relevant tab.
2. **Park detail** (`app/park/[id].tsx`): photo header, overview, amenities, hours, directions link, that park's audio guides, and the claim-stamp button.
3. **Figure detail** (`app/figure/[id].tsx`): portrait, lifespan, biography, related parks. **No directions row.** Same shell as park detail with location as an optional prop.
4. Directions link: platform-native maps URL (Apple Maps on iOS, Google Maps on Android) with a web fallback.
5. **Claim stamp flow** wired to `stampService` from Phase 3 — the button renders every state the service can return, with distance shown on failure ("You're 340m away") rather than a bare rejection, and a celebration on success.
6. Shop section opens the external storefront in the system browser, with a clear affordance that it leaves the app.

### Tests
- Component: carousels render from fixture data and route on press; park detail shows guides for that park only; figure detail renders without a location and does not show a directions row.
- Claim button state machine rendered against every mocked `stampService` outcome, asserting the distance appears in the too-far state.
- Maestro `stamp.yaml`: with simulator location set inside the radius, claim succeeds and the stamp appears in Passport. Second attempt shows already-collected. With location set outside, claim fails with distance shown.

### Exit criteria
Both detail pages render from real content. Claiming a stamp at a simulated in-radius location persists it across restart.

---

## Phase 6 — Explore tab

### Deliverables
1. Map with a pin per park, initial region framing Dallas, user-location dot (permission already handled by `locationService`).
2. `SearchBar` filtering pins and recentering on a result.
3. Pin callout → park detail.
4. Visual distinction between collected and uncollected parks, **not by color alone**.
5. Android Google Maps API key via config plugin; documented in the README.
6. Accessible fallback: the map is not screen-reader navigable in any useful way, so the tab needs a list view toggle. This is an accessibility requirement, not a nice-to-have.

### Tests
- Component: pins render one per park; search filters the set; callout press routes with the right id.
- Unit: initial region calculation covers all park coordinates with sane padding.
- Maestro `explore.yaml`: search a park → tap pin → detail opens.

### Exit criteria
Map renders on both platforms with correct pins. List fallback is reachable and screen-reader navigable.

---

## Phase 7 — Passport tab

### Deliverables
1. Passport summary: stamps collected out of total, with progress.
2. **Completion badge** shown only when every stamp is collected.
3. Tapping the passport opens the full stamp grid — collected stamps in full color, uncollected greyed out with a non-color indicator and a route to that park's detail page.
4. Empty state for zero stamps that points at Discover.
5. Onboarding-adjacent honesty: since stamps are local-only and unrecoverable (per the overview's risk table), the passport carries a quiet note about this.

### Tests
- Component: count matches store; grid marks the right stamps collected; the completion badge appears at exactly 100% and not at n−1.
- Unit: completion selector against 0, 1, n−1, and n stamps.
- Accessibility: uncollected stamps announce their state via label, not color.
- Maestro `passport.yaml`: collect a stamp → passport count increments → stamp appears in grid.

### Exit criteria
Counts and completion are correct at every boundary, verified by test rather than by eye.

---

## Phase 8 — Connect tab

### Deliverables
1. Social links and shop link, opening in the system browser.
2. Curated post showcase backed by remote `feed.json`:
   - fetch on launch (and pull-to-refresh), validate with Zod
   - cache posts and images to disk; **render from cache when offline**
   - on fetch failure with no cache, an error state — never a blank tab
   - unknown fields tolerated, invalid posts skipped rather than failing the whole feed
3. Post press opens the original permalink externally.
4. `feed.json` schema documented in the README so the curator can author it without a developer.
5. Settings/credits/legal entry point, pending open question 2.

### Tests
- Unit: `feedService` on success, HTTP failure with cache, HTTP failure without cache, malformed JSON, and a feed with one invalid post among valid ones.
- Component: feed list, loading skeleton, error state, offline-from-cache state.
- Maestro `connect.yaml`: feed renders; airplane mode on → cached posts still render.

### Exit criteria
Connect tab is fully functional offline after one successful fetch.

---

## Phase 9 — Audio CDN integration

Deliberately last, per your ask. Everything before this runs on bundled fixture audio.

### Deliverables
1. Integrate against whichever audio library the Phase 4 spike settled on. No library decision is open at this point — that is precisely why the spike sits at the start of Phase 4 rather than here.
2. Host chosen and provisioned (S3 + CloudFront or equivalent). Audio encoded consistently: AAC/m4a, mono, speech-grade bitrate.
3. Range-request support verified (seeking while streaming) and long cache headers set.
4. CDN base URL injected by environment; `audioPath` values in the content stay host-independent.
5. Streaming with buffering, network-failure, and retry states surfaced in the UI.
6. Real per-guide downloads via `expo-file-system`, with the player resolving a local file when present and falling back to the stream when not.
7. **Background audio**: iOS `UIBackgroundModes: ["audio"]`, Android foreground service, both via config plugins.
8. Lock-screen controls and now-playing metadata.

### Tests
- Integration: player resolves local file over stream when both exist; falls back cleanly when a download is deleted mid-session.
- Unit: URL resolution from `audioPath` + base across environments.
- **Manual matrix**, both platforms — this is the part simulators can't fully cover:

  | | iOS | Android |
  |---|---|---|
  | Stream over wifi / cellular / degraded | | |
  | Download, then airplane mode playback | | |
  | Background playback, screen locked | | |
  | Lock-screen controls (play/pause/skip/scrub) | | |
  | Interruption (phone call), then resume | | |
  | Delete download while playing | | |

### Exit criteria
Every cell in the matrix passes on both platforms. Seeking works mid-stream.

---

## Phase 10 — Hardening and release

### Deliverables
1. Full accessibility pass: VoiceOver and TalkBack over every screen, largest Dynamic Type setting, contrast test green against final tokens.
2. Fresh-install run and **upgrade run over a build with existing stamps** — confirming migrations preserve them on real devices, not just in unit tests.
3. **Physical device testing at a real park.** Required per the overview: simulators cannot reproduce GPS degradation under tree cover, which is the most likely source of user-reported bugs. Test claim at the entrance, at the centroid, and just outside the radius; tune `stampRadiusMeters` from what you find.
4. Localization audit: confirm every user-facing string is externalized. The *schema* side of this was settled back in Phase 3 — by this phase the catalog is authored and all five tabs read it, so it is far too late to still be called preparation.
5. Store assets, privacy disclosures (location + no data collection), EAS submit pipeline.

### Exit criteria
Accessibility pass clean. Stamps survive an upgrade on a real device. At least three parks stamp-tested in person.

---

## Appendix

### A. Colors

```ts
// src/design/colors.ts
export const palette = {
  navy:  '#0f3357',  // primary
  beige: '#f7efde',  // primary
  pear:  '#7bb31e',  // secondary
  lime:  '#b7d854',  // secondary
  sky:   '#3aa5b9',  // secondary
  teal:  '#45d3cd',  // secondary
  slate: '#72a09a',  // accent
  grey:  '#e5e5ea',
  white: '#ffffff',
} as const;
```

**Measured WCAG contrast** (computed, not estimated — the calculation lives in `tests/unit/contrast.test.ts`):

| Background | Navy text | White text |
|---|---|---|
| white `#ffffff` | **12.87** AAA | — |
| beige `#f7efde` | **11.25** AAA | 1.14 ✗ |
| grey `#e5e5ea` | **10.25** AAA | 1.26 ✗ |
| lime `#b7d854` | **7.95** AAA | 1.62 ✗ |
| teal `#45d3cd` | **7.02** AAA | 1.83 ✗ |
| pear `#7bb31e` | **5.09** AA | 2.53 ✗ |
| sky `#3aa5b9` | 4.45 — large text only | 2.89 ✗ |
| slate `#72a09a` | 4.42 — large text only | 2.91 ✗ |
| navy `#0f3357` | — | **12.87** AAA |

Consequences to design around:
- **White text is unusable on every palette color.** The palette sheet itself shows white on pear, lime, sky, and teal; all four fail. Take this back to the designer.
- **Navy on sky and navy on slate miss AA** (4.45 and 4.42 vs 4.5). Fine for large text (≥24px, or ≥19px bold), not for body copy. Sky and slate are safe as decorative fills and large headings, not as text backgrounds.
- The safe text pairings are navy on white, beige, grey, lime, teal, or pear; and white on navy.

### B. Spacing

4pt base. `xs:4  sm:8  md:12  base:16  lg:20  xl:24  2xl:32  3xl:40  4xl:48  5xl:64`. Screen gutter `base`. Section gap `2xl`. No arbitrary values outside `src/design/`; ESLint enforces it.

### C. Typography

Provisional until reconciled against Figma at the end of Phase 2. Sizes in pt, scaling with Dynamic Type.

| Variant | Size / line height | Use |
|---|---|---|
| `display` | 34 / 40 | Onboarding, passport count |
| `title1` | 28 / 34 | Screen titles |
| `title2` | 22 / 28 | Section headers |
| `headline` | 17 / 22 semibold | Card titles, rows |
| `body` | 17 / 24 | Body copy, transcripts |
| `subhead` | 15 / 20 | Secondary rows |
| `footnote` | 13 / 18 | Metadata, durations |
| `caption` | 12 / 16 | Photo credits |

Radii: `4 / 8 / 12 / 16 / pill`.

### D. Test strategy summary

| Layer | Tool | Covers |
|---|---|---|
| Unit | Jest | geo math, stamp state machine, migrations, selectors, feed parsing, URL resolution |
| Component | RNTL | every component's states, a11y roles/labels, screen composition |
| Contrast | Jest | every declared token pair meets its WCAG target |
| E2E | Maestro | onboarding, skip-intro, listen+playback, stamp claim, explore, passport, connect-offline |
| Manual | Checklist | audio matrix, VoiceOver/TalkBack, upgrade, on-site GPS |

CI runs typecheck, lint, content validation, unit, and component tests on every push.

Maestro is the exception to "on every push." The stack requires a **custom dev client** — MMKV, `react-native-maps`, and the background-audio config plugins all rule out running these flows against Expo Go — so each CI Maestro run needs a built artifact on a macOS runner, not `expo start`. That is a materially larger and slower pipeline than the unit and component tiers. Run Maestro on a schedule and before each release rather than per-push, and budget for the build time when Phase 1 wires CI up.

---

## Open questions

1. **Shop** — external storefront link, or something in-app? Plan assumes external browser link with no payment handling.
2. **Settings/credits/legal** — the five-tab structure has no home for them. Suggested: header button on Connect.
3. **Historic figures and location** — confirmed biographical-only. Must be re-confirmed before Phase 5 if any figure is actually a statue or memorial with a location.
4. **Spanish localization for v1?** — **Blocks Phase 3.** This is the one open question with a hard deadline, because the answer sets the catalog schema shape and the CDN audio path convention, and both harden as soon as content authoring starts. See the gate in Phase 3.
5. **How many parks in v1?** — carried over from the overview. Affects passport completion design, initial map region, and content authoring volume.
6. **Must every park have a guide?** — the overview describes parks as carrying audio guides, but nothing enforces it. Either `validate:content` requires at least one guide per park, or the Phase 5 park detail page needs a no-guides empty state. Cheap either way; just needs picking before Phase 5.
