# Current architecture and scope — October 5, 0.4

Android 0.4 uses local image/PDF OCR, then original text → authenticated Render/Mastra → ElevenLabs Raju. Reviewed dictionary help preserves the source. There is no parent generative paraphrasing. No-text images are refused before upload; hosted picture description is unavailable.

Caregiver-only public reference retrieval uses PGlite/pgvector and fixed approved topics. Optional Gemma 3 27B through Backboard/OpenRouter summarizes those snippets with source links. Explicit Nebius FP8 routing, no fallback and USD-per-million ceilings of 0.12 input/0.30 output apply. Atlas persists eight attempts per UTC day; one dated October 5 validation allowance admits a ninth attempt, with no counter reset. Parent speech/word help is independent of model quota.

Atlas handles transient reconnection without uncertain write retry. Static/health traffic is exempt from application rate buckets; authenticated family API traffic has its own shared limits. See [privacy](privacy.md), [current verification](verification.md) and [audit disposition](sonnet-audit-disposition-2026-10-05.md) for exact operational limits.

## Historical design below — superseded where it differs

## Development specification and history

# Suniye — Technical specification

Version 3, October 3, 2026. Claude audit completed; implementation and evidence recorded in verification.md.

## Components

Native Android Java app, minSdk 30 (Android 11), targetSdk 35, compileSdk 36. AGP 9.1.1 and Gradle 9.3.1, JDK 17. Bundled ML Kit Devanagari/Latin OCR 16.0.1. Framework Activity/Views, Camera2, PdfRenderer, MediaPlayer, AndroidKeyStore. Avoid dependence on a WebView, Expo Go, or a separate WhatsApp bot for the core interaction.

Node 22 backend: Fastify, Zod schemas, Mastra workflow, optional Sentry Node SDK, optional MongoDB driver. Gemma through a configured OpenAI-compatible vision endpoint: local Ollama first, vLLM/hosted endpoint later. ElevenLabs Raju is the only speech output. No Android or browser TTS fallback exists; missing audio keeps the original visible. All keys configured through excluded .env files.

## Android screen service

ScreenReaderService is an explicitly enabled disability-support AccessibilityService with canRetrieveWindowContent, canTakeScreenshot, and isAccessibilityTool. Listen to window state/window changes only to show or hide the accessibility overlay. Do not retain event text, take continuous screenshots, or intercept gestures.

Only allow com.whatsapp and com.whatsapp.w4b for the overlay by default. Hide it on the launcher, system dialogs, setup, and other apps. A user tap captures visible content; text nodes are used only when no media/document view is detected. Media detection is conservative: if ambiguous, use screenshot vision. Android 11–13: keep Stop visible, call takeScreenshot(display), crop to app/media bounds and mask the accessibility overlay in the owned bitmap. Reject foreign windows intersecting the crop, including keyboard/notifications, and reject black captures. Compute the overlay rectangle with getLocationOnScreen. On Android 11–13, reject media when the control overlaps its crop; do not read a partly obscured label as complete. Direct image opening/OCR is a fallback until placement is improved. Android 14+: takeScreenshotOfWindow for the intended application window. Check foreground package/window before capture and again before accepting a capture. Never bypass secure-window errors. The button uses TYPE_ACCESSIBILITY_OVERLAY, not a global overlay permission.

The read target is the application window under the button, not the overlay itself. Stop, permission loss, screen change away from the target, or service disconnect invalidates the in-flight capture. A single operation identifier spans capture, backend work, and playback. Late callbacks compare this identifier before acting.

## Reader state machine

IDLE → CAPTURING/WAITING → SPEAKING → IDLE. FAILED/RETAKE produces an audible actionable prompt and returns to IDLE. Stop increments an operation generation, closes active HTTP on a separate executor, cancels audio, and returns to IDLE. A new reading invalidates the previous generation. Repeat replays last successful original locally. Explanation is a new operation that uses the last original/context, never overwrites original. Slow playback updates preferences and restarts/replays intentionally.

ReaderController is application-scoped with main-thread state/listener updates, one worker executor, and thread-safe cancellation. Activities/services register and unregister listeners across lifecycle events. Audio responses must identify ElevenLabs and the Raju voice ID. Untagged legacy caches are not played. Fixed prompts use bundled recorded Raju clips. Audio playback completion uses the same operation check. No background playback starts from a stale Activity callback.

## Camera and files

Camera2 rear camera with a TextureView preview and ImageReader JPEG output. Ask camera permission before use; only open when foreground/resumed. Close camera/session/ImageReader on pause. Orient the preview/output correctly. Bound image dimensions and recompress to JPEG before upload (max 1600px long side, max 3MB). If captures are too dark or globally blurred, spoken retake guidance replaces upload; these checks do not guarantee OCR accuracy. No semantic claims from heuristic image quality scores.

ACTION_SEND accepts text/plain, image/*, and application/pdf. The parent flow does not depend on sharing; this is an additional entry for the family member. Read URI grants as provided, bound reads and decode dimensions before allocation. No unbounded BitmapFactory decode. PDF access copies a bounded private temporary file, renders one page at a time, and provides large next/previous controls. Delete temporary pages and rendered bitmaps after use. A v1 page read is explicitly page-by-page, not an implied full-document narration.

## Backend API and processing

GET /health: public process readiness plus non-sensitive capability flags, no secrets or provider URLs.

POST /v1/read: authenticated bearer family token. Input { image: data-URI JPEG/PNG optional, text: string optional, mode: read|explain, language: hi, requestId: UUID, wantAudio: boolean default false }. Exactly one of image/text; text max 12000 chars, image decoded max 3MB. JSON/body/schema limits are checked before model use. JPEG/PNG signatures must match declared MIME. HTTPS client destinations only outside a local emulator/debug setup. No user-supplied remote image URLs or model endpoints.

Mastra steps: validate/prepare → extract with Gemma → validate/choose original versus explanation → narrate only if wantAudio is true and ElevenLabs is configured. Prompt source text/images are untrusted data. The workflow has no tools for sending messages, web fetching, database editing, or following image instructions. Require JSON { kind: reading|retake, originalText, description, retakeReason }. On Android, recognize text locally before upload. Inspect minimum word confidence; below 0.85 produces a retake. Gemma receives images only after local recognition finds no text, and must return originalText empty. Visible words/digits detected by Gemma produce a retake. Model-generated originalText and descriptions containing known transcription markers are rejected server-side. Model retake reasons are replaced with a fixed Hindi prompt. If no text, preface the Hindi description. Explain mode uses a separate Gemma request limited to two short sentences and the supplied material, announces explanation, and preserves the source separately. Enforce lengths and nonempty fields; invalid JSON fails closed. Explanation checks compare ordered numeric tokens plus a fixed set of Hindi number/day words, common units, time-of-day words and negations. Digit scripts and common translated units are normalized. Known changed, omitted, added and reordered anchors fail closed. The check can reject faithful rewording and cannot establish preservation of meaning. Model self-reported retake is an aid, not a calibrated confidence score.

Response: { kind, originalText, spokenText, isExplanation, isDescription, retakeReason, audioBase64?, audioBaseRate?, audioProvider?, audioVoiceId? }. Errors use stable public error codes and Hindi messages; never relay provider bodies/stack traces to clients. Timeouts: model 45s, narration 20s. Stop/cancel ignores all results; backend checks client disconnect to cancel provider work when possible. ElevenLabs absence/failure returns the real reading with no audio. Android shows a voice-unavailable message and never substitutes a voice. Do not transmit retake/error prompts to ElevenLabs.

Authentication: random at least 32-character FAMILY_TOKEN, constant-time comparison of hashed candidates. Global/body rate limit and authenticated request rate limit. Max concurrent image jobs protects memory/cost; overload gives a spoken retry message. No wildcard CORS is necessary for Android. HTTP access is limited to emulator localhost addresses by network security configuration; release endpoints must use HTTPS.

Optional GET/PUT /v1/preferences/:profile authenticates identically. Profiles are bounded identifiers; payload accepts only Hindi voice/speed/text size/button placement. Mongo stores these preferences keyed under this single-family deployment. If Mongo is absent, local Android preferences remain authoritative; cloud sync is shown to the caregiver as unavailable, not claimed successful.

## Privacy and local storage

App access token encrypted with AES/GCM AndroidKeyStore, distinct from sponsor provider keys. App-private last successful original/description cache, backup disabled, delete in setup. Images are transient. The last successful reading and its optional MP3 are stored privately for offline replay; delete them through family setup. No personal screenshots/content in automated tests; use synthetic Hindi documents and message-like fixtures.

Sentry spans: capture mode, model stage, narration stage, duration, outcome, and model identifier only. Disable automatic body/header attachment and breadcrumbs that could contain payloads. Scrub request/user/breadcrumb/exception material before sending; no raw prompts, responses, screenshots, tokens, IPs, or user names. Tracing must not affect successful reading if Sentry is unavailable.

## Provenance, hosting, tests

Entire installed from an official checksum-verified release into work/tools. Enable local repo hooks without auto-pushing transcripts. Current Codex hooks require approval in the app; use verified transcript import if hooks cannot capture this already-running session. Capture Claude audit history by import if necessary. Sanitize/private-review provenance before any public sharing. Do not claim an Entire checkpoint until one exists.

Render blueprint runs npm ci/npm start with externally configured Gemma endpoint, keys, and family token. A GPU is not provisioned by default. DigitalOcean model hosting requires a concrete budget decision. Backboard comparison and SerpApi official-support guidance are separate caregiver/developer scripts and do not add accounts or controls to the parent flow. The blueprint is deployment-ready configuration, not evidence of deployment.

Tests: backend schema/auth/rate-limit/cancellation/provider failure/unsafe image input/prompt injection boundaries with deterministic fake providers; real local Gemma picture description and Hindi explanation as separate tests; Android emulator installation/lifecycle/overlay/screen capture/stop/large-font/camera permission/PDF paging checks. Test the screen service against a synthetic debug-only fixture Activity. The debug build allows its own package for this purpose; the release build allows only WhatsApp/WhatsApp Business. Instrumentation can kill and suppress services, so standalone overlay tests are recorded separately after service rebind. Real WhatsApp and parent tests remain separate required evidence. Build APK and source ZIP; record versions, checksums, test results, open limitations, sponsor status, and Claude audit dispositions in docs/verification.md.

Implementation details after review: reading and camera screens use portrait layout and fixed Stop controls. A single MainActivity task owns application-scoped PDF state. Ordinary configuration changes preserve the operation, PDF copy and selected page. Runtime errors on the reading path use application-authored Hindi prompts; arbitrary framework details are not spoken. Authentication runs before body parsing and uses the canonical matched route, including percent-encoded requests.

PDF cache cleanup removes orphaned app-owned copies after restarts while retaining active/in-flight files. Forget removes the current cached PDF as well as the last reading and MP3. The camera preview uses the remaining body height; large headings do not push it below the controls.

Home inputs use ACTION_OPEN_DOCUMENT with a per-item read grant, content:// image/PDF validation and no broad media permission. Plain-text shares are handled before any stream attachment. Parcelable failures produce authored Hindi recovery messages. FLAG_ACTIVITY_LAUNCHED_FROM_HISTORY prevents Recents from replaying an old share. Stop remains a fixed footer on reading, camera and caregiver setup; native ripple and disabled states distinguish controls. The cream/teal palette remains consistent when system night mode is enabled. It is not a separate dark theme.

Caregiver setup displays only UserMessage errors or fixed Hindi fallbacks. Raw network, URI-parser and Keystore error details are not shown. Synced preferences reject nonfinite or out-of-range speeds. The separate official-support summary uses supplied snippets and bounded sourceIndices; those checks do not establish factual faithfulness. Generated links/HTML are rejected, official source titles are Markdown-escaped, and workflow errors use stable codes. A search without approved sources stops before model synthesis.

## October 5 hosted provider update

The deployed text explanation route is Backboard → OpenRouter → google/gemma-3-27b-it, with strict model identity and completed-response checks. Eight attempted calls per UTC day are reserved atomically in Atlas and include uncertain calls. No automatic retry occurs. Hosted picture description is unavailable: provider extraction returns an application-authored retake before Backboard upload; the adapter also rejects images before quota reservation. Local Ollama picture trials remain separate dated evidence.

Memory/search/custom tools are disabled for Backboard text requests. Best-effort deletion of only the returned request thread does not establish zero provider retention, especially after cancellation or an uncertain response. Readings are transient in the backend and no workflow snapshots are stored. Atlas stores family preferences, usage counters and public search caches. Expiring database/network access can disable settings sync and model calls; original Raju speech does not require the model. The caregiver web page shows data transmission, memory-only family token use, official source filtering and a fixed Stop footer.
