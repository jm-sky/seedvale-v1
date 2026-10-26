# Boar quests — Medicinal Meadow and Roadside Hollow

**Created at:** 2026-10-13  
**Created by:** ChatGPT Sol  
**Status:** Accepted; this narrative curation pass is closed (implementation and undecided details deferred).  
**Decision:** D-QUEST-21  
**Decided by:** Author (2026-10-13)

## Accepted: keep two separate quests

**V1 `dzik-przy-szlaku`: REWRITE.** Replace the trail-blocking/kill-any-boar plot with a particular boar threatening an actual herb meadow and its **professional herbalist**, a separate NPC (not Ann Woodward). Retain Mark Hornblower as home guard and giver. The medicinal-meadow narrative follows the direction proposed by reference plan 070; this does *not* accept every technical system specified in that legacy plan. The herbalist **lives in the starting/home settlement**. Their name, stable identity and household remain open; finalize stages later.

**V2 Q02 `The Hollow Below the Road`: KEEP SEPARATE.** Edith Fowler investigates a sow with young living beside the H–V road; Bridget Ward must weigh the injured carter, road safety, costs and the farrow's fate. Its clear/reroute/watch outcomes remain candidate paths for detailed author curation, not all final SeedVale decisions.

The two stories concern different incidents and individual animals, with different motivations and cast. Do not merge them just because both feature boars, nor auto-resolve or duplicate rewards across them. Preserve canonical reserved NPC identities (Mark/Peter are not Edith/Bridget).

## Accepted V1 casting refinement (author, 2026-10-13)

The resident affected by the meadow boar **is a herbalist**, not Ann Woodward. Do not reassign Ann's farmer profession or require a special herb-gathering activity for her as part of this quest. The herbalist lives in the starting settlement; their exact identity and household remain open. The original v1 dialogue with Peter as a trail informant is legacy reference and is not a confirmed requirement for the rewrite.

The author does not require a non-lethal boar-deterrence mechanic for this quest. Killing the particular boar can remain the main solution. Luring it to a different habitat with food is only an unapproved optional idea, not a planned mechanic. External death of the same animal may resolve the problem truthfully, but must not falsely credit a player kill.

## Accepted optional hunter assistance (author, 2026-10-13)

The player may ask a **hunter** to assist in hunting the medicinal-meadow boar. Preserve at least two ways of completing the same incident:

- **Solo hunt:** the player resolves the boar threat without hunter help and is eligible for the higher reputation credit for acting independently.
- **Assisted hunt:** a hunter fights alongside the player against the same boar on the medicinal-herb clearing; no animal-tracking stage is needed. The player receives a **smaller reputation bonus** than in the solo version, while successful cooperation can improve the player's **personal relationship with that hunter**. The relationship improvement is possible/conditional, not an automatically guaranteed fixed award.

These are **branches of one quest, not two boars or duplicate quest payouts**. Use player–settlement reputation separately from player–NPC relationship (AD-51). Neither numeric reputation/relationship deltas nor attribution when the hunter delivers the killing blow are decided here. The hunter's canonical identity, the mechanics of fighting alongside the player, availability and whether the hunter receives any in-world compensation remain open; do not automatically assign v2 Jacob Bowman or Edith Fowler solely because of their profession. The herbalist remains a separate home-settlement NPC and the threatened meadow remains the same place.

## Accepted encounter detail (author, 2026-10-13)

The quest boar is already present on the medicinal-herb clearing when the player reaches it. No tracking or searching phase is required. Asking a hunter for help means real assistance during the fight, not receiving directions to the animal. This remains one quest and one particular boar, with the same resolution whether the player fights alone or with the hunter. Exact companion-combat behaviour is an M7 design issue, not a claim that companion combat exists today.

## Accepted simulation-scope guardrail

**A costly, generic fauna-migration or world-problem simulation is *not* a prerequisite for these stories.** It is acceptable to stage an animal encounter with simpler mechanisms. Prefer a believable arrival out of a den/habitat; off-screen relocation/teleportation is an allowed fallback where useful. Do not visibly pop an animal into the player's view, contradict an active observed encounter, or resurrect an already-resolved animal solely to restart a plot.

Keep meaningful persistent outcomes and avoid duplicate incidents. Reuse existing fauna and quest primitives where practical, but do not commit to implementing the entirety of plan 070's persistent-habitat, NPC profession or world-problem framework. Encounter staging is a future design/implementation choice, not a claim that a spawning feature exists today.

## Open detailed design

- V1: the home herbalist's identity and precise motivation; when the boar is presented on the clearing; solo versus hunter-assisted combat and action attribution; hunter identity/relationship trigger, adjusted reputation and normal reward calibration; external resolution; whether the legacy defense book fits. Non-lethal baiting is optional only and not required.
- Q02: exact choice/ending set, young animals' outcome, any road changes or escort representation, Edith/Bridget's consequences, local treasury and reward tuning.
- Shared: authoritative incident identification, quest completion/credit, save/load, real item/money transfers, local relationships/reputation; follow AD-41…AD-58 and current canon. Legitimately different contributions can earn separate rewards.
- No gameplay implementation until M7.

## Curation close (author, 2026-10-13)

The author ended this quest-curation conversation. The accepted choices above are final for this pass; do not present undecided helper identity, exact reward values or later Q02 writing as if they were approved. Carry those as open details for future M7 planning. No game code is changed by this curation.

## Evidence

- [V1 quest](../quests/catalog/v1/v1-dzik-przy-szlaku/README.md); [V1 medicinal meadow plan 070](../reference/quests/progression-plans/v1/quests-progression-070-boar-at-the-medicinal-meadow-systemic-settlement-problem.md) (imported reference).
- [V2 Q02](../quests/catalog/v2/q02-the-hollow-below-the-road/README.md) (imported proposal).
- [Consistency review 024](../reviews/2026-10-09--024--quests-v1-v2-consistency-review.md) R-20; [Final Audit Synthesis 059](../reviews/2026-10-12--059--v1-v2-v3-content-gap-audit.md) AD-41…AD-58; [Q-012](quest-curation-and-q-012.md).
