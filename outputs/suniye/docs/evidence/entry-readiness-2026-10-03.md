# Challenge entry readiness, October 3

This report compares current artifacts with the [official challenge](https://dev.to/challenges/hacktoberfest-weekend-2026-10-01) and [contest rules](https://dev.to/page/hacktoberfest-weekend-challenge-26-10-01-contest-rules). The deadline is October 5, 2026 at 06:59 UTC, or 12:29 PM IST. Writing quality carries the greatest judging weight. A handover and feedback from the person are bonus evidence, not a required submission step. English writing, a public post with the three required tags, a demo/video, public source and an open-innovation explanation are required.

## What I completed without the family phones

- Reviewed the actual Android input, camera, PDF, overlay and cancellation code and existing emulator receipts.
- Built a new debug-only recording harness and recorded real Android controls with a synthetic bill. It uses the real Mastra backend, local Gemma and ElevenLabs API, not provider doubles. The debug harness and synthetic fixtures are excluded from release source sets.
- Confirmed the app played the returned online MP3, replayed it more slowly, stopped, requested an explanation and replayed the saved original after a refusal.
- Recorded Gemma's changed date formatting and the conservative guard's rejection. The original remained unchanged. This refusal does not prove an incorrect calendar date, nor does the guard prove semantic faithfulness generally.
- Generated English demo narration using the already approved, limited ElevenLabs key. The English narration and Hindi API audio are mixed separately into the video; native screenrecord captures no device audio.
- Reworked the submission into the official template, preserving the known family context and separating observed results from intended WhatsApp behavior.
- Prepared a source publication tree, excluded credentials, model weights, private transcripts and build caches, and retained dated evidence. Public publication remains a distinct final action.

See [native demo receipt](entry-demo-receipt-2026-10-03.json), [actual provider outputs](entry-demo-providers-2026-10-03.json), [narration receipt](entry-narration-receipt.json), [Android/UX audit](ui-integration-audit-2026-10-03.json) and [live integration recheck](integration-recheck-2026-10-03.json). Earlier APK hashes in the UX audit identify the earlier pilot; the current release manifest identifies the new debug harness build. Main app source was unchanged for this recording.

## Sponsor count and claims

| Category | Evidence available | Claim limit |
| --- | --- | --- |
| Gemma | Real local model calls, dated successful explanation, failure/description cases, recorded explanation refusal | Accuracy across inputs remains unresolved |
| Mastra | Real Android-to-backend workflow, 44 backend tests and cancellation receipts | Injected provider tests are not live service evidence |
| ElevenLabs | Real Hindi API audio played by Android; English and Hindi demo narration | Separately captured provider audio; no family listening test |
| Entire | Actual imported checkpoint lookups explaining family-specific UX decisions | Private full transcripts are excluded |
| SerpApi | October 2 successful official-help retrieval and Gemma summary | October 3 returns no approved articles; current guide fails before synthesis |

Four have fresh successful checks. SerpApi has meaningful dated development use, with the current failure disclosed. The article can request five partner categories; judges determine qualification. Do not call this nine working integrations.

| Prepared integration | Current blocker |
| --- | --- |
| MongoDB Atlas | No application URI/read-write evidence; sign-in/access grants pending |
| Sentry | No DSN or received live trace; sign-in grant pending |
| Backboard | Comparison runner prepared; no successful model comparison or R-CLI build use. Official CLI binary/help inspected, which does not qualify |
| Render | Blueprint and account available, but no Suniye deployment/public Gemma endpoint |

I did not authorize new OAuth grants, create broader credentials, upgrade a paid plan or claim a deployed service. Those steps need their specific access/account decisions. The optional integrations are not required to submit this entry.

## What cannot be established remotely

A desktop emulator cannot establish Redmi A4 firmware behavior, real WhatsApp accessibility/media behavior, camera focus on the parents' labels, installed offline Hindi voice, Hindi number pronunciation, Maithili quality or whether either parent can finish tasks without help. No family quote, handover, usage statistic or win guarantee is included. There is no hosted backend for the parents in another city yet. The demo's backend ran on localhost, and the phone used the emulator host bridge.

## Final publication gate

The local article, video and source can be reviewed now. Before entry completion, publish the source and demo, replace the two public-link placeholders, convert supporting relative links to public repository links, inspect their anonymous rendering, and publish the DEV article with `devchallenge`, `weekendchallenge`, `hf26challenge`. Do not report submitted until the actual public article is read back. Family feedback can be added if it becomes available; it is not a blocker for the required entry.

## Publication scan and review disposition

The installed secret scanner covered full staged file contents in the prepared publication repository. It reported two credential-shaped assignments in unit tests and omitted 22 binary files. Both findings were inspected: they are intentional values supplied to injected test providers/local Fastify test servers, not production credentials. The installed scanner's result is not a complete clean verdict.

A complementary byte-pattern pass covered all 111 snapshot files and 483 decoded APK members, including the omitted binaries. It found those same two reviewed test fixtures and no additional known-pattern findings. The separate exact-configured-credential/private-key scan covered source, the decoded APK and source ZIP. None of these checks proves absence of unknown credential formats or constitutes a security audit. [Scan scope and findings](entry-publication-scan.json) include no credential values. The stale audit prompt bundle, account screenshots, private environment, build caches, model weights and full private sessions are excluded from publication.

Claude Code reviewed the entry's named source/documents and found publication placeholders and precision issues. Its useful findings were applied. Its cached-PDF concern was stale: current `forget()` clears the application-owned document, and this behavior has a recorded emulator check. MainActivity, ReaderController, Config, PreferencesClient and SetupActivity hashes match the earlier Android 11/15 audit. The debug harness is the only Android source added for the recording. Review comments do not replace runtime tests.
