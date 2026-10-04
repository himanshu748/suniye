# Suniye / सुनिए

My parents have weak eyesight and ask me to read messages, pictures, labels and documents. Suniye is an Android 11+ Hindi reading aid built around those tasks, with large Hindi controls and a Stop button that stays reachable.

[Download the current 0.3 parent-UX pilot](https://github.com/himanshu748/suniye/releases/download/parent-ux-2026-10-04/suniye-parent-ux.apk) | [Current release and hashes](https://github.com/himanshu748/suniye/releases/tag/parent-ux-2026-10-04) | [Historical 0.1 walkthrough (82 seconds)](https://github.com/himanshu748/suniye/releases/download/v0.1.0-pilot/suniye-demo-judge.mp4)

The historical 0.1 film shows a bill amount spoken as Hindi words, Repeat and Stop, then the exact source image and both PDF pages before their recorded readings. WhatsApp is a labelled setup walkthrough. A separate slide shows one actual local Gemma/Mastra explanation result with an English gloss.

## What has been checked

Android Share inputs with synthetic content URIs, bundled OCR, two PDF pages, online Raju Hindi playback, cancellation and large-font layouts passed bounded emulator checks. The film combines two dated recordings; its provider audio is mixed separately because Android screenrecord did not capture device sound. The current 0.3.0-parent-ux APK uses ElevenLabs Raju exclusively, including bundled spoken help and easier Hindi controls; the films document the earlier 0.1 pilot, not a current 0.3 walkthrough.

Testing limits: neither parent has tried the app, and no improvement or hands-on feedback is claimed. Current 0.3 internal layout/bundled-Raju assertions passed at 160% fonts, but a System UI overlay and emulator crashes blocked the full touch walkthrough. Real Redmi A4, WhatsApp, family listening comfort and microphone recognition remain unverified; explanations remain experimental with recorded failures. A new caption-led walkthrough with English explanation and actual Hindi app audio is planned, not captured. The online features require a configured authenticated backend; the downloadable APK does not include credentials. The free Render service at `https://suniye-reader.onrender.com` now serves authenticated original reading and Hindi narration. Hosted Gemma and Render-to-Atlas remain unconfigured; the Free service can sleep. The local backend passed real Atlas preference write/read and restart-persistence checks.

[Build and caregiver instructions](outputs/suniye/README.md) · [Verification ledger](outputs/suniye/docs/verification.md) · [Sponsor evidence](outputs/suniye/docs/sponsor-tracks.md) · [DEV submission draft](outputs/suniye/docs/dev-submission-draft.md)

## Open workflow

Bundled phone OCR supplies the text. The online Mastra workflow checks the source, prepares the original reading or an optional local Gemma explanation, then requests speech. Model and voice providers are separate modules. Stop cancels the operation and discards late results. Low-confidence OCR asks for a clearer crop.

[Mastra workflow](outputs/suniye/backend/src/workflow.js) · [Gemma/provider code](outputs/suniye/backend/src/providers.js) · [Android reader](outputs/suniye/android/app/src/main/java/in/suniye/app/ReaderController.java)

The project began during the October 2–5, 2026 challenge. Code is MIT licensed; Gemma weights and Google's bundled OCR SDK have separate terms. Provider keys, model weights, family messages and full private development histories are excluded. The debug APK includes synthetic fixtures and instrumentation; production source sets exclude them. [Third-party notes](outputs/suniye/docs/third-party.md).

The caregiver preparation tools now demonstrate local Temporal worker recovery and pgvector retrieval over three official Android setup references. They run separately from the parent app and create no cloud resources. [Instructions and scope](outputs/suniye/backend/caregiver/README.md).

## Landing release preparation

The tested Hindi landing is prepared for the existing Free Render service root; publication has not been executed by this branch. [Source and release ledger](landing/release-ledger.md) records the exact route/assets integration, current APK and historical evidence, plus the current video capture blocker. [New video capture plan](landing/current-video-plan.md).
