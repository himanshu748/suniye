# Current verification — October 5, 0.4.1

The [consolidated 0.4.1 receipt](evidence/native-real-documents-2026-10-05.json) records the tests below, APK hash and actual hosted revision `6a842bf3ee81`. Older 0.3/0.4 receipts remain dated evidence.

## Current checks

| Check | Result and scope |
| --- | --- |
| Backend | 127 tests pass, including separate OCR caution/source fields, bounded speech requests, authentication, cancellation and quota regressions. |
| Speech normalization | 57 shared Java/JavaScript fixtures pass. Bracketed OCR markers become plain spoken Hindi; amounts, explicit times and compact units have dedicated cases. Arbitrary dates/ranges are not interpreted as a general natural-language date system. |
| OCR policy | The standalone pure-Java harness passes. It checks finite confidence, review thresholds and numeric-group masking, including Devanagari digits, Hindi number words, currency groups, lookalikes and line breaks. Confidence is a heuristic, not a measured accuracy score. |
| Android layout/state | Current 0.4.1 APK: ParentUsabilityProbe and RealMediaDemo review-state checks pass on Android 11 at font scale 1.6. They cover long-source scrolling with Stop, empty cache during pending review, Repeat/Slow/help guards, Stop and Forget. |
| Hosted long-document request | A real long PDF page exposed the previous 20-second request timeout. A direct voice request took 33.15 seconds; the long-read timeout is now 60 seconds, deployed in revision `6a842bf`. This is one observed request, not average latency. |
| Recovery | Current-APK RecoveryProbe passes at font scale 1.6: seven authored error mappings/Raju clips, hosted source and dictionary audio, distinct help/original controls, offline replay, restored cache, missing-cache recovery and Stop. |
| Full real-document playback | All three current-APK stages pass at normal fonts: consumer-notice image, complete PDF page 1 and PDF page 2. Each used real ACTION_SEND/local OCR, explicit review, authenticated public Render HTTPS and Raju speech, then completed playback, Repeat and Stop. Source/caution separation passed. |

APK: `0.4.1-real-documents`, version code 5. SHA-256: `f90fd8a8eb4d05c362cd952e514ad4bf20e78501f5c6bf63bdde968a89e4eeca`.

Run the backend suite with `npm test` in `outputs/suniye/backend`. From the repository root, use JDK 17:

```sh
JAVA_HOME=/path/to/jdk17 python3 outputs/suniye/scripts/check-hindi-speech.py
JAVA_HOME=/path/to/jdk17 python3 outputs/suniye/scripts/check-ocr-transcript.py
```

The full playback durations were 30.976 seconds (image), 188.422 seconds (PDF page 1) and 161.15 seconds (PDF page 2). Request waits were 8.466, 40.817 and 30.504 seconds respectively. These are individual observations, not a latency benchmark. Android screenrecord capped the page-1 footage at 180 seconds; the instrumentation continued through the full playback and controls. The 140.032-second film export passed full decoding and visual inspection; its measured mean audio is −19.9 dB. [Film receipt](evidence/native-real-documents-video-2026-10-05.json). Hosted browser playback is checked separately from the exported-file checks.

## Hosted integration receipts

- [Atlas preferences, original speech and content rejection](evidence/hosted-e2e-2026-10-05.json).
- [Reviewed dictionary help and original preservation](evidence/hosted-word-help-2026-10-05.json).
- [Gemma/Backboard public-reference summary and exact persistent quota](evidence/hosted-public-summary-2026-10-05.json).
- [Concurrent pgvector retrieval](evidence/hosted-pgvector-concurrent-2026-10-05.json).
- [Signed-in Sentry timing/token inspection](evidence/hosted-sentry-2026-10-05.json).
- [Full sponsor roles, limits and source links](sponsor-tracks.md).

These establish the recorded provider interactions. They are not a guarantee that a temporary credential or hosted service remains available indefinitely. Parent reading and reviewed dictionary help do not consume Gemma attempts; the one approved October 5 extra model test is recorded without a counter reset.

## Demonstration and limits

The new film uses dated public documents, English explanation and Hindi app speech. The source image is a crop from a real consumer bulletin; the PDF contains two complete pages. [Provenance and capture scope](real-document-walkthrough.md). Provider response MP3s are mixed with emulator footage; Android screenrecord does not capture device sound.

Instrumentation tests Activity views and media state. Physical Redmi behavior, actual external WhatsApp sharing and microphone recognition need separate device checks. The film's English instructions explain the sender workflow; the native capture exercises the receiving app. Dense OCR can misrecognize confident words and reading order. Flagged numeric groups are withheld, but confidence cannot guarantee every error is detected. Protected screens and no-text pictures are refused rather than described. Fresh cloud speech needs a connection; cached audio can be replayed offline. Free Render may sleep. Atlas network access and provider credentials retain their temporary expiry/caps.

## Dated earlier evidence

[0.4 native suites](evidence/native-0.4-e2e-2026-10-05.json), [0.4 recovery](evidence/native-0.4-recovery-2026-10-05.json), [0.4 synthetic media](evidence/native-0.4-media-2026-10-05.json) and [0.4 film](evidence/native-0.4-video-2026-10-05.json) describe the earlier build. They are retained for traceability, not presented as the current full-document demonstration. [Sonnet audit disposition](sonnet-audit-disposition-2026-10-05.md).
