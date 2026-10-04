# Suniye landing verification — October 4, 2026

This is a local static page on `improve/suniye-landing-20261004`, based on `a569d74`. Only `landing/` changes. No Android or backend code changes, package install, paid request, cloud runtime, publication or release execution occurred. The final exact commit is recorded in the accompanying workspace receipt after committing these files.

## Executed evidence

- First complete static build: 281,251 bytes, 561 ms; manifest `evidence/build-first.json`.
- Earlier complete static build after the single fix batch (before the release-copy correction below): **282,110 bytes, 546 ms**; manifest `evidence/build-final.json`. Command: `node landing/build.mjs`. This validates shipped local references, anchors, unique IDs, Hindi/viewport metadata, script syntax and the 350,000-byte package budget. It is a dependency-free copy build, not an Android build or performance benchmark. Manifest metadata is additional to the reported payload bytes.
- First browser batch: **11 passed, 3 failed**, 42,069 ms. Its unchanged receipt is `evidence/browser-first.json`. Failures: skip link did not focus main; enlarged text overflowed by 100px at 390px; aborted local audio kept controls pending. All three were addressed together: focusable main, rem-based text/bounded amount, captured source errors and an eight-second loading recovery. Pending Stop also invalidates stale playback.
- Sole confirmation browser batch: **16 passed, 1 failed**, 224,229 ms; unchanged receipt `evidence/browser-confirmation.json`. The three initial findings passed: keyboard focus, 200% text at 390px (body 34px, page width 390px), and controlled audio failure. Pending-load Stop and mobile playback/Stop passed. The desktop Play → Slow → Stop → Repeat sequence timed out after Stop became disabled. No further full-page/self-design pass was run. The parent later explicitly authorized the narrow functional diagnostic below.
- `ffprobe -v error -show_entries format=duration -of json landing/assets/raju-bill-sample.mp3` reports **7.760 seconds**. Source enables Stop before play, clears the loading timer after play resolves, and disables Stop only in the common clear operation, invoked by end/error/pagehide/hidden visibility/user Stop. The harness makes several browser round trips while a short clip plays. Natural completion is a possible timing race, **unproven** because currentTime/duration/ended/visibility/status were not captured at the failing click. This broad sequence remains failed, not an all-pass result or a proven environment-only failure. The subsequently authorized targeted diagnostic below verifies current control behavior without identifying the old timeout cause. Initial desktop playback passed; final normal console contains no errors/warnings.
- Final desktop/mobile full-page and first-viewport captures were inspected once. No visible overlap, blank content or clipped reading layout at normal tested widths. Parent reported the fresh reviewer found no visual or artifact-truth blocker; the reviewer initially left the desktop audio sequence unresolved; diagnostic evidence was then sent for fresh review. There is no blanket accessibility or interaction approval.
- Source MP3 and both native screenshots compare byte-for-byte with the supplied originals. The final manifest records each SHA-256.

The browser runner is `suniye-landing-browser-qa.cjs` in the task workspace. It uses the already-installed Playwright and Chromium, allows only `http://127.0.0.1:3074` and blocks all external requests. It checks 1440×1000 desktop and 390×844 mobile, existing local media state, keyboard, reduced motion, 200% root text, JavaScript-disabled fallback, and controlled local media failure/delay. Measured browser elapsed time is the whole test batch, not page-load latency or physical-device speed. Playback-state checks do not judge listening comfort.

The static server is session 39527, port 3074. The first browser runner is session 40923 and the confirmation runner is session 90668; all remain running by explicit user instruction. The first output-directory alias was corrected to the real build, then its served mirror refreshed with the final build without restarting any process. The separate final build directory remains `landing/build/2026-10-04T16-08-36-972Z`; original and final manifests are preserved. No process was stopped and no file was deleted.

## Rubric to evidence

These criteria map the delegated brief to inspectable evidence; they are not a claim of an official judging score.

| Criterion | State | Evidence / boundary |
| --- | --- | --- |
| Unmistakable parent benefit and warm Hindi | Passed: implementation and visual inspection | Hindi heading, short source/speech demonstration, family setup and real screen. `index.html`, `SURFACE.md`; no invented testimonial. |
| Genuine native media and useful download | Passed: source provenance and static links | Two unchanged emulator captures, existing synthetic Raju MP3, recorded video and current public 0.3 APK link; historical 0.2 remains in the ledger. Public release metadata/version text read; APK not fetched. |
| Honest speech/model and version claims | Passed: source/copy review | Raju is speech; Gemma explanation separate and hosted model unconfigured. Current public 0.3, historical 0.2 and selected cloud-emulator 0.1 are distinguished; 160% internal assertions and blocked full walkthrough remain explicit. No family or new Appetize result claimed. |
| Mobile layout and large targets | Passed in both browser batches | 390px normal view, no small measured primary/nav targets; native ledger scroll container. Enlarged text first failed; final 200% body and page width passed. |
| Keyboard and enlarged text | Passed confirmation; first failures preserved | Skip focus and 200% text now pass; first findings preserved. |
| Existing recorded audio | Passed targeted controls; broad failed sequence retained | User-triggered Play/Slow 0.85/Stop/Repeat, local MP3 only; no microphone or new TTS. Failure recovery and pending Stop pass; targeted desktop Slow/Stop, Repeat and natural completion now pass; the broad sequential timeout cause remains unproven. |
| Reduced motion and JavaScript-off content | Passed confirmation | Native audio fallback, source/setup/download remain static; CSS removes transitions/smooth scrolling for reduced motion. |
| Readable palette | Passed: five measured pairs | First ratios 12.91, 6.25, 7.41, 5.72, 8.40 (text minimum 4.5). These measurements do not certify the full page. |
| Lightweight page and no live providers | Passed: build/browser scope | Pre-correction 282,110-byte payload; updated payload below; local font/media; no API routes, uploads, remote font requests, autoplay or external request in both batches. |
| Independent finish review | Passed visual/artifact review; interaction limitation retained | Parent relayed fresh reviewer: no visual or artifact-truth blocker; the preserved broad timeout is distinguished from targeted passing state evidence; the new diagnostic was sent for review. |
| Screen reader / physical Redmi / parent comfort / ASR | Not run | Requires separate actual device/assistive-technology/family checks. |
| Public deployment / APK runtime or binary scan / live model | Not run | Local site only; no paid provider, Android execution, release fetch or publication. |

## Captures and QA before the latest release-copy correction

Screenshots are workspace artifacts outside the repository. These captures and functional checks were taken before the latest factual version-copy correction; they do not show or validate the corrected 0.3 ledger. Layout, player code and assets did not change in that correction:

- `suniye-landing-desktop-viewport-confirmation-2026-10-04.png` — 1440×1000 first viewport.
- `suniye-landing-mobile-viewport-confirmation-2026-10-04.png` — 390×844 first viewport.
- `suniye-landing-desktop-confirmation-2026-10-04.png` — full desktop page.
- `suniye-landing-mobile-confirmation-2026-10-04.png` — full mobile page.

| Required QA check | Final state | Evidence |
| --- | --- | --- |
| Identity / meaningful content / no framework overlay | Passed desktop/mobile | Correct loopback URL/title; real Hindi main; no framework overlay nodes; captures visually inspected. |
| Console health | Passed normal flow | No uncaught errors; normal desktop/mobile console empty. One ERR_FAILED is expected from the deliberately aborted local MP3. |
| Screenshot evidence | Passed bounded inspection | Four final captures; actual native images decode at 720px natural width. |
| Interaction proof | Passed targeted behavior; broad failure retained | Keyboard, disclosure, mobile Play/Stop, pending Stop, audio failure pass. Targeted active desktop Slow/Stop and natural completion pass; broad full audio sequence failed as preserved above. |

Browser plugin was not available in the session; already-installed local Playwright/Chromium was used under explicit local-validation authorization. The full Frontend Testing and Debugging skill (`skill://plugins~Plugin_d0e159446ee48191b94ce1960780cc3c/frontend-testing-debugging/SKILL.md`) was read before the confirmation batch. The single full confirmation limit was reached. The parent then explicitly authorized the targeted diagnostic below for the newly unresolved functional check; it used no UI edits or full-page rerun.

## Separately authorized recorded-audio diagnostic

`evidence/audio-diagnostic.json` preserves the separate **3 passed, 0 failed** diagnostic (17,799 ms), performed after the parent explicitly authorized targeted functional investigation. It does not overwrite the broad 16/1 receipt. Runner and log are workspace `suniye-audio-diagnostic-2026-10-04.cjs` and `.log`; browser session 75487 remains running.

A real Play tap starts the actual local MP3. A prearmed page-local observer waits for resolved active playback and runs the real Slow and Stop handlers together, removing protocol delay during the 7.76-second clip. Before: currentTime 0.009182, duration 7.76, ended false, paused false, visibility visible, Stop enabled, Hindi playing status. Slow changes playbackRate to 0.85. Stop pauses, resets currentTime to 0, disables Stop and enables Repeat with Hindi stopped status.

A subsequent real Repeat tap plays at normal speed through actual completion. A capture listener records the natural ended event before the application resets it: currentTime 7.76, duration 7.76, ended true, visible. Afterward: paused true, currentTime 0, Stop disabled, Repeat enabled, Hindi completion status. Only local GETs occurred; no app/console errors. This proves the current active-control and natural-end behavior under the diagnostic method. The cause of the older disabled-Stop click timeout remains unproven because its actual state was not captured.

## Latest public-release artifact correction

The parent supplied a newer DEV checkpoint edited at 2026-10-04T15:37:57Z. Read-only GitHub release metadata confirms `parent-ux-2026-10-04` was published at 15:36:48Z, draft false/prerelease false, targeting `b2dc5e0bea7d9167d1396ab23df3893339712ccc`. Its tag's actual Gradle source declares versionCode 3 and versionName `0.3.0-parent-ux`. Current CTA: `https://github.com/himanshu748/suniye/releases/download/parent-ux-2026-10-04/suniye-parent-ux.apk`.

The published APK is **53,618,122 bytes**, metadata digest `sha256:39d5484833272ead0147788823ee7c0e8790ed1454555b48f721e807c1d2cdfd`. This is public asset metadata, not a new downloaded-file hash or APK scan; it must not be conflated with earlier local 0.3 binaries. Metadata is preserved in `evidence/parent-ux-release-metadata.json`.

The current ledger retains older 0.2 and 0.1 separately. It attributes 160% internal layout/audio assertions to the release and states that a System UI overlay and emulator crashes blocked the full touch walkthrough. No clean emulator/parent/Redmi success is implied. No latest public Android/backend implementation was edited; the isolated branch remains based on a569d74 and its patch contains landing files only.

This correction changes copy/hrefs/documentation only. A new full static build and source assertions are recorded in `evidence/build-release-correction.json` and `evidence/release-copy-assertions.json`; no further broad browser or design pass was run. Earlier screenshots and 16/1 + targeted 3/0 functional evidence remain historical to the pre-correction copy. HTML/CSS/player assets were not redesigned, and the player code/style/media hashes remain unchanged.

## Asset provenance

`README.md` lists the exact supplied originals. `evidence/build-final.json` contains shipped hashes. `assets/mark.svg` is authored simple vector geometry. Latin Manrope came from the existing installed font package and ships with its SIL OFL license. Hindi uses the native fallback stack approved by the parent brief; no font download. `assets/sample-photo.png` is an existing copied synthetic source artifact, unused by the page and excluded from the static build; it is retained because the user forbids file deletion. No generated raster, asset retouching or image-generation spend.

## Impeccable skill record

Read `skill://plugins_6a5028ae047081918e3dfde753112690/impeccable/SKILL.md`, complete `reference/new-work.md` and `reference/craft-floor.md`, plus `reference/init.md`, `reference/document.md` and `reference/degraded/documenter.md`. The local `.codex/skills/impeccable/scripts/impeccable` context/concept launcher is absent; its single attempted context load failed. It was not retried and no seed key was invented. Automated finish tooling was unavailable, so the record uses direct files, actual browser captures and the separately assigned fresh reviewer.

Direct grounding: repository README, `outputs/suniye/README.md`, task-workspace `suniye-revised-dev-article-2026-10-04.md`, existing native captures, the dated Raju generation receipt, and supplied release/cloud/caregiver evidence. No AGENTS or incumbent landing PRODUCT/DESIGN was found. `PRODUCT.md` records durable truth; `SURFACE.md` holds the chosen direction. `DESIGN.md` was authored provisionally in this task and refreshed with observed tokens; `.impeccable/design.json` records only extension data and actual component snippets. Existing native identity, the fully specified delegated brief, and the no-install/no-spend constraints supplied visual authority. Image comps, a font download and provider calls were not used. Whole-workflow automated approval and independent review are not claimed.

The finish detector's unavailable status is not a clean verdict. Initial defects are preserved above; the final confirmation and relayed parent review are recorded with the unresolved sequence above.

Corrected current release-copy build: **282,761 bytes in 191 ms**; **10 static/source assertions passed, 0 failed**. Initial edit encoding failure and mismatched CTA assertion were caught and preserved in workspace first-attempt evidence; that build did not contain corrected copy. This completed build/source check supersedes it. No further browser pass.
