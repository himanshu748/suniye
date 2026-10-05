---
title: Suniye: let my parents hear the message themselves
published: true
tags: devchallenge, weekendchallenge, hf26challenge
---

*Built for the [Hacktoberfest Weekend Challenge: Build for a Friend](https://dev.to/challenges/hacktoberfest-weekend-2026-10-01).*

## What I Built

My mother and father ask me to read WhatsApp messages, pictures, labels and documents. Both have weak eyesight and use Redmi A4 phones. I am in another city, so a small request can mean waiting for me to become available.

I built **Suniye / सुनिए**, an Android 11+ reading aid that turns small print into Hindi speech. Large buttons let them stop, repeat and slow the reading themselves. A caregiver does the initial setup; daily reading should take fewer decisions.

![Silent preview of the tested Android 0.4 image-to-speech workflow](https://raw.githubusercontent.com/himanshu748/suniye/codex/challenge-entry/outputs/suniye/docs/evidence/native-0.4-preview.gif)

**[Watch the 82-second narrated walkthrough](https://suniye-reader.onrender.com/#walkthrough)** · **[Download Android 0.4](https://github.com/himanshu748/suniye/releases/download/parent-ux-2026-10-05/suniye-parent-ux-0.4.apk)** · **[Live project](https://suniye-reader.onrender.com/)**

The video shows the exact synthetic photo, its नमस्ते reading, then two PDF pages reading बिल and धन्यवाद. All speech, including the opening and sharing guidance, is **ElevenLabs Raju**. The GIF is silent; the video has sound. This is the tested 0.4 APK calling the public Render backend directly over HTTPS. The film uses normal system text size; the separate full native suite passed at 160%.

Android screenrecord did not capture device sound. I mixed the exact successful response MP3s at the app's playback speed with approximate visual/event alignment. Source previews are inserted stills; native reading waits remain. The final WhatsApp segment shows Suniye's actual help screen, not a real WhatsApp conversation. [Recording receipt](https://github.com/himanshu748/suniye/blob/codex/challenge-entry/outputs/suniye/docs/evidence/native-0.4-video-2026-10-05.json).

## How my parents would use it

1. **Paper:** tap कागज़ पढ़िए and photograph the writing.
2. **A saved photo or PDF:** choose फ़ोटो पढ़िए / फ़ाइल पढ़िए, or share the file to Suniye from Android's Share menu. PDFs have a next-page control.
3. **A WhatsApp item:** share the selected text, opened photo or PDF to Suniye. A floating सुनिए screen-reading control is another intended route after caregiver accessibility setup. Actual WhatsApp sender behavior still needs testing on their phones.
4. **Listen at their pace:** रोकिए stays below the scrolling content. फिर सुनिए repeats the current recording; धीरे सुनिए slows it. Successful audio can replay offline. A new reading needs the backend.

An amount needed more care than passing digits to a voice API. `₹1,250` becomes “एक हज़ार दो सौ पचास रुपये” in the speech input while the original remains visible. Shared Java/JavaScript fixtures also cover compact units, percentages, signs, decimal rupees and explicit clock times. Ambiguous dates and ratios keep their written order.

This is a pilot for my parents, not a claim that they have tested it. They are in another city. Redmi A4 behavior, their listening comfort, spoken-command recognition and independent use remain family checks.

## Demo and Code

[Source repository](https://github.com/himanshu748/suniye) · [Caregiver setup](https://github.com/himanshu748/suniye/blob/codex/challenge-entry/outputs/suniye/docs/caregiver-setup.md) · [Current verification](https://github.com/himanshu748/suniye/blob/codex/challenge-entry/outputs/suniye/docs/verification.md)

The downloadable debug pilot is **0.4.0-parent-ux**. Its SHA-256 is `f2a93ab8c1dcb2acc8c7ded211e7d2b1bcee254f3a41a6b852a897d2f7a47af0`. Earlier videos and APKs remain labelled historical. Synthetic fixtures are debug-only; provider keys and family messages stay out of the repository and APK.

For an offline prepared example, the separate [HTML reader](https://github.com/himanshu748/suniye/releases/download/niche-integrations-2026-10-04/elevenlabs-prepared-reader.html) displays its source and plays embedded Raju recordings. It does not generate new speech or replace the Android app.

## How I Built It

### Photo/PDF → local OCR → original Hindi speech

Bundled Devanagari and Latin OCR recognizes the image or rendered PDF page on the phone. Recognized text goes through the authenticated Render backend and Mastra workflow to ElevenLabs. The image stays local on this route. The current APK refuses a no-text image before uploading it; picture description is unavailable.

The voice policy accepts Raju only. Fixed instructions are bundled Raju recordings; successful readings cache their audio. Missing audio produces an explicit recovery message rather than silently changing to Android or browser TTS.

### A model failure changed the product

“Faithfulness” means keeping the original meaning. During testing, model explanations changed relationships, dates or instructions, or added plausible context absent from the source. Literal amount checks caught some errors and missed others. A hosted milk-sentence reply even added a reason about keeping milk cold.

I therefore **removed generative rewriting from the parent reading flow**. Optional शब्दों की मदद now gives reviewed dictionary definitions, clearly labels them as general meanings, and retains the unchanged original. It does not interpret a whole instruction. OCR can still be wrong, so important amounts, dates and medicine labels need comparison with the source and family help.

Gemma has a narrower role on the [separate caregiver page](https://suniye-reader.onrender.com/caregiver): summarize fixed public setup references retrieved by pgvector. The caregiver supplies the private family connection code; it stays in page memory. **Parent readings do not go to Gemma, Backboard or OpenRouter.**

The new hosted Gemma 3 27B request returned a Hindi summary of Google's display-settings reference and its link. It correctly retained the source's qualification that some methods need Android 13 or later. This is one inspected success, not a general accuracy score. [Exact request outcome](https://github.com/himanshu748/suniye/blob/codex/challenge-entry/outputs/suniye/docs/evidence/hosted-public-summary-2026-10-05.json).

Backboard uses explicit provider routing, token-price ceilings and no automatic fallback. Memory, search and tools are off. Atlas counts failed and uncertain attempts as well as successes. The normal limit is eight attempts per UTC day. I approved one extra validation attempt on October 5; its persistent counter moved from eight to nine without a reset. Further model calls are capped today. Original speech and dictionary help are independent of this quota.

### Stop, recovery and readable controls

Mastra carries a cancellation signal through the reading stages. Stop invalidates the phone's operation and discards late replies. A dispatched model call can finish a bounded response to recover its thread ID for deletion; unknown IDs, timeouts and failed deletes mean I cannot promise zero provider retention. [Data flow](https://github.com/himanshu748/suniye/blob/codex/challenge-entry/outputs/suniye/docs/privacy.md).

A Sonnet 5.5 audit found native replay, failure-message and disclosure gaps. The 0.4 revision displays word help separately, replays its current recording correctly, offers an explicit original-reading button, restores cached state and speaks specific Hindi recovery prompts. No-text pictures no longer leave the phone for an unsupported description route.

Atlas now reconnects after transient startup/network failures without automatically repeating uncertain writes. A duplicate-key upsert race no longer disables the store. Unauthenticated traffic cannot spend the family's API bucket, while static pages avoid starving behind a shared proxy limit.

### What I actually tested

- **125 backend tests** and **56 shared Java/JavaScript pronunciation fixtures** passed.
- The same APK passed **all three Android 11 instrumentation suites at 160% fonts**: parent layout/media state, recovery/cache behavior, and image/PDF Share → OCR → hosted Raju → next page → Stop → WhatsApp help. These were direct HTTPS requests, with normal certificate checks and no relay. [Native receipt](https://github.com/himanshu748/suniye/blob/codex/challenge-entry/outputs/suniye/docs/evidence/native-0.4-e2e-2026-10-05.json).
- Hosted Atlas settings survived a deploy/process replacement; write/read, content-field rejection and synthetic-record cleanup passed. Three simultaneous fixed-topic pgvector requests passed. [Hosted checks](https://github.com/himanshu748/suniye/blob/codex/challenge-entry/outputs/suniye/docs/evidence/hosted-e2e-2026-10-05.json) · [Retrieval](https://github.com/himanshu748/suniye/blob/codex/challenge-entry/outputs/suniye/docs/evidence/hosted-pgvector-concurrent-2026-10-05.json).
- Sentry's signed-in trace view confirmed a hosted agent/model request: 4.13 seconds total, 2.89 seconds in Gemma 4B and 158 tokens, without displayed input/output content. This earlier trace is one run, not an average or the new caregiver-summary trace. [Receipt](https://github.com/himanshu748/suniye/blob/codex/challenge-entry/outputs/suniye/docs/evidence/hosted-sentry-2026-10-05.json).

![Earlier actual hosted Suniye agent trace: timing and token data, no reading content](https://raw.githubusercontent.com/himanshu748/suniye/codex/challenge-entry/outputs/suniye/docs/evidence/hosted-sentry-2026-10-05.png)

The emulator suites exercise app views and media state; they do not establish a complete physical-touch walkthrough or actual WhatsApp/Redmi use. Dense OCR still fails some examples. Very long expanded speech can exceed its limit and leave the original visible without audio. [Audit fixes and remaining boundaries](https://github.com/himanshu748/suniye/blob/codex/challenge-entry/outputs/suniye/docs/sonnet-audit-disposition-2026-10-05.md).

## Why Does Open Innovation Matter?

I can inspect Mastra's workflow and change its stages when a model fails. Open model experiments exposed why a plausible rewrite is insufficient for my parents' messages. The code now makes that decision explicit: preserve the parent source, use reviewed word meanings, and restrict generative help to a separate public-reference task.

I began the scaffold on October 2. The code is MIT licensed; Gemma and Google's bundled OCR have separate terms. While preparing the entry, I read [Samajh](https://dev.to/adityaanenenu5/samajh-a-reader-for-the-letters-my-mother-couldnt-read-2emg) and [ReadAloud](https://dev.to/yramstech/i-find-reading-hard-so-i-built-a-text-to-speech-reader-for-android-heres-how-31ci). My focus is my parents' small-print problem, Hindi amounts and reachable Android controls.

## My Agent Session

Entire imported eighteen development checkpoints. A lookup recovered my instruction: “they ask me to do it so ux and ui needs to be specifically for them”. That connects the large Hindi controls and separate caregiver setup to the original brief. [Curated provenance](https://github.com/himanshu748/suniye/blob/v0.1.0-pilot/outputs/suniye/docs/build-provenance.md); full private transcripts remain private.

Claude reviewed the PRD/specification, and Sonnet 5.5 independently audited source and targeted tests. I fixed findings and verified runtime behavior separately. Source review does not tell me how the app feels to my parents.

## Prize Categories

Ten targets, each with a bounded role. Nine are runtime integrations; Entire is development provenance. These are claims for judging, not guaranteed qualifications.

| Category | What it does and why | Evidence and limit |
| --- | --- | --- |
| **ElevenLabs** | Raju reads Hindi originals, fixed help and video narration; cached audio supports Repeat/Slow. | Real hosted audio played in the current Android tests. No substitute voice. Parent listening remains unobserved. Voice attribution: [ElevenLabs](https://elevenlabs.io). |
| **Mastra** | Validates a reading, prepares unchanged source or dictionary help, and requests speech with cancellation. | Hosted reads and delayed-reply/Stop tests. It keeps narration distinct from optional caregiver AI. |
| **Gemma** | Summarizes fixed public setup references in Hindi for the caregiver. | New hosted 27B summary with its approved source link; parent generative rewriting was removed after failures. |
| **Backboard** | Hosts the Gemma route while my laptop is off and supported a six-call development comparison. | Actual caregiver request; memory/search/tools off, Atlas daily quota and best-effort thread deletion. No general model ranking or zero-retention claim. |
| **Render** | Hosts the authenticated API, landing and caregiver page. | Current direct Android HTTPS and hosted receipts. Free service can sleep; scheduled health checks are best effort. |
| **MongoDB Atlas** | Persists caregiver preferences, quota counters and public help cache. | Hosted write/read, process-replacement persistence, content rejection and the extra-call counter. Android settings-sync UI is not yet verified. Access is temporary. |
| **Sentry Agent Tracing** | Separates workflow/model latency and token use without logging the reading. | Signed-in hosted trace readback; one earlier 4B synthetic run, not an average or billing receipt. |
| **SerpApi** | Checks fixed public queries for current official setup references. | Live HTTP 200 returned zero approved URLs; the UI retains curated help instead of inventing links. The older cache lacks raw-row counts, so its rejection cause is unknown. |
| **Tiger Data / pgvector** | Retrieves approved setup references using keyword/vector ranking. | Hosted PGlite/pgvector, three fixed topics and concurrent requests. The new Gemma summary consumes this retrieval. No Tiger Cloud or unrestricted search claim. |
| **Entire** | Links interface decisions to the family brief. | Imported checkpoints and public curated provenance; not an artificial runtime dependency. |

The [Tiger Data category](https://dev.to/challenges/hacktoberfest-weekend-2026-10-01#best-use-of-tiger-data) explicitly accepts pgvector/hybrid retrieval. [Sponsor ledger and receipts](https://github.com/himanshu748/suniye/blob/codex/challenge-entry/outputs/suniye/docs/sponsor-tracks.md).

No cash purchase or paid resource was created. Render required payment information despite the $50 credit, so it remains Free. Temporal Cloud also required payment information and is excluded. TabPFN has no measured OCR outcome table, inference or demonstrated benefit, so it is excluded too. Atlas and provider credentials retain their temporary expiry/cap requirements.

My next family check is concrete: can each parent read a WhatsApp item and a paper label, then stop and replay without my help? I have not observed that yet. This entry reports the working pilot and its tested boundaries.
