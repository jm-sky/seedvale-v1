# Plan: Lifecycle — Mounted Livestock Reference

**Created:** 2026-09-21
**Status:** `draft` 📝
**Type:** fix
**Priority:** high · **Effort:** S
**Depends on:** ~~items-player-057~~, ~~settlements-npcs-048~~  
**Owns residual from 057:** collision-safe mounted identity only (`PersistentLivestockRef` on `MountActions` / `SavePlayer.mountedAnimalId`). 057's lifecycle slice is delivered; do not duplicate it here.
**Domain:** `items-player`
**Subdomains:** `interaction`
**Tags:** `lifecycle` `mount` `livestock` `persistence`

## Cel

Przenieść durable player-mount relation z bare `animalId` na canonical collision-safe livestock identity, aby save/load i same-world rebuild zawsze reattachowały dokładnie to samo zwierzę.

## Problem

Shared livestock lifecycle ma już `PersistentLivestockRef { settlementId, animalId }`, `persistentLivestockKey()` i ref-aware resolver, ale `MountActions` oraz `SavePlayer.mountedAnimalId` nadal przechowują tylko bare id.

Przy kolizji id między osadami restore/rebuild może rozwiązać relację do niewłaściwego live animal.

## Zakres draft

Po reconie plan powinien ustalić:

- docelowy persisted shape mounted relation,
- runtime pending restore representation w `MountActions`,
- jak pozyskać origin/namespace przy realnym mount action,
- ref-aware restore i rebuild reattach,
- migration istniejących save'ów z bare `mountedAnimalId`,
- fallback semantics dla legacy save, którego bare id jest potencjalnie niejednoznaczne,
- test collision dwóch settlement livestock o tym samym `animalId`.

## Guardrails

- Reuse `PersistentLivestockRef`, `persistentLivestockKey()`, `resolveLivePersistentAnimalByRef()` i shared livestock registry.
- Nie tworzyć mount-specific identity ani drugiego livestock registry.
- Live `AnimalAgent` pozostaje runtime handle; durable relation ma być plain identity.
- New Game nadal czyści relation bez gameplayowego dismount side effect.
- Same-world rebuild zachowuje durable relation, ale nigdy disposed live handle.
- Dodać JSDoc do nowych publicznych identity/lifecycle seams; gdy pomaga preflightowi użyć `@domain items-player`.

## Out of scope

- merchant pack-animal off-screen continuity (`settlements-npcs-057`),
- redesign riding gameplay,
- globalna zmiana wszystkich animal ids,
- browser verification przez AI.

## Verification

AI agent: collision-safe save/load/rebuild tests, legacy migration tests, New Game reset regression, typecheck/build. Użytkownik: mount → save/load i mount → same-world rebuild.

## Recon do wykonania przed przejściem na planned

Uzupełnić o aktualny `SavePlayer` schema/version, `MountActions` call-sites, ref-aware API w `SettlementsManager/livestock.ts` i sposób ustalania origin dla mountowanego livestock.

> **Zrób git commit i push do main, rebase jeżeli trzeba**
