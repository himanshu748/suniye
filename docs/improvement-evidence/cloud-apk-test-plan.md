# Focused Suniye cloud-device test plan

Status: planned, not executed by this implementation agent. The parent cloud worker owns any separately approved Appetize Free upload/session; root prepares the artifact only. No provider calls, cloud uploads, account creation or device testing were performed for these backend changes.

## Pin the build before testing

Candidate A is the locally inspected `releases/suniye-elevenlabs-only.apk` at `/Users/himanshujha/n/suniye/outputs/suniye/releases/suniye-elevenlabs-only.apk`: SHA-256 `6fc6b78d22c2a2db47264776888d1b1e9185bdd38c26ab4a19788f148ce41afb`, 53,487,633 bytes, `in.suniye.app.debug`, versionCode 2, `0.2.0-elevenlabs`, Android 11+ / minSDK 30, targetSDK 35, debuggable. Installed `aapt dump badging` verified these fields; see `apk-metadata.json`.

Candidate B is the newer local `/Users/himanshujha/n/suniye/outputs/suniye/android/app/build/outputs/apk/debug/app-debug.apk`: 53,352,794 bytes, `in.suniye.app.debug`, versionCode 3 / `0.3.0-parent-ux`, minSDK 30, targetSDK 35, debuggable. Installed aapt verified its manifest too. That local APK hashes to `2251d9082e15d8019cca00a5626f1064d337a9fd9b611368be1753e276a26644`. It is a separate artifact. Do not use its screenshots or source behavior as proof of the chosen pinned APK. GitHub assets were not reverified in this task, so both files are described as locally available; no latest-public-release claim is made. Prefer candidate B for the current parent UX if the parent cloud worker selects it and approves its provenance. Pin one exact APK/hash in the execution receipt before uploading. Candidate B corresponds by version/build timestamp to the original dirty parent-UX source, not to the isolated public baseline; there was no reproducible rebuild in this task. baseline.json records the source differences, and the public clone keeps them separate from the two backend changes.

## Connection and privacy

The APK includes no family token/provider keys. First run can test layout, bundled help and recoveries without credentials. New reading narration requires caregiver consent and an authenticated HTTPS backend with ElevenLabs Raju. Original reading is supported by the documented Render service; it can sleep. Hosted Gemma remains unconfigured, so a cloud-device explanation failure cannot be presented as a model success. This task forbids additional real-provider calls: use synthetic fixtures and a separately authorized test backend if voice/response checks are needed. Without it, mark fresh speech and live explanation NOT RUN.

Do not enter family messages, account passwords or production tokens in a provider session, recording or shared URL. Use synthetic bills/images/PDFs only. Declining microphone/accessibility consent must leave deliberate-input recovery available. Do not bypass protected screens, restricted settings or Play Protect. Root must verify free quota, upload destination and retention settings before any upload. A cloud stream/emulator is not a physical-device test; require provider/device attestation before calling it physical hardware.

## One batched device pass

Use an Android 11+ phone viewport. Record service name, emulator/physical classification, device/OS, tested APK hash and session date. Capture native screenshots, not browser recreations. Repeat at font scales 1.0 and 1.6, light/system-night appearance, and gesture/button navigation if supported. Restore test settings afterward when the provider allows it. Keep test sessions bounded to the verified free quota.

| Priority | Case | Exact acceptance | Evidence/result |
| --- | --- | --- | --- |
| P0 | Fresh install, consent declined, empty home | Purpose and input routes understandable; fixed रोकिए visible; no automatic reading; caregiver setup reachable | Screenshot + action notes; NOT RUN |
| P0 | Stop during OCR/network/model wait | Stop remains tappable; waiting clears; late reply cannot change transcript or restart playback; intentionally repeating starts a fresh operation | Timestamped native states/fixture transport receipt; NOT RUN |
| P0 | Repeat / slower after a completed synthetic reading | Cached Raju clip repeats with network unavailable; Stop releases audio; slower remains understandable | Playback states + listening observation if available; NOT RUN |
| P0 | Source fidelity | Synthetic ₹1,250 and date remain visible exactly; narration amount words are checked separately from original; explanation clearly distinguished | Screenshot + exact source + audio observation; NOT RUN |
| P0 | Accessibility / denied permissions | Accessibility protected screen fails closed; camera/microphone denial gives Hindi recovery; no requests before deliberate action/consent | Permission and recovery screenshots; NOT RUN |
| P1 | Large fonts / long text / setup keyboard | No truncated actionable labels; Stop fits above system navigation; source scrolls independently; IME does not conceal save/recovery | Native screenshots at 1.6; NOT RUN |
| P1 | TalkBack | Read focus order and label/state announcements for listen/Stop/Repeat/slow/setup; navigation returns focus predictably; every action reachable | Actual TalkBack traversal notes; NOT RUN |
| P1 | Touch targets and insets | Measured actions at least 48×48 dp with 8 dp spacing; status/navigation/cutout/IME insets honored | Measured native bounds, density, screenshot; NOT RUN |
| P1 | Photo/PDF selection, cancellation, Recents | Cancel preserves prior reading; malformed/empty shares recover; Recents does not re-read; next/previous page index matches source | Actual chooser/share tests or explicitly synthetic URI tests; NOT RUN |
| P1 | Back / lifecycle / interruption | System Back works; backgrounding stops active speech; rotation/configuration behavior documented; incoming audio-focus loss stops playback | Device action log; NOT RUN |
| P2 | Appearance / motion / responsiveness | Hindi readable in both appearances; Remove animations does not hide controls; launch/scroll remains responsive; portrait lock and multi-window limitations disclosed | Native screenshots and observations; NOT RUN |

The existing source uses native Android Views, sp text sizes, an 88 dp minimum button height, Hindi content descriptions and a separate fixed controls footer with system-bar insets. These are source observations, not a complete accessibility or contrast audit. No accessibility score is assigned. Test requirements draw on the available Impeccable `reference/audit.native.md` and `reference/android.md`; its launcher is cloud-only here and context loading did not run. Existing README, caregiver setup, native code and dated screenshots supplied project context.

Real WhatsApp sharing requires an actual authorized WhatsApp setup, which this plan does not infer from Suniye’s help screen or a synthetic Share intent. Redmi A4 performance, Hindi ASR, listening comfort and both parents completing a real reading task remain NOT RUN even after a cloud test succeeds.
