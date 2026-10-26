# Lost Parcel — Family Impersonation Curation

**Created at:** 2026-10-13  
**Created by:** ChatGPT Luna  
**Updated at:** 2026-10-13  
**Updated by:** ChatGPT Luna  
**Status:** Accepted author decision; detailed design remains planned.  
**Decision:** D-QUEST-20  
**Decided by:** Author

## Decision and rationale

Retain and rewrite v1 `zaginiona-przesylka` as one branching authored quest about criminals impersonating Kate's distant relatives. Replace the old private-letters-versus-guard dilemma, dialogue and reward logic.

Kate is an honest, important character. This story must not make her a fraudster or morally ambiguous, create a marital conflict with Mark, or require her to leave the settlement on a dangerous journey. No quest path may put her at risk of death. Mark and Kate cooperate once the fraud is exposed.

Kate wants to buy Mark a special gift: a decorated, well-made shield with personal significance, not necessarily a legendary item. The recovered correspondence concerns its purchase through a seemingly legitimate trade offer from people claiming to be her distant relatives. Kate trusts the claimed family connection; the criminals seek an advance payment. The player can show the letter to Mark or return it to Kate.

Even if the player gives the correspondence to Mark, Kate initially describes it as ordinary trade and says she knows the people involved. Her explanation protects the surprise, not criminal activity: she does not knowingly cooperate with the fraud or deceive him to harm him. Mark nevertheless detects the impersonation from the evidence. Write this as affectionate discretion and practical investigation, without marital conflict.

## Agreed opening and evidence (author, 2026-10-13)

Kate awaits a reply about the gift commission. A messenger loses a packet of correspondence on the trail, and the player finds it. Kate remains in the settlement; finding the packet must not depend on her travelling.

The forged offer claims a distant relative can arrange the equipment commission. The impersonators know real family names and details, making Kate's trust plausible.

If the player returns the correspondence to Kate, she explains the intended surprise. If it goes to Mark, she describes ordinary trade and says she knows the senders. Mark identifies a concrete discrepancy based on information Kate did not have: for example, he recently met the real relative and knows they no longer operate the claimed workshop. This example is a writing candidate; establish the exact evidence in final dialogue.

Returning the correspondence to Kate does **not** immediately lock in the financial loss. The fraud can still be exposed before payment, including through the travelling merchant's clue. Kate's advance comes from her own money, not settlement funds or the player's purse.

## Branch A — Early detection

Mark immediately recognizes concrete inconsistencies in the letter and explains why the senders cannot be Kate's relatives. Choose credible, specific clues during writing rather than giving him unexplained omniscience.

With Kate informed and cooperating, the player and guard can arrange a controlled advance-payment handoff, follow the messenger and uncover the criminals. This branch offers a chance to catch them and a bonus for preventing the loss. Exact handoff, investigation, arrest and reward details remain open.

## Branch B — Fraud proceeds, then recovery

If the correspondence is returned to Kate and the impersonation remains undiscovered until payment, the transaction proceeds. A messenger can collect the advance while Kate remains in the settlement.

Kate loses money when the fraud succeeds. This leads to a distinct climax: the player investigates the criminals and attempts to recover the stolen funds, with Kate and Mark cooperating. Provide a discoverable lead; do not turn this branch into an empty failure.

Returning Kate's own correspondence does not automatically reduce her relationship with the player. The player was not necessarily able to identify the fraud.

## Travelling merchant — Optional clues and referral

A travelling merchant can help in either branch:

- Before payment, they recognize the messenger's description and recall that the same person used a different name in a neighbouring settlement. This is suspicious evidence to investigate with Mark, not automatic proof that every alias is criminal.
- After the fraud, they report where they saw the messenger or the messenger's wagon, providing an actionable investigation lead.
- They can recommend the reputable blacksmith who makes the genuine gift.

The merchant is helpful but not mandatory: their absence must not block progression. The messenger leaves an alternative discoverable lead; its concrete form and placement remain for detailed design. The merchant's information must come from plausible encounters and shared world knowledge, not omniscience.

## Shared finale — A genuine gift

After the fraud problem is resolved, the player and Kate find a reputable blacksmith who makes the intended gift for Mark. Mark is delighted. Both successful branches lead to this positive finale; early detection does not bypass it.

The blacksmith adds an extra piece of equipment of his own accord. Mark gives that extra item to the player as thanks for helping Kate and resolving the problem. The extra equipment is a pair of good pauldrons/shoulder armour; exact stats, quality tier and value remain for balancing. The main gift belongs to Mark; the extra is the player's tangible reward.

The intended surprise may already be partly revealed in the early-detection branch; that must not block commissioning the genuine gift or Mark's delight at receiving it. Exact dialogue remains open.

Crafting, payment, ownership and the extra gift must fit real item transfers and the economy. Do not automatically grant a powerful weapon or duplicate items as a quest-only payout. Equipment type, quality and value need balancing.

## Shared constraints

- Both paths belong to the same concrete fraud incident, not duplicate quest inventories.
- Both paths offer a meaningful adventure; early detection has an advantage without removing the later recovery route.
- Human combat is not required: investigation, tracking, surrender or guard-led apprehension can resolve the case, consistent with existing canon.
- Money paid, intercepted or recovered must use actual world transfers; recovering Kate's money is distinct from the player's reward and must not duplicate currency.
- Use shared quest, dialogue, knowledge, relationship, item and economy systems; preserve incident and branch state through save/load when implemented.
- This decision does not decide the disposition of v2 G06 `Trader's Letter`; its separate trade-price story remains subject to curation.

## Open detailed design

Quest title; forged relatives and exact credible letter clues; shield identity, decoration, personal meaning and quality; reputable blacksmith and commissioning terms; pauldrons' stats, value and provenance; travelling merchant identity, encounters and the alternative messenger lead; advance amount; messenger and criminal identities; locations; evidence and handoff steps; timing and interruption; partial recovery/failure outcomes and their effect on the gift finale; prevention bonus; final English dialogue.

This is a narrative/curation decision, not an implementation task. Quest-system implementation remains gated by M7; coordinate shared dependencies with their owning milestones.

## Reference

- [Imported v1 Lost Parcel](../quests/catalog/v1/v1-zaginiona-przesylka/README.md) — old behaviour, not the rewritten canon.
- [Quest curation and Q-012](quest-curation-and-q-012.md) — identity and reconciliation rules.
- [Consistency review 024](../reviews/2026-10-09--024--quests-v1-v2-consistency-review.md) — advisory comparison.
