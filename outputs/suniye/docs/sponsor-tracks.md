# Sponsor roles and evidence

Checked October 2, 2026 against the [official challenge](https://dev.to/challenges/hacktoberfest-weekend-2026-10-01). This is a build plan and evidence ledger, not a claim that every category is ready. One entry can list multiple qualifying categories; each needs actual use.

## October 3 live status

[Current receipt](evidence/integration-recheck-2026-10-03.json): four fresh checks passed: Mastra, Gemma, ElevenLabs and Entire. SerpApi is connected, but a new guide could not be generated from the returned results. The four remaining integrations lack a configured live connection or deployment. The nine targets below describe product roles and dated evidence; they are not nine fully working or confirmed qualifying categories.

## Nine useful targets

| Category | Role in Suniye | Current evidence | Remaining gate |
| --- | --- | --- | --- |
| Gemma | Hindi explanations and descriptions of non-text pictures | Actual local Gemma 3 4B calls; explanation returned Hindi, vision failure cases recorded | Improve description reliability; family checks of explanation accuracy |
| Mastra | Extraction, output validation, explanation and optional speech in one cancellable workflow | Real Gemma calls passed through Mastra; backend tests exercise its workflow | Include a successful end-to-end demo and architecture in the post |
| ElevenLabs | Hindi demo narration; optional caregiver-enabled online speech | Actual 23-second Raju demo; limited TTS key saved privately; real Roger Hindi API MP3 through Mastra, 1,757 ms | Inspect Hindi pronunciation and phone playback; Raju library API requires payment on this account |
| Entire | Explain interface decisions from saved development sessions | 18 local imported checkpoints; `checkpoint explain` recovered the family-specific UX instruction | Include the curated provenance explanation; keep full history private |
| Render | Host the authenticated AI workflow backend | Blueprint prepared; account dashboard shows $50 existing balance | Deploy and verify `/health` and a real request; blueprint alone is insufficient |
| MongoDB Atlas | Sync voice speed, button placement and other family preferences | Free SuniyePilot cluster created in a separate project; strict preference-only routes and tests pass; restricted one-week user prepared, not created | Approval for the collection-scoped user and temporary current-IP access, then live preference read/write receipt |
| Sentry Agent Tracing | Investigate Gemma latency and failures without logging message content | Agent/model spans and token metrics implemented; privacy canary test passes | Live trace receipt, screenshot and a concrete debugging finding in the post |
| Backboard | Compare two open-weight models for faithful Hindi explanation before choosing one | Six-call synthetic comparison runner prepared, no memory/search/tools; own test resources cleaned up | Sign in, redeem the available $5 offer, select actual catalogue IDs and run comparison; review outputs manually |
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

## Credit ledger

Signed-in dashboards and partner offers were inspected during this session. The partner portal displayed $50 Render, $5 Backboard and $10 Tinker offers. Render issued a separate claim code; it has not been applied by this build. The Render account already has $50 remaining from an earlier promotion. Do not count these as $100 until redemption is confirmed. Backboard's offer was claimed in the partner portal but has not been redeemed in a Backboard account. Tinker's offer is available after GitHub linkage; no training or redemption is recorded. The portal did not show an ElevenLabs offer during inspection. ElevenLabs's existing free balance went from 10,000 to 9,704 credits after the narration. That balance predates the successful preset-voice API smoke. The new key is TTS-only, capped at 1,000 credits per refresh period and expires October 9; other endpoints have no access. It is saved only in the ignored backend .env. No paid upgrade was made. Raju returned payment_required via API; Roger returned actual Hindi audio. See [ElevenLabs API errors](https://elevenlabs.io/docs/eleven-api/resources/errors) and the recorded failure/success evidence.

Codes, keys, billing identifiers and account contact details are deliberately absent from public evidence files. An available offer is not a deployed integration.

SerpApi live receipt: two fixed queries were run twice while refining the source filter. The dashboard showed 2 / 250 searches used afterward; repeated cached queries did not raise the observed counter. The final dated guide contains two official Google help articles, not community answers or a claimed Redmi-specific procedure. Atlas SuniyePilot is active on the free tier; it has no database user or network allowlist entry yet.
