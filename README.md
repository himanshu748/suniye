# Suniye / सुनिए

My parents have weak eyesight and ask me to read messages, pictures, labels and documents. Suniye is an Android 11+ Hindi reading aid built around those tasks, with large Hindi controls and a Stop button that stays reachable.

[Watch the 82-second walkthrough](https://github.com/himanshu748/suniye/releases/download/v0.1.0-pilot/suniye-demo-judge.mp4) · [Download the debug APK](https://github.com/himanshu748/suniye/releases/download/v0.1.0-pilot/suniye-debug.apk) · [Release files and hashes](https://github.com/himanshu748/suniye/releases/tag/v0.1.0-pilot)

The film shows a bill amount spoken as Hindi words, Repeat and Stop, then the exact source image and both PDF pages before their recorded readings. WhatsApp is a labelled setup walkthrough. A separate slide shows one actual local Gemma/Mastra explanation result with an English gloss.

## What has been checked

Android Share inputs with synthetic content URIs, bundled OCR, two PDF pages, online Raju Hindi playback, cancellation and large-font layouts passed bounded emulator checks. The film combines two dated recordings; its provider audio is mixed separately because Android screenrecord did not capture device sound. The debug APK matches the later image/PDF recording.

Real Redmi A4 use, WhatsApp behavior, offline Hindi listening, microphone recognition and family handover remain unverified. Explanation and picture-description failures are recorded alongside successes. The online features require a configured authenticated backend; the downloadable APK does not include a public family backend.

[Build and caregiver instructions](outputs/suniye/README.md) · [Verification ledger](outputs/suniye/docs/verification.md) · [Sponsor evidence](outputs/suniye/docs/sponsor-tracks.md) · [DEV submission draft](outputs/suniye/docs/dev-submission-draft.md)

## Open workflow

Bundled phone OCR supplies the text. The online Mastra workflow checks the source, prepares the original reading or an optional local Gemma explanation, then requests speech. Model and voice providers are separate modules. Stop cancels the operation and discards late results. Low-confidence OCR asks for a clearer crop.

[Mastra workflow](outputs/suniye/backend/src/workflow.js) · [Gemma/provider code](outputs/suniye/backend/src/providers.js) · [Android reader](outputs/suniye/android/app/src/main/java/in/suniye/app/ReaderController.java)

The project began during the October 2–5, 2026 challenge. Code is MIT licensed; Gemma weights and Google's bundled OCR SDK have separate terms. Provider keys, model weights, family messages and full private development histories are excluded. The debug APK includes synthetic fixtures and instrumentation; production source sets exclude them. [Third-party notes](outputs/suniye/docs/third-party.md).
