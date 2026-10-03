# Caregiver setup and family test

The target phones are Redmi A4. The exact model variant, Android version and HyperOS version have not been inspected. Check them in About phone before following version-specific instructions. Support starts at Android 11.

## Install and consent

Install the debug APK on a phone you own with the parent's agreement. Suniye asks for accessibility access to read visible WhatsApp content after a tap, and camera permission only for paper. Explain what the service can access and what optional online features transmit. Keep Android's security protections enabled. If Android blocks accessibility for a sideloaded app, open its official settings guidance and review why it is blocked; do not automatically bypass the warning.

Open Suniye → परिवार की सेटिंग. Select consent and save the local setup. Empty backend fields are allowed for local text/OCR reading. Open आवाज़ की सेटिंग, select Hindi and download an offline Hindi voice if the phone offers one. Use हिंदी आवाज़ जाँचें with mobile data/Wi-Fi off. The app refuses a missing, network-only or English fallback voice. Verify the parent's comfortable volume and pronunciation of amounts and dates.

Enable the Suniye accessibility service. Open an ordinary WhatsApp message and check that सुनिए appears. The same button becomes रोकिए during work. More controls are under और. The debug build also shows the overlay in its own app for synthetic tests; release source restricts it to WhatsApp/WhatsApp Business. Calls and unsupported foreground apps should hide the overlay. Secure content must remain unreadable.

For paper, tap कागज़ पढ़िए on the home screen or use the launcher shortcut. The caregiver should demonstrate a well-lit, close crop and help find a comfortable holding distance. Camera guidance and large buttons do not prove a parent can frame a label unaided.

For a saved image, tap फ़ोटो पढ़िए and select one item in Android’s picker. For a PDF, tap फ़ाइल पढ़िए and use the large page controls. Cancelling a picker leaves the reading unchanged. Android 11 may open the picker’s Recent view; finding a WhatsApp image there has not been tested with the parents. Neither route requests access to the entire photo library. WhatsApp → Share → Suniye also accepts text, images and PDFs.

## Connect Gemma

Run Ollama/Gemma and the backend on the laptop first. Put provider keys only in backend/.env. Generate a random FAMILY_TOKEN, and enter that family token in phone setup. It is distinct from ElevenLabs/MongoDB/Backboard credentials and is encrypted with Android Keystore. Remote phones require a valid token-protected HTTPS endpoint. Render needs an externally reachable Gemma endpoint; deploying the Node service alone will not expose local Ollama.

For a temporary USB developer test on a specifically selected phone:

```sh
adb devices
adb -s PHONE_SERIAL reverse tcp:8787 tcp:8787
```

Set the debug app endpoint to `http://127.0.0.1:8787`. Replace PHONE_SERIAL with the actual test device identifier; never run against an unselected personal device. USB debugging is a developer setup step, not the finished parent experience. The laptop must remain connected and the backend running. Release source accepts HTTPS destinations only.

Optional online voice is off by default. Enable it only after explaining that reading text reaches the configured backend and ElevenLabs. Atlas preference sync stores speed/size/placement, not messages or pictures. If sync is unavailable, local settings remain usable.

## Redmi checks

Review the app's battery/background settings and any available Background autostart control. Menu names vary with firmware; no exact A4 menu path is claimed verified. After enabling the service, lock/unlock the phone and reopen WhatsApp. Check that the button stays within the display at the parent's font size and doesn't cover the keyboard/send controls. Select left/right placement together. Follow official device instructions before changing settings.

The optional `npm run guide:caregiver` workflow searches public Google/Xiaomi support references through SerpApi and summarizes their snippets with Gemma. It accepts no family message as a query. A generated summary is a reference aid; confirm menu paths against the official links and the actual phone. Its source indices only identify supplied snippets; they do not prove factual accuracy. On October 3 the API responded, but no official article passed the filter, so the workflow refused to generate a fresh guide. The saved October 2 guide is dated historical evidence, not a current successful run.

## Record acceptance separately for each parent

Record model/Android/HyperOS, font scale, installed Hindi voice, camera orientation and the build hash. Ask each parent to open a synthetic message, start reading, stop it during a wait, repeat, slow down, and capture a harmless label. Note every prompt or hand movement supplied by Himanshu. Do not count a helped task as independent use.

Check ordinary WhatsApp text, an opened image, PDF page navigation, protected content, keyboard/notification overlays, leaving WhatsApp during capture, a call, revoked permissions and a slow network. Verify that Stop prevents late playback. Reopen the app offline and test the last successful reading.

Save actual feedback in family-test-notes.md only with agreement. No parent quotes or successful independence claims have been recorded yet. Important labels and numbers still need a family member's check; the OCR threshold cannot guarantee correct recognition.
