# A simpler Suniye demo

The current film is 32.9 seconds and shows one task: a synthetic electricity bill enters through Android Share, Raju reads ₹1,250 as “एक हज़ार दो सौ पचास रुपये,” Repeat plays the saved reading and Stop cancels it. A 10.5-second opening explains the parents’ small-print problem in Hindi. The phone occupies most of the portrait frame; captions are short. There are no model explanations, date parsing or sponsor panels in this film.

The recorded APK contains the new fixed बोलिए and रोकिए controls and puts the original text above replay controls. This film does not stage microphone recognition. Actual ASR on the parents’ Redmi A4 phones remains unverified. [Voice callback checks](evidence/voice-controls-2026-10-03.json) are separate evidence.

A fresh ElevenLabs v4 request used Raju - Clear, Natural and Warm and returned HTTP 200 in 2,475 ms. Android played it and cached it with base rate 1. Repeat’s actual MediaPlayer rate was .85; Stop ended it. No Gemma generation was needed for this already supplied text. [Native receipt](evidence/simple-native-2026-10-03.json) identifies the recorded APK; [provider receipt](evidence/simple-providers-2026-10-03.json) records the synthetic speech input.

The native flow runs at normal speed, with no waits cut. Android screenrecord does not capture device sound, so the actual provider MP3 is mixed separately at .85 speed and approximately aligned with the instrumentation events. The intro reuses the separately generated Raju purpose narration. Video and full stereo PCM are rendered separately and then muxed. Full decoding and non-silent intro, bill and Repeat segments passed; [audio check](evidence/demo-audio-check-2026-10-03.json) records the measured levels. This is not physical-phone audibility or parent feedback.

Older native v4 Slow/Stop/Repeat and Gemma refusal receipts remain dated supplementary evidence. The older 60.2-second edit receipt describes that previous film; it does not describe the current release file. [Current edit receipt](evidence/simple-demo-edit-2026-10-03.json).

Family-phone installation, offline Hindi listening, real WhatsApp, Redmi camera focus and parent usability remain pending. No family handover is claimed. API calls use plan credits; the free v4 web/mobile promotion excludes API.

## Image, PDF and WhatsApp walkthrough

The companion film shows a synthetic image entering through Android Share and being read as नमस्ते, then a two-page PDF: बिल on page 1 and धन्यवाद on page 2. Actual Hindi provider audio is mixed separately at the observed playback rate. Native OCR, page count, page change and playback completion passed on Android 11. [Recording receipt](evidence/media-native-2026-10-03.json).

The WhatsApp portion shows the app’s help screen with separately generated Hindi instructions. It explains the green सुनिए button for messages and Share → Suniye for photos and PDFs. The footer labels this a setup walkthrough with real WhatsApp testing pending. [Edit and audio checks](evidence/media-demo-edit-2026-10-03.json).

## Combined judge walkthrough, October 4

The combined film opens with the bill and Hindi purpose narration, then shows each exact PNG/PDF source before its recorded reading. Three source previews add nine seconds; the native recordings run at normal speed. A final eight-second slide displays a fresh Gemma/Mastra backend receipt, with an English gloss. That slide is a saved synthetic result, not Android playback.

The two original APK hashes remain in their native receipts. The released APK matches the later image/PDF recording; production app code did not change during this edit. This export adds no staged microphone recognition or real WhatsApp test. [Combined edit checks](evidence/judge-demo-edit-2026-10-04.json).
