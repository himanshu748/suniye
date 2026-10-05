# Suniye / सुनिए

My parents have weak eyesight and ask me to read WhatsApp messages, pictures, labels and documents. Suniye is an Android 11+ Hindi reading aid with large Stop, Repeat and Slow controls. They use Redmi A4 phones in another city.

[Download Android 0.4.1](https://github.com/himanshu748/suniye/releases/download/real-documents-2026-10-05/suniye-parent-ux-0.4.1.apk) · [English-narrated real-document walkthrough](https://suniye-reader.onrender.com/#walkthrough) · [Live project](https://suniye-reader.onrender.com/) · [Caregiver help](https://suniye-reader.onrender.com/caregiver) · [Entry](https://dev.to/himanshu_748/suniye-let-my-parents-hear-the-message-themselves-41bh)

## What happens to a photo or PDF?

Android Share sends selected text, an image or PDF to Suniye. Bundled OCR reads image/PDF text locally. The authenticated Render backend runs Mastra and requests Hindi speech from ElevenLabs Raju. The original stays visible; cached audio supports offline Repeat and Slow. ₹1,250 is spoken as “एक हज़ार दो सौ पचास रुपये”. There is no fallback to another voice.

**Parent messages are not generatively rewritten.** Optional word help uses reviewed dictionary definitions beside the unchanged original. Gemma 3 27B via Backboard is restricted to a separate caregiver summary of fixed public setup references. No-text picture description is unavailable. [Privacy](outputs/suniye/docs/privacy.md).

## Verified October 5

- 127 backend tests, 57 shared Java/JS pronunciation fixtures and the standalone OCR policy harness pass.
- The same 0.4.1 APK passed Android 11 layout/recovery checks at 160% fonts and all three real-document playback stages at normal fonts: image, PDF page 1 and PDF page 2. Each completed hosted Raju playback, Repeat and Stop through direct public HTTPS. [Consolidated receipt](outputs/suniye/docs/evidence/native-real-documents-2026-10-05.json).
- The walkthrough uses a real consumer-notice image and a complete two-page Hindi notice. The 2-minute-20-second film uses English explanations and captions; app controls and document speech remain Hindi. [Inputs, provenance and capture scope](outputs/suniye/docs/real-document-walkthrough.md).
- Hosted Atlas preference write/read and persistence across process replacement; concurrent pgvector retrieval; Sentry dashboard timing/token readback; fixed SerpApi query execution. [Ledger](outputs/suniye/docs/sponsor-tracks.md).
- One approved extra Gemma caregiver test retained its persistent before/after counter evidence, without resetting the quota. [Actual outcome](outputs/suniye/docs/evidence/hosted-public-summary-2026-10-05.json).
- Sonnet 5.5 source audits informed the cache, OCR warning and numeric masking fixes. [Audit disposition](outputs/suniye/docs/sonnet-audit-disposition-2026-10-05.md).

APK SHA-256: `f90fd8a8eb4d05c362cd952e514ad4bf20e78501f5c6bf63bdde968a89e4eeca`. Debug pilot, version `0.4.1-real-documents` (version code 5). Older releases and videos remain dated historical evidence.

## Limits

Current Android checks use an emulator. Physical Redmi A4 behavior, an external WhatsApp sender and microphone recognition require separate device checks. OCR can be wrong, including confident words; its confidence threshold is a heuristic. Uncertain pages require an explicit review choice and an audible warning, and flagged numeric groups are withheld. Check important details against the source document. Free Render may sleep. Temporary Atlas access and provider credentials require maintenance; original speech is independent of the eight-attempt daily model quota. No cash purchase or paid resource was created.

## Integrations and source

[Android](outputs/suniye/android) · [Backend](outputs/suniye/backend) · [Verification](outputs/suniye/docs/verification.md) · [Ten-category ledger](outputs/suniye/docs/sponsor-tracks.md)

Nine runtime roles: ElevenLabs, Mastra, Gemma, Backboard, Render, Sentry, Atlas, SerpApi and pgvector. Entire is development provenance. Tiger Data's listed pgvector/hybrid use case is implemented with hosted PGlite; no Tiger Cloud claim. Temporal/TabPFN are excluded from hosted claims.

MIT code built during the October 2–5 challenge. Gemma weights and bundled Google OCR have separate terms. Secrets, private messages and full development transcripts stay private. Test instrumentation is debug-only. The dated public demonstration documents retain their source rights; the code licence does not relicense them. [Third-party notes](outputs/suniye/docs/third-party.md).
