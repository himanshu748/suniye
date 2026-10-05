# Suniye Android 0.4 pilot

Suniye helps Hindi-speaking parents with weak eyesight hear small print. Android 11+ accepts shared text, images and PDFs. Bundled OCR runs on the phone; original text goes to the authenticated Render backend and ElevenLabs Raju. Cached audio supports Repeat and Slow. Stop stays below the scrolling content.

Reviewed dictionary help gives separately labelled word meanings beside the unchanged source. Parent readings are not sent to a generative paraphrase model. Gemma 3 27B via Backboard only summarizes fixed public caregiver references. Picture description is unavailable. Maithili and real Redmi/WhatsApp behavior are unverified.

[Download 0.4](https://github.com/himanshu748/suniye/releases/download/parent-ux-2026-10-05/suniye-parent-ux-0.4.apk) · [Narrated walkthrough](https://suniye-reader.onrender.com/#walkthrough) · [Caregiver setup](docs/caregiver-setup.md) · [Current verification](docs/verification.md) · [Sponsor ledger](docs/sponsor-tracks.md) · [Privacy](docs/privacy.md)

Provider credentials stay on the backend. A caregiver privately supplies the family connection code and explains voice/accessibility consent. This is a debug pilot; synthetic instrumentation is excluded from release-source builds. No protected-screen bypass or Play Protect disabling is required or recommended.

## Development

Android uses JDK 17 and the Gradle wrapper in `android/`; run `bash ./gradlew assembleDebug` there with the configured Android SDK. The backend uses Node 22: `npm ci`, then `npm test`, in `backend/`. Copy `.env.example` to ignored `.env` and configure your own authorized providers before starting it. Never commit the environment file or put provider keys in the APK.

The current hosted original/word-help path does not require a local Ollama model. Earlier local Gemma experiments remain historical evidence in the model-evaluation and sponsor-history documents. See the [root README](../../README.md) for release hashes and the actual current hosted check.
