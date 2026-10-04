# Suniye landing verification — October 4, 2026

This is a local static page on `improve/suniye-landing-20261004`, based on `a569d74`. Only `landing/` changes. No Android or backend code changes, package install, paid request, cloud runtime, publication or release execution occurred. The final exact commit is recorded in the accompanying workspace receipt after committing these files.

## Executed evidence

- First complete static build: 281,251 bytes, 561 ms; manifest `evidence/build-first.json`.
- Final complete static build after the single fix batch: **282,110 bytes, 546 ms**; manifest `evidence/build-final.json`. Command: `node landing/build.mjs`. This validates shipped local references, anchors, unique IDs, Hindi/viewport metadata, script syntax and the 350,000-byte package budget. It is a dependency-free copy build, not an Android build or performance benchmark. Manifest metadata is additional to the reported payload bytes.
- First browser batch: **11 passed, 3 failed**, 42,069 ms. Its unchanged receipt is `evidence/browser-first.json`. Failures: skip link did not focus main; enlarged text overflowed by 100px at 390px; aborted local audio kept controls pending. All three were addressed together: focusable main, rem-based text/bounded amount, captured source errors and an eight-second loading recovery. Pending Stop also invalidates stale playback.
- Sole confirmation browser batch: **16 passed, 1 failed**, 224,229 ms; unchanged receipt `evidence/browser-confirmation.json`. The three initial findings passed: keyboard focus, 200% text at 390px (body 34px, page width 390px), and controlled audio failure. Pending-load Stop and mobile playback/Stop passed. The desktop Play → Slow → Stop → Repeat sequence timed out after Stop became disabled. No further self-check was run.
- `ffprobe -v error -show_entries format=duration -of json landing/assets/raju-bill-sample.mp3` reports **7.760 seconds**. Source enables Stop before play, clears the loading timer after play resolves, and disables Stop only in the common clear operation, invoked by end/error/pagehide/hidden visibility/user Stop. The harness makes several browser round trips while a short clip plays. Natural completion is a possible timing race, **unproven** because currentTime/duration/ended/visibility/status were not captured at the failing click. This remains an unresolved verification sequence, not an all-pass result or a proven environment-only failure. Initial desktop playback passed; final normal console contains no errors/warnings.
- Final desktop/mobile full-page and first-viewport captures were inspected once. No visible overlap, blank content or clipped reading layout at normal tested widths. Parent reported the fresh reviewer found no visual or artifact-truth blocker; the reviewer also left the desktop audio sequence unresolved. There is no blanket accessibility or interaction approval.
- Source MP3 and both native screenshots compare byte-for-byte with the supplied originals. The final manifest records each SHA-256.

The browser runner is `suniye-landing-browser-qa.cjs` in the task workspace. It uses the already-installed Playwright and Chromium, allows only `http://127.0.0.1:3074` and blocks all external requests. It checks 1440×1000 desktop and 390×844 mobile, existing local media state, keyboard, reduced motion, 200% root text, JavaScript-disabled fallback, and controlled local media failure/delay. Measured browser elapsed time is the whole test batch, not page-load latency or physical-device speed. Playback-state checks do not judge listening comfort.

The static server is session 39527, port 3074. The first browser runner is session 40923 and the confirmation runner is session 90668; all remain running by explicit user instruction. The first output-directory alias was corrected to the real build, then its served mirror refreshed with the final build without restarting any process. The separate final build directory remains `landing/build/2026-10-04T16-08-36-972Z`; original and final manifests are preserved. No process was stopped and no file was deleted.

## Rubric to evidence

These criteria map the delegated brief to inspectable evidence; they are not a claim of an official judging score.

| Criterion | State | Evidence / boundary |
| --- | --- | --- |
| Unmistakable parent benefit and warm Hindi | Passed: implementation and visual inspection | Hindi heading, short source/speech demonstration, family setup and real screen. `index.html`, `SURFACE.md`; no invented testimonial. |
| Genuine native media and useful download | Passed: source provenance and static links | Two unchanged emulator captures, existing synthetic Raju MP3, recorded video and public 0.2 APK link. No external link fetched. |
| Honest speech/model and version claims | Passed: source/copy review | Raju is speech; Gemma explanation separate and hosted model unconfigured. Public 0.2, selected cloud-emulator 0.1 and local-only 0.3 are distinguished. No family or new Appetize result claimed. |
| Mobile layout and large targets | Passed in both browser batches | 390px normal view, no small measured primary/nav targets; native ledger scroll container. Enlarged text first failed; final 200% body and page width passed. |
| Keyboard and enlarged text | Passed confirmation; first failures preserved | Skip focus and 200% text now pass; first findings preserved. |
| Existing recorded audio | Mixed: mobile/recovery pass; desktop sequence failed | User-triggered Play/Slow 0.85/Stop/Repeat, local MP3 only; no microphone or new TTS. Failure recovery and pending Stop pass; desktop sequential Stop check remains unresolved. |
| Reduced motion and JavaScript-off content | Passed confirmation | Native audio fallback, source/setup/download remain static; CSS removes transitions/smooth scrolling for reduced motion. |
| Readable palette | Passed: five measured pairs | First ratios 12.91, 6.25, 7.41, 5.72, 8.40 (text minimum 4.5). These measurements do not certify the full page. |
| Lightweight page and no live providers | Passed: build/browser scope | 282,110-byte payload; local font/media; no API routes, uploads, remote font requests, autoplay or external request in both batches. |
| Independent finish review | Passed visual/artifact review; interaction limitation retained | Parent relayed fresh reviewer: no visual or artifact-truth blocker; failed desktop sequence remains unresolved. |
| Screen reader / physical Redmi / parent comfort / ASR | Not run | Requires separate actual device/assistive-technology/family checks. |
| Public deployment / APK runtime or binary scan / live model | Not run | Local site only; no paid provider, Android execution, release fetch or publication. |

## Final captures and QA check map

Screenshots are workspace artifacts outside the repository:

- `suniye-landing-desktop-viewport-confirmation-2026-10-04.png` — 1440×1000 first viewport.
- `suniye-landing-mobile-viewport-confirmation-2026-10-04.png` — 390×844 first viewport.
- `suniye-landing-desktop-confirmation-2026-10-04.png` — full desktop page.
- `suniye-landing-mobile-confirmation-2026-10-04.png` — full mobile page.

| Required QA check | Final state | Evidence |
| --- | --- | --- |
| Identity / meaningful content / no framework overlay | Passed desktop/mobile | Correct loopback URL/title; real Hindi main; no framework overlay nodes; captures visually inspected. |
| Console health | Passed normal flow | No uncaught errors; normal desktop/mobile console empty. One ERR_FAILED is expected from the deliberately aborted local MP3. |
| Screenshot evidence | Passed bounded inspection | Four final captures; actual native images decode at 720px natural width. |
| Interaction proof | Mixed | Keyboard, disclosure, mobile Play/Stop, pending Stop, audio failure pass. Desktop full audio sequence fails as preserved above. |

Browser plugin was not available in the session; already-installed local Playwright/Chromium was used under explicit local-validation authorization. The full Frontend Testing and Debugging skill (`skill://plugins~Plugin_d0e159446ee48191b94ce1960780cc3c/frontend-testing-debugging/SKILL.md`) was read before the confirmation batch. A future optional diagnostic should record currentTime/duration/ended/visibility/status at each audio state, then perform Slow and Stop together while the clip is active. It was not run: the one-confirmation limit was reached.

## Asset provenance

`README.md` lists the exact supplied originals. `evidence/build-final.json` contains shipped hashes. `assets/mark.svg` is authored simple vector geometry. Latin Manrope came from the existing installed font package and ships with its SIL OFL license. Hindi uses the native fallback stack approved by the parent brief; no font download. `assets/sample-photo.png` is an existing copied synthetic source artifact, unused by the page and excluded from the static build; it is retained because the user forbids file deletion. No generated raster, asset retouching or image-generation spend.

## Impeccable skill record

Read `skill://plugins_6a5028ae047081918e3dfde753112690/impeccable/SKILL.md`, complete `reference/new-work.md` and `reference/craft-floor.md`, plus `reference/init.md`, `reference/document.md` and `reference/degraded/documenter.md`. The local `.codex/skills/impeccable/scripts/impeccable` context/concept launcher is absent; its single attempted context load failed. It was not retried and no seed key was invented. Automated finish tooling was unavailable, so the record uses direct files, actual browser captures and the separately assigned fresh reviewer.

Direct grounding: repository README, `outputs/suniye/README.md`, task-workspace `suniye-revised-dev-article-2026-10-04.md`, existing native captures, the dated Raju generation receipt, and supplied release/cloud/caregiver evidence. No AGENTS or incumbent landing PRODUCT/DESIGN was found. `PRODUCT.md` records durable truth; `SURFACE.md` holds the chosen direction. `DESIGN.md` was authored provisionally in this task and refreshed with observed tokens; `.impeccable/design.json` records only extension data and actual component snippets. Existing native identity, the fully specified delegated brief, and the no-install/no-spend constraints supplied visual authority. Image comps, a font download and provider calls were not used. Whole-workflow automated approval and independent review are not claimed.

The finish detector's unavailable status is not a clean verdict. Initial defects are preserved above; the final confirmation and relayed parent review are recorded with the unresolved sequence above.
