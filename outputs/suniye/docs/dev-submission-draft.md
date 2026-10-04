---
title: Suniye: let my parents hear the message themselves
published: true
tags: devchallenge, weekendchallenge, hf26challenge
---

*Built for the [Hacktoberfest Weekend Challenge: Build for a Friend](https://dev.to/challenges/hacktoberfest-weekend-2026-10-01).*

## What I Built

My mother and father ask me to read WhatsApp messages, pictures, labels and documents. Both have weak eyesight and use Redmi A4 phones. I am in another city right now, so that request can mean waiting for me to be available.

I built Suniye, or सुनिए, an Android reading aid for those moments. It reads small print aloud in Hindi and keeps the controls large: रोकिए to stop, फिर सुनिए to hear it again, धीरे सुनिए to slow down. The pilot supports Android 11 and later.

Reading an amount aloud took more care than sending the printed text to a voice API. `₹1,250` now becomes “एक हज़ार दो सौ पचास रुपये” in the speech input. The original stays visible, with a separate amount hint. Dates keep their written field order.

The daily screen follows the things they already ask me to do. कागज़ पढ़िए opens the camera, फ़ोटो पढ़िए selects a photo, and फ़ाइल पढ़िए opens a PDF. Android Share accepts text, images and PDFs. A floating सुनिए control is the intended WhatsApp route after caregiver setup.

रोकिए stays below the scrolling content, so a long document or enlarged font cannot push it away. Provider settings and optional tap-to-speak commands live behind caregiver setup; Redmi speech recognition remains untested.

I have tested synthetic material on Android emulators. I have not handed the app to my parents or collected their feedback. Real WhatsApp, Redmi firmware and offline Hindi listening remain unverified.

## Demo

[Watch the complete walkthrough](https://github.com/himanshu748/suniye/releases/download/v0.1.0-pilot/suniye-demo-judge.mp4) · [Download the pilot APK](https://github.com/himanshu748/suniye/releases/download/v0.1.0-pilot/suniye-debug.apk)

The film opens with the problem in Hindi, then shows a bill read as Hindi amount words, Repeat and Stop. It shows the exact image and PDF source files before their recognized text: नमस्ते from an image, बिल from PDF page 1 and धन्यवाद from page 2. The WhatsApp section is labelled as a setup walkthrough.

These are synthetic Android Share inputs using real content URIs, bundled OCR and live Raju v4 audio. Android screenrecord did not capture device sound, so I mixed the provider MP3s separately at the observed playback rate. Source previews are inserted stills; native waiting remains in the film. [Recording notes](https://github.com/himanshu748/suniye/blob/v0.1.0-pilot/outputs/suniye/docs/demo-script.md).

For WhatsApp messages, the intended steps are: open the message, then tap the green सुनिए control. For a photo or PDF, open the item, choose Share, then Suniye. Real WhatsApp testing remains pending.

## Code

[Source repository](https://github.com/himanshu748/suniye) · [Tests and limitations](https://github.com/himanshu748/suniye/blob/v0.1.0-pilot/outputs/suniye/docs/verification.md)

I began the scaffold on October 2 during the challenge. Code is MIT licensed. The debug APK includes synthetic fixtures; production source excludes them. Provider keys and family messages stay out of the repository. [Third-party notes](https://github.com/himanshu748/suniye/blob/v0.1.0-pilot/outputs/suniye/docs/third-party.md).

## How I Built It

The phone first reads accessible text or runs bundled Devanagari and Latin OCR. If OCR finds text, the image stays on the phone. Online speech sends the text through the backend to ElevenLabs. If OCR finds no text, an online description sends the image to the backend and its model. An installed offline Hindi voice can read the original without a backend; Redmi listening remains untested.

Mastra runs the online reading workflow. Two stages check the source, prepare an original reading or Gemma explanation, and optionally request speech. Each run has its own cancellation signal. Stop invalidates the phone's operation, cancels the request and discards late callbacks. A deliberately delayed-response test confirmed that reading did not restart after Stop.

Gemma 3 4B runs locally through Ollama for explanations and non-text picture descriptions. In a fresh backend check, “प्रवेश से पूर्व अपने जूते उतारना अनिवार्य है।” became “प्रवेश करने से पहले अपने जूते निकालें।” Both tell the reader to remove their shoes before entering. The warm model returned this meaning-preserving instruction through Mastra in 2.66 seconds. The film includes the saved reply, labelled as a separate backend check. [Receipt](https://github.com/himanshu748/suniye/blob/v0.1.0-pilot/outputs/suniye/docs/evidence/editorial-gemma-2026-10-04.json).

Other samples changed a date or replaced “attach” with “submit”. The quantity/negation guard caught some changes and missed others. Explanations remain experimental and separate from the original. [Model results](https://github.com/himanshu748/suniye/blob/v0.1.0-pilot/outputs/suniye/docs/model-evaluation.md).

OCR also failed on a dense bill. I added a retake below .85 confidence. The PDF invitation used in an early recording triggered that guard, so the final demonstration uses simpler text. This is a recovery heuristic, not an accuracy guarantee. Important amounts, dates and medicine labels still need a family member's check.

I selected Raju after listening to two Hindi samples. Its catalogue labels it Hindi with an Indian accent. Real Eleven v4 API audio played in Android, including the Hindi amount, cached Repeat and Stop. The [evidence ledger](https://github.com/himanshu748/suniye/blob/v0.1.0-pilot/outputs/suniye/docs/verification.md) contains 87 backend tests, pronunciation checks and dated runtime results.

I deployed the original-reading backend on Render's free Singapore service. An authenticated bill request preserved its source and returned real Raju audio; an unauthenticated request returned 401. The service can sleep, and hosted Gemma explanations and Atlas sync are still unconfigured. [Live check](https://github.com/himanshu748/suniye/blob/live-evidence-2026-10-04/outputs/suniye/docs/evidence/render-live-2026-10-04.json).

Sentry's Agent Activity showed a local Gemma request taking 32.64 seconds: 24.96 seconds loading, 4.62 seconds evaluating the prompt and 2.73 seconds generating. It recorded 143 input and 11 output tokens without the reading text in the outgoing trace. That gives me a way to distinguish model loading from generation instead of blaming the voice. [Trace evidence](https://github.com/himanshu748/suniye/blob/live-evidence-2026-10-04/outputs/suniye/docs/evidence/sentry-live-2026-10-04.json).

I also used Backboard for six synthetic Hindi calls comparing Gemma 3 4B with Qwen 2.5 72B. Every amount/date literal check passed, but Gemma added a meeting or event absent from the source. Qwen avoided that addition in these three cases. I am keeping original reading first and explanations experimental; this small comparison does not establish a general ranking. [Replies and source review](https://github.com/himanshu748/suniye/blob/live-evidence-2026-10-04/outputs/suniye/docs/evidence/backboard-comparison.json).

Claude reviewed the PRD, spec and selected source. I fixed its findings and ran separate runtime checks. Source review helped find issues; it did not establish how the app feels to my parents.

## Why Does Open Innovation Matter?

I can inspect Mastra's workflow, change its stages and test cancellation without handing the reading policy to a closed agent. The model and speech providers are separate modules. Both can be replaced without changing the Android controls.

Local Gemma lets me repeat a failure on synthetic Hindi material and inspect the response. Gemma runs on my laptop, not inside the APK. Remote phones need an authenticated HTTPS backend for explanations and descriptions. The open workflow is running in the online reading demo; the original-reading path does not need a generative rewrite.

Gemma weights have their own terms, and Google's OCR SDK is proprietary. I disclose both because another builder needs to know what they can reuse.

While preparing this write-up, I read [Samajh](https://dev.to/adityaanenenu5/samajh-a-reader-for-the-letters-my-mother-couldnt-read-2emg) by [adityaanenenu5](https://dev.to/adityaanenenu5), which focuses on document explanations tied to source quotes, and [ReadAloud](https://dev.to/yramstech/i-find-reading-hard-so-i-built-a-text-to-speech-reader-for-android-heres-how-31ci) by [yramstech](https://dev.to/yramstech), which focuses on following spoken words. My focus here is my parents' small-print problem, Hindi amounts and reachable Android controls.

## My Agent Session

I used Entire to import the development session locally. A checkpoint lookup recovered my instruction: “they ask me to do it so ux and ui needs to be specifically for them”. That explains the large Hindi controls and separate caregiver setup. [Curated provenance](https://github.com/himanshu748/suniye/blob/v0.1.0-pilot/outputs/suniye/docs/build-provenance.md) connects those instructions to the code; full private transcripts remain private.

## Prize Categories

I am entering eight categories with these evidence boundaries:

- **ElevenLabs:** Raju v4 Hindi API audio played by Android and used in the film. Attribution: [elevenlabs.io](https://elevenlabs.io).
- **Mastra:** the online reading workflow, validation and cancellation checks.
- **Gemma:** local explanation and picture trials, with dated successes and unresolved failures.
- **Entire:** imported checkpoint lookups explaining interface decisions.
- **SerpApi:** searches supplied two official Google Android help articles for a Gemma caregiver summary on October 2. The next day's search returned no approved articles and stopped generation. This is dated development use.

- **Render:** the free Singapore service passed authenticated original reading with real Hindi audio. Hosted Gemma remains separate.
- **Sentry Agent Tracing:** an ingested Suniye/Gemma agent trace exposed model loading as the main delay in one request.
- **Backboard:** six real calls compared open-weight models on synthetic Hindi sources and exposed an added-context error.

Atlas has a restricted temporary user, but its live preference read/write is still pending, so I am leaving that category out. [Sponsor ledger](https://github.com/himanshu748/suniye/blob/live-evidence-2026-10-04/outputs/suniye/docs/sponsor-tracks.md).

My next check is to have each parent open a message, read a paper, stop and replay without my help. Those results still need to be collected.
