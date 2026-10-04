# Suniye release preparation ledger

State: reviewed local source, not pushed or deployed by this task. Parents have not tried the app; motivation is helping them read independently, not observed improvement or a testimonial.

| Artifact | Exact scope/status |
| --- | --- |
| Public implementation | codex/challenge-entry at b2dc5e0bea7d9167d1396ab23df3893339712ccc merged into the existing improve/suniye-landing-20261004 branch; all latest Android files preserved. |
| Current public APK | 0.3.0-parent-ux at parent-ux-2026-10-04/suniye-parent-ux.apk, 53,618,122 bytes; metadata digest39d5484833272ead0147788823ee7c0e8790ed1454555b48f721e807c1d2cdfd, distinct from earlier local builds. |
| Current APK check limits | Published internal layout/bundled-Raju assertions at160% passed; System UI overlay/crashes blocked clean touch walkthrough. Real Redmi, parents/WhatsApp/listening/ASR remain unobserved. |
| Video | Old0.1 film explicitly historical. New current source-image/PDF->actualOCR->Hindi sound->bothPDFpages->Stop/Repeat video is not captured; see current-video-plan.md for English narration and actualHindi audio requirements. |
| Screenshots | Existing android-home.png/android-reading.png are historical Android15/font1.6 emulator captures. Exact originating APK version/date is not established here; both visible captions now say historical pilot. They do not show verified0.3 runtime. |
| Landing | Existing reviewed cream/teal Hindi page, local recorded7.76s Raju sample, public0.3 CTA, historical0.2/0.1 ledger. Previous broad16/1 preserved; separate active/natural3/0 and actual trusted-pointer5/0 passed. |
| Existing hosting | https://suniye-reader.onrender.com, existing Free Render service suniye-reader, rootDir outputs/suniye/backend, build npm ci, start npm start, health /health. Existing Free service can sleep; no plan or environment change. |
| Source integration | Nine byte-identical shipped files inside backend/public, exact GET/automaticHEAD allowlist, /welcome redirects to /. CSP/no-sniff/referrer/cache headers; no wildcard/filesystem request path. /v1 auth/no-store/rate limits and /health preserved. |
| Retained authorized safeguards | Existing a569d74 per-run cancellation and private-response no-store changes remain. No unrelated Backboard experiment was merged. |
| Mozhi/TabPFN | Separate licensed100-crop experiment; harness builds but runtime disk-blocked, zero observations. No trained TabPFN/OCR gain or app-integration claim. Not part of this release. |

## Local verification

Focused static inject checks4/4 passed; full backend97/97 passed using already-installed dependencies, no install/provider call. Tests assert root/currentAPK/CSP/HEAD, every byte/MIME, unknown/traversal404, redirect, health, authenticated original reading, unauthorized401/no-store, and zero provider calls for public requests. After the final tiny historical-caption update, only the four focused checks are repeated. Logs and exact final counts/commit are recorded in the workspace release receipt.

The initial focused run3/1 used a throwing model fixture for a valid read; the fixture was corrected to a pure synthetic extraction, not production behavior. Original log is preserved. No heavy build, Android execution or new video export.

## Concrete publication handoff

Review the final commit and cumulative patch against b2dc5e0. Cumulative additions include previously authorized a569d74 safeguards and evidence plus landing/static/README files. Android files must diff identical to b2dc5e0. Parent reviews/updates the public DEV article separately; the article publication is not performed here.

The exact intended source operation is a fast-forward push of this reviewed branch to existing codex/challenge-entry, guarded by verifying its remote HEAD is still b2dc5e0 and that b2dc5e0 is an ancestor of the final commit. Proposed command, not executed:

git push origin HEAD:refs/heads/codex/challenge-entry

Do not force-push. If the remote advanced, fetch/reconcile/review before a new exact push. Existing Render may automatically deploy from the source update; source push and deployment are therefore coupled and require the parent-reviewed mutation approval. No push occurred in this task.

Parent must confirm the existing Render service's connected repository branch and autodeploy setting through its authorized dashboard/tool; supplied receipts do not establish that setting. Existing blueprint uses the backend directory and requires no new static-host project or dependency. If connected to another branch or autodeploy disabled, hand this exact reviewed commit to the existing service owner; do not create a replacement service or change plan/env. After authorized deployment, check public root/assets/media, health and unauthenticated API boundary without provider requests, record deployed SHA, and align the published article/README links. Until then the public origin is an intended existing destination, not a newly verified landing URL.
