# Suniye / सुनिए

My parents have weak eyesight and ask me to read WhatsApp messages, pictures, labels and documents. Suniye is an Android 11+ Hindi reading aid with large Stop, Repeat and Slow controls. They use Redmi A4 phones and live in another city; their own use has not yet been observed.

[Download 0.3 parent-UX APK](https://github.com/himanshu748/suniye/releases/download/parent-ux-2026-10-04/suniye-parent-ux.apk) · [Live project page](https://suniye-reader.onrender.com/) · [Caregiver voice/help page](https://suniye-reader.onrender.com/caregiver) · [Published entry](https://dev.to/himanshu_748/suniye-let-my-parents-hear-the-message-themselves-41bh)

## How it works

The phone accepts selected text, images and PDFs through Android Share, its camera and file controls. Bundled OCR recognizes image/PDF text locally. An authenticated Render backend runs the Mastra workflow and sends text to ElevenLabs Raju; successful audio can be repeated or slowed offline. The original stays visible. There is no Android/browser TTS substitute. `₹1,250` becomes “एक हज़ार दो सौ पचास रुपये” for speech, while the printed source remains unchanged.

Optional Gemma explanation uses Backboard → OpenRouter → Gemma 3 27B. It is experimental, speaks an AI warning, and can still add context or reject faithful wording. Original reading avoids the rewrite. Hosted picture description is unavailable; the backend returns an authored retake before sending a picture to Backboard. [Data flow and retention](outputs/suniye/docs/privacy.md).

## Current evidence, October 5

- 107 backend tests pass. Sonnet 5.5 independently found defects; [dispositions](outputs/suniye/docs/sonnet-audit-disposition-2026-10-05.md) distinguish fixes from open Android/provider issues.
- Real hosted original Raju speech, Atlas write/read/content-field rejection, settings persistence across a deploy/process replacement and synthetic-profile cleanup passed. [Receipt](outputs/suniye/docs/evidence/hosted-e2e-2026-10-05.json).
- Three simultaneous fixed-topic PGlite/pgvector help requests passed. This retrieves three approved Android references using frozen vectors and keyword/vector ranking, not arbitrary Hindi questions. [Receipt](outputs/suniye/docs/evidence/hosted-pgvector-concurrent-2026-10-05.json).
- A Sentry dashboard trace confirms hosted agent/model timings and tokens without displayed reading content. [Screenshot and receipt](outputs/suniye/docs/evidence/hosted-sentry-2026-10-05.json).
- Gemma 4B passed an earlier request, then its upstream pool throttled another. The explicit price-bounded 27B route rejected a weekday output and returned Raju speech for a milk sentence that still added context. [Both outcomes](outputs/suniye/docs/evidence/hosted-gemma-27b-2026-10-05.json).
- SerpApi returned HTTP 200 with zero approved URLs. The caregiver falls back to its approved help buttons. Older cached outcomes lack raw-row counts; no cause for missing links is asserted.

Today's eight model attempts are used; they reset at 05:30 IST the next day. Original Raju reading remains available. Render is Free and can sleep. A best-effort health schedule is not an uptime guarantee. Temporary Atlas access and provider credential expiries require deliberate maintenance. No new cash charge, purchase or paid plan was made.

## Android and demo limits

The released APK is 0.3.0-parent-ux, SHA-256 `39d5484833272ead0147788823ee7c0e8790ed1454555b48f721e807c1d2cdfd`. Prior Android 11/15 checks cover synthetic Share inputs, OCR, PDF paging, Raju media state, cancellation and large fonts. The current touch walkthrough, real WhatsApp, physical Redmi and parent comprehension remain open. Native daily-limit messages, explanation replay, setup disclosure and some number/time pronunciation need follow-up.

[Historical 0.1 walkthrough (82 seconds)](https://github.com/himanshu748/suniye/releases/download/v0.1.0-pilot/suniye-demo-judge.mp4) · [Historical image/PDF-to-speech film (24 seconds)](https://github.com/himanshu748/suniye/releases/download/media-showcase-2026-10-04/suniye-image-pdf-to-speech.mp4)

These earlier films show exact synthetic source images/PDF pages and separately mixed Raju recordings; the WhatsApp portion is setup guidance. They do not show the current native revision or a parent's use. [Release ledger](landing/release-ledger.md) · [Raju-only current video plan](landing/current-video-plan.md).

## Source and sponsor scope

[Android](outputs/suniye/android) · [Mastra/backend](outputs/suniye/backend) · [Verification](outputs/suniye/docs/verification.md) · [Sponsor ledger](outputs/suniye/docs/sponsor-tracks.md)

Ten category targets have bounded roles: Mastra, Gemma, ElevenLabs, Render, Backboard, Atlas, Sentry, SerpApi and pgvector at runtime; Entire for development provenance. Tiger Data's category explicitly permits pgvector/hybrid retrieval; Tiger Cloud is not used. Temporal remains a local caregiver prototype and TabPFN has no representative measured outcomes, so both are excluded from hosted claims. Qualification is a judging decision.

Built during the October 2–5 challenge. Code is MIT licensed. Gemma weights and bundled Google OCR have separate terms. Provider keys, family messages and full private development histories are excluded. Synthetic fixtures are debug-only. [Third-party notes](outputs/suniye/docs/third-party.md).
