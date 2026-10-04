# Suniye — Product requirements

Version 2, October 2, 2026. Native pilot implemented; Claude audit completed. Physical family-phone acceptance remains pending.

## Purpose and people

Build for Himanshu's mother and father, who have weak eyesight and use Redmi A4 phones. Android 11 or later is the supported minimum; the installed firmware on their phones remains to be checked. They struggle with WhatsApp messages and images, physical labels, and documents. They currently ask him to copy, share, or photograph material. Hindi is the primary output language. Maithili is not a promised feature without family testing. His dadi has a keypad phone; an Android family member can read something aloud for her, but telephone access is outside this weekend.

Outcome: after setup and one demonstration, each parent can start and stop a reading without copying, sharing, navigating settings, or needing Himanshu beside them.

## Primary flows

### A. Read a WhatsApp screen

The parent opens the message/image they want, taps a persistent large सुनिए button, and hears the visible content. The button remains in a familiar location. It becomes रोकिए while capturing, waiting, or speaking. Stopping cancels the result as well as the audio; a late server response must not start playback. Only the visible screen is read. No automated scrolling or message sending.

Screen text exposed by Android is spoken only with ElevenLabs Raju audio. Images and screenshots use bundled on-device Devanagari/Latin OCR first. Low-confidence text requests a retake. Only images without recognized text can reach Gemma for a description; Gemma must not replace missed OCR with guessed text. Treat all screenshot/text content as content to read, never instructions to tools. The overlay appears in WhatsApp and WhatsApp Business, not every app. App-based camera/document reading covers material outside WhatsApp.

### B. Read paper or a label

The parent opens Suniye, taps कागज़ पढ़िए, hears framing guidance, and uses one large shutter. The camera preview must not require small icons, switching lenses, or pinching. A visibly dark/blurry frame should prompt a retake. On-device recognition may request a retake below a word confidence of 0.85. This threshold is a heuristic and does not guarantee accuracy. Gemma may report unreadable non-text pictures. Never fill missing dates, numbers, names, or dosage text. Spoken prompts explain what to do next.

### C. Listen again or understand

The last successful reading is available locally. Repeat works without uploading again. A slow-playback button changes speech rate. Original reading is distinct from a Hindi explanation, labeled आसान भाषा में समझाइए. Explanation must announce that it is an explanation, not the original wording. Omitted, changed or invented numeric tokens fail closed. The number guard does not establish semantic accuracy. For an image without text, announce that it is a description. It must not identify people by face or infer private traits.

### D. Family setup

Himanshu performs installation, Android accessibility enablement, camera permission, Hindi voice setup, and backend configuration once with the parent's agreement. A clearly labeled family setup screen contains technical fields. Parents see a useful spoken readiness prompt when setup is missing. No sponsor logos, API settings, or account creation in their daily flow. Default to Hindi, high contrast, large controls, and a comfortable speech rate.

## Interaction requirements

- Primary controls at least 80dp tall; overlay at least 96dp wide by 80dp tall. Secondary controls at least 56dp. Respect system font scaling and use scrollable content rather than truncating labels.
- Dark text on warm light backgrounds, deep teal primary actions. Meaning is communicated through labels, spoken feedback, and shape, not color alone.
- Hindi labels at least 24sp; headline 36sp. Icon plus text; no icon-only action. Use standard Android accessibility semantics and TalkBack labels.
- Immediate spoken/haptic acknowledgement, with a waiting state for server work. Stop is always reachable.
- No timed onboarding carousel. No gesture-only daily controls or required long presses. Family settings can require a deliberate labeled action.
- The overlay must avoid the keyboard/send controls and stay within screen bounds. Setup offers left/right placement. Test a smaller screen and large font scale.
- Microphone-based questions, automatic framing/capture, continuous video, call integration, and browsing/search are excluded from v1.

## Failure behavior

No network: existing text stays visible and cached ElevenLabs audio can repeat offline. Image text can be recognized locally through bundled OCR, but fresh narration needs the authenticated backend and ElevenLabs. Non-text descriptions and explanations need the configured model connection. No ElevenLabs audio: show the original and a setup/network message with a bundled Raju help clip. Never substitute Android TTS or a browser voice. Backend missing: announce how a family member can finish setup. Blurry/cropped/protected content: say what is unreadable and ask for another view. Incorrect or empty model JSON: return a retake/error, never fabricate a fallback reading. Permission revoked/service interrupted: restore a visible setup state.

## Data and safety boundaries

Screen capture only after a deliberate tap; visible WhatsApp content only. Camera images only after the shutter. Family setup explains that requested images and extracted text go to the configured backend/model host, and narration text goes to ElevenLabs only when the caregiver explicitly enables optional online voice. No capture of secure windows or bypass. No reading archives on the backend by default. Local last-reading storage is app-private, backups disabled, with a delete action in family settings. Sentry only receives stage/duration/status metadata. MongoDB only stores optional preferences, never photos/readings. API credentials stay server-side. App access token is installed by the family and encrypted at rest.

Image text may be incorrect even if the model considers it readable. Read labels faithfully; never give medical/financial advice or present an extracted quantity as independently verified. The public write-up must describe this limitation and include failure examples.

## Sponsor roles and rollout

Implement Gemma, Mastra, optional ElevenLabs, optional MongoDB, optional Sentry, Entire provenance and a Render blueprint. Add a developer Backboard model comparison and a caregiver SerpApi/Gemma official-support helper. See sponsor-tracks.md for actual evidence and remaining gates. Partner usage requires evidence before it is claimed as live. DigitalOcean hosting, Tinker fine-tuning and other conditional tracks require a useful role and verifiable execution before inclusion. GitHub Copilot is excluded by user preference.

Use local development first to conserve credits. No paid GPU provision or public deployment before concrete configuration and spending terms are known. SDK/model downloads are local development dependencies, not cloud deployment.

## Acceptance and evidence

1. Android 11 APK installs; accessibility setup can be enabled; overlay reads a controlled fixture and stops during work.
2. Hindi camera/document path reads recognized original text with bundled OCR; Gemma describes non-text synthetic pictures in a separate test. Empty/invalid/blurred samples visibly fail or request a retake.
3. A late image/model/audio response after Stop cannot resume reading.
4. Saved reading and slower playback work offline after a successful reading.
5. At font scale 1.3 and 1.6, primary labels/actions remain accessible without overlap.
6. No API secret in APK, ZIP, logs, traces, or repository. Auth/rate limits/body limits protect the backend.
7. A real phone/WhatsApp integration test and separate parent usability test are recorded before claiming parental independence. Emulator/fixture tests alone do not meet this outcome.
8. Record which integrations are configured, live, locally tested, or pending, and include the Claude review and dispositions.

## Weekend submission

The project and repository are new within the October 2–5 window. Submit by October 5, 2026, 12:29 PM IST with code, APK/demo, and the required DEV template. Writing quality has the highest weight. The story should use actual parent feedback, not invented quotes. The no-ai-slop skill applies when drafting the public article. Only one submission and one possible win, regardless of qualifying partner categories.
