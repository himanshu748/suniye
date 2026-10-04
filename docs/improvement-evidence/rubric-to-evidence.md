# Rubric and product evidence checklist — October 4

The [official challenge](https://dev.to/challenges/hacktoberfest-weekend-2026-10-01) makes writing the highest-weight criterion and asks for a real loved one's problem, open AI pieces central to the project, a demo and an explanation of open innovation. Handover feedback is bonus evidence. Deadline: October 5, 06:59 UTC / 12:29 IST. This is an evidence checklist, not a prize prediction or a numeric accessibility score.

| Requirement / outcome | Status | Evidence and exact limit |
| --- | --- | --- |
| Real friend / loved-one theme | PASS: stated rationale | README and family-test-notes identify mother/father with weak eyesight; controls/readings address their actual stated need. No feedback is invented. |
| Writing quality / truthful revision | NOT RUN by this agent | Root owns revised article. Preserve specific task, before/after, source/audio distinctions, real failures, model limitations and handover status. Judging quality cannot be certified by tests. |
| Open AI / framework at core | PASS: source and historical runtime | MIT app code; Mastra workflow governs the reading path; Gemma3:4b is open-weight local Ollama for optional explanations/non-text descriptions. ML Kit OCR and ElevenLabs are proprietary and must be disclosed; the whole pipeline is not an offline/open-source model claim. |
| Actual model runtime | PASS: historical single-case evidence | editorial-gemma-2026-10-04.json: actual local Gemma/Fastify/Mastra instruction explanation, HTTP200, 2660ms; sentry-live receipt separately records 143 input/11 output tokens and a slow32782ms request plus failures. No new model call in this task. |
| Working demo | PASS: historical bounded recording | README public simple/media/judge links; synthetic bill, Hindi amount, image/PDF pages, Repeat/Stop. Audio mixed from provider MP3; WhatsApp is setup/help, not actual sender behavior. No new demo export here. |
| Stop reliability backend improvement | PASS: offline regressions | 93/93 full suite; final4/4 confirm no provider begins after pre-abort/asynccreateRun/traced-stage cancellation. Existing late-result/cancellation tests also pass. Real-phone network behavior NOT RUN. |
| Reading/settings response privacy | PASS: offline HTTP fixtures | Cache-Control no-store verified on encoded/canonical reading, preferenceGET/PUT, 400/401/500/503; provider-private error text excluded. This instructs caches; it is not a proof of third-party provider data retention. |
| Accessibility / large text | PASS: prior scoped emulator checks; NOT RUN here | Dated Android11/15 screenshots and voice/Stop receipts record selected large-font controls. Source uses sp text, 88dp button minheight and fixed footer. No general TalkBack, contrast, actual48dp-bounds or physical usability certification. |
| Cloud device | NOT RUN | cloud-apk-test-plan.md pins0.2 and0.3 candidates and requires provider/device classification. Parent cloud worker owns any separately approved upload/session. Cloud emulation cannot be described as physical hardware. |
| Actual Redmi / WhatsApp / Hindi ASR | NOT RUN | Existing receipts explicitly do not establish these; WhatsApp help/syntheticShare is distinct. |
| Real parents / handover / listening comfort | NOT RUN | Family-test-notes explicitly pending; no borrowed emulator or cloud result fills this gap. |
| Sponsor execution | PASS: dated scoped roles | Eleven distinct evidence targets: Mastra/Gemma/ElevenLabs/Render/Sentry/Backboard/Entire/SerpApi/Atlas, plus local caregiver Temporal and pgvector. They have different roles/scopes; eligibility is judges' decision. |
| Hosted original reading / voice | PASS: historical authenticated receipt | render-live-2026-10-04.json: health200, unauthorized401, original reading with real Raju audio. Free service can sleep. No new hosted check. |
| Hosted Gemma / Render-to-Atlas | NOT RUN / unconfigured | Local model and local Atlas evidence do not prove hosted model or hosted preference connectivity. |
| Model semantic reliability | FAIL on known examples; limited successes | model-evaluation.md records square→rectangle/omittedposition failures; Backboard comparison notes addedcontext despite literalchecks. Keep original visible and explanations optional; no accuracy rate. |

## Evidence paths and public links

- Public repository: https://github.com/himanshu748/suniye
- DEV entry: https://dev.to/himanshu_748/suniye-let-my-parents-hear-the-message-themselves-41bh
- Existing judge demo: https://github.com/himanshu748/suniye/releases/download/v0.1.0-pilot/suniye-demo-judge.mp4
- Public baseline461aa99: outputs/suniye/docs/sponsor-tracks.md; docs/model-evaluation.md; docs/verification.md; docs/evidence/editorial-gemma-2026-10-04.json; docs/evidence/sentry-live-2026-10-04.json; docs/evidence/android15-voice-home-font16.png; docs/evidence/android11-sticky-stop-font16.png.
- Private original0.3 source/screenshot drift is recorded in baseline.json. Existing source is not assumed byte-identical to0.2 APK. Metadata for both local APK candidates is in apk-metadata.json.

The planning-only Impeccable guidance was read from skill://plugins_6a5028ae047081918e3dfde753112690/impeccable/SKILL.md and reference/audit.native.md / android.md. No UI edits or scores were produced. Its unavailable cloud-only launcher did not load context; existing source and project docs supplied it directly.
