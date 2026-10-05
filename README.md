# Suniye / सुनिए

My parents have weak eyesight and ask me to read WhatsApp messages, pictures, labels and documents. Suniye is an Android 11+ Hindi reading aid with large Stop, Repeat and Slow controls. They use Redmi A4 phones in another city; their own use remains unobserved.

[Download Android 0.4](https://github.com/himanshu748/suniye/releases/download/parent-ux-2026-10-05/suniye-parent-ux-0.4.apk) · [82-second narrated walkthrough](https://suniye-reader.onrender.com/#walkthrough) · [Live project](https://suniye-reader.onrender.com/) · [Caregiver help](https://suniye-reader.onrender.com/caregiver) · [Entry](https://dev.to/himanshu_748/suniye-let-my-parents-hear-the-message-themselves-41bh)

## What happens to a photo or PDF?

Android Share sends selected text, an image or PDF to Suniye. Bundled OCR reads image/PDF text locally. The authenticated Render backend runs Mastra and requests Hindi speech from ElevenLabs Raju. The original stays visible; cached audio supports offline Repeat and Slow. ₹1,250 is spoken as “एक हज़ार दो सौ पचास रुपये”. There is no fallback to another voice.

**Parent messages are not generatively rewritten.** Optional word help uses reviewed dictionary definitions beside the unchanged original. Gemma 3 27B via Backboard is restricted to a separate caregiver summary of fixed public setup references. No-text picture description is unavailable. [Privacy](outputs/suniye/docs/privacy.md).

## Verified October 5

- 125 backend tests and 56 shared Java/JS pronunciation fixtures pass.
- The same 0.4 APK passed all three Android 11 suites at 160% fonts: parent layout/media state, recovery/cache behavior, and synthetic image/PDF Share → local OCR → real hosted Raju → Stop/WhatsApp help. Direct public HTTPS, no relay. [Receipt](outputs/suniye/docs/evidence/native-0.4-e2e-2026-10-05.json).
- Hosted Atlas preference write/read, content rejection and persistence across process replacement; concurrent pgvector retrieval; Sentry dashboard timing/token readback; fixed SerpApi query execution. [Ledger](outputs/suniye/docs/sponsor-tracks.md).
- One explicitly approved extra Gemma caregiver test, with persistent before/after counter evidence and no reset. [Actual outcome](outputs/suniye/docs/evidence/hosted-public-summary-2026-10-05.json).
- Sonnet 5.5 independently audited the source twice. [Fixes and remaining limits](outputs/suniye/docs/sonnet-audit-disposition-2026-10-05.md).

APK SHA-256: `f2a93ab8c1dcb2acc8c7ded211e7d2b1bcee254f3a41a6b852a897d2f7a47af0`. Debug pilot, version 0.4.0-parent-ux. The [film receipt](outputs/suniye/docs/evidence/native-0.4-video-2026-10-05.json) documents exact source fixtures, separately mixed Raju responses and scope. Old releases/videos remain historical.

## Limits

Instrumented emulator behavior is not physical Redmi testing, real WhatsApp sender testing or parent comprehension. Dense OCR can be wrong. Free Render may sleep. Temporary Atlas access and provider credentials require maintenance; original speech is independent of the eight-attempt daily model quota. No cash purchase or paid resource was created.

## Integrations and source

[Android](outputs/suniye/android) · [Backend](outputs/suniye/backend) · [Verification](outputs/suniye/docs/verification.md) · [Ten-category ledger](outputs/suniye/docs/sponsor-tracks.md)

Nine runtime roles: ElevenLabs, Mastra, Gemma, Backboard, Render, Sentry, Atlas, SerpApi and pgvector. Entire is development provenance. Tiger Data's listed pgvector/hybrid use case is implemented with hosted PGlite; no Tiger Cloud claim. Temporal/TabPFN are excluded from hosted claims.

MIT code built during the October 2–5 challenge. Gemma weights and bundled Google OCR have separate terms. Secrets, private messages and full development transcripts stay private. Synthetic fixtures are debug-only. [Third-party notes](outputs/suniye/docs/third-party.md).
