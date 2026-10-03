# Independent Claude audit — October 2, 2026

Reviewer: Claude desktop, Opus 5.5 Extra. Original review retained privately.

The attached `audit-bundle.txt` contained PRD v1 and technical spec v1. The instruction explicitly requested a read-only review. Claude stated that nothing was built or run and that its failure examples were predictions, not test results. This file summarizes the response; it is not a verbatim export.

## Blockers

- B1: Local Ollama plus HTTPS-only release endpoints leaves physical phones without a connection plan. Use adb reverse for USB debug tests; a token-protected temporary HTTPS tunnel can support the family pilot, with its temporary status disclosed.
- B2: Seven sponsors, camera, PDF pager, all tests and the article risk exceeding the weekend. Prioritize working parent flows and actual family feedback; freeze features before submission.
- B3: Enable interactive-window retrieval; choose the top application window by type/package rather than the active root, which may be an overlay or keyboard.
- B4: Declare TTS service visibility and select an installed offline Hindi voice. The manifest declaration was already present in the implementation when the review returned; the offline voice check still needed work.

## High risks and minimum changes

- H1: Android 11–13 display screenshots can include notifications or race overlay hiding. Crop to application bounds, reject intersecting foreign windows, mask the persistent overlay, reject black captures, close HardwareBuffers reliably, handle rate limiting.
- H2: Keep Stop reachable during work and cancel on interruption; define capture invalidation precisely. Ordinary chat content updates should not cancel every reading.
- H3: Repeat needs an entry point from WhatsApp. An unchanged-screen replay cache is suggested. The current implementation instead provides explicit repeat/slow/explain controls through a labeled overlay menu, pending parent testing.
- H4: PDFs open outside WhatsApp. Register ACTION_VIEW for PDF and explain password-protected document errors.
- H5: Read mode preserves the original script and wording; Hindi governs explanations, prompts and descriptions. The model prompt already specifies this, but fixtures are required.
- H6: Check model finish_reason and test small-print/dense pages. Do not present a truncated response as complete. Claude suggested partial speech; this build uses fail-closed retake behavior because invalid/truncated JSON cannot be trusted.
- H7: Verify actual workflow/model/tracing storage behavior before claiming no server archives. Do not configure workflow storage or AI auto-instrumentation. Use a unique non-private test marker to inspect generated logs/data.
- H8: Test actual installation/accessibility enablement on the family's phones; restricted settings, sideload protection and OEM battery policies may interfere. Do not weaken Play Protect automatically.
- H9: Bound client/provider waits, prevent retry storms and verify cancellation with a slow provider and a real model. Existing client timeouts were already explicit; real latency remains to measure.

## Medium risks

Filter UI clutter in text-node reading; avoid uploading whole chats for a thumbnail; verify number pronunciation without changing stored text; check camera lifecycle/orientation/framing; test overlay bounds at large font scales and with keyboard; hide during calls and use media audio focus; exclude device-transfer backups; apply Android 15 insets; set an explicit Fastify base64 body limit (already present at 4.3 MB).

## Reviewer verdict

Claude judged the core implementable after the fixes, with operation generations, fail-closed JSON, no model tools and honest evidence boundaries as strengths. It recommended a staged core build rather than the entire spec. Sponsor cuts are advice, not a user scope change: sponsor modules remain optional and claims require actual integration evidence.

## Required tests that a review cannot replace

Real WhatsApp and protected-media behavior; heads-up notification capture; late-response cancellation; offline Hindi voice/replay; English/mixed-language and number fixtures; font scales 1.3/1.6; Android 15 insets; generated-log marker search; secret scanning; each parent's unassisted start/stop and label capture. These remain pending until verification.md records evidence.

## Claude Code implementation review

Claude desktop's local **Code** view, Opus 5.5 Medium, completed the implementation audit and a follow-up after the project moved to the local project folder. This is distinct from the earlier Claude Chat PRD review. The source inspection was read-only; Claude did not execute the app or backend tests. Its review excluded credentials, logs and development histories.

The first Code pass found configuration changes interrupting reading/PDF loading, generated picture text slipping into descriptions, Hindi number-word changes escaping the explanation check, an audio-focus leak and untyped PDF intents being treated as images. The fixes preserve PDFs in application-owned state, keep reading through ordinary configuration changes, reject suspected picture transcription with a fixed retake prompt, compare conservative explanation anchors, release old audio focus before fallback speech and resolve the incoming MIME type. One MainActivity task now owns the shared document. The phone keeps Stop available during both work and prompts.

The follow-up caught an authentication bypass introduced while moving authorization before body parsing. A raw URL prefix check missed percent-encoded routes. A local synthetic request to `/%761/read` returned 200 without a token; `/v1/read` returned 401. Authorization now checks the matched canonical route. Regression tests cover encoded read and preference endpoints, provider/store isolation, malformed unauthorized bodies and quota protection. No public backend was deployed when this defect was found.

The follow-up also identified missing contractions/prohibitions and quoted-text markers. These checks now reject the known examples. Equivalent digit scripts and common translated units are normalized before comparison. Ordered anchors can still reject faithful rewording and cannot prove semantic equivalence. Suspected text in pictures asks for a closer crop; the deny pattern cannot prove that every accepted description is correct.

Executed verification belongs in [verification.md](verification.md), separately from review conclusions. Real Redmi OCR confidence, audible Hindi, stalled HTTPS uploads and parent usability still require device checks.

The final targeted Code pass closed the known `cannot`, `नही`, `ना` and omitted `बगैर` examples. It reported no remaining P0/P1 in the reviewed changes, while emphasizing that a matching anchor list does not establish a correct explanation. The local backend suite passed 37 checks. This is a scoped source-review conclusion, not a claim that the entire app is defect-free.

Later emulator checks found unused PDF copies surviving process restarts. The implementation now cleans orphaned app-cache copies, retains the active/in-flight file, and removes it on Forget. Repeated synthetic tests passed. Compact headers and a flexible camera preview keep parent actions visible at large fonts. These later UI/cache changes were verified by the Android harness; the final Code verdict above covered the stated source-review scope.

## October 3 input and caregiver review

The same local Claude Code session reviewed the new home input routes, fixed Setup Stop, conditional reading controls, shared-intent handling and source-bound setup-reference workflow. It found a P1: Recents could replay the original share after the Activity had finished. The history-intent guard now prevents that; synthetic instrumentation verified no reading or speech operation started. The review also prompted typed Parcelable handling, plain-text processing before file attachments and visible disabled button states.

A follow-up confirmed those fixes and reported no P0/P1 in that scope. Three P2s were fixed before packaging: malformed text extras could throw while being unpacked, missing SerpApi configuration lost its useful error code, and a generated guide could introduce nonofficial links. Text getters now have a narrowly scoped RuntimeException guard; the model summary rejects links/HTML and official source titles are escaped. Added backend tests exercise missing-key, rejected-source and generated-link cases.

The final source confirmation read MainActivity, Config, PreferencesClient, SetupActivity, UserMessage, providers, setup-guide and setup-guide tests. Claude confirmed the three P2s and the additional caregiver exception privacy fix, reporting no new P0/P1 or regression from those fixes. It noted a P3 plain RuntimeException variant in malformed bundles; the final getter-only guards cover that too. That last catch widening was locally compiled and tested separately. Claude did not execute the app or backend tests.

Source indices validate references to supplied snippets; they cannot prove that the generated claims follow from those snippets. No successful October 3 live guide is claimed. Hindi audibility, Redmi firmware behavior and parent usability remain outside these source reviews.

Android 15 then exposed a behavior difference: an invalid text extra was defused to null rather than throwing. A null/empty text check now preserves the previous reading and announces recovery. The actual malformed-extra fixture passed after the fix. This was an emulator finding after the final source review, not a finding attributed to Claude.

## October 3 entry review

Claude Code reviewed the draft, README, demo receipts and debug recording harness. It found no invented result in the reviewed scope, but publication links remained placeholders. Useful edits made the opt-in online voice explicit, described both currency/date rewording, linked the successful explanation receipt, identified the recorded APK and disclosed time-stretched mixed audio. No new runtime checks are attributed to this review.

Two source concerns were stale: ReaderController.forget already clears the application-owned PDF, and SHA-256 comparisons show MainActivity, ReaderController, Config, PreferencesClient and SetupActivity unchanged from the 06:37 UTC emulator audit through the 08:38 UTC recording. The publication tree preserves outputs/suniye, so the Render rootDir remains correct. The review suggested a concrete family scene; no unobserved family experience was added. Public links must still be resolved and read back before publication.
