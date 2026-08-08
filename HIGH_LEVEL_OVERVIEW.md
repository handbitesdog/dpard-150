# Dallas Parks & Rec App — High-Level Overview

## Context

The Dallas Parks and Recreation department wants a cross-platform mobile app that turns visiting city parks into a collectible experience. Users browse a catalog of parks and the historic figures behind them, physically visit a park to earn a digital stamp (verified by phone GPS), and listen to guided audio while they're there.

Throughout this document, a **guide** means one recorded audio piece about a park. The app has no other sense of "tour."

The guiding constraint is **no backend and no accounts**. All user state — stamps earned, guide progress, downloaded audio — lives on the device. This keeps the project cheap to run, sidesteps the privacy and compliance burden of storing location history for a government entity, and means the app works in a park with weak signal. The only remote dependency is a static file host, serving guide audio and the curated Connect feed — no API, no database, nothing that needs operating.

This is a high-level architecture document — it settles *why*. Screen structure, build phasing, and the component and test plan live in `IMPLEMENTATION.md`, which settles *what gets built*. Visual design is supplied separately as Figma screens. Where this document and the implementation plan disagree, the implementation plan is newer and wins.

## Product Scope (v1)

Four pillars:

1. **Learn** — browse a catalog of Dallas parks and the historic figures connected to the city; each park has photos, description, amenities, hours, and a map location.
2. **Collect** — visit a park in person, tap "Collect Stamp," and the app confirms via GPS that you're actually there. Stamps accumulate into a passport/collection view.
3. **Listen** — a park may carry one or more audio guides, streamed by default with an option to download for offline playback.
4. **Connect** — links out to the department's social channels and shop, plus a curated showcase of community posts shared under the department's hashtag.

Explicitly **out of scope for v1**: user accounts, cloud sync, user-generated content, push notifications, event calendars, facility reservations, in-app commerce, and analytics or crash reporting.

That last one is a decision rather than an oversight: shipping no telemetry keeps the privacy disclosure to a plain "this app collects no data," which is worth a great deal for a government app. The cost is real and worth stating — there will be no data on stamp-claim failures, which the risk table below identifies as the likeliest source of user-reported bugs. Field testing has to carry that weight instead.

The Connect pillar is **read-only and editorially curated**. The app never posts, never authenticates against a social platform, and never accepts user submissions — a curator hand-picks posts and publishes them as a static file. That distinction is what keeps a social feature compatible with the no-backend constraint, and it is the line to hold if the feature grows.

## Technical Decisions

| Decision | Choice | Rationale |
|---|---|---|
| **Framework** | Expo SDK with a custom dev client (EAS Build) | `expo-location`, `expo-audio`, and `expo-file-system` cover every native need here. EAS Build removes local Xcode/Gradle setup, and OTA updates let content fixes ship without app-store review. Native modules remain available via config plugins if needed later. |
| **Catalog data** | Static JSON bundled in the app | Fully offline, zero infra, versioned in the repo alongside code. Adding a park, guide, or figure means an app or OTA update — acceptable given the catalog changes rarely. |
| **Audio guides** | Stream from a CDN, with per-guide offline download | A 10-minute guide is roughly 10MB; bundling dozens of them would make the binary unacceptably large. Streaming keeps the app small, and the download option covers the real problem of weak cell coverage inside large parks. |
| **Connect feed** | Remote JSON on the same static host, cached to disk | The one piece of content that changes on a social-media cadence rather than an app-release cadence, so a curator has to be able to update it without a developer. Reuses the host the audio already needs; caching means the tab still works offline. |
| **Stamp collection** | Foreground check-in against a per-park geofence radius | The user opens the app at the park and taps to collect; the app verifies they're inside the radius. Avoids "Always" location permission, background tasks, and the extra app-store justification that automatic geofencing requires. |

## Architecture

### Data Layer

**Content catalog** — bundled JSON, typed and validated at build time, split across three entities.

*Parks* (`parks.json`) — the primary entity, and the only one that carries a location or a stamp:

- Identity: stable `id`, name, neighborhood
- Content: description, amenities, hours, credited photo references
- Location: latitude/longitude, plus a `stampRadiusMeters` tuned per park (a pocket park needs a tighter radius than a 300-acre one)
- Stamp: artwork reference and label

*Audio guides* (`guides.json`) — each guide belongs to exactly one park, and a park may have several. Carries title, narrator, duration, a host-independent audio path, a required transcript, and optional chapter markers. Guides are modeled separately from the park record rather than nested inside it because the Listen tab is a flat, searchable view across every park's guides; nesting would mean flattening on every render.

*Historic figures* (`figures.json`) — biographical content only: name, lifespan, portrait, biography, and references to related parks. Figures deliberately have **no coordinates, no stamp, and no audio**. They are people the app tells you about, not places it sends you to. This is the one asymmetry in the content model worth remembering, because it means the shared detail screen has to treat location as optional.

Park and figure images ship as bundled assets so the catalog renders instantly with no network.

**User state** — persisted locally, one store per concern:

- Stamps: `{ parkId, collectedAt, coordinates }` per earned stamp
- Guide progress: last playback position per guide, completion flags
- Downloads: which guides are cached on disk, with file paths
- Preferences: onboarding completion, permission prompt history
- Connect feed: the last successfully fetched feed, cached so the tab renders offline

Use a small persisted state library — settled as Zustand over MMKV — rather than raw AsyncStorage calls scattered through components. Downloaded audio files go to the filesystem, not the key-value store; only their paths are persisted.

Because all state is local and unrecoverable, the schema needs a version field and a migration path from day one. A user who has collected forty stamps must not lose them to an app update.

### Location & Stamp Verification

A single `stampService` owns the entire collect flow so the logic is testable in one place and background geofencing can be swapped in later without touching UI:

1. Check whether a stamp for this park already exists (idempotent — no duplicate stamps).
2. Request foreground location permission, handling the denied and "ask again" cases with a clear explanation of why the app needs it.
3. Take a location reading with a required accuracy threshold; retry or surface a "waiting for a better GPS fix" state rather than failing outright.
4. Compute distance to the park centroid and compare against that park's `stampRadiusMeters`.
5. On success, persist the stamp and hand off to a celebration UI. On failure, tell the user how far away they are, not just "denied."

Two realities to design around: GPS accuracy degrades badly under tree cover, which is exactly where users will be standing; and the radius should be generous enough that standing at a park entrance counts. Err toward letting a legitimate visitor collect.

Since this is a government-branded app, spoofing deserves a brief note: basic mitigations (rejecting mock-location readings on Android, requiring a plausible accuracy value) are cheap and worth including. Anything stronger is not worth the complexity for a rewards program with no prizes attached.

### Audio Playback

Built on `expo-audio`, wrapped in a playback service that owns a single global player instance:

- **Streaming by default**, with buffering and network-failure states surfaced in the UI
- **Download for offline** — per-guide, with visible progress, cancel, and delete; the player resolves a local file when one exists and falls back to the stream when it doesn't
- **Background audio** — playback must continue when the phone is locked or the app is backgrounded (users will pocket their phone and walk). This requires the iOS background audio mode and an Android foreground service, both configured via Expo config plugins.
- **Lock-screen controls** and now-playing metadata
- **Resume position** persisted per guide
- **Transcripts** for every guide — an accessibility requirement for a public-sector app, and useful to anyone without headphones

A persistent mini-player above the tab bar lets users navigate the app while a guide plays.

### Navigation & Screens

Expo Router (file-based). A one-time onboarding sequence — a welcome screen and four explanatory slides — precedes a five-tab app:

| Tab | Holds |
|---|---|
| **Discover** | Curated carousels of parks and historic figures, plus showcases for audio guides and the shop |
| **Listen** | Every audio guide, searchable, streamable or downloadable |
| **Explore** | Map of parks with pins, searchable |
| **Passport** | Stamp count, completion badge, and the full stamp collection |
| **Connect** | Social links, shop, and the curated post showcase |

Park and figure detail screens sit outside the tab group and share a layout, with location optional. The park detail screen is where the stamp button and that park's guides both live — it is the hinge between the Collect and Listen pillars. A persistent mini-player sits above the tab bar so a guide keeps playing while the user navigates.

Settings, credits, and legal notices have no tab of their own under this structure and still need a home; see the open questions in `IMPLEMENTATION.md`.

## Infrastructure

The only server-side dependency is **a static file host** — S3 + CloudFront, or any CDN. No API, no database, no auth. It serves two things:

1. **Audio guides**, encoded consistently (AAC/m4a, mono, modest bitrate — speech doesn't need music-grade quality) and served with long cache headers and range-request support so seeking works while streaming.
2. **The Connect feed** — a `feed.json` plus post images, uploaded by a curator, with a short cache lifetime so edits appear quickly.

This is the one place the project isn't truly backend-free, and it has been accepted as a deliberate compromise: bundling every guide would make the app binary unacceptably large, and the Connect feed changes far too often to ship through app releases. The requirement stays deliberately minimal — a dumb file host, nothing that needs to be operated or monitored.

Since audio paths are baked into the bundled catalog, the host should be chosen before the catalog is finalized; a stable path convention (for example `/guides/{guideId}.m4a`) keeps the data files insulated from a later host change. The feed is fetched at a fixed well-known path and cached to disk, so a host outage degrades to yesterday's posts rather than an empty tab.

## Content

All content — park descriptions, photos, figure biographies, recorded guide audio, and transcripts — is authored and supplied manually by the project owner. The Connect feed is likewise hand-curated, just published to the CDN rather than bundled.

This has a direct implementation consequence: the catalog files are hand-edited documents, not machine-generated input. Keep the schemas readable and commented, validate them at build time so a malformed entry fails loudly instead of crashing the app at runtime, and avoid tooling that assumes generated data. Cross-references between the three files — a guide naming its park, a figure naming related parks — are the most likely thing to be typed wrong, so validation has to check them, not just each file in isolation.

## Accessibility & Compliance

A City of Dallas app will be held to public-sector accessibility standards. Building this in from the start is far cheaper than retrofitting:

- Screen reader labels on all interactive elements, especially the stamp button
- Alt text on every catalog image — park photos and figure portraits alike. This is a required schema field enforced by content validation, not something left to an author's memory.
- Full support for Dynamic Type / large font scales
- Transcripts for every audio guide
- No information conveyed by color alone — a collected stamp needs a non-color indicator too
- A map is not meaningfully navigable by screen reader, so the Explore tab needs an equivalent list view. This is a structural requirement, not a refinement.
- **Sufficient color contrast.** The supplied palette has been measured against WCAG and does not currently clear it: white text fails AA on every color in the palette, and navy on sky or slate falls just short for body copy. The measured table and its consequences are in `IMPLEMENTATION.md`, Appendix A. This is an open issue with the design, tracked in the risk table below.

Spanish localization is very likely to be requested for a Dallas civic app. v1 doesn't need translated content, but strings should be externalized and the catalog schemas should allow per-language description, biography, and audio fields so localization isn't a rewrite.

The timing on this is not flexible. Per-language audio changes the CDN path convention described above, and every screen that renders a description or biography reads the shape the schema commits to — so deciding late means re-authoring the catalog *and* touching all five tabs, which is exactly the rewrite this paragraph exists to prevent. It is therefore a gate on Phase 3 in `IMPLEMENTATION.md`, settled before content authoring begins, not a late-stage audit.

## Risks

| Risk | Mitigation |
|---|---|
| GPS accuracy under tree canopy blocks legitimate check-ins | Generous per-park radii, accuracy thresholds with retry, clear "move closer / waiting for signal" feedback |
| Local-only data means a lost phone loses all stamps | Set expectations in onboarding; consider an export/share-your-passport feature post-v1 |
| Local schema migrations done wrong wipe user progress | Versioned schema and migration tests from the first release |
| Weak connectivity in parks breaks streaming | Prominent offline-download affordance, surfaced *before* the user leaves home |
| Audio host not yet chosen | Use a stable path convention so the bundled data survives a host change |
| Supplied palette fails WCAG contrast, and a public-sector app will be held to it | Measured and documented; needs a designer decision before page-building starts. Enforced afterward by an automated contrast test over the theme tokens. |
| Curated Connect feed is unmoderated once published | Posts are hand-picked by a curator before upload, so the app never renders anything a person hasn't approved. No user-submitted path exists to abuse. |

## Open Questions

Architecture-level questions, not blocking, but worth settling early. Implementation-level questions are tracked separately under "Open questions" in `IMPLEMENTATION.md`.

- How many parks are in scope for v1?
- Are there rewards or recognition tied to collecting stamps, or is the collection itself the reward?
- Is Spanish localization required for the initial release?

## Verification Strategy

The principles are below; the concrete test layers, tooling, and per-phase exit criteria are in `IMPLEMENTATION.md`, Appendix D.

- **Unit tests** on the pure logic that matters most: distance/geofence calculation against known coordinate pairs, stamp de-duplication, and state schema migrations.
- **Simulated location testing** — both iOS Simulator and Android emulator support setting a custom GPS coordinate. Test the collect flow at the park centroid, just inside the radius, just outside it, and with permission denied.
- **Physical device testing at a real park** is required before release. Simulators cannot reproduce degraded accuracy under tree cover, which is the single most likely source of user-reported bugs.
- **Audio matrix** — verify streaming, download, offline playback with airplane mode on, background playback with the screen locked, and lock-screen controls, on both platforms.
- **Offline runs** — with the network off, confirm the catalog, downloaded guides, the passport, and the cached Connect feed all still render. Offline is the expected condition in a large park, not an edge case.
- **Fresh-install and upgrade runs** — confirm first-launch permission prompts behave, and that an upgrade over a build with existing stamps preserves them.
- **Accessibility pass** with VoiceOver and TalkBack, plus the largest system font size.
