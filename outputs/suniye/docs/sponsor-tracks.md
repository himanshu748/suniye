# Sponsor roles and evidence — October 5 real-document 0.4.1 update

Ten targets: nine runtime roles and Entire development provenance. Parent generative rewriting has been removed; Gemma/Backboard now summarize only fixed public caregiver references. Category decisions belong to the judges.

| Category | Actual use and why | Evidence and limits |
| --- | --- | --- |
| ElevenLabs | Raju Hindi original reading, authored help, offline replay/Slow and film narration. | The current 0.4.1 APK completed actual hosted Raju playback for the image and both full PDF pages, followed by Repeat and Stop. Strict voice allowlist; no other speech engine. English film explanations and Hindi app readings use the same provider.|
| Mastra | Validate original/word-help/speech stages and discard stopped replies. | 127 backend tests and hosted Android original/help requests. Caregiver AI is separate from parent reading. |
| Gemma | Hindi summary of approved public setup snippets. | Hosted 27B display-topic summary returned HTTP 200 and its source link. Parent text never enters this route. One success is not a broad faithfulness metric. |
| Backboard | Compare candidate open-weight models, then host Gemma while the laptop is off. | Actual current caregiver summary; [six-call Gemma/Qwen comparison](evidence/backboard-comparison.json) informed the removal of generative rewriting from parent reading. This small comparison is not a general model ranking. Memory/search/tools off, eight attempts/day, one approved October 5 extra test (8→9), no reset. Best-effort deletion is not zero retention. |
| Render | Host authenticated backend, landing and caregiver app. | Actual public /health revision and direct Android HTTPS checks. Existing Free Singapore service; sleep remains possible despite health schedule. No paid upgrade. |
| MongoDB Atlas | Preferences, persistent quotas and public help cache. | Hosted write/read, content rejection, settings persistence across process replacement, synthetic cleanup and 8→9 quota receipt. Reconnection and duplicate-race regressions pass. Android settings-sync UI not separately tested. Temporary access expires around October 11–12. |
| Sentry Agent Tracing | Locate model/workflow latency and token use without reading content. | Signed-in hosted trace: 4.13s total, 2.89s model, 158 tokens, no displayed input/output. This earlier 4B trace is not the new summary trace or average latency. |
| SerpApi | Fixed public searches for current official setup material. | Actual HTTP 200 retained zero approved URLs. Curated help remains available. Older cache lacks raw-row counts, so no rejection cause asserted. New outcomes count raw rows/reasons. |
| Tiger Data / pgvector | Retrieve approved setup references using keyword/vector ranking. | Hosted PGlite/pgvector, three fixed topics and frozen public vectors; concurrent requests passed. New Gemma summary consumes its display reference. No Tiger Cloud, arbitrary queries, BM25 or pgvectorscale claim. |
| Entire | Connect UI decisions to the family brief. | Eighteen imported development checkpoints and curated requirement lookups. Private transcripts excluded; deliberately a development integration. |

## Current receipts

- [Current 0.4.1 native receipt](evidence/native-real-documents-2026-10-05.json), [English/Hindi film receipt](evidence/native-real-documents-video-2026-10-05.json), [verification](verification.md) and [real-document walkthrough provenance](real-document-walkthrough.md). Earlier [0.4 Android](evidence/native-0.4-e2e-2026-10-05.json) and [film](evidence/native-0.4-video-2026-10-05.json) remain dated historical evidence.
- [Hosted public Gemma/Backboard summary and exact quota](evidence/hosted-public-summary-2026-10-05.json).
- [Hosted dictionary/source preservation](evidence/hosted-word-help-2026-10-05.json).
- [Hosted Atlas/original speech](evidence/hosted-e2e-2026-10-05.json), [concurrent pgvector](evidence/hosted-pgvector-concurrent-2026-10-05.json), [Sentry dashboard](evidence/hosted-sentry-2026-10-05.json).
- [Sonnet fixes and remaining boundaries](sonnet-audit-disposition-2026-10-05.md).

The official [Tiger Data category](https://dev.to/challenges/hacktoberfest-weekend-2026-10-01#best-use-of-tiger-data) includes pgvector/hybrid search. Temporal Cloud required payment information; its local prototype is excluded. TabPFN has zero real OCR observations and no inference/benefit, so is excluded. DigitalOcean/Tinker/Arduino have no deployed role. No cash purchase or paid resource was created.


[Earlier experiments and dated provider status](sponsor-history-through-2026-10-04.md) are archived separately.
