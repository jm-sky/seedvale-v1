# Speaker identity calibration — 2026-11-05

Stage 2 gate: **useful for conservative manual-review triage; proceed to Stage 3**.

27 ledger takes across 12 historical banks, including short acknowledgements, shouted danger, exhausted delivery and the Casual/Warm/Laura concerns. No manual identity ground truth is invented: bank UUIDs are hypotheses; named history downloads are reference labels.

All 31 reference takes with another distinct same-UUID reference ranked their own voice first in leave-one-content-out checks. Expected mean cosine range 0.463–0.802; minimum margin 0.160. Six singleton voices cannot be validated internally. KID lacks a repository UUID and is excluded.

Local screening policy: mean cosine ≥0.45 and winner margin ≥0.15. Both bounds are rounded down from observed reference minima, not universal thresholds or calibrated probabilities. Low scores remain ambiguous; strong competing matches become suspected source mismatches requiring listening. This is exploratory calibration without an independent held-out labelled test set.

First 26-take cold run: 43.80s wall, 35.21s CPU, 666.4 MiB peak RSS, 63 embeddings. Final 27-take cached run: 7.13s wall, 3.29s CPU, 504.5 MiB peak RSS. Two PyTorch CPU threads. Metrics include initialization; cold wall includes download. Linux process resource counters; not machine-wide utilization.

| File | Expected winner? | Best | Expected | Margin |
| --- | --- | ---: | ---: | ---: |
| general_female_b_exhausted_01.mp3 | True | 0.551 | 0.551 | 0.283 |
| general_female_b_greeting_01.mp3 | True | 0.503 | 0.503 | 0.329 |
| general_female_child_greeting_01.mp3 | False | 0.455 | 0.111 | 0.305 |
| general_female_exhausted_01.mp3 | True | 0.585 | 0.585 | 0.303 |
| general_female_greeting_01.mp3 | False | 0.677 | 0.046 | 0.536 |
| general_female_weather_shelter_01.mp3 | True | 0.742 | 0.742 | 0.462 |
| general_male_b_exhausted_01.mp3 | True | 0.600 | 0.600 | 0.362 |
| general_male_b_greeting_01.mp3 | True | 0.651 | 0.651 | 0.386 |
| general_male_exhausted_01.mp3 | True | 0.494 | 0.494 | 0.214 |
| general_male_farewell_01.mp3 | False | 0.305 | 0.002 | 0.109 |
| general_male_greeting_01.mp3 | False | 0.196 | -0.122 | 0.012 |
| guard_male_b_exhausted_01.mp3 | True | 0.368 | 0.368 | 0.156 |
| guard_male_b_greeting_01.mp3 | True | 0.621 | 0.621 | 0.286 |
| hunter_male_agree_01.mp3 | True | 0.584 | 0.584 | 0.343 |
| hunter_male_b_exhausted_01.mp3 | True | 0.614 | 0.614 | 0.384 |
| hunter_male_b_greeting_01.mp3 | True | 0.665 | 0.665 | 0.393 |
| hunter_male_greeting_01.mp3 | True | 0.550 | 0.550 | 0.280 |
| merchant_female_agree_01.mp3 | True | 0.367 | 0.367 | 0.057 |
| merchant_female_b_exhausted_01.mp3 | True | 0.589 | 0.589 | 0.387 |
| merchant_female_b_greeting_01.mp3 | True | 0.734 | 0.734 | 0.553 |
| merchant_female_greeting_01.mp3 | True | 0.529 | 0.529 | 0.335 |
| npc_mark_hornblower_daily_01.mp3 | True | 0.735 | 0.735 | 0.493 |
| npc_mark_hornblower_greeting_01.mp3 | True | 0.522 | 0.522 | 0.304 |
| shepard_male_danger_alert_01.mp3 | True | 0.464 | 0.464 | 0.281 |
| shepherd_male_b_call_for_help_01.mp3 | True | 0.554 | 0.554 | 0.231 |
| shepherd_male_b_greeting_01.mp3 | True | 0.995 | 0.995 | 0.706 |
| shepherd_male_greeting_01.mp3 | True | 0.486 | 0.486 | 0.302 |

Laura greeting/exhaustion both match Laura; Casual exhaustion matches Casual but farewell/greeting do not strongly identify a covered alternative. Warm exhaustion/weather match Warm; its greeting and child sample need competing-source investigation. Expressive short acknowledgement has weak margin despite the correct winner. Short clips and expressive delivery therefore remain explicit ambiguity cases.

Near-unit similarities can indicate the same generation re-encoded with different MP3 bytes (e.g. historian greeting); these are not independent validation. Byte-identical files are always excluded; leave-one-reference-out evidence, not target near-copies, supports the gate. Multiple references are averaged once per distinct content per speaker. Singleton reference coverage remains weaker.

Artifacts: [raw calibration](identity-calibration.json), [sample](identity-sample.json), [local policy](identity-policy.json), [CLI setup](../../../scripts/voice/IDENTITY-QC.md). Existing transcript QC and author verdicts are untouched.

Final sample screening: 4 ambiguous, 21 strong-match, 2 suspected-wrong-speaker. Expected-bank winner: 23/27; this is agreement with catalog metadata, not measured identity accuracy. British female wins the Warm greeting (0.677, margin 0.536); Little Lem wins the child greeting (0.455, margin 0.305), with weaker singleton evidence and borderline score.
