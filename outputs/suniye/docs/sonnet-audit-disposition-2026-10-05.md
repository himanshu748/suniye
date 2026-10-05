# Sonnet 5.5 audit disposition — 0.4.1 real-document update

The original [audit](evidence/sonnet-5.5-audit-2026-10-05.txt) and [follow-up](evidence/sonnet-5.5-reaudit-2026-10-05.txt) are preserved. Sonnet reviewed source and ran targeted tests; subsequent native/hosted receipts are separate verification, not attributed to the auditor. The [final focused review](evidence/sonnet-5.5-final-focused-review-2026-10-05.txt) found no new Android regression and flagged old documentation; that history is now separated from the current instructions.

## Fixed and verified

- **Meaning preservation:** parent generative paraphrasing was removed. Reviewed dictionary definitions are labelled separately and followed by the unchanged original. Descriptions cannot be presented as original text. Gemma now handles only fixed public caregiver setup references.
- **Native replay:** Repeat/Slow use the current original or word-help audio; help text is displayed separately, and an explicit original-reading button is available. Restored cache and missing-cache recovery passed.
- **Native failure UX:** seven error categories map to authored Hindi recovery and bundled Raju clips. No-text images are refused locally before upload. Setup now discloses providers, visible screen content and retention uncertainty.
- **Speech normalization:** compact units, percentages, large rupee amounts, decimal paise, explicit clock times and signs are covered by shared Java/JS fixtures. Identifiers, dates and ratios remain literal where interpretation would be ambiguous. All 57 shared fixtures passed; OCR brackets are converted to plain spoken markers.
- **Atlas recovery:** transient startup/network errors reconnect; uncertain writes are not repeated. Duplicate-key upsert races no longer mark the store unavailable. Temporary access expiry remains operational maintenance.
- **Rate isolation:** unauthenticated requests cannot consume the family bucket. Static/health requests are exempt from the shared proxy bucket; API routes retain limits. The family deliberately shares its API quota.
- **Cancellation/privacy:** late replies are discarded; returned model threads receive bounded cleanup attempts. Unknown IDs/timeouts still prevent a zero-retention claim.
- **Hosted retrieval:** concurrent fixed-topic pgvector queries passed. SerpApi receipts now distinguish raw rows and rejection reasons; the older zero-approved cached result retains its uncertainty.

## Real-document findings addressed

The focused real-document review identified three additional source issues:

- **Old audio during pending OCR:** the pending review now clears the previous reading cache. Repeat, Slow, word help and original-reading actions retain the review gate; Stop/Forget clear it.
- **Incomplete numeric masking:** flagged numeric groups now include adjacent tokens, Hindi number words, currency/unit tokens, digit lookalikes and cross-line groups. The caution promises only that some flagged numbers are replaced, not that every recognition error is detected.
- **Caution presented as source:** recognized text and the authored OCR caution now travel in separate fields. Only speech receives the prefix; original display and dictionary matching receive the recognized body. Repeats preserve the caution.

The full-page PDF also exposed the old 20-second provider timeout. An observed direct voice request took 33.15 seconds; the long-read timeout is now 60 seconds. This is a bounded timeout adjustment, not a claim that every long document will complete.

The [final focused Sonnet 5.5 follow-up](evidence/sonnet-5.5-real-documents-final-2026-10-05.txt) reported: “No concrete blocker in the diffs you listed.” It checked the exact OCR marker handling, preservation of ordinary brackets, Java/source mapping, 20/60-second request bounds against Android’s 75-second limit, abort propagation and the standalone OCR runner. It did not rerun the 127-test backend suite, 57 speech fixtures or Android checks; those results are recorded separately. Its minor concern about manually adjacent markers does not match OcrTranscript’s space-separated output.

## Current verification

127 backend tests, 57 shared Java/JavaScript speech cases and the standalone OCR harness pass. Current 0.4.1 Android 11 checks at 160% fonts pass for layout, playback state, pending review, Stop/Forget and RecoveryProbe (authored errors, hosted source/dictionary audio, offline replay and cache recovery). The image and both full PDF-page stages also passed at normal fonts through direct public HTTPS, including Raju playback completion, Repeat and Stop. [Consolidated native receipt](evidence/native-real-documents-2026-10-05.json). The [140.032-second film export](evidence/native-real-documents-video-2026-10-05.json) passed full decoding and visual inspection. Export checks and hosted browser playback remain distinct from native tests.

APK SHA-256: `f90fd8a8eb4d05c362cd952e514ad4bf20e78501f5c6bf63bdde968a89e4eeca`. [Real-document sources and capture scope](real-document-walkthrough.md). Native/hosted test results are our verification, not attributed to Sonnet's source review. The focused review result applies to the inspected changes, not to physical-device or provider availability guarantees.

The [approved extra public-reference test](evidence/hosted-public-summary-2026-10-05.json) preserves its actual outcome and Atlas before/after counts. No counter reset or purchase was made. Original reading and dictionary help do not consume Gemma quota.

## Remaining technical limits

Physical Redmi A4 behavior, an external WhatsApp sender and microphone recognition need separate device checks. Dense OCR is imperfect, including some confident tokens; confidence is a heuristic. Natural pronunciation of arbitrary ranges/dates is not implemented; written order is preserved. Very long expanded speech can exceed its limit and leave visible text without audio. Provider retention cannot be guaranteed. Free Render can sleep despite the scheduled health check. Atlas and voice credentials retain their expiry/caps.

Ten category targets describe bounded roles, not guaranteed qualifications: nine runtime roles plus Entire development provenance. Tiger Data is pgvector/PGlite, not Tiger Cloud. Temporal and TabPFN remain excluded from hosted claims.
