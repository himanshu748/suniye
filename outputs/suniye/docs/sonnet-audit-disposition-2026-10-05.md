# Sonnet 5.5 audit dispositions, October 5

The independent [audit](evidence/sonnet-5.5-audit-2026-10-05.txt) reviewed b354b5c and some concurrent edits, not the final deployed revision. Its original report and failed receipts are preserved. Current backend code is 24538b1; `/health` and the signed-in Render dashboard attest that revision. This document records later fixes, not a claim that the auditor reran them.

## Addressed with tests and hosted checks

- H1: known before/after, duration, first/last, weekday and payment-word flips are rejected by ordered anchors. Every accepted explanation speaks an AI warning. The 107-test backend suite passes. This only covers those probes: the hosted 27B milk reply added context without being rejected. Full meaning preservation remains open.
- H2: after dispatch, Stop discards the reader result but permits a bounded 45-second reply and a separate 10-second thread cleanup. The cancellation regression confirms a returned thread is deleted. Unknown IDs, timeouts, malformed/oversized replies and failed deletion still prevent zero-retention claims.
- H3: the landing and caregiver web pages now name Backboard/OpenRouter, and [privacy.md](privacy.md) covers providers, local storage, `/tmp`/process-interruption limits, visible screen content and retention uncertainty. Native 0.3 setup disclosure is still less specific.
- H4: hosted no-text pictures receive an authored retake before any Backboard attachment or quota reservation. The live check returned HTTP 200 and its counter stayed at four. Android local image/PDF OCR is a different route.
- M1: new SerpApi outcomes include organic-row counts and rejection reasons. The earlier cached HTTP 200/zero-approved result does not prove why links were absent.
- M2: a failed pgvector initialization now clears its cached promise. Three simultaneous hosted fixed-topic requests passed in 21,688 ms. This is a three-topic approved corpus, not unrestricted search or a load benchmark.
- M4: `service_` profile identifiers are reserved. Offline tests and live GETs return 400. Internal counters cannot be initialized through the preference API.
- M8: the opt-in hosted runner cleans only its synthetic profile in `finally`, writes uniquely dated receipts/audio and exits nonzero on failure. Its revised provider-consuming full run was not repeated. Two older synthetic profiles were cleaned through direct checks, with hosted absence confirmed.
- Settings survived an automatic deploy/process replacement and were read from the hosted route. This was not a separate manual restart experiment. [Receipt](evidence/hosted-e2e-2026-10-05.json).
- Sentry ingestion is now verified through its signed-in trace UI, not inferred from configuration. One hosted 4B trace showed 4.13 seconds total, 2.89 seconds model and 158 tokens, with no input/output content shown. [Receipt](evidence/hosted-sentry-2026-10-05.json).

## Still open

H1 general faithfulness and false positives; H2 uncertain provider retention; H3 native setup disclosure; H4 native daily-limit/model error mapping and retake prompt specificity; H5 temporary Atlas access and no retry after startup failure; H6 time/date/range pronunciation; M3 actual proxy/multi-IP rate-limit scope; M5 native Repeat/Slow after explanation and missing explanation text; M6 compact units, percentages, long unprefixed amounts, Java/JS parity and dense OCR; M7 physical Redmi/WhatsApp/current touch walkthrough.

The released APK remains 0.3.0-parent-ux with SHA-256 `39d5484833272ead0147788823ee7c0e8790ed1454555b48f721e807c1d2cdfd`. No Android fix is implied by a backend deploy. Historical Android videos are labelled as such. No parent testimonial or physical-device success is claimed.

Atlas credential/network access is temporary, roughly October 11 to 12; verify exact dashboard expiries before extending it. The ElevenLabs key also has an existing expiry and credit cap. No access expansion, paid plan, card or cash purchase was made in this audit.

## Current model outcome and budget

The deployed 4B request failed when DeepInfra's shared upstream pool throttled it. The local diagnosis is labelled separately from hosted evidence. The explicit 27B route restricts routing to Nebius FP8 and sets USD-per-million-token ceilings of 0.12 input and 0.30 output, with fallback off. It does not guarantee provider availability or total account spending.

A hosted weekday output was rejected with UNFAITHFUL before speech. The milk output produced real Raju speech and the AI warning, but added a reason about cold storage. Today's eight model attempts are used; reset is at 05:30 IST the following day. Original speech is independent of that model limit. No counter was reset to make a demo pass. [Current outcomes](evidence/hosted-gemma-27b-2026-10-05.json).

## Prize scope

Ten targets: nine runtime roles with dated executed evidence, plus Entire development provenance. This is not ten guaranteed qualifications or continuously healthy services. Tiger Data is claimed under the challenge's pgvector/hybrid retrieval use case, using hosted PGlite/pgvector, not Tiger Cloud. Temporal remains local and excluded from hosted claims; TabPFN has zero measured OCR outcomes and is excluded. Free Render can sleep despite a best-effort health schedule.

## Later current native capture

The released 0.3 APK completed synthetic image OCR, both PDF pages and their real hosted Raju playback, reaching Stop, through an explicit localhost/adb relay because emulator DNS could not resolve the public hostname. The final WhatsApp-help scroll assertion failed; overall instrumentation remains failed. The [new focused video receipt](evidence/current-image-pdf-video-2026-10-05.json) preserves that limit and separately mixed audio. This closes the lack of any current image/PDF footage, but not direct device HTTPS, full touch walkthrough, real WhatsApp or parent testing.
