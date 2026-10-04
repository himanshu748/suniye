# Suniye dedicated landing page

Standalone Hindi-first landing, isolated from Android and backend code. No dependency install, analytics, document upload, microphone access, remote font or provider API call. The audio player plays an existing synthetic Raju recording only after a user action.

## Build

From the repository root, with existing Node:

```sh
node landing/build.mjs
```

The builder validates local references and anchors, metadata and script syntax, checks a 350 KB total package budget, then copies a complete static site to a fresh `landing/build/<timestamp>` directory with a SHA-256 manifest. It never deletes earlier builds. The static package includes the existing font license. Serve the reported output directory on an unused loopback port for local QA; no backend or cloud runtime is needed.

## Existing assets and evidence

| Landing asset | Unchanged original | Scope |
| --- | --- | --- |
| `assets/android-home.png` | `outputs/suniye/docs/evidence/android15-voice-home-font16.png` | Native emulator capture; no new APK or physical-phone verification |
| `assets/android-reading.png` | `outputs/suniye/docs/evidence/android15-number-reading-font16.png` | Native original/amount/Stop screen; dated pilot evidence |
| `assets/raju-bill-sample.mp3` | `outputs/suniye/docs/evidence/elevenlabs-raju-v4-2026-10-03.mp3` | Synthetic bill speech, generated previously; source receipt `elevenlabs-raju-v4-2026-10-03.json` |
| `assets/manrope-latin.woff2` | Already-installed `@fontsource-variable/manrope` Latin file | SIL OFL; included `MANROPE-OFL.txt`. Hindi retains the native system font fallback. |

The source Raju receipt records “नमस्ते। बिजली का बिल एक हज़ार दो सौ पचास रुपये है। फिर सुनने के लिए फिर सुनिए दबाएँ।” Playback on this page is not new TTS generation. Voice is not model reasoning. Screenshot and MP3 file hashes are recorded by the build.

Public download: `0.2.0-elevenlabs`, linked to the existing release. The 82-second film is an older `0.1` pilot with synthetic inputs and separately mixed provider audio. A separate `0.1` APK was selected for the parent orchestrator's Appetize cloud-emulator checks; this page claims no outcome from that check. Newer `0.3.0-parent-ux` and backend refinements are local work outside the public download. Existing links are taken from supplied repository/docs; no fresh public release fetch, APK binary scan or cloud test was performed by this landing task.

## Verification scope

See `verification.md` for the executed static build and bounded browser checks, known limits, external screenshot paths and the rubric-to-evidence mapping. A page-level browser check is not an accessibility certification, device/parent usability study, live provider test or release of newer Android code.
