---
title: Suniye: let my parents hear the message themselves
published: false
tags: devchallenge, weekendchallenge, hf26challenge
---

*Prepared for the [Hacktoberfest Weekend Challenge: Build for a Friend](https://dev.to/challenges/hacktoberfest-weekend-2026-10-01). Publication is pending the public demo and source links.*

## What I Built

My mother and father ask me to read WhatsApp messages, pictures, labels and documents. Both have weak eyesight and use Redmi A4 phones. I am in another city right now, so that request can mean waiting for me to be available.

I built Suniye, or सुनिए, an Android reading aid with large Hindi buttons. They can listen, stop, listen again or slow the voice down. A separate button asks for an explanation in simpler Hindi. The pilot supports Android 11 and later.

The interface follows the tasks they already ask me to do. कागज़ पढ़िए opens the camera, फ़ोटो पढ़िए selects a photo and फ़ाइल पढ़िए opens a PDF. Shared text, images and PDFs can enter through Android's Share or Open actions. The intended WhatsApp route adds a floating सुनिए control after caregiver setup, so they can read from the message they have open.

रोकिए stays below the scrolling content. It remains reachable when a document is long, the font is enlarged or the model is still working. Repeat and Slow appear after a reading exists. Provider settings stay on a separate caregiver screen.

I have tested synthetic material on Android 11 and Android 15 emulators, including enlarged fonts and dark mode. I have not put this build on my parents' phones or collected their feedback. The WhatsApp overlay checks used a synthetic app window; real WhatsApp and Redmi firmware behavior remain unverified.

## Demo

**Recorded demo (voice: elevenlabs.io):** [PUBLIC_DEMO_URL]

The recording shows a real Android app receiving a synthetic electricity bill. The caregiver-enabled online voice returns Hindi ElevenLabs audio through the backend, and the app plays it. Slow starts a slower replay; Stop cancels it.

Gemma then attempts a separate explanation. It changes `02/10/2026` into a written month format and adds a duplicate currency word, so the conservative guard rejects the result. Neither change proves an incorrect calendar date or amount. The original bill remains available through Repeat. This is a recorded refusal, not a successful explanation substituted into the video. A [separate dated live test](evidence/gemma-explanation-final.json) produced a Hindi explanation that preserved the amount and date.

The video identifies the emulator and synthetic inputs. Its audio combines English narration and the actual Hindi API MP3 captured separately; Android's screen recorder did not capture device sound. The Slow and Repeat segments use the same API MP3 time-stretched to match the app's selected rate. The [native receipt](evidence/entry-demo-receipt-2026-10-03.json) identifies the recorded debug APK by SHA-256. ElevenLabs attribution: [elevenlabs.io](https://elevenlabs.io).

[Evidence and limitations](evidence/entry-readiness-2026-10-03.md) include input, camera, PDF, large-font and cancellation checks. Hearing Hindi on the parents' phones and checking spoken amounts still require a real device.

## Code

**Source:** [PUBLIC_REPOSITORY_URL]

Suniye's source is MIT licensed. The repository includes Android source, the Node backend, tests, caregiver instructions and dated evidence. The downloadable pilot APK is a debug build with synthetic fixtures and instrumentation. The APK and recorded demo are separate release downloads; production source sets exclude the debug harness. Provider keys, model weights, private chat history and family messages are excluded.

I began this project's scaffold during the challenge on October 2. Gemma, Android tools and the dependencies existed before it; I did not train Gemma or write Google's OCR SDK. [Third-party notes](third-party.md) describe those boundaries.

## How I Built It

Android reads accessible text or runs bundled Devanagari and Latin OCR on images. An installed offline Hindi voice can read the original without a backend. The app also offers caregiver-enabled online speech. It keeps the last reading privately on the phone for Repeat, with a control to delete it.

For explanations and non-text picture descriptions, Gemma 3 4B runs through Ollama on my laptop. Mastra runs the backend's extraction, validation, explanation and optional speech stages. The phone sends a request only for a deliberate reading action. Provider keys stay on the backend. The family access token is encrypted on the phone.

An early synthetic bill exposed errors in both generative OCR and bundled OCR. Gemma changed a word and took about 56 seconds. Bundled OCR misread the dense fixture with a lowest confidence of 0.72. I made OCR run first and ask for a clearer crop below 0.85. A larger नमस्ते fixture read correctly at 0.93. The threshold is a retake heuristic; these samples do not establish accuracy across handwriting or labels.

Gemma cannot supply guessed image text when OCR finds none. Its picture descriptions still need work: one test described a square as a rectangle, and earlier calls retook or timed out. Explanations can also add context. The numeric and negation checks catch some changes, but they do not prove that every explanation preserves meaning. The app keeps original reading separate, and important amounts, dates and medicine labels still need someone to check them.

Stop invalidates the operation, cancels work and discards late callbacks. A deliberately delayed backend test confirmed that a response arriving after Stop did not resume playback. PDF loading and the selected page also survive activity recreation; deleting the reading removes its cached PDF.

Claude reviewed the PRD, spec and selected implementation files through the desktop Code view. I fixed the issues it identified, including malformed shares, raw setup errors and unchecked links in a generated caregiver guide. Its source review and my runtime checks are recorded separately. The backend has 44 passing tests; injected provider tests are identified separately from live calls.

## Why Does Open Innovation Matter?

Local Gemma lets me inspect a failure on synthetic Hindi material, change the prompt and run the same case again. Mastra's source and tests make the reading stages inspectable. Another builder can change those stages or remove an optional provider without rebuilding the idea from scratch.

The model's roughly 3.3 GB weights stay on the laptop; the debug APK is about 51 MB. Remote phones need a reachable authenticated HTTPS backend for explanations and descriptions. Local development inference does not make those features offline on a phone.

Suniye's code is open source. Gemma weights use separate Gemma terms, and Google's bundled OCR is proprietary. I disclose those dependencies because someone trying to reuse the app needs to know what they can change and distribute.

## My Agent Session

I used Entire to import the development session locally and recover my instruction that the UI needed to work specifically for my parents. That explains the large Hindi controls and separate caregiver setup. Another checkpoint recovered the request to use multiple fitting sponsors. [The curated provenance note](build-provenance.md) connects those instructions to the code. Full private transcripts remain private.

## Prize Categories

I am entering the Gemma, Mastra, ElevenLabs, Entire and SerpApi categories, with the following evidence and limits:

- **Gemma:** local Gemma 3 4B explanation and picture trials, including successful output and recorded failures.
- **Mastra:** the reading workflow used by the live backend and Android demo, with cancellation and validation checks.
- **ElevenLabs:** actual Hindi API audio in the app plus demo narration. Phone pronunciation and listening comfort remain untested.
- **Entire:** imported development checkpoints and actual lookups used to explain interface decisions.
- **SerpApi:** October 2 searches supplied two official Google help articles for a Gemma caregiver summary. October 3 searches produced no approved articles, and the guide refused to generate. It is a dated development use, not a claim that current Redmi setup instructions work.

Atlas preference sync, Sentry tracing, a Backboard comparison runner and a Render blueprint are implemented or prepared, but their live application checks are incomplete. I am not entering those categories on the strength of an SDK, account or configuration file.

The next family check is concrete: have each parent open one message, read one paper, stop and replay the reading without my help. I can record those results once the app reaches their phones.
