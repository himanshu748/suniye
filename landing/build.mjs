import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, mkdir, copyFile, writeFile, stat } from "node:fs/promises";
import { dirname, resolve, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const root = dirname(fileURLToPath(import.meta.url));
const started = performance.now();
const files = ["index.html", "caregiver.html", "caregiver.css", "caregiver.js", "style.css", "app.js", "assets/mark.svg", "assets/android-home.png", "assets/android-reading.png", "assets/raju-bill-sample.mp3", "assets/manrope-latin.woff2", "assets/MANROPE-OFL.txt", "assets/suniye-walkthrough.mp4", "assets/walkthrough-en.vtt", "assets/walkthrough-poster.png"];
const html = await readFile(resolve(root, "index.html"), "utf8");
assert.match(html, /<html lang="hi">/);
assert.match(html, /name="viewport"/);
assert.match(html, /connect-src 'none'/);
assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
assert.doesNotMatch(html, /\bon\w+\s*=|\bautoplay\b/i, "No inline handlers or media autoplay");
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
assert.equal(new Set(ids).size, ids.length, "IDs must be unique");
for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
  const target = match[1];
  if (target.startsWith("#")) {
    if (target !== "#") assert(ids.includes(target.slice(1)), `Missing anchor ${target}`);
  } else if (!/^https:\/\//.test(target)) {
    const local = target === "/caregiver" ? "caregiver.html" : target;
    assert(files.includes(local), `Unexpected or unbuilt local asset ${target}`);
    await stat(resolve(root, local));
  }
}
assert.doesNotMatch(await readFile(resolve(root, "style.css"), "utf8"), /https?:\/\/|@import/);
execFileSync(process.execPath, ["--check", resolve(root, "app.js")], { stdio: "pipe" });
const stamp = new Date().toISOString().replaceAll(":", "-").replaceAll(".", "-");
const output = resolve(root, "build", stamp);
await mkdir(resolve(output, "assets"), { recursive: true });
const manifest = [];
for (const file of files) {
  const body = await readFile(resolve(root, file));
  await copyFile(resolve(root, file), resolve(output, file));
  manifest.push({ file, bytes: body.byteLength, sha256: createHash("sha256").update(body).digest("hex") });
}
const bytes = manifest.reduce((total, file) => total + file.bytes, 0);
const coreBytes = manifest.filter(x => !x.file.endsWith(".mp4")).reduce((n,x) => n+x.bytes,0);
assert(coreBytes < 2_000_000, `Non-video assets exceed 2 MB: ${coreBytes}`);
assert(bytes < 20_000_000, `Walkthrough package exceeds 20 MB: ${bytes}`);
await writeFile(resolve(output, "build-manifest.json"), JSON.stringify({
  builtAt: new Date().toISOString(), elapsedMs: Math.round(performance.now() - started), bytes,
  scope: "Static local build; no minifier, dependency install, runtime provider call or deployment", files: manifest,
}, null, 2) + "\n");
console.log(`PASS: static build, anchors, asset references, Hindi/viewport metadata, unique IDs, script syntax, no autoplay/inline handlers/remote font imports; ${bytes} bytes.`);
console.log(`OUTPUT=${relative(process.cwd(), output)}`);
