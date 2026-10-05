---
title: Suniye: let my parents hear the message themselves
published: true
tags: devchallenge, weekendchallenge, hf26challenge
---

*Built for the [Hacktoberfest Weekend Challenge: Build for a Friend](https://dev.to/challenges/hacktoberfest-weekend-2026-10-01).*

## What I Built

My mother and father ask me to read WhatsApp messages, pictures, labels and documents. Both have weak eyesight and use Redmi A4 phones. I am in another city right now, so that request can mean waiting for me to be available.

I built Suniye, or सुनिए, an Android reading aid for those moments. It reads small print aloud in Hindi, with large controls for रोकिए (Stop), फिर सुनिए (Repeat) and धीरे सुनिए (Slow). The pilot supports Android 11 and later.

![Historical pre-0.3 silent preview of Suniye recognizing a photo and both PDF pages](https://raw.githubusercontent.com/himanshu748/suniye/media-showcase-2026-10-04/outputs/suniye/docs/evidence/image-pdf-to-speech-preview.gif)

[Hear the historical pre-0.3 image-and-PDF demo (24 seconds)](https://github.com/himanshu748/suniye/releases/download/media-showcase-2026-10-04/suniye-image-pdf-to-speech.mp4). This footage predates the 0.3 parent-UX revision. The preview above is silent. The video shows the source image, then नमस्ते read aloud; the PDF pages read बिल and धन्यवाद. These simple synthetic samples establish the demonstrated path. Dense documents need separate checks.

An amount needed more care than sending printed text to a voice API. `₹1,250` becomes “एक हज़ार दो सौ पचास रुपये” in the speech input. The original remains visible, with a separate amount hint. Dates keep their written field order.

कागज़ पढ़िए opens the camera, फ़ोटो पढ़िए selects a photo, and फ़ाइल पढ़िए opens a PDF. Android Share accepts text, images and PDFs. After caregiver setup, a floating सुनिए control is the intended WhatsApp route. The daily controls use large Hindi labels; settings and optional spoken commands stay behind caregiver setup. Stop remains below the scrolling content, where a long reading cannot push it away.

The pilot has bounded Android 11 and 15 emulator checks. The parent-focused revision passed internal layout and bundled-Raju playback assertions at 160% fonts, but a System UI dialog covered the capture and later system crashes blocked the full touch walkthrough. That check remains open. I have not observed my parents using it on their Redmi A4s. [Parent check and limits](https://github.com/himanshu748/suniye/blob/parent-ux-2026-10-04/outputs/suniye/docs/evidence/parent-usability-check-2026-10-04.json).

## Demo

[Watch the historical v0.1 walkthrough](https://github.com/himanshu748/suniye/releases/download/v0.1.0-pilot/suniye-demo-judge.mp4) · [Download the parent-UX APK](https://github.com/himanshu748/suniye/releases/download/parent-ux-2026-10-04/suniye-parent-ux.apk)

The linked APK is the released 0.3.0 parent-UX revision. The films show earlier demonstrated flows; the newer revision's internal assertions do not establish a completed touch walkthrough. The cancellation/privacy safeguards and release-link corrections are published in the source repository. The [project page](https://suniye-reader.onrender.com/) is live on the existing Free Render service, with the current APK link and historical screenshots clearly labelled.

The walkthrough shows a synthetic electricity bill, Hindi amount wording, Repeat and Stop, followed by a photo and two PDF pages. It displays the source files before their recognized text. The WhatsApp section is a labelled setup walkthrough; actual WhatsApp reading remains untested.

The inputs use real Android content URIs, bundled OCR and real Raju v4 API audio. Android screenrecord did not capture device sound, so I mixed the provider MP3s separately at the observed playback rate. Source previews are inserted stills; native waiting stays in the film. The Gemma reply is a separate saved backend check. [Recording notes](https://github.com/himanshu748/suniye/blob/v0.1.0-pilot/outputs/suniye/docs/demo-script.md).

For a quick trial without configuring a backend, [download the prepared PDF reader](https://github.com/himanshu748/suniye/releases/download/niche-integrations-2026-10-04/elevenlabs-prepared-reader.html), open the HTML and tap सुनिए. It displays the original and Hindi amount wording, and plays its embedded Raju recordings without provider requests. This caregiver export is separate from the Android app.

## Code

[Source repository](https://github.com/himanshu748/suniye) · [Current 0.3 usability scope and limits](https://github.com/himanshu748/suniye/blob/parent-ux-2026-10-04/outputs/suniye/docs/parent-usability.md) · [Caregiver setup for the current release](https://github.com/himanshu748/suniye/blob/parent-ux-2026-10-04/outputs/suniye/docs/caregiver-setup.md)

I began the scaffold on October 2 during the challenge. The code is MIT licensed. The debug APK includes synthetic fixtures; production source excludes them. Provider keys and family messages stay out of the public repository. Gemma weights have separate terms, and Google's bundled OCR SDK is proprietary. [Third-party notes](https://github.com/himanshu748/suniye/blob/v0.1.0-pilot/outputs/suniye/docs/third-party.md).

## Current hosted check — October 5

[Open the live caregiver page](https://suniye-reader.onrender.com/caregiver). A caregiver supplies the private family connection code; it stays in page memory. The page retrieves official setup references, sends a short text for original Raju speech or optional Gemma explanation, and keeps Stop available. The Android APK remains the parent’s reader; this page helps a family member configure and check it.

Real deployed checks passed original Hindi Raju speech, Atlas preference write/read and content-field rejection. Those settings survived a deployment that replaced the backend process; only the two synthetic audit records were then deleted. Three simultaneous caregiver-help requests passed the live pgvector route. The browser played/replayed the bill and Stop removed its playback. [Hosted checks](https://github.com/himanshu748/suniye/blob/codex/challenge-entry/outputs/suniye/docs/evidence/hosted-e2e-2026-10-05.json) · [Concurrent help check](https://github.com/himanshu748/suniye/blob/codex/challenge-entry/outputs/suniye/docs/evidence/hosted-pgvector-concurrent-2026-10-05.json).

The SerpApi call returned HTTP 200 and retained zero approved URLs. Its older cached receipt lacks raw result counts, so I cannot say whether there were no organic results or the source filter rejected them. The caregiver can still open the approved help references. New receipts count raw rows and rejection reasons.

Gemma 4B initially returned an explanation and Raju audio, then its shared upstream pool throttled a later request. I explicitly switched the hosted route to Gemma 3 27B through Backboard/OpenRouter, with provider selection, token-price ceilings and no automatic fallback. A weekday answer was rejected by the meaning guard before narration. A simple milk sentence returned 109,967 bytes of Raju audio with a spoken AI warning, but added a reason about keeping milk cold. That is an execution check, not a faithfulness approval. [Both new outcomes](https://github.com/himanshu748/suniye/blob/codex/challenge-entry/outputs/suniye/docs/evidence/hosted-gemma-27b-2026-10-05.json).

The Atlas-backed limit is eight attempted model calls per UTC day, including failed and uncertain calls. Today's checks used all eight; optional AI explanation resets at 05:30 IST the next day. Original reading remains available independently. Backboard memory, web search and custom tools are off. After Stop, a dispatched call can finish its bounded response to permit deletion of its returned thread, while the reader discards the result. Timeouts, unknown thread IDs and failed deletes still prevent a zero-retention promise. Atlas access rules and the evidence credential need review before their temporary window expires around October 11 to 12.

A hosted picture test exposed an unsupported attachment/document-tool path. The backend now returns an authored retake before sending an image to Backboard or consuming model quota. Image/PDF text still follows Android's local OCR → original text → Raju route. Hosted picture description remains unavailable. [Data flow and retention](https://github.com/himanshu748/suniye/blob/codex/challenge-entry/outputs/suniye/docs/privacy.md).

Sonnet 5.5 independently audited the source. The backend now rejects its known relation, duration, weekday and payment-word flips, reserves internal quota identifiers, warns about AI mistakes aloud, and keeps the web Stop control fixed. All 107 backend tests pass. The native APK still has gaps in daily-limit messages, explanation replay and setup disclosure; time/date/unit pronunciation, real WhatsApp, physical Redmi use and the current native video remain open. [Audit dispositions](https://github.com/himanshu748/suniye/blob/codex/challenge-entry/outputs/suniye/docs/sonnet-audit-disposition-2026-10-05.md).

## How I Built It

The phone reads Android's accessible text or runs bundled Devanagari and Latin OCR. When OCR recognizes text, the image stays on the phone. Online narration sends that text through the authenticated backend to ElevenLabs. The current hosted provider does not support the picture-description route. A no-text picture receives an application-authored retake instead of an AI guess. Images with recognized text still use the phone’s OCR followed by Raju speech.

New narration uses ElevenLabs Raju exclusively. Fixed help prompts are bundled Raju recordings; successful readings cache their audio for offline Repeat and Slow. A new reading needs a connection. If audio is unavailable, the original remains visible. The app never silently switches to Android or browser TTS.

### Stop must stay stopped

Mastra runs the online reading workflow: validate the source, prepare the original or an optional explanation, then request speech if needed. Each request has its own cancellation signal. Stop invalidates the phone's operation and discards late replies. A deliberately delayed-response test checked that a stopped reading did not restart. The voice-only Android 15 check also covered cached replay, Slow, Stop, missing or corrupt audio, wrong-provider audio and late replies. Its host audio was disabled, so it verifies media state rather than another listening judgment. [Android receipt](https://github.com/himanshu748/suniye/blob/niche-integrations-2026-10-04/outputs/suniye/docs/evidence/elevenlabs-only-android15-2026-10-04.json).

### Keep the original when the model gets it wrong

The deployed backend now uses Gemma 3 27B through Backboard for optional Hindi explanations. The earlier 4B receipt preserved a simple milk sentence and returned Raju audio; the current 27B check above exposes an added-context limitation. Picture description is unavailable on this route. Earlier local Ollama trials remain dated development evidence: A warm check changed “प्रवेश से पूर्व अपने जूते उतारना अनिवार्य है।” to “प्रवेश करने से पहले अपने जूते निकालें।” Both tell the reader to remove their shoes before entering; the Mastra response took 2.66 seconds. [Saved reply](https://github.com/himanshu748/suniye/blob/v0.1.0-pilot/outputs/suniye/docs/evidence/editorial-gemma-2026-10-04.json).

Other replies changed a date, replaced “attach” with “submit”, or added context absent from the source. The quantity and negation guard caught some errors and missed others. Six synthetic Backboard calls comparing Gemma 3 4B and Qwen 2.5 72B also passed literal amount/date checks while exposing added-context errors. That small comparison supports keeping explanations experimental and separate from the original; it does not establish a general model ranking. [Model results](https://github.com/himanshu748/suniye/blob/v0.1.0-pilot/outputs/suniye/docs/model-evaluation.md) · [Comparison](https://github.com/himanshu748/suniye/blob/live-evidence-2026-10-04/outputs/suniye/docs/evidence/backboard-comparison.json).

Bundled OCR misread a dense bill too. I added a retake below .85 confidence. An early PDF invitation triggered that guard, so the final demo uses simpler text. This is a recovery heuristic, not an accuracy guarantee. Amounts, dates and medicine labels still need a family member's check.

I investigated TabPFN for choosing a retake or caregiver review. I prepared 100 CC BY 4.0 printed Hindi training-word crops from [Mozhi-Hindi](https://ilocr.iiit.ac.in/dataset/7/) and built an isolated batch harness using Suniye's unchanged ML Kit OCR pipeline. The two TabPFN data-collection attempts stopped at the host's disk-space check before boot. There are zero actual OCR observations, no model inference and no measured benefit. The confidence rule remains unchanged, and TabPFN is not a twelfth category claim.

### Make the wait explainable

Sentry received a real hosted explanation trace: 4.13 seconds overall, 2.89 seconds in Gemma 4B and 158 tokens. The trace view showed no input or output content. I used it to distinguish the model stage from the rest of the request; this is one synthetic run, not an average. Its displayed cost is an estimate, not a billing receipt. [Trace receipt](https://github.com/himanshu748/suniye/blob/codex/challenge-entry/outputs/suniye/docs/evidence/hosted-sentry-2026-10-05.json).

![Actual hosted Suniye agent trace with timing and tokens, without reading content](https://raw.githubusercontent.com/himanshu748/suniye/codex/challenge-entry/outputs/suniye/docs/evidence/hosted-sentry-2026-10-05.png)

The earlier local trace spent 24.96 seconds loading its model within a 32.64-second model call. That remains useful development evidence, but is separate from the hosted service. [Local trace](https://github.com/himanshu748/suniye/blob/live-evidence-2026-10-04/outputs/suniye/docs/evidence/sentry-live-2026-10-04.json).

Render's Free Singapore service passed an authenticated original-reading request with real Raju audio and rejected an unauthenticated request with 401. The newer hosted voice-only check returned unchanged bill text and 27,420 bytes of Raju audio. The free service can sleep. Gemma explanation and Render-to-Atlas preference write/read are now active and tested. A best-effort ten-minute GitHub health schedule is installed; its manual run passed, but it does not guarantee uptime. [Hosted check](https://github.com/himanshu748/suniye/blob/codex/challenge-entry/outputs/suniye/docs/evidence/elevenlabs-only-render-2026-10-04.json).

I tried to use the $50 hackathon credit for Render's $7/month always-on compute plan. Render required payment information on file even with the credit, so the service remains Free. [Credit-only upgrade check](https://github.com/himanshu748/suniye/blob/integration-roles-2026-10-04/outputs/suniye/docs/evidence/render-credit-only-2026-10-04.json).

## Why Does Open Innovation Matter?

I can inspect Mastra's workflow, change its stages and test cancellation. The model and speech providers are separate modules, so the reading policy is visible in code. The original-reading path does not depend on a generative rewrite. The current speech policy accepts only Raju; replacing it would require an explicit policy change.

Local Gemma lets me repeat failures on synthetic Hindi text and inspect the replies. It runs on my laptop, not inside the APK. Remote explanations now use the authenticated Backboard route; hosted picture description is unavailable. The open pieces make those decisions and their limits available to another builder; the OCR and speech services have their own terms.

While preparing the post, I read [Samajh](https://dev.to/adityaanenenu5/samajh-a-reader-for-the-letters-my-mother-couldnt-read-2emg) and [ReadAloud](https://dev.to/yramstech/i-find-reading-hard-so-i-built-a-text-to-speech-reader-for-android-heres-how-31ci). Their work focuses on source-linked explanations and following spoken words. My focus is my parents' small-print problem, Hindi amounts and reachable Android controls.

## My Agent Session

I used Entire to import the development session locally. A checkpoint lookup recovered my instruction: “they ask me to do it so ux and ui needs to be specifically for them”. That explains the large Hindi controls and separate caregiver setup. [Curated provenance](https://github.com/himanshu748/suniye/blob/v0.1.0-pilot/outputs/suniye/docs/build-provenance.md) links those instructions to the code; full private transcripts stay private.

Claude reviewed the PRD, specification and selected source. I fixed findings and ran separate runtime checks. Source review helped find defects; it did not tell me how the app feels to my parents.

## Prize Categories

I am targeting ten categories, with the scope of each recorded below. Temporal stays a local prototype and is excluded from the hosted integration claim; activating its Cloud trial required payment information. TabPFN also stays excluded because no representative OCR outcome table has been collected.

| Category | Why I used it | What actually ran and its limit |
| --- | --- | --- |
| ElevenLabs | My parents need to hear the original in Hindi and replay it. | Raju v4 API audio played in Android; cached replay and bundled help prompts were checked. Redmi listening is pending. Attribution: [elevenlabs.io](https://elevenlabs.io). |
| Mastra | Stop needs to cancel work through the model and speech stages. | The reading workflow validates input, separates explanation and handles cancellation; delayed-reply tests ran. Redmi network behavior remains untested. |
| Gemma | Formal Hindi may need a simpler, separate explanation. | Hosted Gemma 3 27B via Backboard returned Hindi explanation and Raju speech after 4B upstream throttling. Known anchor flips are rejected, but added context remains a limitation; picture description is unavailable. |
| Render | The phones need a reachable authenticated endpoint while I am elsewhere. | Free Singapore service now serves original speech, Gemma explanation, Atlas preferences and caregiver help. Manual external health-check run passed; sleep and scheduling delays remain possible. |
| Sentry Agent Tracing | I need to find where a long model wait is spent. | Signed-in Sentry readback confirmed the hosted agent/model trace, latency and 158 tokens, with no input/output content shown. Earlier local tracing exposed model loading. |
| Backboard | A model endpoint lets explanations work while my laptop is off. | A six-call model comparison and hosted Gemma text requests used the same API. Runtime memory/search/tools are off; an eight-attempt daily limit and best-effort deletion bound use. No general model-ranking claim. |
| Entire | I wanted to trace interface choices back to my family brief. | Eighteen imported checkpoints and lookups linked requirements to decisions. Curated provenance is public; full sessions stay private. |
| SerpApi | A caregiver can check for current official setup references. | Live fixed public queries ran; this result retained zero approved URLs. The UI falls back to approved help rather than inventing instructions. |
| MongoDB Atlas | Caregiver settings and model-use counters need a shared store. | Hosted settings write/read, message-field rejection and persistence across a deploy/process replacement passed; synthetic profiles were cleaned up. Android sync remains untested. Access expires after a week. |
| Tiger Data / pgvector | Caregiver questions should retrieve approved setup sources. | Hosted PGlite/pgvector hybrid retrieval passed three simultaneous fixed-topic requests using frozen public vectors. This matches the listed pgvector use case; no Tiger Cloud or unrestricted search is claimed. |

The [Tiger Data category](https://dev.to/challenges/hacktoberfest-weekend-2026-10-01#best-use-of-tiger-data) explicitly accepts pgvector and hybrid retrieval. That is why I use the existing hosted index rather than add a trial-only cloud dependency.

The [current sponsor ledger](https://github.com/himanshu748/suniye/blob/codex/challenge-entry/outputs/suniye/docs/sponsor-tracks.md) separates hosted receipts, historical development evidence and missing checks. Entire is development provenance, rather than a runtime dependency.

The next family check is specific: can each parent read a WhatsApp message and a paper label, then stop and replay without my help? I have not observed that yet. Emulator checks establish the tested app behavior; their Redmi phones and their own use need a separate check.
