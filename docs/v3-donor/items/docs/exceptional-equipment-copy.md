# Exceptional equipment — description and lore editorial pass

**Status:** `draft`
**Created:** 2026-10-15
**Domain:** items, narrative content
**Roadmap:** Track B item catalogue; M3/M5 item presentation
**Depends on:** [items--004](../plans/items--004--equipment-data-and-browser.md), [equipment curation](../comparison/items-equipment.md), D-NPC-23 sword boundary
**Finished:** —

The current catalogue has one- or two-sentence `description` for each item and a separate one-line `lore` for 15 masterwork, legendary or unique pieces. The item browser displays **both** fields. Several pairs repeat the same combat comparison, while some imply guaranteed results (one-blow kill, turning spears) that the data does not establish. These are proposed **English replacement strings**, not a balance change, item instance, provenance ruling or approved world history. Track B owns `src/game/data/items/`; this pass changes no catalogue code.

For this pass, `description` explains the object and a credible handling cost. `lore` gives one restrained trace of making, ownership or uncertain tradition. The V2 `tiered(...)` text is the source for 14 of these items; `pinewatch_longsword` had no V2 lore and its current unique history is V3 writing. V1's Polish descriptions informed the merged catalogue but are not carried verbatim. New history below is **fictional draft copy** and needs content review before it becomes canon; neither a place-like item name nor a legacy tier makes a location, maker or former owner part of the current world.

## Proposed copy

| Item ID | Proposed `description` | Proposed `lore` | Editorial note |
|---|---|---|---|
| `ashgrove_dagger` | A slim steel dagger with a fine point. Light in hand, but its thin edge asks for care. | A river-guard captain once carried a blade made to this pattern; the maker's name is lost. | Keeps the V2 captain precedent as an uncertain pattern history, without assigning this instance to a current actor. |
| `kestrel_dagger` | A short, keen dagger that answers quickly in the hand. Its narrow blade will not endure rough use. | The old account gives it three owners and no explanation of how it passed between them. | Separates the V2 three-owner story from durability. |
| `pinewatch_longsword` | A long, carefully balanced sword with a keen edge. Its reach still asks for two hands. | One blade was made for the pine-watch of the northern pass; the records name no second. | Retains current unique premise as draft lore; **does not identify E01's sword** or Q12's sword. |
| `millbrook_shortsword` | A broad short sword that carries more weight into a cut than its length suggests. | A militia smith saved a good piece of steel for this blade and kept the plain hilt. | Replaces the repeated damage/stamina comparison with a modest making story. |
| `harrow_shortsword` | A short sword with a heavy blade and a fine edge. The weight makes each swing deliberate. | It was recovered from a ruined watch post, though no one agrees how long it lay there. | Keeps V2 ruined-watch provenance as uncertain, without placing a new ruin. |
| `fenmoor_sword` | An arming sword with extra steel through the body of the blade. Steady in a cut, heavy over time. | Its maker spent the best work where blade meets hilt; the rest was left plain. | Craft detail replaces the current description/lore echo. |
| `ironvale_sword` | A long, keen arming sword. It reaches farther than most one-handed blades and asks more of the arm. | Its drowned-estate story is repeated often; no one has produced an owner's mark. | Retains V2 hearsay as hearsay, not a confirmed estate or reward site. |
| `stonebridge_longsword` | A long two-handed sword with a substantial grip. Its weight rewards a measured swing. | The grip has been bound again since the blade was made; whoever used it expected a working weapon. | New physical-history proposal; check the eventual model before adopting the grip detail. |
| `greywatch_longsword` | A great weight of steel with a long cutting edge. It is slow to bring around and hard to ignore. | Old stories call it a watch blade, but never agree on the watch or the hand that held it. | Removes V2's unsupported one-blow guarantee. No watch site is canonized. |
| `marlow_longbow` | A yew longbow with a demanding draw. It sends an arrow cleanly, though drawing takes time. | The bowyer left the stave to season through two winters before shaping it. | Replaces the repeated projectile-speed claim with craft history. |
| `yewmaster_longbow` | A heavy war bow of yew. Drawing it well takes strength and practice. | Its first bowyer is unnamed; the careful taper is the only signature left. | Avoids claiming only a hunter can use it or implying a skill gate. |
| `stoneford_mail` | A tightly riveted mail shirt. It gives firmer coverage than common mail at a cost in weight. | The rings were set by more than one hand; the later repairs are as careful as the first work. | New repair history replaces copied protection text. No maker or site assigned. |
| `kingsbane_hauberk` | A double-ringed mail coat built for hard service. It is strong protection and a burden to wear. | It came out of a fallen garrison; the name attached to it later. | Preserves V2 garrison origin as draft, without saying it turns every spear or has killed a king. |
| `ravenmoor_cuirass` | A carefully hammered breast- and backplate. It spreads a heavy blow, but its weight slows the wearer. | The plates were worked smooth again after use; their maker valued repair over ornament. | New repair history replaces identical description/lore. Check model finish before use. |
| `marshal_cuirass` | A heavy steel cuirass with broad coverage. It takes punishment and makes its wearer carry every step. | It was kept after its marshal died; the account says little of the person beneath it. | Keeps V2's dead-marshal premise without a mace-proof claim or named campaign. |

## Decisions before catalogue integration

- Keep the existing `id`, name, tier, availability, stats and legacy IDs. This pass edits words only; no item's rarity or ownership is changed.
- Confirm the new physical details against item art when the item has a distinct model. If a grip, repair, taper or finish cannot be shown or plausibly inspected, revise its lore to an oral account instead.
- Resolve E01's actual sword ID and ownership separately under D-NPC-23. None of these rows allocates that sword, creates a second instance or connects it to Q12.
- Review place-like names and V2 historical hints as fiction before using them in a quest or on a map. Their presence in an item string is not evidence that the corresponding location exists.
- Once Track B accepts a row, change `description` and `lore` together so the item browser does not show a new sentence beside its old duplicate. The text remains readable even without audio.
