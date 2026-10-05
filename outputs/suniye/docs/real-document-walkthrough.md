# Real-document walkthrough — 0.4.1

The demonstration follows an everyday task: share an image or PDF, hear its recognized text in Hindi, move through PDF pages and control playback. Explanations, titles and subtitles are English so the submission is understandable to judges. The native interface, OCR caution and document readings remain Hindi. All generated speech uses ElevenLabs Raju; there is no alternate TTS engine.

## Source documents

These are dated, publicly available electricity notices. They are examples of document formats that can be shared in a messaging app, not private WhatsApp messages or current consumer advice. No claim is made that the pictured document arrived in a particular person's chat.

| Input | Provenance | SHA-256 |
| --- | --- | --- |
| Consumer-notice image (`consumer-hi.png`) | Crop of the orange complaint-information box on page 1 of [DERC consumer bulletin 13](https://www.derc.gov.in/sites/default/files/PB-13%20%28Hindi%29_2.pdf). The original PDF was rasterized at a 6400-pixel long side, then cropped at x=108, y=3712, width=1100, height=664. The source text was not redrawn. | `824d80fe737267ac43f36cafe16b7999865cbcd0ce6ab532fe3222a99ca60817` |
| DERC original PDF | Complete public source of the image crop. | `ce5d95b0b435df9e95082942c01a23b8b4141ae91d60969740a6fa1df8d7343c` |
| Two-page Hindi PDF (`up-electricity-notice.pdf`) | [Uttar Pradesh electricity press notice](https://information.up.gov.in/admin/UploadDocument/OtherPress/compressed_280220260402524.pdf), dated February 27, 2026. Both original pages contain paragraphs, dates and numbers; the PDF is not a one-word fixture. | `35630ec93fa4161afee51e6c996d821e53b6e74b3a3248b21944ff80b5baff45` |

The repository's MIT licence covers project code, not these source documents. Their source rights remain with their respective publishers. The supplied links permit viewers to inspect the originals independently.

## What the app does

1. Android passes a selected image or PDF to Suniye's Share receiver. Images and rendered PDF pages are recognized locally.
2. A sufficiently uncertain page stays on the phone until the separate **सावधानी से सुनिए** review choice. Stop or Forget clears that pending choice. A prior cached reading cannot bypass it.
3. The app displays the recognized source separately from the authored caution. The backend prepends the caution to speech without inserting it into the source or dictionary input. Flagged numeric groups are withheld; OCR may still misread confident words.
4. The authenticated hosted backend returns real Raju speech. Repeat and Slow reuse the cached response, and Stop remains outside the scrolling source.
5. **अगला पन्ना** loads the next PDF page. Each page has its own OCR and review decision.

In WhatsApp, the intended flow is: open the image or PDF → Share → Suniye. The film shows the receiving Android workflow and English sharing instructions. It does not present the help screen as footage of an actual WhatsApp sender.

## Capture and verification

The APK is `0.4.1-real-documents` (version code 5), SHA-256 `f90fd8a8eb4d05c362cd952e514ad4bf20e78501f5c6bf63bdde968a89e4eeca`. Android 11 instrumentation drives the app and records actual view/media state. Video speech is mixed from the exact provider MP3 responses because Android screenrecord does not capture device audio. Any shortened playback or wait is an editorial cut, not a claim of shorter provider latency.

The [consolidated native receipt](evidence/native-real-documents-2026-10-05.json) records successful full playback, Repeat and Stop for all three stages: image (30.976 seconds), PDF page 1 (188.422 seconds) and PDF page 2 (161.15 seconds). Recorded request waits were 8.466, 40.817 and 30.504 seconds respectively. Page 1’s screen recording reached Android screenrecord’s 180-second limit before the instrumentation finished. Full playback is supported by media-state evidence, not uninterrupted footage of its ending. The [140.032-second film receipt](evidence/native-real-documents-video-2026-10-05.json) records the exact edit timeline, provider audio, hashes and full-decode check. The export also received visual inspection of its English explanations, Hindi app, source previews and labelled excerpts. [Current verification](verification.md) identifies which gates have passed. [Audit fixes](sonnet-audit-disposition-2026-10-05.md) explain the warning, cache and numeric changes.


## Published media identity

The English-narrated walkthrough is approximately 2 minutes 20 seconds (140.032 seconds), with Hindi app readings and English captions. File size: 3,722,171 bytes. SHA-256: `6f41e19b5e8f27a1bc1f90dfaffc134f9697064b9ac874a554dfbb4442355323`.

[Walkthrough on the project page](https://suniye-reader.onrender.com/#walkthrough) · [Download the video](https://github.com/himanshu748/suniye/releases/download/real-documents-2026-10-05/suniye-real-documents-walkthrough.mp4) · [Download Android 0.4.1](https://github.com/himanshu748/suniye/releases/download/real-documents-2026-10-05/suniye-parent-ux-0.4.1.apk).
