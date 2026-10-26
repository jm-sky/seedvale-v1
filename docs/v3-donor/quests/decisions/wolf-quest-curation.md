# Wolf Quest Curation Decision

**Created at:** 2026-10-10  
**Created by:** ChatGPT Luna

**Status:** Accepted narrative direction; individual quest rewrites remain curation work.

## Decision

Treat the wolf quests as two narratively distinct threads, with a causal story link between them. Their eventual locations are **not decided yet**: they must be chosen after the canonical geography is known and reviewed. The link is authored narrative; it does **not** require a fauna-migration simulation system.

### Greybeard (v2 G07; location undecided)

Keep G07, **Trail of Greybeard**, as the longer, personal wolf story. Its focus is Jacob, his family, and the specific old grey wolf. Do not assign it to the east or any other compass direction until the canonical geography has been established.

The wolf being dealt with frees its territory in the story. The resulting movement of a larger pack and its later attacks are narrative consequences, not a requirement to implement or extend systemic fauna migration.

### Settlement — wolves under pressure (v1 `wilki-pod-osada`; location details undecided)

Rework **Wolves Under the Settlement** as a follow-on story after the Greybeard thread: a larger pack starts threatening the settlement, and the player must deal with the wolves and destroy their den or dens.

The prerequisite and cause can be conveyed through authored quest sequencing, dialogue, and world narrative. Do not build simulation mechanics solely to produce this plot beat.

### Possible separate short wolf thread (v1 `grozny-wilk` and `wilcza-jama`; location undecided)

Do not preserve the old v1 chain unchanged, because it overlaps mechanically with other den quests and with G07's wolf story.

**Decision (author, 2026-10-10):** keep both quests as a short, separate thread about a different dangerous wolf: first encounter the dangerous wolf (`grozny-wilk`), then find and clear its den (`wilcza-jama`). Their location relative to the settlement and Greybeard is undecided and must fit the canonical geography. Preserve the two-step structure only if the curated objectives remain meaningfully distinct; do not add extra stages merely to keep both records.

### Wolves at the Merchant — merged into the settlement thread

**Decision (author, 2026-10-10):** merge **Wolves at the Merchant** (`wilki-u-kupca`) into **Wolves Under the Settlement** (`wilki-pod-osada`). They concern the same wolf-den incident, so do not preserve `wilki-u-kupca` as a separate quest or a separate den problem.

Kasia remains a distinct quest giver with her own reason to care: wolves threaten the merchant's horse. Preserve that motivation as an additional narrative perspective or objective within the curated settlement-wolves thread. One world event, including destruction of the den, may resolve multiple quest objectives; this is acceptable and is not by itself a conflict.

This merge does not settle reward stacking or implementation details. Curate the horse outcome and rewards so they fit the unified thread, without treating duplicate completion by one event as inherently invalid.

### Generated wolf-den pressure — D-QUEST-16 resolved at author-policy level (2026-10-14)

**Accepted:** [D-QUEST-16](quest-incident-arbitration-contract.md) follows the concrete world **incident/den occurrence** and compatible resource claims. A generated `world:wolf-den-pressure` notice must **not create another copy of the particular den or compete to perform its exclusive physical clearing** if that same incident is already owned or reserved by an authored story. It may refer to the existing incident as a compatible information/objective perspective; different authored entitlements may pay separately **once each**, while identical entitlements do not pay twice. An actually **different** wolf den, nearby wolf activity, or new future den-pressure occurrence remains eligible. Never suppress by proximity, shared species or the blanket existence of an authored wolf quest.

The original 2026-10-10 question was open until [Review 095](../reviews/2026-10-14--095--pre-m7-quest-architecture-incident-arbitration-review.md) and the author's 2026-10-14 approval. This closes the **product-policy decision**, **not** the Opus architecture review of exact interfaces, live runtime or M7 implementation. Review 024's static imported-source findings are not proof of current V3 quest behaviour.

## Curation guidance

- This decision concerns quest content and narrative direction, not implementation of the quest engine. Quest-system implementation remains gated by M7.
- Do not require simulated migration, territory displacement, or pack-level ecology merely to justify the story.
- Use authored narrative for causes and consequences that do not need a gameplay system.
- Treat all compass directions and precise quest-site locations as open until canonical geography is authored and reviewed. Do not infer geography from imported quest descriptions.
- Keep the imported quest records as historical sources; record curation outcomes rather than deleting source material.
- Do not change the imported quest metadata status from `verification needed` as if this decision were an implementation or runtime verification.

## Source material

- [Review 024 — Quest Consistency Review: v1 and v2](../reviews/2026-10-09--024--quests-v1-v2-consistency-review.md)
- [G07 — Trail of Greybeard](../quests/catalog/v2/g07-trail-of-greybeard/README.md)
- [Dangerous Wolf](../quests/catalog/v1/v1-grozny-wilk/README.md)
- [Wolf Den](../quests/catalog/v1/v1-wilcza-jama/README.md)
- [Wolves Under the Settlement](../quests/catalog/v1/v1-wilki-pod-osada/README.md)
- [Wolves at the Merchant](../quests/catalog/v1/v1-wilki-u-kupca/README.md)
