# Shells for Kate — Quest Curation

**Created at:** 2026-10-14  
**Created by:** ChatGPT Sol

**Status:** Accepted author decision (2026-10-14); narrative/design only.

## D-QUEST-39 — KEEP / REWRITE V1 `shells-dla-kasi`

Keep the modest personal errand for the reserved home trader Kate Hornblower (legacy Kasia), without merging it into an unrelated V2 quest. Kate wants three attractive shells to decorate the entrance to her house. The player can provide three shells from ordinary lawful world sources: shoreline gathering, previously held items or trade. The actual three items transfer from the player's inventory to Kate; collection alone does not complete the quest. No quest-exclusive shell spawning, magic item conversion, forced pickup site or arbitrary expiration.

Accept a mix of ordinary `shell` and exceptional `pearl_shell` items (both retained by AD-01). Any exceptional shell qualifies for a stronger personal-relationship reward and a small payment of **5–10 copper**, transferred from Kate's actual available funds, not minted. The suggested **5 copper for one exceptional shell, 10 for two or three** is a *balancing proposal*, not an author-approved exact breakpoint. Handle insufficient funds via the ordinary economic transaction rules, not negative money or fabricated coins.

Ordinary completion improves Kate's relationship; exceptional completion improves it **more**, in addition to the copper. Legacy `+1` / `+2` are relative shorthand, **not locked numerical values**. Calibrate against the actual implemented relationship scale and gift rules when available (M9), ensuring that a completed personal quest gives **substantially more relationship benefit than a trivial gift**, for example more than a single flower. A hypothetical flower gift worth +4 does *not* establish a fixed +8 target. Do not add a new relationship subsystem or collapse personal affinity into settlement reputation.

The gifted shells must later become **persistent, visible decorations near Kate's house entrance**. Kate may place them during her ordinary daily schedule upon returning home; do not teleport or freeze her for the scene. Persist the accepted handover and decoration state through save/load, avoiding duplication, respawn rewards and inconsistent visuals. Prefer the existing shared world/structure decoration and saved-state mechanisms when their implementation is designed; this requirement is not authorization for a separate quest-only decorating engine. The decoration's exact appearance and placement are an M7/world-art implementation detail.

No human violence, mandatory timer or quest-specific AI. This is an authored quest (M7), grounded in the shared item pickup/gathering and inventory paths (M3/M5), settlement NPC schedules (M4), economy/transfers (M8) and calibrated relationship model (M9). These dependencies may require phased implementation rather than building ad-hoc substitutes.

## References

- [V1 quest](../quests/catalog/v1/v1-shells-dla-kasi/README.md)
- [Review 024](../reviews/2026-10-09--024--quests-v1-v2-consistency-review.md), R-26 and §8.3
- [Review 059](../reviews/2026-10-12--059--v1-v2-v3-content-gap-audit.md), AD-01 and AD-41…AD-58
- [Q-012 quest curation](quest-curation-and-q-012.md)
- [Port ledger](../state/PORT-LEDGER.md)
