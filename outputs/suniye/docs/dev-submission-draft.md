---
title: Suniye: let my parents hear the message themselves
published: true
tags: devchallenge, weekendchallenge, hf26challenge
---

*Built for the [Hacktoberfest Weekend Challenge: Build for a Friend](https://dev.to/challenges/hacktoberfest-weekend-2026-10-01).*

## What I Built

My mother and father ask me to read WhatsApp messages, pictures, labels and documents. Both have weak eyesight and use Redmi A4 phones. I live in another city. A small piece of text can become a request, a phone call, and a wait.

I built **Suniye / सुनिए**, an Android 11+ reading aid that turns shared text, images and PDF pages into Hindi speech. The purpose is simple: make everyday small print easier to hear, with large controls for **Repeat, Slow and Stop**. A caregiver handles the initial connection setup.

The interface is Hindi because that is the language my parents need. This writeup and the walkthrough's explanations are English so judges can follow the demonstration; the app's actual reading remains Hindi.

## Demo

**[Watch the narrated image → Hindi speech → two-page PDF walkthrough](https://suniye-reader.onrender.com/#walkthrough)** · **[Download Android 0.4.1](https://github.com/himanshu748/suniye/releases/download/real-documents-2026-10-05/suniye-parent-ux-0.4.1.apk)** · **[Live project](https://suniye-reader.onrender.com/)**

The walkthrough uses substantial public documents:

- A Hindi consumer-complaint notice cropped from a real DERC bulletin—the kind of notice image someone could share in a chat.
- A complete two-page Uttar Pradesh electricity notice, containing full paragraphs, dates and numbers.
- The app's uncertainty confirmation, actual Hindi playback, PDF next page, Repeat and Stop, followed by WhatsApp sharing instructions.

These are dated public documents, **not private WhatsApp messages or current advice**. [Original sources and exact input hashes](https://github.com/himanshu748/suniye/blob/codex/challenge-entry/outputs/suniye/docs/real-document-walkthrough.md).

![Actual Android reading of the public Hindi notice](https://raw.githubusercontent.com/himanshu748/suniye/codex/challenge-entry/landing/assets/android-reading.png)

**WhatsApp route:** open an image or PDF → Share → Suniye. For a text message, use Share when offered, or copy it into Suniye. The app receives Android's shared content; it does not need access to the whole conversation. The video demonstrates the receiving app and explains the sender steps.

Every voice in the film is **ElevenLabs Raju**. English narration explains each step; Hindi speech comes from the actual successful hosted responses. Android screenrecord does not capture device audio, so those response MP3s are mixed at the app's playback speed with approximate event alignment. The film includes labelled excerpts from the full PDF playback checks. [Recording and test receipt](https://github.com/himanshu748/suniye/blob/codex/challenge-entry/outputs/suniye/docs/evidence/native-real-documents-video-2026-10-05.json).

## Code

[Source repository](https://github.com/himanshu748/suniye) · [Release and APK checksum](https://github.com/himanshu748/suniye/releases/tag/real-documents-2026-10-05) · [Caregiver setup](https://github.com/himanshu748/suniye/blob/codex/challenge-entry/outputs/suniye/docs/caregiver-setup.md) · [Verification](https://github.com/himanshu748/suniye/blob/codex/challenge-entry/outputs/suniye/docs/verification.md)

The downloadable app is a debug pilot. Provider credentials stay on the backend; a caregiver privately supplies the family connection code. The website offers the walkthrough and a prepared voice sample; it is not a public upload service. Its separate [caregiver page](https://suniye-reader.onrender.com/caregiver) provides authenticated setup help.

## How I Built It

### From a picture to speech

Bundled Devanagari/Latin OCR recognizes an image or rendered PDF page **on the phone**. The image stays local on this route. Recognized text goes through the authenticated Render backend and a Mastra workflow to ElevenLabs. The displayed recognized text and spoken caution remain separate.

Small-print OCR is imperfect. A substantially uncertain page waits for the explicit **सावधानी से सुनिए** confirmation and starts with an audible caution. Flagged number groups are withheld as **अस्पष्ट संख्या**. Pages with too little usable text ask for a clearer image. Confidence is a heuristic, not a guarantee: names, dates and amounts still need comparison with the source.

Amounts also need deliberate pronunciation. `₹1,250` becomes **“एक हज़ार दो सौ पचास रुपये”**, while the original remains visible. Shared Java/JavaScript fixtures cover money, units, percentages, signs and clock times. Ambiguous dates keep their written order.

### A failure changed the design

I initially wanted AI to explain every message. A six-call Backboard comparison of Gemma and Qwen exposed the problem: literal-number checks passed even when a response added an event or inferred a person absent from the source. This tiny comparison is not a model ranking, but it showed why a fluent rewrite is insufficient. [Inputs, replies and review notes](https://github.com/himanshu748/suniye/blob/codex/challenge-entry/outputs/suniye/docs/evidence/backboard-comparison.json).

I removed generative rewriting from the parent reading flow. **शब्दों की मदद** now gives reviewed dictionary meanings beside the unchanged recognized text. “Faithfulness” here means preserving what the source says, rather than supplying a plausible interpretation. OCR errors remain a separate limitation.

Gemma has a narrower task: summarize **fixed public Android setup references for the caregiver**, retrieved with pgvector. Parent readings never enter Gemma or Backboard. A hosted Gemma 3 27B summary correctly retained Google's qualification that some display-setting methods require Android 13 or later. That is one inspected result, not an accuracy score. [Hosted result](https://github.com/himanshu748/suniye/blob/codex/challenge-entry/outputs/suniye/docs/evidence/hosted-public-summary-2026-10-05.json).

### Controls and recovery

Stop invalidates the active operation and ignores late replies. Repeat and Slow use the current cached Raju recording, including offline. A new reading needs internet. Missing audio produces a specific Hindi recovery prompt; there is no fallback to another voice.

A Sonnet 5.5 review found three important OCR issues: an old recording could remain available during a new page's review; partial number masking could imply a wrong amount; and a warning was being stored as source text. I fixed each, added regression checks, and separated the warning from both the source and dictionary input. The full-page test also exposed a 20-second synthesis timeout: a real page needed 33 seconds, so long readings now have a bounded 60-second allowance and remain cancellable.

### Verification

- **127 backend tests**, **57 shared pronunciation cases**, and the standalone OCR-policy regression harness pass.
- The new APK's Android 11 checks cover large-font layout, pending OCR confirmation, cache/recovery, and real image/PDF receiving → local OCR → public HTTPS → Raju playback → Repeat/Stop. Full-page completion is checked separately from the edited video. [Native evidence](https://github.com/himanshu748/suniye/blob/codex/challenge-entry/outputs/suniye/docs/evidence/native-real-documents-2026-10-05.json).
- Hosted Atlas preferences survived process replacement. Concurrent pgvector queries, the caregiver summary, and Sentry trace readback have separate receipts in the [sponsor ledger](https://github.com/himanshu748/suniye/blob/codex/challenge-entry/outputs/suniye/docs/sponsor-tracks.md).

These are instrumented Android emulator and hosted-service checks. They do not establish physical-device compatibility or external WhatsApp sender behavior. OCR may misread dense layouts; picture description is unavailable. Render Free can sleep. Temporary provider credentials and Atlas access need maintenance. No cash purchase or paid resource was created.

## Why Does Open Innovation Matter?

Mastra's open-source workflow is on the actual reading path: I can inspect source handling, change the stages, propagate cancellation, and test the decision to preserve text. Gemma's open weights made it possible to compare a smaller model with another open-weight model through the same Backboard API, then narrow generative help to a task with public sources.

That openness was useful when an attractive feature failed. I could remove the rewriting stage without replacing the interface or speech service. The result is a reading aid with an explicit boundary between recognized text, dictionary help and generated caregiver guidance.

The MIT code began during this challenge on October 2. Gemma, bundled Google OCR, ElevenLabs and the public source documents have their own terms; the entire stack is not claimed to be open source. I also read [Samajh](https://dev.to/adityaanenenu5/samajh-a-reader-for-the-letters-my-mother-couldnt-read-2emg) and [ReadAloud](https://dev.to/yramstech/i-find-reading-hard-so-i-built-a-text-to-speech-reader-for-android-heres-how-31ci) while preparing the entry. Suniye's focus is Hindi small print, spoken amounts and reachable Android controls.

## My Agent Session

Entire imported eighteen development checkpoints. A lookup recovered my original instruction: “they ask me to do it so ux and ui needs to be specifically for them”. That connects the Hindi controls and caregiver setup to the brief. [Curated development provenance](https://github.com/himanshu748/suniye/blob/v0.1.0-pilot/outputs/suniye/docs/build-provenance.md).

Claude reviewed the PRD/specification; Sonnet 5.5 independently reviewed source and targeted changes. Runtime verification is recorded separately. Private transcripts and credentials are excluded.

## Prize Categories

Ten category targets: nine runtime roles and Entire for development provenance. Each has a concrete job; qualification is for the judges to decide.

| Category | How and why Suniye uses it | Evidence/result |
| --- | --- | --- |
| **Best Use of ElevenLabs** | Raju voices Hindi readings, authored recovery prompts and English demo narration. | Current Android hosted playback; cached Repeat/Slow; strict voice allowlist. [Voice attribution](https://elevenlabs.io). |
| **Best Use of Mastra** | Orchestrates source validation, reading/dictionary stages, speech and cancellation. | Hosted original/help requests and cancellation regression tests. |
| **Best Use of Gemma** | Generates Hindi caregiver summaries of fixed public setup references. | Hosted 27B summary with its approved source link; separate from parent readings. |
| **Best Use of Backboard** | One API for the six-call Gemma/Qwen comparison, plus hosted Gemma caregiver help. | Comparison replies and current hosted result. Memory/search/tools off; Atlas-backed daily limit. |
| **Best Use of Render** | Serves the authenticated API, landing and caregiver page. | Actual Android requests to the public HTTPS deployment. Free service; health checks do not guarantee uptime. |
| **Best Use of MongoDB Atlas** | Persists preferences, model quota counters and public help cache. | Hosted write/read, persistence across process replacement, content rejection and cleanup. |
| **Best Use of Sentry Agent Tracing** | Shows where a workflow spends time and tokens without logging reading content. | Dashboard trace: 4.13 s total, 2.89 s in Gemma, 158 tokens. One earlier 4B run, not an average or the newer 27B summary. |
| **Best Use of SerpApi** | Checks fixed public queries for current official setup references. | Live HTTP 200; zero approved URLs in the inspected result. Curated references remain available instead of fabricated links. |
| **Best Use of Tiger Data** | PGlite/pgvector retrieves approved references using keyword/vector ranking. | Hosted topic and concurrent-query checks; retrieved display reference feeds the Gemma summary. No Tiger Cloud claim. |
| **Best Use of Entire** | Connects implementation decisions to the original brief. | Eighteen imported checkpoints and curated requirement lookup. |

In that earlier trace, the model call accounted for about 70% of total latency, identifying it as the main wait in that run. This is a diagnostic observation, not a measured speed improvement.

![Actual hosted Suniye agent trace showing timing and tokens without reading content](https://raw.githubusercontent.com/himanshu748/suniye/codex/challenge-entry/outputs/suniye/docs/evidence/hosted-sentry-2026-10-05.png)

[Detailed sponsor receipts and limits](https://github.com/himanshu748/suniye/blob/codex/challenge-entry/outputs/suniye/docs/sponsor-tracks.md). The normal model budget is eight attempts per UTC day; an explicitly approved ninth validation on October 5 is recorded without resetting the counter. Original speech and dictionary help are independent of that budget.

Temporal, TabPFN, DigitalOcean, Tinker and Arduino are excluded because they do not have a demonstrated hosted role in this entry.
