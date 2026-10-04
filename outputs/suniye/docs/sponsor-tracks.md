# Sponsor roles and evidence

Checked October 2, 2026 against the [official challenge](https://dev.to/challenges/hacktoberfest-weekend-2026-10-01). This is a build plan and evidence ledger, not a claim that every category is ready. One entry can list multiple qualifying categories; each needs actual use.

## Integration roles

The integrations have different jobs. Mastra, Gemma and ElevenLabs handle online reading; Render hosts the API. I use the other tools for development, setup and diagnosis.

| Integration | How I use it | Why it belongs here |
| --- | --- | --- |
| **Mastra** | A two-step reading workflow validates the source, prepares an original reading or explanation, and optionally requests speech. Each request has its own cancellation signal. | Stop must discard late model or voice replies. The workflow also keeps a retake separate from a reading. |
| **Gemma 3 4B** | Runs through Ollama on my laptop for simpler Hindi explanations and descriptions of pictures with no readable text. | Original reading covers small print; an optional explanation or description covers a different need. Added-context failures keep explanations experimental. |
| **ElevenLabs** | Raju, labelled Indian Hindi, produces Eleven v4 audio after amounts are converted into Hindi words. Android caches it for replay and slower playback. | My parents need to hear the text. I chose the voice after listening to two samples. |
| **Render** | Hosts the authenticated HTTPS API and keeps the ElevenLabs credential on the server. A real hosted bill request returned Hindi audio. | The phones need a reachable backend when I am in another city. This deployment supports original reading and speech; hosted Gemma is not connected yet. |
| **Sentry Agent Tracing** | Records the reading agent, model duration, token counts and Ollama timing attributes, while omitting reading text from outgoing traces. | A 32.64-second model call spent 24.96 seconds loading. That tells me where to investigate a long wait. |
| **Backboard** | Ran six synthetic Hindi calls, three each for Gemma 3 4B and Qwen 2.5 72B, with memory, search and tools disabled. | Literal checks missed two added-context errors. Comparing the replies supports keeping the original visible and explanations optional. |
| **Entire** | Imported 18 development checkpoints. A lookup recovered my instruction to design the controls specifically for my parents. | It connects the interface decisions to the original family request. Curated provenance is public; full private sessions stay private. |
| **SerpApi** | Searched public official Android help pages for the caregiver guide; Gemma summarized the approved results in Hindi. | Setup needs understandable references. When a later search returned no approved pages, the guide stopped instead of inventing instructions. |
| **MongoDB Atlas** | Preference-only routes are written for language, speed, text scale and control placement. The free cluster has a temporary user restricted to `suniye.preferences`. | Settings sync would let a caregiver restore a parent's setup. The database password and live read/write check are still pending, so I am not entering this category yet. |

Backboard, Entire, Sentry and SerpApi stay outside the daily parent screen. The six Backboard calls used synthetic text, and its temporary key was revoked afterward. SerpApi searches contain public setup questions, not family messages.

## October 4 live status

Eight categories now have dated application or development evidence. Render is deployed on the free Singapore service and passed authenticated original-text Hindi speech. Sentry received a real local Gemma request and displayed the agent/model relationship, token counts and timing attributes. [Render receipt](evidence/render-live-2026-10-04.json), [Sentry receipt](evidence/sentry-live-2026-10-04.json).

The hosted service does not yet have a reachable Gemma model or Atlas connection. It serves original reading and optional ElevenLabs narration. Atlas has a one-week user limited to `suniye.preferences` on SuniyePilot and current-computer IP access, but password recovery and live read/write are pending. Backboard completed six synthetic calls through its real API and its dashboard confirmed six events. Builder source review found two Gemma added-context errors despite passing literal checks. [Comparison](evidence/backboard-comparison.json). Atlas remains the ninth pending category. The temporary Backboard key was revoked and independently rejected with HTTP 401.

## October 3 live status

[Current receipt](evidence/integration-recheck-2026-10-03.json): four fresh checks passed: Mastra, Gemma, ElevenLabs and Entire. SerpApi is connected, but a new guide could not be generated from the returned results. The four remaining integrations lack a configured live connection or deployment. The nine targets below describe product roles and dated evidence; they are not nine fully working or confirmed qualifying categories.

The current private backend uses Raju, catalogue-labelled Indian Hindi, with Eleven v4. Himanshu preferred its sample B. After manually redeeming the partner Creator plan, real API generation and Android playback passed, including Slow, Stop and Repeat. Earlier Roger/own-voice tests and the initial Raju 402 remain dated evidence. See the [native v4 receipt](evidence/android15-raju-v4-native-2026-10-03.json). Real Redmi listening remains pending.

## Nine useful targets

| Category | Role in Suniye | Current evidence | Scope or remaining check |
| --- | --- | --- | --- |
| Gemma | Hindi explanations and descriptions of non-text pictures | Actual local Gemma 3 4B calls; explanation returned Hindi, vision failure cases recorded | Improve description reliability; family checks of explanation accuracy |
| Mastra | Extraction, output validation, explanation and optional speech in one cancellable workflow | Real Gemma calls passed through Mastra; backend tests exercise its workflow | Real Redmi network/cancellation behavior remains untested |
| ElevenLabs | Hindi narration; optional caregiver-enabled online speech | Real Raju v4 API audio played in Android; Hindi amount words, Slow/Stop/Repeat verified. User preferred Raju sample B | Real Redmi listening and parent comfort |
| Entire | Explain interface decisions from saved development sessions | 18 local imported checkpoints; `checkpoint explain` recovered the family-specific UX instruction | Curated provenance is included; full private history stays excluded |
| Render | Host the authenticated AI workflow backend | Free Singapore service live; `/health` HTTP 200, unauthenticated read HTTP 401, authenticated original read with real Raju audio HTTP 200 | Hosted Gemma explanation/vision and Atlas connection remain unconfigured; Free service can sleep |
| MongoDB Atlas | Sync voice speed, button placement and other family preferences | Free SuniyePilot cluster; strict preference-only routes; one-week collection-scoped user and current-IP access created | User must recover the database password privately, then live preference read/write; Render outbound IP access is not granted |
| Sentry Agent Tracing | Investigate Gemma latency and failures without logging message content | Real Gemma request ingested; Agent Activity shows Suniye → gemma3:4b, 143 input and 11 output tokens, 32.64-second model span; 24.96 seconds loading | Outgoing trace omits reading content; Sentry can add network metadata. Hosted traces and real-device latency remain separate |
| Backboard | Compare two open-weight models for faithful Hindi explanation before choosing one | Six real Gemma 3 4B/Qwen 2.5 72B calls reviewed; dashboard confirms 681 input and 254 output tokens; no memory/search/tools/reasoning | Three cases do not establish a general ranking; current production model stays local Gemma. Temporary key revoked; API rejects it with HTTP 401 |
| SerpApi | Help Himanshu find current official Android/Redmi setup references, summarized by Gemma | Actual SerpApi searches and Mastra/Gemma Hindi summary saved; two official Android help articles retained; community posts and unrelated results excluded | Verify exact menus on the Redmi phones; no matching Xiaomi reference was returned |

The parent interface contains reading controls. Model comparisons, setup reference research and trace dashboards stay with the caregiver/developer. No family message is used as a web search query. Source integration is useful work, but an installed SDK or mocked test does not prove live partner use.

## Conditional categories

| Category | Potential useful role | Decision and evidence required |
| --- | --- | --- |
| DigitalOcean | Serve Gemma separately from Render's workflow backend, or host the caregiver tooling | Connector works and there are no existing Droplets to reuse. No infrastructure provisioned. Need a concrete instance plan, spending limit, actual deployment and request proof. Account balance is not a verified credit grant. |
| Tinker | Fine-tune source-faithful Hindi simplification to reduce added context | $10 partner offer visible. Need an appropriate supported base model, curated authorized examples, a held-out baseline, actual training and measured improvement. A general inference call would not establish this track. |
| Temporal | Recover a caregiver batch of document pages after a worker restart | Current parent reads should cancel immediately when Stop is pressed. Add only for a real, separate batch use case and demonstrate recovery without resuming cancelled speech. |
| Tiger Data | Retrieve approved caregiver setup material through vector/hybrid search | No retrieval corpus or implementation yet. Cost telemetry in a time-series table alone would not satisfy the listed category. Requires useful retrieval and a real database query. |
| TabPFN | Predict a useful reading-quality outcome from historical device/reading data | No real historical table yet. Synthetic rows added solely to run a model would not demonstrate useful prediction. Reconsider after authorized usage data exists. |
| Arduino | A physical reader using an UNO Q | No UNO Q available or hardware test. Do not claim. |
| GitHub Copilot | — | Excluded by Himanshu's preference. |

These are product-fit judgments, not promises of qualification or prizes. Revisit a conditional track when its required hardware, data or deployment becomes available.

## Earlier credit checks, superseded by the update below

Signed-in dashboards and partner offers were inspected during this session. The partner portal displayed $50 Render, $5 Backboard and $10 Tinker offers. Render issued a separate claim code; it has not been applied by this build. The Render account already has $50 remaining from an earlier promotion. Do not count these as $100 until redemption is confirmed. Backboard's offer was claimed in the partner portal but has not been redeemed in a Backboard account. Tinker's offer is available after GitHub linkage; no training or redemption is recorded. The portal did not show an ElevenLabs offer during inspection. ElevenLabs's existing free balance went from 10,000 to 9,704 credits after the narration. That balance predates the successful preset-voice API smoke. The new key is TTS-only, capped at 1,000 credits per refresh period and expires October 9; other endpoints have no access. It is saved only in the ignored backend .env. No paid upgrade was made. Raju returned payment_required via API; Roger returned actual Hindi audio. See [ElevenLabs API errors](https://elevenlabs.io/docs/eleven-api/resources/errors) and the recorded failure/success evidence.

Codes, keys, billing identifiers and account contact details are deliberately absent from public evidence files. An available offer is not a deployed integration.

SerpApi live receipt: two fixed queries were run twice while refining the source filter. The dashboard showed 2 / 250 searches used afterward; repeated cached queries did not raise the observed counter. The final dated guide contains two official Google help articles, not community answers or a claimed Redmi-specific procedure. At that earlier check, Atlas SuniyePilot had no database user or network allowlist entry; October 4 setup is recorded above.

Before partner-plan redemption, October 3 listening choice: Himanshu preferred Raju (sample B). It is saved in My Voices and selected for browser narration. The [fresh Raju API receipt](evidence/elevenlabs-raju-recheck-2026-10-03.json) records HTTP 402 payment_required, so it is not described as working online app speech. The account displays a $1 first-month Starter offer; no paid subscription was activated.


Current credit update, October 3: the user manually redeemed the Hacktoberfest Creator offer. The official offer stated three months; the actual redemption dialog stated one month. Account readback showed Creator, cancelled with access ending November 3, auto top-up off, and a paid $0 invoice. Only that current access is confirmed. No paid upgrade was made by this build. The restricted key remains TTS-only, capped at 1,000 credits and expires October 9. Raju v4 API calls succeeded using included credits. The free v4 promotion applies to web/mobile apps only, not API calls. [Plan receipt](evidence/elevenlabs-partner-plan-2026-10-03.json).

October 4 Backboard credit update: the already-claimed partner code added $5 to the balance without a card or subscription. The dashboard displayed $0.0002 total spend after six calls. This used promotional credits; no new purchase was made.

Render credit-only upgrade check, October 4: the dashboard confirms $50 of hackathon credit. The proposed 0.5c-512mb compute plan costs $7/month. Render rejected the approved credit-only upgrade because it requires payment information on file. No card was added and no cash purchase was made. The service remains Free. [Receipt](evidence/render-credit-only-2026-10-04.json).
