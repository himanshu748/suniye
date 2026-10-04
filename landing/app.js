"use strict";

const audio = document.getElementById("sample-audio");
const player = document.getElementById("custom-player");
const play = document.getElementById("play-sample");
const playLabel = document.getElementById("play-label");
const stop = document.getElementById("stop-sample");
const slow = document.getElementById("slow-sample");
const status = document.getElementById("audio-status");
const panel = document.querySelector(".voice-panel");
let operation = 0;
let hasStarted = false;
let loading = false;
let loadTimer;

function clearPlayback(message) {
  operation += 1;
  clearTimeout(loadTimer);
  audio.pause();
  if (Number.isFinite(audio.duration)) audio.currentTime = 0;
  loading = false;
  play.disabled = false;
  play.removeAttribute("aria-busy");
  stop.disabled = true;
  playLabel.textContent = hasStarted ? "फिर सुनिए" : "नमूना सुनिए";
  panel.classList.remove("is-playing");
  status.textContent = message;
}

async function playSample() {
  if (loading) return;
  const current = ++operation;
  loading = true;
  play.disabled = true;
  play.setAttribute("aria-busy", "true");
  stop.disabled = false;
  playLabel.textContent = "आवाज़ तैयार हो रही है…";
  status.textContent = "रिकॉर्डिंग खुल रही है। रोकिए से अभी भी रोक सकते हैं।";
  loadTimer = setTimeout(() => {
    if (current === operation && loading) clearPlayback("रिकॉर्डिंग खुलने में देर हो रही है। फिर कोशिश करें या रिकॉर्डिंग डाउनलोड करके सुनिए।");
  }, 8000);
  try {
    if (audio.error) audio.load();
    audio.currentTime = 0;
    await audio.play();
    if (current !== operation) return;
    hasStarted = true;
    clearTimeout(loadTimer);
    loading = false;
    play.removeAttribute("aria-busy");
    playLabel.textContent = "सुन रहे हैं…";
    panel.classList.add("is-playing");
    status.textContent = audio.playbackRate < 1 ? "धीमी गति से सुन रहे हैं।" : "सुन रहे हैं। जब चाहें रोकिए।";
  } catch {
    if (current !== operation) return;
    clearPlayback("आवाज़ नहीं चली। फ़ोन की आवाज़ जाँचें, फिर सुनिए दबाएँ या रिकॉर्डिंग डाउनलोड करें।");
  }
}

play.addEventListener("click", () => void playSample());
stop.addEventListener("click", () => clearPlayback("रोक दिया। फिर सुनने के लिए फिर सुनिए दबाएँ।"));
slow.addEventListener("click", () => {
  const enabled = slow.getAttribute("aria-pressed") !== "true";
  audio.playbackRate = enabled ? 0.85 : 1;
  slow.setAttribute("aria-pressed", String(enabled));
  slow.textContent = enabled ? "सामान्य गति से सुनिए" : "धीरे सुनिए";
  status.textContent = enabled ? "धीमी गति चुनी गई है।" : "सामान्य गति चुनी गई है।";
});
audio.addEventListener("ended", () => clearPlayback("पूरा सुन लिया। फिर सुनने के लिए फिर सुनिए दबाएँ।"));
// A failed child <source> may leave play() pending without an audio-level error.
audio.addEventListener("error", () => clearPlayback("रिकॉर्डिंग नहीं खुली। फ़ाइल डाउनलोड करके सुनें, या बाद में फिर कोशिश करें।"), true);
window.addEventListener("pagehide", () => clearPlayback("रिकॉर्डिंग रोक दी गई है।"));
document.addEventListener("visibilitychange", () => {
  if (document.hidden && (!audio.paused || loading)) clearPlayback("रिकॉर्डिंग रोक दी गई है। फिर सुनिए दबाएँ।");
});

// Keep the native audio control if script does not load or JavaScript is disabled.
audio.controls = false;
player.hidden = false;
