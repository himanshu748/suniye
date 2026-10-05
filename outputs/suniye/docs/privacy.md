# Data flow and retention, October 5, 2026

Suniye is an experimental family pilot. A caregiver configures the HTTPS backend and private family token. The shared token authorizes the whole family service; it is not separate authentication for each profile. Do not publish it or put it in the APK.

## What leaves the phone

Android recognizes image/PDF text locally with bundled ML Kit. New original speech sends recognized or shared text to Render and ElevenLabs Raju. Optional explanation also sends the text through Backboard and OpenRouter to Gemma 3 4B. The current hosted Backboard route does not forward picture attachments: it returns an authored retake. This does not make the phone's upload to Render local-only.

Screen reading can include other visible messages, contact names, previews and timestamps. The user starts it deliberately, but the pilot does not isolate one message reliably. Share a selected message or photo when possible. Real WhatsApp and Redmi A4 behavior remains unverified. Bank screens, OTPs and private documents should not be used in the public voice check.

Voice commands use Android's recognition service. On-device recognition is preferred where available; the system fallback may send microphone input to its provider. It is a short user-started session, not an always-listening assistant. There is no Android/browser TTS substitute: generated and bundled app speech uses ElevenLabs Raju.

## Where information remains

The phone retains the last original text and allowed audio privately for Repeat until Forget or app data removal. Temporary voice files are deleted when playback releases; imported PDF data remains until its document cleanup. Crash/process termination may interrupt cleanup. Local content storage has no fixed expiry.

Render request-content logging and Mastra workflow snapshots are disabled. The backend holds request text/audio in memory while processing. This is a code policy, not proof that every infrastructure layer has zero retention.

Backboard memory, search, tools and document upload are off. After a dispatched call, the adapter allows up to 45 seconds to receive its reply, including after the client presses Stop, so it can delete the returned request thread with a separate 10-second cleanup timeout. A stopped reader receives no late result. Unknown thread IDs, provider timeouts, malformed/oversized replies, failures and unsuccessful deletes can still leave provider-held content. Deletion is best effort; memory off is not zero retention. No claim is made about deleting Backboard/OpenRouter operational logs or ElevenLabs history. Provider retention settings and histories have not been independently verified.

Atlas stores preferences, UTC-day model/search counters and cached public support references, not reading content. The public preference API reserves `service_` identifiers for internal counters. Access uses temporary restricted database credentials and network rules, roughly expiring October 11–12; these must be checked and renewed deliberately. When Atlas is unavailable, model quota reservations fail closed; original speech remains independent of model quota.

Sentry code sanitizes transactions to stage, timing, model and token metadata and disables default PII/integrations. Reading text, URLs, credentials and arbitrary provider errors are omitted by the sanitizer tests. Configuration and a trace ID alone do not prove ingestion or retention. See the current audit receipt for dashboard status.

SerpApi receives two fixed public setup queries, never a family reading. pgvector stores only three approved public Android references and frozen vectors for three setup topics. Tiger Cloud is not used; this hosted PGlite/pgvector route is the documented pgvector/hybrid-search use case. No unrestricted Hindi search or BM25 claim is made.

## Explanation limits

Explanations are separate, experimental and audibly warn that AI can be wrong. Ordered anchors reject known quantity, negation, relation, duration, weekday and payment-word changes; they cannot verify the whole meaning. Medicines, deadlines and financial instructions require comparison with the original and family help. Original-reading mode avoids a generative rewrite, but its OCR can still be wrong.
