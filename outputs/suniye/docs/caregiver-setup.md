# Caregiver setup

The target phones are Redmi A4. The exact model variant, Android version and HyperOS version have not been inspected. Check them in About phone before following version-specific instructions. Support starts at Android 11.

## Install and consent

Install the debug APK on a phone you own with the parent's agreement. Suniye asks for accessibility access to read visible WhatsApp content after a tap, and camera permission only for paper. Explain what the service can access and what optional online features transmit. Keep Android's security protections enabled. If Android blocks accessibility for a sideloaded app, open its official settings guidance and review why it is blocked; do not automatically bypass the warning.

Open Suniye → परिवार की सेटिंग. Explain that text for new narration goes to the backend and ElevenLabs, select consent, and save the HTTPS endpoint and family token. Use हिंदी आवाज़ जाँचें with internet available. Suniye uses only ElevenLabs Raju; it never switches to a phone or browser voice. Fixed help prompts are bundled Raju recordings. After a successful reading, turn internet off and test Repeat and Slow with the saved clip. Verify comfortable volume and pronunciation of amounts and dates.

For the optional floating screen reader, enable the Suniye accessibility service. Sharing a text, image or PDF into the main app does not require this service. Open an ordinary WhatsApp message and check that सुनिए appears. The same button becomes रोकिए during work. More controls are under और. The debug build also shows the overlay in its own app for synthetic tests; release source restricts it to WhatsApp/WhatsApp Business. Calls and unsupported foreground apps should hide the overlay. Secure content must remain unreadable.

For paper, tap कागज़ पढ़िए on the home screen or use the launcher shortcut. The caregiver should demonstrate a well-lit, close crop and help find a comfortable holding distance. Camera guidance and large buttons do not prove a parent can frame a label unaided.

For a saved image, tap फ़ोटो पढ़िए and select one item in Android’s picker. For a PDF, tap फ़ाइल पढ़िए and use the large page controls. Cancelling a picker leaves the reading unchanged. Android 11 may open the picker’s Recent view; use its folder navigation if the desired file is elsewhere. Neither route requests access to the entire photo library. WhatsApp → Share → Suniye also accepts text, images and PDFs.

## Optional spoken controls

In परिवार की सेटिंग, enable बोलकर चलाना चालू करें only after explaining the microphone and speech service. It is off by default. Tap बोलिए on the home or camera screen and allow microphone access when asked. After the beep, say one command: पढ़िए, फिर सुनिए, धीरे सुनिए or रोकिए. In the camera, frame the paper first, then say फोटो लो. Spoken error prompts ask for another attempt; the large buttons remain available.

Android 12+ prefers an on-device recognizer. If that recognizer lacks Hindi, Suniye tries the phone's standard service once. The standard service may transmit audio even when offline recognition is requested. Sessions are short, foreground and started by a tap. Suniye stores neither commands nor microphone audio. This feature does not continuously listen for a wake word or Stop during playback.

Test those four commands on each Redmi, then check denied microphone permission, missing Hindi models, offline behavior and comfortable volume. Emulator callback tests verify action routing and cleanup, not microphone accuracy. If a phone cannot recognize the parent's speech reliably, use the large controls while recording that limitation.

## Connect the hosted pilot

Use `https://suniye-reader.onrender.com` and the privately supplied family connection code in caregiver setup. Provider keys do not go into the phone. The token is stored using Android Keystore protection. Original reading and reviewed dictionary help use the hosted ElevenLabs route; no laptop model is needed. The current APK is 0.4.1-real-documents.

New speech requires caregiver consent that text reaches Render and ElevenLabs. Older installs must save updated setup before fresh narration. Raju is the only allowed voice; Himanshu preferred it as sample B. API narration consumes existing account credits; the web/mobile promotion is not an unlimited backend allowance. Listen on each actual phone before handover.

The Free Render service can sleep, so the first request may be delayed or require another attempt. Previously cached Raju audio can replay offline; new reading needs a connection. Atlas stores speech/control preferences and persistent usage counters, not messages or pictures. Hosted settings persistence passed, but the Android sync UI needs its own check. Local settings remain usable if sync is unavailable. Text size uses Android system settings.

The separate `/caregiver` page offers approved public setup references and optional Gemma summaries of those fixed snippets. It never sends a parent reading to Gemma/Backboard/OpenRouter. Word help in the app is a reviewed dictionary, not an AI rewrite. No-text picture description is unavailable. See [privacy](privacy.md).

## Redmi checks

Review the app's battery/background settings and any available Background autostart control. Menu names vary with firmware; no exact A4 menu path is claimed verified. After enabling the service, lock/unlock the phone and reopen WhatsApp. Check that the button stays within the display at the parent's font size and doesn't cover the keyboard/send controls. Select left/right placement together. Follow official device instructions before changing settings.

The optional `npm run guide:caregiver` workflow searches public Google/Xiaomi support references through SerpApi and summarizes their snippets with Gemma. It accepts no family message as a query. A generated summary is a reference aid; confirm menu paths against the official links and the actual phone. Its source indices only identify supplied snippets; they do not prove factual accuracy. On October 3 the API responded, but no official article passed the filter, so the workflow refused to generate a fresh guide. The saved October 2 guide is dated historical evidence, not a current successful run.

## Record acceptance separately for each parent

Record model/Android/HyperOS, font scale, ElevenLabs connection and media volume, camera orientation and the build hash. Ask each parent to open a synthetic message, start reading, stop it during a wait, repeat, slow down, and capture a harmless label. Note every prompt or hand movement supplied by Himanshu. Do not count a helped task as independent use.

Check ordinary WhatsApp text, an opened image, PDF page navigation, protected content, keyboard/notification overlays, leaving WhatsApp during capture, a call, revoked permissions and a slow network. Verify that Stop prevents late playback. Reopen the app offline and test the last successful reading.

Save actual feedback in family-test-notes.md only with agreement. Important labels and numbers still need a family member's check; the OCR threshold cannot guarantee correct recognition.
