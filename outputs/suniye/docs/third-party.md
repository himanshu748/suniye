# Third-party components

The application source is MIT licensed. Dependency licenses and service/model terms apply separately.

- Gemma 3: open-weight model, separately governed by [Gemma terms](https://ai.google.dev/gemma/terms). Downloaded through Ollama for local inference; weights are not redistributed in the APK or source ZIP.
- Mastra: open-source workflow framework. The backend uses actual `@mastra/core` workflows; refer to the installed package's license.
- Google ML Kit: bundled Devanagari and Latin text-recognition SDKs, version 16.0.1. This is proprietary Google SDK functionality. The entire reading stack is not described as open source.
- Android SDK/Gradle/AGP: build/runtime tooling with their upstream licenses. Gradle wrapper is included; SDK images and JDK are not redistributed.
- Fastify, Zod, MongoDB Node driver and Sentry Node SDK: upstream package licenses apply. Exact installed versions are locked in backend/package-lock.json.
- ElevenLabs: hosted voice service. Hindi demo narration and a short backend speech smoke used synthetic app instructions. Free-plan generated audio requires attribution when published; include elevenlabs.io in the published audio/video title. See [ElevenLabs publishing guidance](https://help.elevenlabs.io/hc/en-us/articles/13313564601361-Can-I-publish-the-content-I-generate-on-the-platform). The limited backend key is excluded from all packages.
- Backboard and SerpApi: hosted optional developer/caregiver integrations. Provider credentials are excluded from source and APK.
- Entire: official checksum-verified v0.11.3 development tool, used locally. The binary and full session history are not included in the source ZIP.
- Claude: independent PRD/spec audit through the desktop app. The audit summary distinguishes review predictions from executed tests.

The Android emulator's bundled default.jpg was used privately to probe vision behavior. It is not included in the redistribution package. The included shape and Hindi fixtures were generated for this project; they contain no real family messages.

- Temporal TypeScript SDK 1.24.0 and local development server: actual durable document preparation and worker-recovery tests, separate from the phone.
- PGlite 0.5.8 with pgvector 0.8.1: local PostgreSQL vector and keyword retrieval over approved public setup references. This does not deploy Tiger Cloud or use pgvectorscale/BM25.
- all-minilm:22m through local Ollama: 384-dimensional English caregiver embeddings. Hindi query quality is unvalidated and rejected. Weights are not included in the APK or source.
