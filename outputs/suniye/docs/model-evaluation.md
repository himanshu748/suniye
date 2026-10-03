# Local Gemma comparison — October 2, 2026

Three synthetic fixtures ran through Fastify and Mastra with the same local Gemma 3 4B weights. The baseline used the previous provider implementation and the current workflow. The candidate combined shorter prompts with native Ollama structured output. These are individual development runs, with uncontrolled machine load, not an accuracy benchmark or a reliable speed estimate. The model was unloaded before each series; later requests could reuse it. No ElevenLabs calls were made.

| Fixture | Baseline | Candidate | Inspected result |
| --- | --- | --- | --- |
| Bill ₹1,250, date 02/10/2026 | 14,174 ms | 23,951 ms | Both preserved the amount and date. |
| Short Hindi invitation | 3,739 ms | 7,193 ms | Both preserved the time. Candidate added an unnecessary sentence describing the source. |
| Red circle left, blue square right | 42,120 ms | 43,494 ms | Both preserved colors and called the square a rectangle. Baseline retained positions; candidate omitted them. |

The candidate gave no evidence of an improvement. The default remains the OpenAI-compatible protocol with the previous prompts. Response limits, structured picture JSON, ordered explanation-anchor checks and public error handling remain in the updated source. The optional native protocol records load, prompt and generation durations; its first candidate request reported 12,472 ms of model loading. That explains only part of that request's delay.

The updated check compares ordered amounts, dates and a fixed set of Hindi number/day words, common units, time-of-day words and negations. It normalizes digit scripts and common translated units. Tests catch the known swaps, omissions and negation inversions. The check can reject faithful rewording and does not prove preservation of meaning. AI explanations and picture descriptions are separate from original text. Direct text reading uses the supplied source. Image text comes from bundled phone OCR, with uncertain recognition requesting a retake.

Raw synthetic receipts: [baseline](evidence/model-baseline-comparison.json), [candidate](evidence/model-candidate-comparison.json). Earlier failures remain in the verification ledger. Real labels, family phone latency and spoken Hindi still require device testing.
