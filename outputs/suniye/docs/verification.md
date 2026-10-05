# Current verification, October 5

Backend suite: 107/107 pass after Sonnet fixes and explicit 27B routing. These are offline regressions, distinct from provider checks. `/health` reports deployed 24538b1 and Gemma 3 27B. The signed-in Render dashboard confirmed deployment `dep-db1hisgu01pc73efubk0` Live after the model environment change.

Hosted receipts cover original Raju speech, auth, Atlas write/read, content-field rejection, persistence across deploy/process replacement, exact synthetic cleanup and picture fallback without model spending. Three simultaneous pgvector help topics passed. Sentry hosted ingestion was read in its authenticated dashboard. [Live checks](evidence/hosted-e2e-2026-10-05.json) · [pgvector](evidence/hosted-pgvector-concurrent-2026-10-05.json) · [Sentry](evidence/hosted-sentry-2026-10-05.json).

Provider failures are retained: initial picture path failed; fixed route is now disabled before upload/quota. A later 4B request failed upstream throttling. The hosted 27B weekday output was rejected before speech; the milk sentence returned real Raju warning/audio but added context. [New outcomes](evidence/hosted-gemma-27b-2026-10-05.json) · [Earlier failure](evidence/hosted-route-failure-2026-10-05.json). Eight daily attempts are used; no counters were reset.

[Independent Sonnet 5.5 audit and dispositions](sonnet-audit-disposition-2026-10-05.md) record fixes and unresolved meaning, retention, native error/replay/disclosure, time/unit pronunciation, Atlas expiry, proxy rate-limit and actual-device gates. Current native 0.3 video/touch walkthrough, real WhatsApp/Redmi and parent comprehension remain unverified. Historical videos remain labelled. These checks do not establish a replacement for family help or a prize win.

## Dated verification history

## October 4 ElevenLabs-only build

Version 0.2.0 removes Android and browser speech synthesis. Android 15 emulator checks passed for tagged Raju media, offline cached Repeat/Slow, Stop, missing/foreign/corrupt audio and late-result rejection. Host audio was disabled; these are media-state checks, not a new listening judgment. 89 backend and 11 caregiver tests passed. Fixed prompts and two synthetic PDF clips were generated through the real ElevenLabs API using 363 characters and existing credits. No purchase or upgrade was made. [Native check](evidence/elevenlabs-only-android15-2026-10-04.json) · [Provider receipt](evidence/elevenlabs-only-assets-2026-10-04.json). Provider voice allowlisting rejects foreign voices before a request. An exclusive job claim blocks concurrent caregiver voice generation; the concurrency regression made exactly one fixture call. Legacy screen consent does not enable new ElevenLabs speech until the caregiver saves the updated setup. [Browser checks](evidence/elevenlabs-only-browser-2026-10-04.json). Older checks below describe their dated builds.

# Verification ledger — October 4, 2026

This records executed tests separately from planned acceptance. The app is a debug pilot, not a verified replacement for family help. Earlier sections retain their dated results; the October 4 sponsor connections at the end supersede earlier provider/deployment status.

## October 3 recheck

The family is in another city. No parent feedback or real Redmi/WhatsApp success is inferred from these checks.

- Android 11: photo/PDF picker launch, cancellation and synthetic URI results passed at font scales 1.3 and 1.6. Both selected photo and PDF recognized नमस्ते. First setup and the entire Stop control were visible. System night mode retained the intended palette.
- Recents history intent did not start reading. Malformed stream extras and external file:// URIs were rejected. Camera preview/shutter/Stop, capture return, scrolling with fixed Stop, Setup Stop, PDF recreation/page retention/Forget passed at font scale 1.6.
- Android 15: picker/photo/PDF, first setup, scrolling with fixed Stop, Setup Stop, camera return, PDF recreation/page retention/Forget, history intent and authored-error checks passed at font scale 1.6 with night mode enabled. One delayed HTTP request reached the synthetic test backend; Stop prevented late results. A malformed text extra initially returned null on this Android version, exposing a recovery gap. Null/empty shares now preserve the previous reading and show Hindi recovery; the final picker recheck passed.
- Final error check passed authored Hindi recovery, private framework/network error suppression and invalid remote preference rejection. No installed offline Hindi voice was available in the emulator; audible playback remains unverified.
- Backend: 44 tests passed. New checks cover distinct support synthesis, source index bounds, empty manufacturer results, no model call with rejected search sources, stable failure codes, missing configuration and generated link/HTML rejection. Provider doubles are identified as such.
- Live Mastra request passed. Actual Gemma bill/date explanation passed in 17,769 ms. Actual ElevenLabs Hindi request returned 18,016 audio bytes in 1,650 ms. Entire metadata lookup recovered an imported checkpoint. These individual calls do not prove reliability or listening quality.
- SerpApi returned HTTP 200, but current results included no approved official article. The guide failed closed with GUIDE_SEARCH_UNAVAILABLE before model synthesis. The successful October 2 guide below remains historical evidence.
- Atlas, Sentry, Backboard and Render remain without complete live application evidence. GitHub sign-in grants for Atlas/Sentry are awaiting approval; Backboard has no configured key, and Render has no Suniye deployment or hosted model endpoint.

Latest sanitized receipts: [integration recheck](evidence/integration-recheck-2026-10-03.json), [UI and audit receipt](evidence/ui-integration-audit-2026-10-03.json). The source archive includes screenshots and receipts, not private test logs or credentials.

## Earlier executed checks (October 2)

| Check | Result and scope |
| --- | --- |
| Android build/install | AGP 9.1.1, Gradle 9.3.1, JDK 17, SDK 36; minSdk 30 / targetSdk 35. Debug build and emulator install succeeded. |
| Daily native controls | Android 11 instrumentation passed original text, six or more native actions, stale capture rejection, Repeat and slower preference. |
| Late HTTP response | An actual emulator HTTP request to a deliberately delayed test backend was stopped before response. Status did not change and playback did not resume. Provider was a test double, not Gemma. |
| Large fonts | Same instrumentation checks passed at system font scales 1.3 and 1.6. Home screenshots saved. They prove emulator layout and controller behavior, not parent usability. |
| Positive bundled OCR | A synthetic large “नमस्ते” image matched at minimum word confidence 0.93033856; 2,091 ms in this run. No model/provider call required. Final-APK rerun matched at the same confidence in 1,502 ms. |
| OCR recovery | Dense synthetic bill recognized a wrong word at confidence 0.7216797. The 0.85 guard rejected it with a retake. Runs at font 1.3/1.6 passed the guard. This is a known failure case, not an OCR accuracy benchmark. |
| Backend | 37 tests passed: auth, input bounds, script/quantity preservation, schema failures, narration opt-in, retake/cancellation, explanation quantity invariants, truncation, fallback, concurrency, preference isolation, official-source search filtering, trace privacy, repeated quantities, public error propagation, duplicate request IDs, native schema/completion, bounded model responses, ordered Hindi/day/unit/negation anchors, picture transcription/retake filtering, framework status codes, provider-body cleanup and percent-encoded authentication routes. Most provider calls use injected doubles. |
| Real Gemma explanation | Actual local Gemma 3 4B call returned Hindi in 38,776 ms, but added “meeting/visit” context to a short invitation. Recorded as a faithfulness limitation. After shortening the prompt and adding numeric invariants, a separate bill/date example returned an inspected faithful explanation through actual Mastra/Gemma in 25,016 ms. One example is not a general correctness guarantee. |
| Real Gemma vision | Three-fixture comparison: baseline shapes returned in 42,120 ms; candidate in 43,494 ms. Both identified colors, but described a square as a rectangle; candidate omitted positions. Default protocol/prompts retained. See [comparison](model-evaluation.md). Early generative OCR took 55,976 ms and misread “आइए”; that approach was replaced with local OCR and server rejection of generated image text. Other description tests unnecessarily requested retakes; an earlier revised shape prompt timed out. See evidence JSON. |
| ElevenLabs | Actual Hindi demo narration: 23 seconds, Raju / Eleven Multilingual v2, 296 credits. A limited TTS-only key was created with a 1,000-credit cap and October 9 expiry, and saved only in the ignored backend .env (0600). Raju API returned HTTP 402 payment_required. The official preset Roger voice then returned actual Hindi MP3 through Fastify/Mastra: HTTP 200, 42,466 audio bytes, 1,757 ms. Listening quality and on-phone online playback remain unverified. The 9,704 dashboard balance was measured before this API call. |
| SerpApi / caregiver guide | Real public searches, followed by an actual Mastra/Gemma Hindi summary. Final guide keeps two official Google Android help articles. Initial host-only filter admitted community threads; the revised path/topic filter and test reject them and unrelated pages. No matching Xiaomi reference returned. Dashboard showed 2 / 250 searches used. Phone menus remain unverified. |
| Atlas provisioning | Separate Suniye project and active free SuniyePilot cluster created. One-week, collection-scoped user is prepared for approval; no credential or IP allowlist created. Live preference sync remains unverified. |
| Entire | Actual local import produced 18 checkpoints; two `checkpoint explain` lookups recovered interface/sponsor decisions. Full transcripts stay private; curated provenance included. |
| Render credits | Existing signed-in account shows $50 remaining. New partner claim code issued but not applied. Blueprint has not been deployed. |
| Accessibility service | Bound successfully after reboot. Running instrumentation/install can kill its process and leave dead or crashed bindings without a Java crash. Standalone overlay tap preserved the synthetic message amount/date in the private cache. Audible Hindi playback, image capture/Stop and real WhatsApp remain pending. |

## Claude dispositions

B1: documented USB debug connection; remote token-protected HTTPS endpoint remains undeployed. B2: keep optional sponsor work outside parent controls; source ledger prevents unsupported claims. B3: interactive-window retrieval and top application-window selection implemented. B4: manifest TTS visibility and installed offline Hindi voice selection implemented; real voice still needs a phone.

H1/H2: corrected screen-coordinate masking; Android 11–13 now reject capture crops overlapped by the control, preventing an obscured label from being treated as complete. This limits the image flow until placement or direct app opening avoids the control. Screenshot cropping, foreign-window rejection, persistent Stop, overlay masking, black/secure-window errors, buffer closure and operation generations implemented. H3: Repeat/slow/explain overlay menu implemented. H4: ACTION_VIEW PDF and paging implemented. H5/H6: source reading preserves script; bounded inputs and truncated JSON fail closed. H7: content logging/snapshot persistence disabled; trace privacy canary passed. H8: Redmi sideload/permission/background behavior remains unverified. H9: bounded waits and delayed-result cancellation passed; local Gemma latency is too high and unreliable for a polished parent demo.

Medium fixes include camera lifecycle, URI/image limits, backup exclusions, media audio focus, call hiding, Android 15 insets and PDF completion invalidation. Their presence in code is not proof of behavior on every Android version.

## Outstanding checklist recorded October 3

- Real WhatsApp text/image/protected-screen/keyboard/notification tests on each Redmi A4.
- Offline Hindi speech and number pronunciation, physical rear-camera focus/orientation, PDF paging and Redmi firmware/screenshots/insets. Android 15 emulator results are recorded separately when available.
- Each parent's unassisted start/stop/label tasks and actual feedback.
- Faster, inspected Gemma outputs without added source facts; current failure cases stay in the write-up.
- Atlas live preference read/write, Sentry trace receipt/screenshot, Backboard live comparison and Render hosted request before listing those categories as live.
- Listen to the actual preset-voice Hindi output and verify online playback on the phones; the limited key and backend API audio are now verified.
- Recorded demo, public new repository and final DEV template post. Nothing has been published or submitted by this build.

Known image-flow limit: Android 11–13 display capture cannot safely read media hidden under the overlay. The pilot asks for help moving the control or opening the image directly. Android 14 window-capture behavior is untested. The standalone fixture includes headings in its text read; WhatsApp UI clutter still needs filtering based on actual device tests.

Implementation update: fixed Stop footer on reading/camera screens; public model errors map to static Hindi client messages; nonfinite or missing OCR confidence requests a retake. APK compilation passed. Claude Code completed a source review and follow-up; their findings and fixes are recorded in claude-audit.md. The local APK compiled with application-owned PDF state, canonical-route authorization, fixed retake prompts, typed Hindi errors and asynchronous HTTP cancellation. Android 11 runtime checks at font scale 1.6 passed fully visible sticky Stop before/after scrolling, delayed HTTP cancellation, untyped PDF VIEW loading across recreation, preserved page 2 with one cache copy, private framework-error handling and enabled Stop during Hindi prompts. These used synthetic input and a delayed test backend. Camera shortcut checks passed with the entire preview, shutter and Stop visible at font scale 1.6. Capture returned to a resumed reading screen with input focus and a working Stop. Repeated PDF checks found orphaned copies after process restarts; startup cleanup now preserves the active/in-flight document and removes unused app-cache copies. Forget also removes the active cached PDF. The repeat checks passed.

Release hashes and packaging checks are in releases/manifest.json. Secret checks cover exact configured credentials and private-key markers in source and decoded APK contents; third-party binaries/model weights and private agent history are excluded.

Emulator environment: a System UI ANR covered early local screenshots. Those images were replaced after recovery. The final harness rejects a foreign foreground window, checks actual scroll movement and camera input focus, and waits for rendered Stop pixels. It uses synthetic source material and a test backend. This does not establish phone speech or parent usability.


## Hindi number and v4 final checks, October 3

The current build passed 87 backend tests and 38 shared pure Java pronunciation cases. Final Android 15 instrumentation at font scale 1.6 passed the purpose/amount/help screen and input picker, including selected image/PDF OCR, malformed shares, cancelled pickers and visible setup. The fixed Stop scroll check passed. A real Raju v4 native run verified online playback, cache base rate 1, actual Slow/Repeat rate .7 and Stop. Gemma’s separate explanation was refused and did not replace the original. The recorded APK and final package are identified separately: the latter also fixes spaced currency-alias signs and restricts supported voice model IDs. [Final receipt](evidence/numbers-and-ux-2026-10-03.json).

The 60.2-second replacement film uses Raju v4 and opens with the audience/task. It cuts and labels 32.369 seconds of model waiting. The provider MP3 is mixed separately, not device sound capture. Physical Redmi, actual WhatsApp, offline Hindi listening and parent usability remain unverified. No public deployment or submission is claimed.


Demo export correction: the earlier MP4 had silent/truncated audio despite the native app playback passing. The corrected export muxes a complete stereo track separately, adds Raju Hindi TTS at the opening, and simplifies captions. Decoded sound levels passed for intro, bill, Slow and Repeat; full decoding passed. This is a media correction, with no APK/code changes. [Audio receipt](evidence/demo-audio-check-2026-10-03.json).

## Spoken controls and simpler film, October 3

The updated APK built and its debug v2 signature verified. Exact voice parsing passed 33 cases, including both nukta forms, negation and embedded-command rejection. Android 15 at font 1.6 passed real UI/action routing with synthetic recognizer callbacks: caregiver opt-in, fixed Stop/Speak, hi-IN bounded request, unknown recovery, Repeat/Slow/Stop, late callback/dismissal cleanup, spoken permission errors and one standard-service fallback when the device engine lacks Hindi. Camera capture and image/PDF input checks passed with the new footer. Actual microphone recognition, Redmi language models and the first camera permission interaction remain unverified. [Voice receipt](evidence/voice-controls-2026-10-03.json).

The replacement 32.9-second portrait film shows one bill with Hindi purpose narration, fresh Raju v4 bill audio, cached Repeat and Stop. It uses the updated APK. There is no staged voice recognition or model explanation. The actual provider MP3 is mixed separately; no native waits are cut. Full audio duration, decoded levels for intro/bill/Repeat and full decoding passed. [Current recording notes](demo-script.md).

The same packaged APK also passed Android 11 voice callbacks and sticky Stop at font 1.6. On-device language fallback is an Android 12+ branch exercised on Android 15; Android 11 uses the standard-service path. Microphone permission was pre-granted in the synthetic callback tests, so they do not establish the physical permission dialog or microphone recognition.

## Image/PDF Share walkthrough, October 3

Android 11 at font scale 1.3 passed synthetic ACTION_SEND image/PDF intents with actual MediaStore content URIs. The image recognized नमस्ते; PDF page 1 recognized बिल and page 2 recognized धन्यवाद. Three real Raju v4 requests returned HTTP 200, and Android playback completed with cached audio base rate 1. PDF count, next-page index and Stop passed. The test harness drives native controls. [Native receipt](evidence/media-native-2026-10-03.json), [provider calls](evidence/media-providers-2026-10-03.json).

This demonstrates the receiver used by Android Share. No real WhatsApp sender, share chooser, Redmi installation or parent success is inferred. The film’s WhatsApp section shows Suniye’s own instructions: after caregiver setup, open a message and tap the green सुनिए control; for photos/PDFs, open the item, Share and choose Suniye.

The initial PDF invitation triggered low-confidence recovery. A rendering probe measured कल शाम at .8203 and चार बजे आइए। at .8369, below the unchanged .85 guard. बिल and धन्यवाद passed at .9466 and .9191. The film uses these simpler fixtures; it is not an OCR accuracy benchmark. [Probe](evidence/media-pdf-ocr-probe-2026-10-03.json).

A separate attempt to record the actual file picker did not pass. Android 15 runs encountered System UI/Digital Wellbeing ANRs and a focus timeout; Android 11 selection automation did not reliably return to Suniye. One Android 11 image-picker reading completed, but the combined picker recording remained incomplete. Earlier picker tests supplied synthetic URI results and must not be treated as full chooser navigation.

## Submission revision, October 4

Two actual local Gemma checks ran through the current Fastify/Mastra backend without a speech provider. The first preserved the instruction but barely simplified it, taking 23,019 ms. The second turned प्रवेश से पूर्व अपने जूते उतारना अनिवार्य है। into प्रवेश करने से पहले अपने जूते निकालें।, preserving the remove-shoes-before-entering instruction in a warm 2,660 ms call. Both are single synthetic cases with manually compared meanings; no accuracy rate, phone latency or Android playback is claimed. [First check](evidence/editorial-gemma-first-2026-10-04.json), [Second check](evidence/editorial-gemma-2026-10-04.json).

The revised film combines the existing bill and media recordings with exact source previews and a separate saved Gemma result. No production Android/backend code changed for the article/video revision.

## October 4 additional sponsor connections

- Render: free Singapore service deployed commit `77e2b32`. HTTPS health returned 200; unauthenticated reading returned 401; authenticated original bill reading preserved source and returned 26,166 bytes of real Raju Hindi audio. Hosted Gemma and preference sync remain unconfigured. See [receipt](evidence/render-live-2026-10-04.json).
- Sentry Agent Tracing: a real local Gemma explanation returned 200 and its four-span trace appeared in Agent Activity. The model used 143 input and 11 output tokens. Its 32.64 seconds included 24.96 seconds loading, 4.62 seconds prompt evaluation and 2.73 seconds generation. A prior timeout remains recorded. The outgoing envelope omitted source text and configured credentials; Sentry can add network metadata. See [receipt and screenshot](evidence/sentry-live-2026-10-04.json).
- Atlas: real local HTTP preference write/read, update and persistence after closing/restarting the backend passed. Reading content was rejected with 400; unauthenticated access returned 401. The single synthetic record was deleted and its absence verified. The one-week evidence user is restricted to `suniye.preferences` and SuniyePilot. Render-to-Atlas and Android sync remain untested. [Receipt](evidence/atlas-persistence-2026-10-04.json).
- Backboard: six real synthetic calls completed and appeared in the usage dashboard. Builder review found two Gemma added-context errors despite all literal checks passing; Qwen avoided those errors on the same three cases. No general quality ranking is claimed. Own test assistant absence was checked; key revocation was confirmed by an empty dashboard key list and API HTTP 401. See [comparison](evidence/backboard-comparison.json).

The APK and Android production source did not change for these checks. This verifies provider connections, not Redmi, WhatsApp or family usability.

Render credit-only upgrade: $50 credit confirmed; $7/month paid compute attempted with approval. Render required payment information on file and rejected the update. No card or cash payment was added; service remains Free. [Receipt](evidence/render-credit-only-2026-10-04.json).
