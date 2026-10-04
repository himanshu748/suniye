---
title: Suniye: let my parents hear the message themselves
published: true
tags: devchallenge, weekendchallenge, hf26challenge
---

*Built for the [Hacktoberfest Weekend Challenge: Build for a Friend](https://dev.to/challenges/hacktoberfest-weekend-2026-10-01).*

## What I Built

My mother and father ask me to read WhatsApp messages, pictures, labels and documents. Both have weak eyesight and use Redmi A4 phones. I am in another city right now, so that request can mean waiting for me to be available.

I built Suniye, or सुनिए, an Android reading aid for those moments. It reads small print aloud in Hindi and keeps the controls large: रोकिए to stop, फिर सुनिए to hear it again, धीरे सुनिए to slow down. The pilot supports Android 11 and later.

**See a photo and PDF become Hindi speech in 24 seconds.**

![Silent preview: an image and both PDF pages become recognized Hindi text in Suniye](https://raw.githubusercontent.com/himanshu748/suniye/media-showcase-2026-10-04/outputs/suniye/docs/evidence/image-pdf-to-speech-preview.gif)

[Play the short video with Raju's Hindi voice](https://github.com/himanshu748/suniye/releases/download/media-showcase-2026-10-04/suniye-image-pdf-to-speech.mp4). The preview above is silent. The video shows the exact source image, then नमस्ते read aloud; PDF page 1 reads बिल, and page 2 reads धन्यवाद. The large रोकिए control stays reachable.

Reading an amount aloud took more care than sending the printed text to a voice API. `₹1,250` now becomes “एक हज़ार दो सौ पचास रुपये” in the speech input. The original stays visible, with a separate amount hint. Dates keep their written field order.

The daily screen follows the things they already ask me to do. कागज़ पढ़िए opens the camera, फ़ोटो पढ़िए selects a photo, and फ़ाइल पढ़िए opens a PDF. Android Share accepts text, images and PDFs. A floating सुनिए control is the intended WhatsApp route after caregiver setup.

रोकिए stays below the scrolling content, so a long document or enlarged font cannot push it away. Repeat and Slow appear before the text; a four-line preview can open the full original. The Slow button can return to the usual speed. “कैसे चलाएँ? सुनिए” plays bundled Raju instructions, including without internet. The microphone button appears after caregiver opt-in, and experimental explanations sit under “और विकल्प”. Provider settings stay in caregiver setup; Redmi speech recognition remains untested.

The pilot passed bounded Android 11 and 15 emulator checks for image/PDF inputs, large text, Stop and replay, with real Hindi audio. My parents are in another city, so I have not observed them using it on their Redmi A4s. The parent-focused revision passed internal layout and bundled-Raju playback assertions at 160% fonts. An emulator System UI dialog covered the capture, and later system crashes blocked the full touch walkthrough. I am keeping that check open. [Parent check and limits](https://github.com/himanshu748/suniye/blob/parent-ux-2026-10-04/outputs/suniye/docs/evidence/parent-usability-check-2026-10-04.json).

## Demo

The short showcase follows **image or PDF → bundled OCR → Hindi text → Raju speech**. These are simple synthetic fixtures; they establish the tested path, not dense-document accuracy. [Download the image](https://raw.githubusercontent.com/himanshu748/suniye/media-showcase-2026-10-04/outputs/suniye/docs/evidence/media-sample-image.png) · [Download the two-page PDF](https://raw.githubusercontent.com/himanshu748/suniye/media-showcase-2026-10-04/outputs/suniye/docs/evidence/media-sample-two-pages.pdf) · [Showcase checks](https://github.com/himanshu748/suniye/blob/media-showcase-2026-10-04/outputs/suniye/docs/evidence/image-pdf-showcase-2026-10-04.json).

[Watch the complete walkthrough](https://github.com/himanshu748/suniye/releases/download/v0.1.0-pilot/suniye-demo-judge.mp4) · [Download the ElevenLabs-only APK](https://github.com/himanshu748/suniye/releases/download/parent-ux-2026-10-04/suniye-parent-ux.apk)

The film opens with the problem in Hindi, then shows a bill read as Hindi amount words, Repeat and Stop. It shows the exact image and PDF source files before their recognized text: नमस्ते from an image, बिल from PDF page 1 and धन्यवाद from page 2. The WhatsApp section is labelled as a setup walkthrough.

These are synthetic Android Share inputs using real content URIs, bundled OCR and live Raju v4 audio. Android screenrecord did not capture device sound, so I mixed the provider MP3s separately at the observed playback rate. Source previews are inserted stills; native waiting remains in the film. [Recording notes](https://github.com/himanshu748/suniye/blob/v0.1.0-pilot/outputs/suniye/docs/demo-script.md).

For WhatsApp messages, the intended steps are: open the message, then tap the green सुनिए control. For a photo or PDF, open the item, choose Share, then Suniye. Real WhatsApp testing remains pending.

## Code

[Source repository](https://github.com/himanshu748/suniye) · [Tests and limitations](https://github.com/himanshu748/suniye/blob/v0.1.0-pilot/outputs/suniye/docs/verification.md)

I began the scaffold on October 2 during the challenge. Code is MIT licensed. The debug APK includes synthetic fixtures; production source excludes them. Provider keys and family messages stay out of the repository. [Third-party notes](https://github.com/himanshu748/suniye/blob/v0.1.0-pilot/outputs/suniye/docs/third-party.md).

## How I Built It

The phone first reads accessible text or runs bundled Devanagari and Latin OCR. If OCR finds text, the image stays on the phone. Online speech sends the text through the backend to ElevenLabs. If OCR finds no text, an online description sends the image to the backend and its model. New narration uses ElevenLabs Raju exclusively. Fixed prompts are bundled Raju recordings; successful readings cache their Raju audio for offline Repeat and Slow. Missing audio leaves the original visible and asks for a connection check. The app never switches to Android or browser TTS; Redmi listening remains untested.

Mastra runs the online reading workflow. Two stages check the source, prepare an original reading or Gemma explanation, and optionally request speech. Each run has its own cancellation signal. Stop invalidates the phone's operation, cancels the request and discards late callbacks. A deliberately delayed-response test confirmed that reading did not restart after Stop.

Gemma 3 4B runs locally through Ollama for explanations and non-text picture descriptions. In a fresh backend check, “प्रवेश से पूर्व अपने जूते उतारना अनिवार्य है।” became “प्रवेश करने से पहले अपने जूते निकालें।” Both tell the reader to remove their shoes before entering. The warm model returned this meaning-preserving instruction through Mastra in 2.66 seconds. The film includes the saved reply, labelled as a separate backend check. [Receipt](https://github.com/himanshu748/suniye/blob/v0.1.0-pilot/outputs/suniye/docs/evidence/editorial-gemma-2026-10-04.json).

Other samples changed a date or replaced “attach” with “submit”. The quantity/negation guard caught some changes and missed others. Explanations remain experimental and separate from the original. [Model results](https://github.com/himanshu748/suniye/blob/v0.1.0-pilot/outputs/suniye/docs/model-evaluation.md).

OCR also failed on a dense bill. I added a retake below .85 confidence. The PDF invitation used in an early recording triggered that guard, so the final demonstration uses simpler text. This is a recovery heuristic, not an accuracy guarantee. Important amounts, dates and medicine labels still need a family member's check.

I selected Raju after listening to two Hindi samples. Its catalogue labels it Hindi with an Indian accent. Real Eleven v4 API audio played in Android, including the Hindi amount, cached Repeat and Stop. The [evidence ledger](https://github.com/himanshu748/suniye/blob/v0.1.0-pilot/outputs/suniye/docs/verification.md) contains pronunciation checks and dated runtime results. The newer voice-only build passed backend tests and an Android 15 media-state check for cached replay, Slow, Stop, missing/corrupt/wrong-provider audio and late replies. The emulator host audio was disabled, so that check verifies playback state rather than another listening judgment. [Voice-only receipt](https://github.com/himanshu748/suniye/blob/niche-integrations-2026-10-04/outputs/suniye/docs/evidence/elevenlabs-only-android15-2026-10-04.json).

Render's Singapore service passed an authenticated bill request with real Raju audio and rejected an unauthenticated request with 401. A fresh check of the voice-only deployment returned the unchanged bill text and 27,420 bytes of audio labelled ElevenLabs with the Raju voice ID. [Voice-only hosted check](https://github.com/himanshu748/suniye/blob/codex/challenge-entry/outputs/suniye/docs/evidence/elevenlabs-only-render-2026-10-04.json). I tried to use the $50 hackathon credit for the $7/month always-on compute plan. Render required payment information on file even with the credit, so the service remains Free and can sleep. Render's hosted Gemma and Atlas connections are still unconfigured. [Live request](https://github.com/himanshu748/suniye/blob/live-evidence-2026-10-04/outputs/suniye/docs/evidence/render-live-2026-10-04.json) · [Credit-only upgrade check](https://github.com/himanshu748/suniye/blob/integration-roles-2026-10-04/outputs/suniye/docs/evidence/render-credit-only-2026-10-04.json).

Sentry's Agent Activity showed a local Gemma request taking 32.64 seconds: 24.96 seconds loading, 4.62 seconds evaluating the prompt and 2.73 seconds generating. It recorded 143 input and 11 output tokens without the reading text in the outgoing trace. That gives me a way to distinguish model loading from generation instead of blaming the voice. [Trace evidence](https://github.com/himanshu748/suniye/blob/live-evidence-2026-10-04/outputs/suniye/docs/evidence/sentry-live-2026-10-04.json).

I also used Backboard for six synthetic Hindi calls comparing Gemma 3 4B with Qwen 2.5 72B. Every amount/date literal check passed, but Gemma added a meeting or event absent from the source. Qwen avoided that addition in these three cases. I am keeping original reading first and explanations experimental; this small comparison does not establish a general ranking. [Replies and source review](https://github.com/himanshu748/suniye/blob/live-evidence-2026-10-04/outputs/suniye/docs/evidence/backboard-comparison.json).

I checked Atlas through real HTTP requests to the local backend. It saved Hindi settings, read them back after I closed and restarted the backend, then retained a slower speech rate and left-side control placement. A message field returned 400; an unauthenticated read returned 401. I deleted the one synthetic record and confirmed it was gone. This verifies the local backend's Atlas connection; Render-to-Atlas and Android sync are separate checks. [Persistence receipt](https://github.com/himanshu748/suniye/blob/atlas-live-2026-10-04/outputs/suniye/docs/evidence/atlas-persistence-2026-10-04.json).

I added a separate caregiver tool for preparing a text PDF before handing it over. Temporal completes the pages through the original-reading Mastra workflow. In the local recovery test, I killed its worker process after page one, restarted it, and injected a retryable failure on page two. Page one was not repeated. Cancellation removed the encrypted input and rejected late writes. Document text stays outside Temporal history. Preparation makes no model or speech API calls; optional Raju recording is an explicit later step, outside the retry loop. A new shoe-instruction trial reversed the meaning, so this tool keeps the original and excludes explanations. [Recovery receipt](https://github.com/himanshu748/suniye/blob/niche-integrations-2026-10-04/outputs/suniye/docs/evidence/temporal-recovery-2026-10-04.json).

For caregiver setup, local PostgreSQL with pgvector stores embeddings of three approved official Android references. Mastra combines vector similarity and keyword rank to retrieve the source URL and a fixed Hindi hint. Three setup questions found their expected reference; an unrelated cake question returned none. Reopening the database preserved the index, and a tampered URL was rejected. English caregiver queries are supported; Hindi search quality is unvalidated. This runs locally with PGlite and pgvector, without Tiger Cloud or a new cloud charge. [Query results](https://github.com/himanshu748/suniye/blob/niche-integrations-2026-10-04/outputs/suniye/docs/evidence/pgvector-source-search-2026-10-04.json).

The integrations have different jobs. Mastra, Gemma and ElevenLabs handle online reading; Render hosts the API. I use the other tools for development, setup and diagnosis.

| Integration | How I use it | Why it belongs here |
| --- | --- | --- |
| **Mastra** | A two-step reading workflow validates the source, prepares an original reading or explanation, and optionally requests speech. Each request has its own cancellation signal. | Stop must discard late model or voice replies. The workflow also keeps a retake separate from a reading. |
| **Gemma 3 4B** | Runs through Ollama on my laptop for simpler Hindi explanations and descriptions of pictures with no readable text. | Original reading covers small print; an optional explanation or description covers a different need. Added-context failures keep explanations experimental. |
| **ElevenLabs** | Raju, labelled Indian Hindi, produces Eleven v4 audio after amounts are converted into Hindi words. Android caches it for replay and slower playback. | My parents need to hear the text. I chose the voice after listening to two samples. |
| **Render** | Hosts the authenticated HTTPS API and keeps the ElevenLabs credential on the server. A real hosted bill request returned Hindi audio. | The phones need a reachable backend when I am in another city. This deployment supports original reading and speech; hosted Gemma is not connected yet. |
| **Sentry Agent Tracing** | Records the reading agent, model duration, token counts and Ollama timing attributes, while omitting reading text from outgoing traces. | A 32.64-second model call spent 24.96 seconds loading. That tells me where to investigate a long wait. |
| **Backboard** | Ran six synthetic Hindi calls, three each for Gemma 3 4B and Qwen 2.5 72B, with memory, search and tools disabled. | Literal checks missed two added-context errors. Comparing the replies supports keeping the original visible and explanations optional. |
| **Entire** | Imported 18 development checkpoints. A lookup recovered my instruction to design the controls specifically for my parents. | It connects the interface decisions to the original family request. Curated provenance is public; full private sessions stay private. |
| **SerpApi** | Searched public official Android help pages for the caregiver guide; Gemma summarized the approved results in Hindi. | Setup needs understandable references. When a later search returned no approved pages, the guide stopped instead of inventing instructions. |
| **MongoDB Atlas** | The local backend writes caregiver settings to `suniye.preferences`, restores them after a backend restart, and updates speech speed and control placement. | Saved settings need to survive a restart. Strict routes reject message content and unauthenticated access. Render-to-Atlas and Android sync remain untested. |
| **Temporal** | Recovers a separate caregiver PDF preparation job after a worker dies, with page retries and cancellation tombstones. | A prepared document should not need starting over after my computer stops. Parent playback starts only after a tap. This is local recovery evidence. |
| **Tiger Data / pgvector** | Local PostgreSQL retrieves approved setup references using pgvector similarity and keyword rank through Mastra. | Setup questions need source links. A failed search should say it found nothing. This claims the listed pgvector use case; Tiger Cloud is not deployed. |

Backboard, Entire, Sentry and SerpApi stay outside the daily parent screen. The six Backboard calls used synthetic text, and its temporary key was revoked afterward. SerpApi searches contain public setup questions, not family messages.

Claude reviewed the PRD, spec and selected source. I fixed its findings and ran separate runtime checks. Source review helped find issues; it did not establish how the app feels to my parents.

## Why Does Open Innovation Matter?

I can inspect Mastra's workflow, change its stages and test cancellation without handing the reading policy to a closed agent. The model and speech providers are separate modules. The speech output policy accepts only ElevenLabs Raju; changing it would require an explicit policy change.

Local Gemma lets me repeat a failure on synthetic Hindi material and inspect the response. Gemma runs on my laptop, not inside the APK. Remote phones need an authenticated HTTPS backend for explanations and descriptions. The open workflow is running in the online reading demo; the original-reading path does not need a generative rewrite.

Gemma weights have their own terms, and Google's OCR SDK is proprietary. I disclose both because another builder needs to know what they can reuse.

While preparing this write-up, I read [Samajh](https://dev.to/adityaanenenu5/samajh-a-reader-for-the-letters-my-mother-couldnt-read-2emg) by [adityaanenenu5](https://dev.to/adityaanenenu5), which focuses on document explanations tied to source quotes, and [ReadAloud](https://dev.to/yramstech/i-find-reading-hard-so-i-built-a-text-to-speech-reader-for-android-heres-how-31ci) by [yramstech](https://dev.to/yramstech), which focuses on following spoken words. My focus here is my parents' small-print problem, Hindi amounts and reachable Android controls.

## My Agent Session

I used Entire to import the development session locally. A checkpoint lookup recovered my instruction: “they ask me to do it so ux and ui needs to be specifically for them”. That explains the large Hindi controls and separate caregiver setup. [Curated provenance](https://github.com/himanshu748/suniye/blob/v0.1.0-pilot/outputs/suniye/docs/build-provenance.md) connects those instructions to the code; full private transcripts remain private.

## Prize Categories

I am entering eleven categories with these evidence boundaries:

- **ElevenLabs:** Raju v4 Hindi API audio played by Android and used in the film. Attribution: [elevenlabs.io](https://elevenlabs.io).
- **Mastra:** the online reading workflow, validation and cancellation checks.
- **Gemma:** local explanation and picture trials, with dated successes and unresolved failures.
- **Entire:** imported checkpoint lookups explaining interface decisions.
- **SerpApi:** searches supplied two official Google Android help articles for a Gemma caregiver summary on October 2. The next day's search returned no approved articles and stopped generation. This is dated development use.

- **Render:** the free Singapore service passed authenticated original reading with real Hindi audio. Hosted Gemma remains separate.
- **Sentry Agent Tracing:** an ingested Suniye/Gemma agent trace exposed model loading as the main delay in one request.
- **Backboard:** six real calls compared open-weight models on synthetic Hindi sources and exposed an added-context error.
- **MongoDB Atlas:** authenticated preference write/read, persistence after a backend restart, content-field rejection and cleanup verified against the real database.

- **Temporal:** real local worker restart, unfinished-page retry and cancellation for caregiver preparation.
- **Tiger Data / pgvector:** local pgvector and keyword retrieval over public setup sources, including persistence and source validation.

The [sponsor ledger](https://github.com/himanshu748/suniye/blob/niche-integrations-2026-10-04/outputs/suniye/docs/sponsor-tracks.md) links each category to its dated checks and their scope.

[Try the prepared PDF reader with cached Raju audio](https://github.com/himanshu748/suniye/releases/download/niche-integrations-2026-10-04/elevenlabs-prepared-reader.html). Download and open the HTML, then tap सुनिए. It displays the original and the Hindi amount wording, plays only its embedded ElevenLabs recordings, and makes no provider requests. This is a caregiver export, separate from the Android app.

The APK, narrated demo and provider evidence are available above. The remaining family check is specific: can each parent read a WhatsApp message and a paper label, then stop and replay without my help? I have not observed that yet. Emulator checks establish the tested app behavior; their Redmi phones and their own use need a separate check.
