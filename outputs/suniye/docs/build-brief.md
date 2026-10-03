# सुनिए / Suniye

Agreed direction, October 2, 2026.

## People and problem

Himanshu's mother and father have weak eyesight. WhatsApp messages, shared images, labels, and documents are difficult to read. Copying, sharing, and taking photos often require his help. Both use Redmi A4 phones; support starts at Android 11. Hindi is the primary language; Maithili is a later experiment requiring family evaluation. His dadi uses a keypad phone and can listen on a family member's Android phone; direct telephone access is outside this build.

## Pitch

A Hindi reading companion with one large button over WhatsApp and a guided camera for paper: tap, hear the original, repeat or slow down.

## Core workflow

1. A family member installs the app and configures permissions, voice, and backend once.
2. The parent opens a message or picture in WhatsApp and taps सुनिए.
3. The app reads visible text or runs bundled OCR on the requested screenshot; images without recognized text can go to Gemma for description. It only reads when requested.
4. Camera mode provides spoken guidance and a large shutter for labels and documents.
5. Reading and explanation are distinct; unclear content produces a retake prompt.

## Integrations and scope

Gemma: non-text image description and Hindi explanation. Mastra: the reading workflow. ElevenLabs: optional Hindi narration, with Android Hindi TTS as the built-in fallback. MongoDB Atlas: optional synced family preferences. Sentry: optional metadata-only workflow traces. Render: deployable backend configuration. Entire: actual build provenance, subject to capture verification. Backboard: synthetic open-model comparison. SerpApi: current official caregiver setup references. Both need live evidence before a track claim. DigitalOcean and Tinker remain conditional extensions. GitHub Copilot is excluded.

No automatic WhatsApp actions, continuous screenshots, bank-screen capture, medication advice, full chat-history imports, or keypad calling. The APK does not contain sponsor API secrets. Protected screens are respected.

## Demo and evidence

Demonstrate original reading, separate explanation, blurry-photo recovery, stopping an in-flight request, replay, and large controls. Emulator tests are distinct from a real WhatsApp/device test and a parent usability test. Partner categories are claimed only after actual use is verified.

First risk: Android 11 screen capture plus the overlay on a real phone. Next: Hindi image-reading accuracy and a parent's ability to find and tap the button without help.

## Submission requirements

New project created during October 2–5. Deadline: October 5, 2026, 12:29 PM IST. A DEV template post, demo, code, and explanation of open innovation are required. Writing quality is weighted most heavily. One entry may qualify for multiple partner categories but may win only once.

Sources: [challenge](https://dev.to/challenges/hacktoberfest-weekend-2026-10-01), [rules](https://dev.to/page/hacktoberfest-weekend-challenge-26-10-01-contest-rules), [Android accessibility APIs](https://developer.android.com/reference/android/accessibilityservice/AccessibilityService), [ElevenLabs languages](https://elevenlabs.io/docs/overview/models).
