# Challenge entry readiness, October 3

Suniye is an Android reading aid for Hindi readers who struggle with small print, built around the tasks Himanshu’s parents ask him to do. The current 32.9-second portrait film explains that purpose with Hindi TTS, then shows one bill, Repeat and Stop. The [official challenge](https://dev.to/challenges/hacktoberfest-weekend-2026-10-01) and [contest rules](https://dev.to/page/hacktoberfest-weekend-challenge-26-10-01-contest-rules) require an English post, the three tags, a demo, public source and an open-innovation explanation. The deadline is October 5 at 12:29 PM IST. Family handover/feedback is bonus evidence.

## Current verification

- Final debug build succeeded; 87 backend tests and 38 shared Java pronunciation cases passed.
- Android 15, font scale 1.6: purpose text, camera/photo controls, Hindi amount hint, 24sp WhatsApp instructions and fixed Stop/Back passed. Actual photo/PDF OCR, malformed shares, picker cancellation and first setup passed.
- Real Raju v4 API audio played in Android. The cache recorded audioBaseRate=1; Slow and Repeat played at measured 0.7; Stop cancelled both. The original bill stayed unchanged.
- Gemma returned a changed date/currency phrasing. The conservative guard refused it and retained the original. Earlier successful explanation evidence is separate.
- The new film has a complete stereo track. Intro, bill and Repeat segments are non-silent and full decoding passes. [Audio check](demo-audio-check-2026-10-03.json).
- A fresh simple-bill Raju v4 request returned HTTP 200. Android read it, preserved the original, repeated cached audio at .85 speed and stopped. No waits are cut. Actual provider audio is mixed separately; this is not device microphone capture.
- Spoken controls passed 33 command parser cases and Android 11/15 synthetic recognizer callback checks at font 1.6. Opt-in, Hindi request limits, unknown rejection, Repeat/Slow/Stop, engine fallback and late callback cleanup passed. Camera and image/PDF input checks also passed.
- Claude’s scoped voice review identified three P2s, all fixed; a source follow-up found no P1/P2 regression. Claude did not run tests. Actual Hindi microphone recognition remains unverified.

[New native receipt](simple-native-2026-10-03.json), [provider receipt](simple-providers-2026-10-03.json), [edit receipt](simple-demo-edit-2026-10-03.json), [voice checks](voice-controls-2026-10-03.json). Older Android 11/15, pronunciation, Gemma and Slow receipts remain dated evidence.

## Sponsor evidence

| Category | Actual use | Limit |
| --- | --- | --- |
| Gemma | Local model explanations and picture trials, dated success and recorded refusal | Accuracy and picture reliability unresolved |
| Mastra | Real Android-to-backend reading workflow and cancellation tests | Injected tests are distinguished from live calls |
| ElevenLabs | Real Raju v4 Hindi API audio played by Android | Real-phone listening remains pending |
| Entire | Imported checkpoint lookups explaining family-specific UX | Full private sessions excluded |
| SerpApi | October 2 official-help retrieval and Gemma summary | October 3 returned no approved articles; dated development use |

Four categories have fresh successful checks; SerpApi has meaningful dated use. Five can be requested with these limits; judges determine eligibility. Nine sponsors fit the plan, but four lack live application evidence: Atlas has no application URI/read-write receipt, Sentry no received trace, Backboard no comparison or R-CLI build, and Render no deployed Suniye/backend model endpoint.

The user manually redeemed the ElevenLabs partner plan. The offer stated three months; actual checkout stated one. Readback confirms Creator, a paid $0 invoice, auto top-up off and cancelled access ending November 3. Only current access is confirmed. V4’s free web/mobile promotion does not cover API calls. The restricted TTS key’s 1,000-credit cap and October 9 expiry are unchanged. [Plan receipt](elevenlabs-partner-plan-2026-10-03.json).

## Remaining limits and publication

Real Redmi A4 behavior, actual WhatsApp media/accessibility, camera focus, installed offline Hindi audio, Maithili and parent usability remain unverified. No family quote, handover or win guarantee is claimed. The demo uses localhost; remote parents still need a reachable authenticated HTTPS backend for online features.

The APK, source ZIP, film and local article are reviewable. Source/demo publication is still pending approval. Then public links must replace placeholders, supporting links must resolve publicly, and the DEV post must be published and read back with devchallenge, weekendchallenge and hf26challenge. No submission is claimed.

The current publication scan records known-pattern findings separately from the exact configured-secret/private-key scan. The known-pattern scanner’s two credential-shaped unit-test fixtures are reviewed test values, not production keys. Scans cover the prepared snapshot, decoded APK and source package within their stated limits; they do not prove absence of every unknown secret format. Account screenshots, private environment, model weights, caches and full sessions are excluded. [Scan receipt](entry-publication-scan.json).
