# NPC speaker identity audit — 2026-11-05

Identity evidence only: no transcript-QC or author verdict is changed. Similarity is not definitive proof of identity. Do not delete or admit MP3s based on this report.

[Calibration and limits](IDENTITY-CALIBRATION.md) · [Raw scores and provenance](identity-audit.json) · [Setup](../../../scripts/voice/IDENTITY-QC.md)

Analyzed 317 ledger rows / 317 distinct audio hashes. Identical public copies verified: 109. No redundant public embedding extraction.

Measured: 0.65s wall; 0.39s CPU (user 0.33s, system 0.06s); peak RSS 28.7 MiB; 2 CPU threads. Cache: 354 hits / 0 extractions. Model initialized: False.

[Expected mapping corrections, evidence and before/after comparison](IDENTITY-MAPPING-REVIEW.md). Null Expected means unresolved identity, not the best scoring candidate. Ledger voiceId is retained in JSON. Decision cells are author-owned and preserved by filename across regeneration; they never change classifications automatically.

| Classification | Count |
| --- | ---: |
| ambiguous | 22 |
| missing-reference | 2 |
| strong-match | 276 |
| suspected-wrong-speaker | 7 |
| unresolved-expected | 10 |

Review suspected wrong-speaker cases first, then ambiguous clips. Strong matches still require source/context/listening QC before cleanup. Single-reference voices and short or expressive clips have weaker evidence; absent speakers can never be identified by a closed reference set.

## Reference coverage and errors

- `docs/v3-donor/voices/named-references/KID-2026-09-17-13-50-Hey!-I-haven't-seen-you-around-before.mp3`: Unmapped reference name

Single-reference voices: British-female, Little-Lem, Old-man, Old-woman, Sleepless-historian, guard. These lack independent within-speaker reference validation.

## suspected-wrong-speaker

| File | Expected | Best reference | Best | Expected score | Margin | Decision |
| --- | --- | --- | ---: | ---: | ---: | --- |
| general_female_greeting_01.mp3 | Warm-Conversational-Female | British-female | 0.677 | 0.046 | 0.536 |  |
| general_female_quest_complete_01.mp3 | Warm-Conversational-Female | British-female | 0.747 | 0.196 | 0.511 |  |
| campfire_female_weather_answer_02.mp3 | Warm-Conversational-Female | British-female | 0.695 | 0.071 | 0.501 |  |
| general_female_agree_01.mp3 | Warm-Conversational-Female | British-female | 0.695 | 0.020 | 0.499 |  |
| general_female_thanks_01.mp3 | Warm-Conversational-Female | British-female | 0.668 | 0.103 | 0.477 |  |
| general_female_quest_declined_01.mp3 | Warm-Conversational-Female | British-female | 0.707 | 0.103 | 0.457 |  |
| general_female_farewell_01.mp3 | Warm-Conversational-Female | British-female | 0.518 | -0.025 | 0.325 |  |

## unresolved-expected

| File | Expected | Best reference | Best | Expected score | Margin | Decision |
| --- | --- | --- | ---: | ---: | ---: | --- |
| general_female_old_farewell_02.mp3 | unresolved | Old-woman | 0.743 | — | 0.554 |  |
| general_female_old_greeting_01.mp3 | unresolved | Old-woman | 0.653 | — | 0.433 |  |
| general_female_child_farewell_01.mp3 | unresolved | Little-Lem | 0.609 | — | 0.366 |  |
| general_male_old_greeting_02.mp3 | unresolved | Old-man | 0.576 | — | 0.317 |  |
| general_female_child_greeting_01.mp3 | unresolved | Little-Lem | 0.455 | — | 0.305 |  |
| general_female_child_farewell_02.mp3 | unresolved | Little-Lem | 0.466 | — | 0.262 |  |
| general_male_old_farewell_01.mp3 | unresolved | Old-man | 0.492 | — | 0.245 |  |
| general_male_young_farewell_01.mp3 | unresolved | Little-Lem | 0.386 | — | 0.205 | ? |
| general_male_young_greeting_01.mp3 | unresolved | Little-Lem | 0.424 | — | 0.177 | ? |
| general_male_old_greeting_01.mp3 | unresolved | Old-man | 0.326 | — | 0.100 | ? |

## ambiguous

| File | Expected | Best reference | Best | Expected score | Margin | Decision |
| --- | --- | --- | ---: | ---: | ---: | --- |
| general_female_b_call_for_help_02.mp3 | Hannah | Hannah | 0.356 | 0.356 | 0.253 | Hannah |
| general_female_b_well_wish_01.mp3 | Hannah | Hannah | 0.441 | 0.441 | 0.251 | Hannah |
| general_female_b_danger_alert_02.mp3 | Hannah | Hannah | 0.399 | 0.399 | 0.237 | Hannah |
| campfire_female_weather_question_01.mp3 | Warm-Conversational-Female | British-female | 0.429 | 0.060 | 0.224 | British-female |
| hunter_male_b_agree_02.mp3 | Cowboy | Cowboy | 0.411 | 0.411 | 0.198 | Cowboy |
| npc_mark_hornblower_danger_alert_01.mp3 | Friendly-Male-Voice | Friendly-Male-Voice | 0.382 | 0.382 | 0.196 | Friendly-Male-Voice |
| merchant_female_refusal_01.mp3 | Expressive-Female-Voice | Expressive-Female-Voice | 0.380 | 0.380 | 0.188 | Expressive-Female-Voice |
| merchant_female_b_call_for_help_02.mp3 | Laura | Laura | 0.378 | 0.378 | 0.170 | Laura |
| shepherd_male_livestock_danger_01.mp3 | hetalia-Russia | hetalia-Russia | 0.423 | 0.423 | 0.168 | matches |
| general_male_combat_start_01.mp3 | Casual-Male-Speaker | Casual-Male-Speaker | 0.393 | 0.393 | 0.160 | matches |
| guard_male_b_exhausted_01.mp3 | Dramatic-Character-Male | Dramatic-Character-Male | 0.368 | 0.368 | 0.156 | matches |
| hunter_male_thanks_02.mp3 | Arthur-Morgan | Arthur-Morgan | 0.482 | 0.482 | 0.148 | matches |
| campfire_male_weather_question_02.mp3 | Casual-Male-Speaker | Casual-Male-Speaker | 0.424 | 0.424 | 0.137 | matches |
| hunter_male_well_wish_01.mp3 | Arthur-Morgan | Arthur-Morgan | 0.440 | 0.440 | 0.117 | matches |
| general_male_call_for_help_01.mp3 | Casual-Male-Speaker | Casual-Male-Speaker | 0.282 | 0.282 | 0.113 | matches |
| general_male_farewell_01.mp3 | Casual-Male-Speaker | hetalia-Russia | 0.305 | 0.002 | 0.109 | REMOVE |
| campfire_male_work_question_01.mp3 | Casual-Male-Speaker | Casual-Male-Speaker | 0.300 | 0.300 | 0.100 | matches |
| general_male_young_greeting_02.mp3 | Little-Lem | Little-Lem | 0.346 | 0.346 | 0.085 | Little-Lem |
| merchant_female_quest_accepted_01.mp3 | Expressive-Female-Voice | Expressive-Female-Voice | 0.468 | 0.468 | 0.082 | matches |
| merchant_female_agree_01.mp3 | Expressive-Female-Voice | Expressive-Female-Voice | 0.367 | 0.367 | 0.057 | matches |
| general_male_danger_alert_01.mp3 | Casual-Male-Speaker | Casual-Male-Speaker | 0.299 | 0.299 | 0.035 | guard? |
| general_male_greeting_01.mp3 | Casual-Male-Speaker | Brian-British | 0.196 | -0.122 | 0.012 | REMOVE |

## missing-reference

| File | Expected | Best reference | Best | Expected score | Margin | Decision |
| --- | --- | --- | ---: | ---: | ---: | --- |
| general_male_old_farewell_02.mp3 | Old-man | Brian-British | 0.349 | — | 0.143 | Old-man |
| general_female_old_farewell_01.mp3 | Old-woman | Old-man | 0.206 | — | 0.004 | Old-woman |

## analysis-error

| File | Expected | Best reference | Best | Expected score | Margin | Decision |
| --- | --- | --- | ---: | ---: | ---: | --- |

## strong-match

| File | Expected | Best reference | Best | Expected score | Margin | Decision |
| --- | --- | --- | ---: | ---: | ---: | --- |
| shepherd_male_b_greeting_01.mp3 | Sleepless-historian | Sleepless-historian | 0.995 | 0.995 | 0.706 |  |
| guard_male_danger_alert_01.mp3 | guard | guard | 0.856 | 0.856 | 0.686 |  |
| guard_male_b_quest_accepted_01.mp3 | Dramatic-Character-Male | Dramatic-Character-Male | 0.758 | 0.758 | 0.609 |  |
| merchant_female_b_quest_offer_02.mp3 | Laura | Laura | 0.703 | 0.703 | 0.579 |  |
| merchant_female_b_greeting_01.mp3 | Laura | Laura | 0.734 | 0.734 | 0.553 |  |
| merchant_female_b_quest_accepted_02.mp3 | Laura | Laura | 0.672 | 0.672 | 0.547 |  |
| merchant_female_b_greeting_02.mp3 | Laura | Laura | 0.853 | 0.853 | 0.546 |  |
| merchant_female_b_attention_02.mp3 | Laura | Laura | 0.648 | 0.648 | 0.537 |  |
| guard_male_farewell_01.mp3 | guard | guard | 0.717 | 0.717 | 0.529 |  |
| guard_male_quest_accepted_02.mp3 | guard | guard | 0.721 | 0.721 | 0.525 |  |
| hunter_male_b_quest_complete_01.mp3 | Cowboy | Cowboy | 0.779 | 0.779 | 0.521 |  |
| merchant_female_b_farewell_01.mp3 | Laura | Laura | 0.679 | 0.679 | 0.518 |  |
| merchant_female_b_attention_01.mp3 | Laura | Laura | 0.678 | 0.678 | 0.513 |  |
| guard_male_greeting_01.mp3 | guard | guard | 0.666 | 0.666 | 0.508 |  |
| merchant_female_b_refusal_01.mp3 | Laura | Laura | 0.644 | 0.644 | 0.505 |  |
| guard_male_quest_complete_02.mp3 | guard | guard | 0.703 | 0.703 | 0.499 |  |
| guard_male_quest_declined_01.mp3 | guard | guard | 0.690 | 0.690 | 0.499 |  |
| merchant_female_b_danger_alert_02.mp3 | Laura | Laura | 0.636 | 0.636 | 0.496 |  |
| hunter_male_b_quest_accepted_01.mp3 | Cowboy | Cowboy | 0.744 | 0.744 | 0.495 |  |
| npc_mark_hornblower_daily_01.mp3 | Friendly-Male-Voice | Friendly-Male-Voice | 0.735 | 0.735 | 0.493 |  |
| merchant_female_b_combat_start_02.mp3 | Laura | Laura | 0.666 | 0.666 | 0.492 |  |
| merchant_female_b_weather_shelter_01.mp3 | Laura | Laura | 0.678 | 0.678 | 0.490 |  |
| merchant_female_b_warning_02.mp3 | Laura | Laura | 0.633 | 0.633 | 0.488 |  |
| merchant_female_b_quest_declined_02.mp3 | Laura | Laura | 0.704 | 0.704 | 0.487 |  |
| hunter_male_b_greeting_02.mp3 | Cowboy | Cowboy | 0.788 | 0.788 | 0.487 |  |
| hunter_male_b_farewell_01.mp3 | Cowboy | Cowboy | 0.723 | 0.723 | 0.483 |  |
| hunter_male_b_agree_01.mp3 | Cowboy | Cowboy | 0.662 | 0.662 | 0.479 |  |
| general_female_b_refusal_02.mp3 | Hannah | Hannah | 0.683 | 0.683 | 0.479 |  |
| campfire_female_road_answer_02.mp3 | Warm-Conversational-Female | Warm-Conversational-Female | 0.740 | 0.740 | 0.478 |  |
| general_female_b_well_wish_02.mp3 | Hannah | Hannah | 0.655 | 0.655 | 0.476 |  |
| guard_male_greeting_02.mp3 | guard | guard | 0.716 | 0.716 | 0.475 |  |
| merchant_female_b_well_wish_01.mp3 | Laura | Laura | 0.634 | 0.634 | 0.474 |  |
| merchant_female_b_quest_accepted_01.mp3 | Laura | Laura | 0.645 | 0.645 | 0.472 |  |
| campfire_male_road_answer_01.mp3 | Casual-Male-Speaker | Casual-Male-Speaker | 0.686 | 0.686 | 0.469 |  |
| general_female_b_quest_offer_01.mp3 | Hannah | Hannah | 0.652 | 0.652 | 0.466 |  |
| merchant_female_b_combat_start_01.mp3 | Laura | Laura | 0.614 | 0.614 | 0.466 |  |
| general_female_b_warning_02.mp3 | Hannah | Hannah | 0.652 | 0.652 | 0.466 |  |
| merchant_female_b_quest_complete_02.mp3 | Laura | Laura | 0.641 | 0.641 | 0.465 |  |
| hunter_male_b_quest_declined_02.mp3 | Cowboy | Cowboy | 0.697 | 0.697 | 0.464 |  |
| merchant_female_b_hungry_01.mp3 | Laura | Laura | 0.662 | 0.662 | 0.463 |  |
| general_female_weather_shelter_01.mp3 | Warm-Conversational-Female | Warm-Conversational-Female | 0.742 | 0.742 | 0.462 |  |
| guard_male_weather_shelter_01.mp3 | guard | guard | 0.664 | 0.664 | 0.458 |  |
| hunter_male_b_quest_offer_01.mp3 | Cowboy | Cowboy | 0.649 | 0.649 | 0.458 |  |
| hunter_male_b_work_finished_02.mp3 | Cowboy | Cowboy | 0.683 | 0.683 | 0.457 |  |
| general_female_b_thanks_01.mp3 | Hannah | Hannah | 0.675 | 0.675 | 0.457 |  |
| npc_mark_hornblower_road_advice_01.mp3 | Friendly-Male-Voice | Friendly-Male-Voice | 0.676 | 0.676 | 0.449 |  |
| guard_male_attention_01.mp3 | guard | guard | 0.670 | 0.670 | 0.449 |  |
| hunter_male_b_quest_complete_02.mp3 | Cowboy | Cowboy | 0.651 | 0.651 | 0.448 |  |
| general_female_b_quest_accepted_01.mp3 | Hannah | Hannah | 0.627 | 0.627 | 0.448 |  |
| guard_male_well_wish_01.mp3 | guard | guard | 0.670 | 0.670 | 0.447 |  |
| shepherd_male_greeting_02.mp3 | hetalia-Russia | hetalia-Russia | 0.645 | 0.645 | 0.446 |  |
| merchant_female_b_warning_01.mp3 | Laura | Laura | 0.595 | 0.595 | 0.445 |  |
| general_female_b_quest_offer_02.mp3 | Hannah | Hannah | 0.632 | 0.632 | 0.444 |  |
| general_female_b_thanks_02.mp3 | Hannah | Hannah | 0.565 | 0.565 | 0.444 |  |
| merchant_female_b_farewell_02.mp3 | Laura | Laura | 0.645 | 0.645 | 0.443 |  |
| merchant_female_b_work_finished_01.mp3 | Laura | Laura | 0.666 | 0.666 | 0.443 |  |
| shepherd_male_b_livestock_danger_02.mp3 | Sleepless-historian | Sleepless-historian | 0.592 | 0.592 | 0.443 |  |
| merchant_female_b_thanks_02.mp3 | Laura | Laura | 0.589 | 0.589 | 0.442 |  |
| general_female_b_farewell_02.mp3 | Hannah | Hannah | 0.655 | 0.655 | 0.439 |  |
| general_female_b_weather_shelter_01.mp3 | Hannah | Hannah | 0.691 | 0.691 | 0.439 |  |
| general_male_b_refusal_02.mp3 | Brian-British | Brian-British | 0.727 | 0.727 | 0.439 |  |
| merchant_female_b_thanks_01.mp3 | Laura | Laura | 0.614 | 0.614 | 0.439 |  |
| general_female_b_work_finished_02.mp3 | Hannah | Hannah | 0.671 | 0.671 | 0.438 |  |
| guard_male_thanks_02.mp3 | guard | guard | 0.674 | 0.674 | 0.437 |  |
| general_male_hungry_01.mp3 | Casual-Male-Speaker | Casual-Male-Speaker | 0.633 | 0.633 | 0.437 |  |
| hunter_male_b_quest_declined_01.mp3 | Cowboy | Cowboy | 0.688 | 0.688 | 0.436 |  |
| general_female_b_farewell_01.mp3 | Hannah | Hannah | 0.640 | 0.640 | 0.435 |  |
| hunter_male_b_farewell_02.mp3 | Cowboy | Cowboy | 0.715 | 0.715 | 0.431 |  |
| campfire_female_road_question_01.mp3 | Warm-Conversational-Female | Warm-Conversational-Female | 0.697 | 0.697 | 0.429 |  |
| hunter_male_b_refusal_01.mp3 | Cowboy | Cowboy | 0.666 | 0.666 | 0.429 |  |
| guard_male_b_refusal_02.mp3 | Dramatic-Character-Male | Dramatic-Character-Male | 0.593 | 0.593 | 0.427 |  |
| merchant_female_b_work_finished_02.mp3 | Laura | Laura | 0.618 | 0.618 | 0.426 |  |
| guard_male_b_hungry_01.mp3 | Dramatic-Character-Male | Dramatic-Character-Male | 0.622 | 0.622 | 0.426 |  |
| guard_male_agree_01.mp3 | guard | guard | 0.637 | 0.637 | 0.426 |  |
| guard_male_quest_declined_02.mp3 | guard | guard | 0.639 | 0.639 | 0.425 |  |
| general_female_b_work_finished_01.mp3 | Hannah | Hannah | 0.656 | 0.656 | 0.425 |  |
| general_male_b_agree_02.mp3 | Brian-British | Brian-British | 0.671 | 0.671 | 0.423 |  |
| hunter_male_b_exhausted_02.mp3 | Cowboy | Cowboy | 0.657 | 0.657 | 0.422 |  |
| general_female_b_exhausted_02.mp3 | Hannah | Hannah | 0.555 | 0.555 | 0.419 |  |
| general_female_b_warning_01.mp3 | Hannah | Hannah | 0.606 | 0.606 | 0.413 |  |
| hunter_male_b_thanks_02.mp3 | Cowboy | Cowboy | 0.622 | 0.622 | 0.413 |  |
| general_female_b_quest_declined_01.mp3 | Hannah | Hannah | 0.660 | 0.660 | 0.411 |  |
| hunter_male_b_warning_01.mp3 | Cowboy | Cowboy | 0.698 | 0.698 | 0.411 |  |
| campfire_male_weather_answer_01.mp3 | Casual-Male-Speaker | Casual-Male-Speaker | 0.594 | 0.594 | 0.410 |  |
| general_female_b_hungry_02.mp3 | Hannah | Hannah | 0.611 | 0.611 | 0.407 |  |
| campfire_female_work_question_02.mp3 | Warm-Conversational-Female | Warm-Conversational-Female | 0.724 | 0.724 | 0.406 |  |
| general_male_b_hungry_01.mp3 | Brian-British | Brian-British | 0.722 | 0.722 | 0.404 |  |
| campfire_male_work_answer_02.mp3 | Casual-Male-Speaker | Casual-Male-Speaker | 0.637 | 0.637 | 0.403 |  |
| hunter_male_b_hungry_01.mp3 | Cowboy | Cowboy | 0.669 | 0.669 | 0.401 |  |
| general_male_b_farewell_02.mp3 | Brian-British | Brian-British | 0.735 | 0.735 | 0.400 |  |
| guard_male_warning_01.mp3 | guard | guard | 0.651 | 0.651 | 0.398 |  |
| general_male_b_quest_declined_01.mp3 | Brian-British | Brian-British | 0.636 | 0.636 | 0.396 |  |
| npc_mark_hornblower_thanks_01.mp3 | Friendly-Male-Voice | Friendly-Male-Voice | 0.652 | 0.652 | 0.395 |  |
| hunter_male_b_greeting_01.mp3 | Cowboy | Cowboy | 0.665 | 0.665 | 0.393 |  |
| general_female_b_quest_complete_02.mp3 | Hannah | Hannah | 0.625 | 0.625 | 0.392 |  |
| hunter_male_b_well_wish_02.mp3 | Cowboy | Cowboy | 0.653 | 0.653 | 0.391 |  |
| general_male_b_quest_offer_01.mp3 | Brian-British | Brian-British | 0.670 | 0.670 | 0.390 |  |
| general_male_b_warning_02.mp3 | Brian-British | Brian-British | 0.748 | 0.748 | 0.389 |  |
| hunter_male_b_thanks_01.mp3 | Cowboy | Cowboy | 0.580 | 0.580 | 0.389 |  |
| general_female_b_greeting_02.mp3 | Hannah | Hannah | 0.569 | 0.569 | 0.389 |  |
| general_female_b_quest_declined_02.mp3 | Hannah | Hannah | 0.608 | 0.608 | 0.389 |  |
| general_male_b_attention_01.mp3 | Brian-British | Brian-British | 0.637 | 0.637 | 0.387 |  |
| merchant_female_b_exhausted_01.mp3 | Laura | Laura | 0.589 | 0.589 | 0.387 |  |
| merchant_female_b_quest_offer_01.mp3 | Laura | Laura | 0.606 | 0.606 | 0.387 |  |
| general_male_b_greeting_01.mp3 | Brian-British | Brian-British | 0.651 | 0.651 | 0.386 |  |
| general_female_b_agree_01.mp3 | Hannah | Hannah | 0.585 | 0.585 | 0.385 |  |
| hunter_male_b_warning_02.mp3 | Cowboy | Cowboy | 0.656 | 0.656 | 0.385 |  |
| hunter_male_b_exhausted_01.mp3 | Cowboy | Cowboy | 0.614 | 0.614 | 0.384 |  |
| hunter_male_b_weather_shelter_02.mp3 | Cowboy | Cowboy | 0.670 | 0.670 | 0.383 |  |
| general_male_b_well_wish_02.mp3 | Brian-British | Brian-British | 0.733 | 0.733 | 0.381 |  |
| guard_male_thanks_01.mp3 | guard | guard | 0.530 | 0.530 | 0.378 |  |
| guard_male_b_refusal_01.mp3 | Dramatic-Character-Male | Dramatic-Character-Male | 0.616 | 0.616 | 0.375 |  |
| general_male_b_weather_shelter_02.mp3 | Brian-British | Brian-British | 0.693 | 0.693 | 0.375 |  |
| hunter_male_b_weather_shelter_01.mp3 | Cowboy | Cowboy | 0.628 | 0.628 | 0.375 |  |
| guard_male_refusal_01.mp3 | guard | guard | 0.550 | 0.550 | 0.372 |  |
| hunter_male_b_combat_start_02.mp3 | Cowboy | Cowboy | 0.610 | 0.610 | 0.371 |  |
| general_female_b_quest_complete_01.mp3 | Hannah | Hannah | 0.617 | 0.617 | 0.370 |  |
| shepherd_male_b_livestock_danger_01.mp3 | Sleepless-historian | Sleepless-historian | 0.627 | 0.627 | 0.370 |  |
| hunter_male_b_attention_02.mp3 | Cowboy | Cowboy | 0.604 | 0.604 | 0.369 |  |
| merchant_female_b_agree_02.mp3 | Laura | Laura | 0.536 | 0.536 | 0.368 |  |
| hunter_male_b_work_finished_01.mp3 | Cowboy | Cowboy | 0.597 | 0.597 | 0.367 |  |
| campfire_female_work_answer_01.mp3 | Warm-Conversational-Female | Warm-Conversational-Female | 0.667 | 0.667 | 0.366 |  |
| general_male_b_quest_declined_02.mp3 | Brian-British | Brian-British | 0.648 | 0.648 | 0.365 |  |
| guard_male_quest_complete_01.mp3 | guard | guard | 0.521 | 0.521 | 0.363 |  |
| guard_male_b_well_wish_02.mp3 | Dramatic-Character-Male | Dramatic-Character-Male | 0.598 | 0.598 | 0.363 |  |
| general_male_b_exhausted_01.mp3 | Brian-British | Brian-British | 0.600 | 0.600 | 0.362 |  |
| merchant_female_b_danger_alert_01.mp3 | Laura | Laura | 0.557 | 0.557 | 0.362 |  |
| guard_male_guard_response_01.mp3 | guard | guard | 0.543 | 0.543 | 0.358 |  |
| hunter_male_b_quest_accepted_02.mp3 | Cowboy | Cowboy | 0.630 | 0.630 | 0.358 |  |
| general_female_b_refusal_01.mp3 | Hannah | Hannah | 0.508 | 0.508 | 0.357 |  |
| guard_male_b_quest_offer_02.mp3 | Dramatic-Character-Male | Dramatic-Character-Male | 0.596 | 0.596 | 0.356 |  |
| general_male_b_farewell_01.mp3 | Brian-British | Brian-British | 0.654 | 0.654 | 0.356 |  |
| general_male_b_thanks_02.mp3 | Brian-British | Brian-British | 0.626 | 0.626 | 0.356 |  |
| shepherd_male_b_farewell_01.mp3 | Sleepless-historian | Sleepless-historian | 0.647 | 0.647 | 0.355 |  |
| shepherd_male_farewell_01.mp3 | hetalia-Russia | hetalia-Russia | 0.588 | 0.588 | 0.355 |  |
| hunter_male_b_call_for_help_02.mp3 | Cowboy | Cowboy | 0.527 | 0.527 | 0.354 |  |
| general_male_b_refusal_01.mp3 | Brian-British | Brian-British | 0.651 | 0.651 | 0.354 |  |
| general_male_b_danger_alert_02.mp3 | Brian-British | Brian-British | 0.625 | 0.625 | 0.353 |  |
| merchant_female_b_quest_declined_01.mp3 | Laura | Laura | 0.512 | 0.512 | 0.352 |  |
| guard_male_b_farewell_02.mp3 | Dramatic-Character-Male | Dramatic-Character-Male | 0.573 | 0.573 | 0.351 |  |
| hunter_male_b_danger_alert_02.mp3 | Cowboy | Cowboy | 0.627 | 0.627 | 0.349 |  |
| merchant_female_b_agree_01.mp3 | Laura | Laura | 0.537 | 0.537 | 0.348 |  |
| general_male_work_finished_01.mp3 | Casual-Male-Speaker | Casual-Male-Speaker | 0.556 | 0.556 | 0.348 |  |
| general_male_b_quest_accepted_02.mp3 | Brian-British | Brian-British | 0.617 | 0.617 | 0.346 |  |
| hunter_male_b_danger_alert_01.mp3 | Cowboy | Cowboy | 0.614 | 0.614 | 0.344 |  |
| hunter_male_agree_01.mp3 | Arthur-Morgan | Arthur-Morgan | 0.584 | 0.584 | 0.343 |  |
| general_male_b_warning_01.mp3 | Brian-British | Brian-British | 0.716 | 0.716 | 0.343 |  |
| general_female_b_combat_start_02.mp3 | Hannah | Hannah | 0.559 | 0.559 | 0.343 |  |
| general_male_b_weather_shelter_01.mp3 | Brian-British | Brian-British | 0.731 | 0.731 | 0.343 |  |
| general_female_b_weather_shelter_02.mp3 | Hannah | Hannah | 0.613 | 0.613 | 0.341 |  |
| merchant_female_b_call_for_help_01.mp3 | Laura | Laura | 0.460 | 0.460 | 0.341 |  |
| merchant_female_quest_complete_02.mp3 | Expressive-Female-Voice | Expressive-Female-Voice | 0.559 | 0.559 | 0.340 |  |
| shepherd_male_b_call_for_help_02.mp3 | Sleepless-historian | Sleepless-historian | 0.613 | 0.613 | 0.340 |  |
| general_female_b_agree_02.mp3 | Hannah | Hannah | 0.584 | 0.584 | 0.339 |  |
| general_female_b_quest_accepted_02.mp3 | Hannah | Hannah | 0.505 | 0.505 | 0.339 |  |
| general_male_weather_shelter_01.mp3 | Casual-Male-Speaker | Casual-Male-Speaker | 0.585 | 0.585 | 0.338 |  |
| guard_male_b_danger_alert_01.mp3 | Dramatic-Character-Male | Dramatic-Character-Male | 0.513 | 0.513 | 0.337 |  |
| guard_male_b_quest_offer_01.mp3 | Dramatic-Character-Male | Dramatic-Character-Male | 0.609 | 0.609 | 0.337 |  |
| general_male_b_work_finished_02.mp3 | Brian-British | Brian-British | 0.660 | 0.660 | 0.337 |  |
| general_male_b_hungry_02.mp3 | Brian-British | Brian-British | 0.656 | 0.656 | 0.336 |  |
| hunter_male_b_quest_offer_02.mp3 | Cowboy | Cowboy | 0.544 | 0.544 | 0.336 |  |
| guard_male_b_quest_declined_02.mp3 | Dramatic-Character-Male | Dramatic-Character-Male | 0.543 | 0.543 | 0.335 |  |
| merchant_female_greeting_01.mp3 | Expressive-Female-Voice | Expressive-Female-Voice | 0.529 | 0.529 | 0.335 |  |
| general_female_danger_alert_01.mp3 | Warm-Conversational-Female | Warm-Conversational-Female | 0.605 | 0.605 | 0.335 |  |
| general_male_b_quest_offer_02.mp3 | Brian-British | Brian-British | 0.683 | 0.683 | 0.334 |  |
| merchant_female_quest_offer_02.mp3 | Expressive-Female-Voice | Expressive-Female-Voice | 0.568 | 0.568 | 0.332 |  |
| general_female_b_hungry_01.mp3 | Hannah | Hannah | 0.510 | 0.510 | 0.330 |  |
| general_female_b_greeting_01.mp3 | Hannah | Hannah | 0.503 | 0.503 | 0.329 |  |
| general_female_b_combat_start_01.mp3 | Hannah | Hannah | 0.467 | 0.467 | 0.329 |  |
| hunter_male_quest_declined_01.mp3 | Arthur-Morgan | Arthur-Morgan | 0.500 | 0.500 | 0.328 |  |
| guard_male_b_quest_accepted_02.mp3 | Dramatic-Character-Male | Dramatic-Character-Male | 0.570 | 0.570 | 0.325 |  |
| hunter_male_call_for_help_01.mp3 | Arthur-Morgan | Arthur-Morgan | 0.544 | 0.544 | 0.324 |  |
| hunter_male_b_well_wish_01.mp3 | Cowboy | Cowboy | 0.500 | 0.500 | 0.324 |  |
| guard_male_b_agree_02.mp3 | Dramatic-Character-Male | Dramatic-Character-Male | 0.643 | 0.643 | 0.324 |  |
| guard_male_b_thanks_01.mp3 | Dramatic-Character-Male | Dramatic-Character-Male | 0.616 | 0.616 | 0.323 |  |
| hunter_male_well_wish_02.mp3 | Arthur-Morgan | Arthur-Morgan | 0.577 | 0.577 | 0.323 |  |
| hunter_male_quest_accepted_01.mp3 | Arthur-Morgan | Arthur-Morgan | 0.614 | 0.614 | 0.323 |  |
| merchant_female_b_weather_shelter_02.mp3 | Laura | Laura | 0.531 | 0.531 | 0.323 |  |
| hunter_male_quest_declined_02.mp3 | Arthur-Morgan | Arthur-Morgan | 0.580 | 0.580 | 0.321 |  |
| general_male_b_exhausted_02.mp3 | Brian-British | Brian-British | 0.671 | 0.671 | 0.320 |  |
| guard_male_b_well_wish_01.mp3 | Dramatic-Character-Male | Dramatic-Character-Male | 0.492 | 0.492 | 0.319 |  |
| guard_male_b_quest_complete_02.mp3 | Dramatic-Character-Male | Dramatic-Character-Male | 0.542 | 0.542 | 0.319 |  |
| hunter_male_b_refusal_02.mp3 | Cowboy | Cowboy | 0.527 | 0.527 | 0.318 |  |
| hunter_male_b_hungry_02.mp3 | Cowboy | Cowboy | 0.593 | 0.593 | 0.318 |  |
| general_male_b_danger_alert_01.mp3 | Brian-British | Brian-British | 0.674 | 0.674 | 0.317 |  |
| general_male_b_quest_accepted_01.mp3 | Brian-British | Brian-British | 0.659 | 0.659 | 0.316 |  |
| general_male_b_quest_complete_02.mp3 | Brian-British | Brian-British | 0.678 | 0.678 | 0.309 |  |
| general_male_b_work_finished_01.mp3 | Brian-British | Brian-British | 0.688 | 0.688 | 0.309 |  |
| merchant_female_b_quest_complete_01.mp3 | Laura | Laura | 0.531 | 0.531 | 0.308 |  |
| general_male_b_greeting_02.mp3 | Brian-British | Brian-British | 0.606 | 0.606 | 0.308 |  |
| general_male_b_thanks_01.mp3 | Brian-British | Brian-British | 0.710 | 0.710 | 0.307 |  |
| guard_male_b_warning_01.mp3 | Dramatic-Character-Male | Dramatic-Character-Male | 0.569 | 0.569 | 0.305 |  |
| guard_male_b_attention_01.mp3 | Dramatic-Character-Male | Dramatic-Character-Male | 0.555 | 0.555 | 0.305 |  |
| general_male_b_call_for_help_02.mp3 | Brian-British | Brian-British | 0.641 | 0.641 | 0.304 |  |
| npc_mark_hornblower_greeting_01.mp3 | Friendly-Male-Voice | Friendly-Male-Voice | 0.522 | 0.522 | 0.304 |  |
| guard_male_b_combat_start_02.mp3 | Dramatic-Character-Male | Dramatic-Character-Male | 0.570 | 0.570 | 0.304 |  |
| general_female_exhausted_01.mp3 | Warm-Conversational-Female | Warm-Conversational-Female | 0.585 | 0.585 | 0.303 |  |
| guard_male_b_quest_complete_01.mp3 | Dramatic-Character-Male | Dramatic-Character-Male | 0.617 | 0.617 | 0.303 |  |
| guard_male_b_guard_response_02.mp3 | Dramatic-Character-Male | Dramatic-Character-Male | 0.597 | 0.597 | 0.302 |  |
| shepherd_male_greeting_01.mp3 | hetalia-Russia | hetalia-Russia | 0.486 | 0.486 | 0.302 |  |
| guard_male_b_work_finished_02.mp3 | Dramatic-Character-Male | Dramatic-Character-Male | 0.529 | 0.529 | 0.301 |  |
| guard_male_quest_accepted_01.mp3 | guard | guard | 0.511 | 0.511 | 0.301 |  |
| hunter_male_quest_complete_01.mp3 | Arthur-Morgan | Arthur-Morgan | 0.543 | 0.543 | 0.296 |  |
| hunter_male_quest_offer_01.mp3 | Arthur-Morgan | Arthur-Morgan | 0.584 | 0.584 | 0.294 |  |
| general_male_b_attention_02.mp3 | Brian-British | Brian-British | 0.645 | 0.645 | 0.293 |  |
| merchant_female_b_exhausted_02.mp3 | Laura | Laura | 0.501 | 0.501 | 0.293 |  |
| merchant_female_b_refusal_02.mp3 | Laura | Laura | 0.518 | 0.518 | 0.293 |  |
| shepherd_male_b_danger_alert_02.mp3 | Sleepless-historian | Sleepless-historian | 0.609 | 0.609 | 0.290 |  |
| guard_male_b_work_finished_01.mp3 | Dramatic-Character-Male | Dramatic-Character-Male | 0.564 | 0.564 | 0.287 |  |
| general_male_b_agree_01.mp3 | Brian-British | Brian-British | 0.698 | 0.698 | 0.287 |  |
| guard_male_b_hungry_02.mp3 | Dramatic-Character-Male | Dramatic-Character-Male | 0.541 | 0.541 | 0.287 |  |
| guard_male_b_greeting_01.mp3 | Dramatic-Character-Male | Dramatic-Character-Male | 0.621 | 0.621 | 0.286 |  |
| general_male_b_well_wish_01.mp3 | Brian-British | Brian-British | 0.627 | 0.627 | 0.285 |  |
| guard_male_b_thanks_02.mp3 | Dramatic-Character-Male | Dramatic-Character-Male | 0.588 | 0.588 | 0.285 |  |
| merchant_female_greeting_02.mp3 | Expressive-Female-Voice | Expressive-Female-Voice | 0.496 | 0.496 | 0.284 |  |
| general_female_b_exhausted_01.mp3 | Hannah | Hannah | 0.551 | 0.551 | 0.283 |  |
| guard_male_quest_offer_01.mp3 | guard | guard | 0.588 | 0.588 | 0.283 |  |
| hunter_male_b_call_for_help_01.mp3 | Cowboy | Cowboy | 0.518 | 0.518 | 0.281 |  |
| shepard_male_danger_alert_01.mp3 | hetalia-Russia | hetalia-Russia | 0.464 | 0.464 | 0.281 |  |
| hunter_male_greeting_01.mp3 | Arthur-Morgan | Arthur-Morgan | 0.550 | 0.550 | 0.280 |  |
| general_female_b_call_for_help_01.mp3 | Hannah | Hannah | 0.471 | 0.471 | 0.280 |  |
| campfire_male_road_question_02.mp3 | Casual-Male-Speaker | Casual-Male-Speaker | 0.514 | 0.514 | 0.280 |  |
| general_male_b_combat_start_01.mp3 | Brian-British | Brian-British | 0.572 | 0.572 | 0.278 |  |
| hunter_male_b_attention_01.mp3 | Cowboy | Cowboy | 0.498 | 0.498 | 0.277 |  |
| hunter_male_farewell_02.mp3 | Arthur-Morgan | Arthur-Morgan | 0.574 | 0.574 | 0.276 |  |
| guard_male_b_warning_02.mp3 | Dramatic-Character-Male | Dramatic-Character-Male | 0.523 | 0.523 | 0.275 |  |
| guard_male_b_agree_01.mp3 | Dramatic-Character-Male | Dramatic-Character-Male | 0.541 | 0.541 | 0.273 |  |
| merchant_female_b_well_wish_02.mp3 | Laura | Laura | 0.474 | 0.474 | 0.273 |  |
| shepherd_male_b_greeting_02.mp3 | Sleepless-historian | Sleepless-historian | 0.538 | 0.538 | 0.272 |  |
| guard_male_b_attention_02.mp3 | Dramatic-Character-Male | Dramatic-Character-Male | 0.587 | 0.587 | 0.269 |  |
| general_female_b_attention_02.mp3 | Hannah | Hannah | 0.497 | 0.497 | 0.268 |  |
| merchant_female_farewell_02.mp3 | Expressive-Female-Voice | Expressive-Female-Voice | 0.524 | 0.524 | 0.267 |  |
| merchant_female_greeting_03.mp3 | Expressive-Female-Voice | Expressive-Female-Voice | 0.554 | 0.554 | 0.266 |  |
| hunter_male_greeting_02.mp3 | Arthur-Morgan | Arthur-Morgan | 0.582 | 0.582 | 0.265 |  |
| general_male_b_call_for_help_01.mp3 | Brian-British | Brian-British | 0.492 | 0.492 | 0.264 |  |
| guard_male_combat_start_01.mp3 | guard | guard | 0.490 | 0.490 | 0.263 |  |
| guard_male_b_combat_start_01.mp3 | Dramatic-Character-Male | Dramatic-Character-Male | 0.546 | 0.546 | 0.262 |  |
| hunter_male_warning_01.mp3 | Arthur-Morgan | Arthur-Morgan | 0.568 | 0.568 | 0.260 |  |
| general_male_b_combat_start_02.mp3 | Brian-British | Brian-British | 0.527 | 0.527 | 0.257 |  |
| guard_male_b_guard_response_01.mp3 | Dramatic-Character-Male | Dramatic-Character-Male | 0.524 | 0.524 | 0.255 |  |
| shepherd_male_b_farewell_02.mp3 | Sleepless-historian | Sleepless-historian | 0.573 | 0.573 | 0.252 |  |
| merchant_female_quest_complete_01.mp3 | Expressive-Female-Voice | Expressive-Female-Voice | 0.524 | 0.524 | 0.252 |  |
| guard_male_b_weather_shelter_01.mp3 | Dramatic-Character-Male | Dramatic-Character-Male | 0.516 | 0.516 | 0.252 |  |
| guard_male_b_weather_shelter_02.mp3 | Dramatic-Character-Male | Dramatic-Character-Male | 0.512 | 0.512 | 0.250 |  |
| merchant_female_quest_declined_01.mp3 | Expressive-Female-Voice | Expressive-Female-Voice | 0.547 | 0.547 | 0.248 |  |
| guard_male_call_for_help_01.mp3 | guard | guard | 0.649 | 0.649 | 0.246 |  |
| general_male_b_quest_complete_01.mp3 | Brian-British | Brian-British | 0.624 | 0.624 | 0.241 |  |
| merchant_female_attention_01.mp3 | Expressive-Female-Voice | Expressive-Female-Voice | 0.571 | 0.571 | 0.240 |  |
| merchant_female_thanks_01.mp3 | Expressive-Female-Voice | Expressive-Female-Voice | 0.584 | 0.584 | 0.238 |  |
| guard_male_b_quest_declined_01.mp3 | Dramatic-Character-Male | Dramatic-Character-Male | 0.489 | 0.489 | 0.238 |  |
| guard_male_b_call_for_help_02.mp3 | Dramatic-Character-Male | Dramatic-Character-Male | 0.574 | 0.574 | 0.236 |  |
| hunter_male_quest_accepted_02.mp3 | Arthur-Morgan | Arthur-Morgan | 0.586 | 0.586 | 0.236 |  |
| shepherd_male_b_call_for_help_01.mp3 | Sleepless-historian | Sleepless-historian | 0.554 | 0.554 | 0.231 |  |
| guard_male_b_greeting_02.mp3 | Dramatic-Character-Male | Dramatic-Character-Male | 0.559 | 0.559 | 0.223 |  |
| merchant_female_farewell_01.mp3 | Expressive-Female-Voice | Expressive-Female-Voice | 0.578 | 0.578 | 0.222 |  |
| guard_male_b_farewell_01.mp3 | Dramatic-Character-Male | Dramatic-Character-Male | 0.504 | 0.504 | 0.218 |  |
| merchant_female_b_hungry_02.mp3 | Laura | Laura | 0.540 | 0.540 | 0.217 |  |
| npc_mark_hornblower_farewell_01.mp3 | Friendly-Male-Voice | Friendly-Male-Voice | 0.453 | 0.453 | 0.217 |  |
| general_male_exhausted_01.mp3 | Casual-Male-Speaker | Casual-Male-Speaker | 0.494 | 0.494 | 0.214 |  |
| guard_male_b_call_for_help_01.mp3 | Dramatic-Character-Male | Dramatic-Character-Male | 0.524 | 0.524 | 0.213 |  |
| hunter_male_danger_alert_01.mp3 | Arthur-Morgan | Arthur-Morgan | 0.532 | 0.532 | 0.211 |  |
| hunter_male_quest_complete_02.mp3 | Arthur-Morgan | Arthur-Morgan | 0.548 | 0.548 | 0.210 |  |
| guard_male_b_exhausted_02.mp3 | Dramatic-Character-Male | Dramatic-Character-Male | 0.475 | 0.475 | 0.210 |  |
| hunter_male_attention_01.mp3 | Arthur-Morgan | Arthur-Morgan | 0.484 | 0.484 | 0.210 |  |
| merchant_female_warning_01.mp3 | Expressive-Female-Voice | Expressive-Female-Voice | 0.553 | 0.553 | 0.209 |  |
| hunter_male_b_combat_start_01.mp3 | Cowboy | Cowboy | 0.469 | 0.469 | 0.201 |  |
| general_female_b_danger_alert_01.mp3 | Hannah | Hannah | 0.476 | 0.476 | 0.200 |  |
| general_female_b_attention_01.mp3 | Hannah | Hannah | 0.476 | 0.476 | 0.189 |  |
| shepherd_male_b_danger_alert_01.mp3 | Sleepless-historian | Sleepless-historian | 0.611 | 0.611 | 0.184 |  |
| merchant_female_quest_accepted_02.mp3 | Expressive-Female-Voice | Expressive-Female-Voice | 0.479 | 0.479 | 0.183 |  |
| general_female_call_for_help_01.mp3 | Warm-Conversational-Female | Warm-Conversational-Female | 0.569 | 0.569 | 0.182 |  |
| hunter_male_thanks_01.mp3 | Arthur-Morgan | Arthur-Morgan | 0.509 | 0.509 | 0.181 |  |
| hunter_male_farewell_01.mp3 | Arthur-Morgan | Arthur-Morgan | 0.477 | 0.477 | 0.181 |  |
| guard_male_b_danger_alert_02.mp3 | Dramatic-Character-Male | Dramatic-Character-Male | 0.512 | 0.512 | 0.178 |  |
| merchant_female_quest_offer_01.mp3 | Expressive-Female-Voice | Expressive-Female-Voice | 0.487 | 0.487 | 0.175 |  |
| hunter_male_combat_start_01.mp3 | Arthur-Morgan | Arthur-Morgan | 0.525 | 0.525 | 0.167 |  |

