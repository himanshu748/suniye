# Current 0.4 result — October 5

All three Android 11 instrumentation suites passed at 160% fonts on the same released APK over direct public HTTPS. Repeat/Slow, long-content Stop, authored errors, cached/restored word help, missing-cache recovery, synthetic image/PDF OCR/playback, next page and WhatsApp help were exercised. [Receipt](evidence/native-0.4-e2e-2026-10-05.json).

These are Activity-view/media-state checks, not physical touch or parent comprehension. Real Redmi, actual WhatsApp sender and spoken-command recognition remain unverified. The older failure history below is preserved rather than relabelled as a pass.

# Parent usability pass — October 4, 2026

Audience: two Hindi-speaking Redmi A4 owners with weak eyesight. Neither parent nor either physical phone has been tested by the builder, who is in another city.

## Changes

- Everyday buttons use Hindi verbs, 28sp text and an 88dp minimum target. Parent guidance on the home/camera screens is 24sp.
- The original starts as a four-line preview with a full-text toggle, so reading another photo does not require scrolling through an entire document. The original itself is unchanged.
- Repeat and Slow appear before a long recognized source. Stop stays in a separate footer when the source scrolls.
- Slow can return to the usual 0.85 playback speed from the same button.
- The microphone button appears only after caregiver opt-in; it does not promise hands-free wake-word control.
- Reviewed dictionary help is collapsed under “और विकल्प”. It is separate from the unchanged original; there is no generative parent rewrite.
- “कैसे चलाएँ? सुनिए” plays a bundled ElevenLabs Raju recording without a network request. Narration has no Android or browser TTS fallback.
- Audio prompts respect audio focus and stop when the reading screen is left. A muted media stream asks the user to raise the phone volume.
- Camera guidance asks for a whole, well-lit paper. WhatsApp guidance distinguishes sharing to Suniye from sending to a contact.
- Setup cannot report success with an empty server address. Server credentials remain in caregiver setup and outside the public APK.

## Family check still needed

After a trusted family member configures the server, access token, consent and optional screen-reading permission, each parent should try these tasks independently:

1. Open Suniye and explain in their own words what it does.
2. Use “कैसे चलाएँ? सुनिए”, then stop the instructions.
3. Read an ordinary paper bill, recognize its amount, replay it slowly, and restore the usual speed.
4. Share a photo and a two-page PDF, change pages, and stop.
5. Open an actual WhatsApp message, use the floating control, and try again after locking and unlocking the Redmi.
6. Turn off data and Wi-Fi, replay a successfully cached reading, and check the unavailable-audio message on a new reading.

Observe wrong taps, requested help, misunderstood words, inaudible playback and failures. Emulator/media-state checks do not establish these outcomes. A reading should not be trusted for medicine, banking or another consequential decision without source review.
