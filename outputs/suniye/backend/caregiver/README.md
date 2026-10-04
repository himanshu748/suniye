# Caregiver tools

These tools run on the caregiver's computer, separately from the Android app and Render API. They create no cloud resources. Parent playback always uses ElevenLabs Raju; original document preparation and setup retrieval make no paid model or voice calls.

## Recover a document preparation job

Install this directory's locked dependencies with `npm ci`. Use an existing official Temporal CLI to start a local service on `127.0.0.1:7233`. In another terminal run `npm run worker`. Then:

```sh
npm run document -- start /absolute/path/document.pdf
npm run document -- status JOB_ID
npm run document -- voice JOB_ID --consent
npm run document -- export JOB_ID /absolute/path/new-reader
```

`voice` is optional, consumes configured existing ElevenLabs credits, accepts only Raju, and caps a job at 1,000 normalized characters. It runs after preparation, outside Temporal retries. An exclusive file claim blocks simultaneous voice commands, and a persisted attempt marker prevents an uncertain request from being charged automatically again. A crashed process can leave the claim locked; it fails closed and needs caregiver review, never an automatic retry. No narration occurs without `--consent`. Without recorded audio, the export shows the original and disables Listen. It never uses a browser voice. Opening an exported recording makes no provider requests.

Input accepts a text PDF or JSON `{ "pages": ["Hindi original"] }`, at most 10 pages and 60,000 characters total. Scanned PDFs and invalid embedded text ask for the Android on-device OCR path. Hindi extraction quality on real documents needs caregiver review. Preparation preserves the original; explanations are excluded because a local Gemma trial reversed a shoe instruction.

`cancel JOB_ID` creates a tombstone and removes encrypted input before contacting Temporal. Late activity writes cannot restore it. Job text/results are AES-256-GCM encrypted locally. The local key has file permissions 0600; it is not protected against someone with access to that account. Inputs expire after 24 hours and are rejected and removed on access; `prune` removes other expired jobs. Exports contain plaintext originals and recorded speech and remain until the caregiver deletes them. Treat them like the original document. Temporal history carries only opaque job/page metadata, never source text, voice audio or API keys.

The real local [recovery check](../../docs/evidence/temporal-recovery-2026-10-04.json) kills an OS worker after page one, restarts it, injects a retryable page-two failure, and verifies that page one is not repeated. A separate cancellation check rejects late writes. It does not demonstrate Temporal Cloud, Android job recovery or physical-phone behavior.

## Retrieve approved setup references

Run a local Ollama service with `all-minilm:22m`, then:

```sh
node support-search.js index
node support-search.js search "Camera and microphone permissions for the app"
```

Three public official Android references cover camera/microphone permissions, display size and restricted accessibility settings. PGlite runs actual PostgreSQL with pgvector 0.8.1 locally. It stores 384-dimensional embeddings and combines exact cosine similarity with PostgreSQL keyword rank using reciprocal-rank fusion. Mastra retrieves approved references and returns their fixed Hindi hints and official URLs. It does not generate device-specific instructions.

The [live retrieval check](../../docs/evidence/pgvector-source-search-2026-10-04.json) verifies the three setup questions, abstains on an unrelated cake question, reopens the persisted database, rejects a tampered source URL, and tests SQL parameterization. Four synthetic questions are a smoke check, not a retrieval benchmark. English caregiver queries are supported; Hindi queries are rejected because quality is unvalidated. This uses local pgvector, not Tiger Cloud, pgvectorscale or BM25. No family messages or reading history enter the index.

Private job and index directories are ignored by Git. Keep the ElevenLabs key only in the backend's ignored `.env`. Nothing in the exported HTML or APK needs that key.
