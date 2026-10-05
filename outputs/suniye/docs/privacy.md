# Data flow and retention — October 5, 2026

Suniye 0.4 is a family pilot. A caregiver configures the HTTPS backend and private family token. The token authorizes the whole family service, not an isolated account per profile. Never publish it or bundle it into the APK.

## Parent reading

Android recognizes image/PDF text locally with bundled ML Kit. New original speech sends recognized or shared text to Render and ElevenLabs Raju. Reviewed dictionary help adds separately labelled definitions and the unchanged source. **Parent readings are no longer sent to Gemma, Backboard or OpenRouter for generative paraphrasing.** A no-text image is rejected on the current phone before upload; the hosted endpoint also refuses picture description before forwarding to Backboard. Older APK behavior is historical.

Screen reading can include other visible messages, contact names, previews and timestamps. The pilot does not reliably isolate one message; sharing a selected message/photo is preferable. Real WhatsApp and Redmi A4 behavior remains unverified. Avoid sensitive documents in the public caregiver test.

Optional spoken commands use Android recognition. On-device recognition is preferred where available; the system fallback may send microphone input to its provider. It is a short user-started session. All generated and bundled app speech is ElevenLabs Raju; there is no Android/browser TTS substitute.

## Local and server storage

The phone retains the last original, current word-help state and allowed audio privately for Repeat until Forget or app-data removal. Temporary playback files and imported PDFs have cleanup paths; process termination may interrupt cleanup. Local content has no fixed expiry.

Render request-content logging and Mastra snapshots are disabled. Text/audio exist in memory during processing. This is an application policy, not proof that every infrastructure layer has zero retention. ElevenLabs history and provider retention settings have not been independently verified.

Atlas stores preferences, UTC-day model/search counters and cached public support references, not parent reading content. Preference APIs reject content fields and reserve service_ IDs. Temporary database credentials and network rules expire around October 11–12; exact dashboard expiries require deliberate maintenance. Startup/network failures trigger bounded reconnection attempts; uncertain writes are not automatically retried. Model quota fails closed without Atlas. Original speech does not need model quota.

Sentry sanitization keeps stage, timing, model and token metadata while discarding text, URLs, credentials and arbitrary provider errors. A signed-in hosted trace was inspected, but one trace is not a comprehensive retention audit.

## Caregiver public help

PGlite/pgvector retrieves three approved public Android references for three fixed topics. It uses frozen public vectors and hybrid ranking, not arbitrary personal queries. SerpApi receives fixed public setup queries only.

Optional Gemma 3 27B summaries receive only the selected fixed public reference snippets through Backboard and OpenRouter, never a submitted parent reading. The separate caregiver UI warns that a summary can be wrong and keeps source links visible. Memory/search/tools/document upload are off. There is a persistent eight-attempt UTC-day quota; one explicitly approved extra test was allowed on October 5 only, without resetting the counter.

A dispatched model request may finish its bounded 45-second response after Stop to recover its thread ID for a separate 10-second deletion attempt; no late result reaches the stopped reader. Unknown IDs, timeouts, malformed replies or failed deletion may leave provider-held public content. Memory off and best-effort deletion do not mean zero retention.

## Accuracy

Removing parent paraphrasing removes that source of invented meaning. OCR can still be wrong, and dictionary meanings do not interpret a whole instruction. Amounts, dates and medicine labels require comparison with the original and family help. Long expanded speech can exceed the provider limit; the original remains visible rather than being truncated silently.
