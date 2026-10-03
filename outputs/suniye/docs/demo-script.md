# Recorded demo, October 3

The actual 79.5-second video is `releases/suniye-demo.mp4`. Publish under the title **Suniye Android pilot | Voice: elevenlabs.io**. It contains no private family material, credentials or account screens.

- 0:00–0:31.5: three actual Android 15 screenshots at font scale 1.6, with an English overview generated through ElevenLabs. These are identified as screenshots before the recorded demonstration.
- 0:31.5–0:38.3: actual Android 15 recording starts. A debug-only driver launches the real app and sends an Android Share intent containing the synthetic bill.
- 0:38.3–0:48.5: the real backend returns Hindi ElevenLabs audio; Android MediaPlayer finishes the reading. The bill's saved amount and date remain unchanged.
- 0:48.5–0:55: Slow replays the cached original at 0.7 instead of the 0.85 base rate, then Stop cancels it.
- 0:55–1:02: a real local Gemma call changes the numeric date to a written month and adds a duplicate currency word. The conservative guard rejects that explanation. This is not proof of an incorrect calendar date, and the rejection is retained in the film.
- 1:02–1:11.5: Repeat replays the original, then Stop cancels it again. No late or refused explanation replaces the saved original.

All native video runs at normal speed; the model wait in this recording is about three seconds. Other cold-model tests were slower. The provider audio was captured separately by a local synthetic-only wrapper and aligned approximately to the visible playback phases. The English overview is separate narration. Android screenrecord contains no device sound, so the mix is not a microphone recording or proof of real-phone pronunciation. Existing Android 11/15 camera, photo/PDF and late cancellation evidence is linked in the entry report; those paths are not acted out in this video.

Receipts: `evidence/entry-demo-receipt-2026-10-03.json`, `evidence/entry-demo-providers-2026-10-03.json`, `evidence/entry-narration-receipt.json`. Raw recording and runtime wrapper stay in the ignored local work folder. The reusable debug driver is in `android/app/src/debug/java/in/suniye/app/EntryDemo.java`; release source sets exclude it.

The family handover, offline Hindi listening test, real WhatsApp overlay and Redmi camera focus remain pending. The film is a pilot demonstration and contains no parent feedback.

The final eight seconds show the actual October 2 successful Gemma/Mastra backend receipt, which kept the numeric amount and date. This section is labeled as a separate saved receipt, not recorded Android playback. Slow/Repeat audio was time-stretched by 0.7/0.85 to match the app setting.

Hindi caption correction: the initial generated receipt card lacked Devanagari shaping and misplaced the vowel mark in बिल. The final export uses native Core Text shaping, inspected for बिल, तारीख, समझाया and the rupee symbol. Android screenshots retain their original native rendering.
