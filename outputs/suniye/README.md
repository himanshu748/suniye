# Suniye Android 0.4.1 pilot

Suniye helps Hindi-speaking parents with weak eyesight hear small print. Android 11+ accepts shared text, images and PDFs. Bundled OCR runs on the phone; original text goes to the authenticated Render backend and ElevenLabs Raju. Cached audio supports Repeat and Slow. Stop stays below the scrolling content.

Reviewed dictionary help gives separately labelled word meanings beside the unchanged source. Parent readings are not sent to a generative paraphrase model. Gemma 3 27B via Backboard only summarizes fixed public caregiver references. Picture description is unavailable. Maithili, physical Redmi behavior and an external WhatsApp sender are outside the emulator checks.

[Download 0.4.1](https://github.com/himanshu748/suniye/releases/download/real-documents-2026-10-05/suniye-parent-ux-0.4.1.apk) · [English-narrated walkthrough](https://suniye-reader.onrender.com/#walkthrough) · [Caregiver setup](docs/caregiver-setup.md) · [Current verification](docs/verification.md) · [Sponsor ledger](docs/sponsor-tracks.md) · [Privacy](docs/privacy.md)

Provider credentials stay on the backend. A caregiver privately supplies the family connection code and explains voice/accessibility consent. This is a debug pilot; synthetic instrumentation is excluded from release-source builds. No protected-screen bypass or Play Protect disabling is required or recommended.

## Real-document walkthrough

A real consumer-notice image and a complete two-page Hindi PDF show the reading workflow. Video explanations and subtitles are English; the native interface and Raju document readings are Hindi. OCR confidence is a heuristic: uncertain pages need a separate review tap and audible caution, while flagged numeric groups are withheld. Authored caution stays separate from the recognized source and dictionary input. [Document provenance and capture scope](docs/real-document-walkthrough.md).

## Development

Android uses JDK 17 and the Gradle wrapper in `android/`; run `bash ./gradlew assembleDebug` there with the configured Android SDK. The backend uses Node 22: `npm ci`, then `npm test`, in `backend/`. Copy `.env.example` to ignored `.env` and configure your own authorized providers before starting it. Never commit the environment file or put provider keys in the APK.

From the repository root, run `JAVA_HOME=/path/to/jdk17 python3 outputs/suniye/scripts/check-hindi-speech.py` for the 57 shared speech fixtures and `JAVA_HOME=/path/to/jdk17 python3 outputs/suniye/scripts/check-ocr-transcript.py` for the standalone OCR policy harness. These are separate from the backend test command.

The current hosted original/word-help path does not require a local Ollama model. Earlier local Gemma experiments remain historical evidence in the model-evaluation and sponsor-history documents. See the [root README](../../README.md) for release hashes and the actual current hosted check.
