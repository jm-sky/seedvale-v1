# Implementation Notes: ui-input-035 NPC label icon row and debug controls

## Current ownership / call sites

- `src/ui/agentStatusLabel.ts` is the shared CSS2D label owner for NPCs and fauna. Keep layout, icon DOM, guarded writes, distance fading and observation presentation here.
- `NpcAgent` currently computes `displayName` once from `character.name + lastName`, creates the shared label with that string, stores quest/shop marker tokens on the agent, and passes them into `AgentLabelObservationPresentation` every update.
- `src/app/npcQuestMarkerSync.ts` remains the quest synchronization owner. Preserve its dirty-state + new-sink lifecycle; do not add per-frame quest scans.
- `src/ai/npcVendor.ts` owns recognizable vendor identity. `resolveNpcVendorKind(role)` is the semantic source; `NPC_VENDOR_MARKER = '◈'` / `npcVendorMarker()` are presentation leftovers that can be removed once all callers/tests migrate.
- `src/app/createApp.ts` owns the transient label debug object. Today it is `{ fullLabelInfo: isDebugMode() }` and is read by the game-loop observation callback.
- `src/ui/createDebugGui.ts` already creates a debug-only `Labels` folder when `isDebugMode() && labelDebug`; extend this instead of adding query-only configuration.

## Quest icon: preserve semantics exactly

`QuestManager.labelMarker(npcId)` already reduces concurrent quest contexts with this priority:

```text
? required action now
✓ ready/report/hand-in
! offered/exposable
… active reminder
null
```

Keep `labelMarker()` and `npcQuestMarkerSync.ts` behavior unchanged if practical. The lowest-risk seam is to keep the sink value as the existing marker token and map that token to icon presentation at the NPC/UI boundary. Do not move quest-state interpretation into `agentStatusLabel.ts`.

The four values are intentionally distinct and priority-sensitive; do not collapse to `hasQuest`.

## Icon-row API

Prefer one shared slot API in `agentStatusLabel.ts`:

```ts
type AgentLabelIconSlot = 'activity' | 'quest' | 'shop'

type AgentLabelIconPresentation = {
  icon: AgentLabelIconKind
  color?: string
  title?: string
} | null
```

Implementation can use an equivalent discriminated shape, but keep these properties:

- fixed slot order is owned by the label renderer;
- each producer updates only its own slot;
- controller caches the last presentation per slot;
- hiding one slot removes/hides only that slot, not the whole row;
- the row hides when all slots are empty.

This is preferable to rebuilding an icon array each frame because quest/shop/debug activity change at different cadences.

## Shop slot: intentionally minimal

For this plan, shop state is only:

```text
resolveNpcVendorKind(role) != null -> show Lucide Chart
otherwise -> no shop icon
```

Do not inspect `resolveNpcTradeOffers()`, stock, artisan orders, `NpcAuthoritativeState.artisanOrders`, or availability cadence. The generic icon presentation type is already enough future extension seam.

Preserve current observation gating: the shop icon replaces the old vendor marker presentation and should remain detailed/full-label-only exactly as `vendorMarker` is today.

## Observation presentation migration

`AgentLabelObservationPresentation` currently carries `questMarker` and optional `vendorMarker`, and `resolve/applyAgentLabelObservationPresentation` owns their visibility.

Keep that gating centralized. A safe migration is:

- resolve observation level first exactly as today;
- derive visible quest/shop slot presentations from the resolved presentation;
- do not let direct `setIcon()` calls bypass observation rules for gameplay icons;
- debug `activity` is the only deliberate developer-only bypass.

Be careful that fauna also uses this shared controller. Its callers must continue working without NPC-only name/icon data.

## Debug activity icon

`NpcAgent.getCurrentActivity(timeOfDay)` is already the stable public projection over private phase/action state. Use it rather than reading `phase` in UI code.

For `kind === 'need'`, use the provided `need`; otherwise map `CurrentActivityKind` to the debug icon. `getActiveNeed()` exists but should only be needed as a fallback, not as a second activity resolver.

Keep the activity/need -> Lucide/color mapping in one presentation helper/module. Avoid switches duplicated between `NpcAgent` and the DOM renderer.

The update path is already per-frame, so rely on controller equality guards rather than adding another scheduler.

## Debug controls wiring

Extend the existing object in `createApp.ts`, e.g.:

```ts
{
  fullLabelInfo: isDebugMode(),
  showNpcActivityIcon: false,
  showNpcDiagnosticText: false,
}
```

Important current behavior: `?debug=1` initializes `fullLabelInfo` to true. Preserve that unless deliberately changing the existing debug experience.

`createDebugGui.ts` can bind directly to the mutable object, matching the current `fullLabelInfo` pattern. A callback is only needed when a toggle requires immediate side effects beyond the normal next-frame label update.

Thread the two new booleans through the existing game-loop/NPC update observation/debug context rather than introducing globals. `NpcAgent.updateDebugLabel()` should gate on the dedicated diagnostic flag, not `isDebugMode()`.

Current `lastFullLabelInfo` also controls the poisoning detail appended to the debug line. Keep that semantic: diagnostic visibility and full-information detail are separate axes.

## Name presentation / prefix-suffix caveat

Current canonical identity remains:

```ts
name = character.name
displayName = character.lastName ? `${name} ${lastName}` : name
```

There is also `src/ai/npcSocialTitle.ts`: `elderSocialDisplayName()` produces contextual dialogue headings such as `Pan ...`, `Dziadek ...`, `Stary ...` as a complete string. It explicitly does not mutate canonical identity.

Do not parse `elderSocialDisplayName()` output into prefix/name/suffix and do not make it label state in this plan.

The structured label-name API is a presentation seam only. For current NPCs it may be populated as:

```ts
{ name: displayName }
```

until a future gameplay rule supplies a real prefix/suffix. This keeps this refactor from silently changing dialogue/social-title behavior.

If prefix/suffix are wired now for a specific existing source, that source must provide structured data directly; never infer by splitting strings.

## Lucide rendering

The repo currently depends on `@lucide/vue` and `lucide-vue-next`, while CSS2D labels are vanilla DOM.

Do not create a Vue app/component tree per NPC label. Before adding any dependency, inspect the installed Lucide package exports. Prefer a tiny shared DOM/SVG adapter using existing exports; if the Vue packages do not expose a clean raw-icon form, keep the adapter narrowly scoped rather than adding a second icon system.

Create SVG only when a slot's icon identity changes; color changes can use `currentColor` / CSS.

## CSS / layout

Current global styles are in `index.html`:

- `.npc-label` column layout;
- `.npc-label__name-row` max-width `16ch`;
- marker pseudo-elements inject `" · "`.

Add the icon row before the name row and delete marker separator rules once old marker DOM is gone. Use a fixed icon size and compact gap; avoid changing the existing label distance/fade behavior.

Long structured names need deliberate overflow behavior. Preserve ellipsis on the main name; prefix/suffix should not accidentally make the entire CSS2D box unbounded.

## Suggested implementation order

1. Add icon presentation types + icon-row DOM/controller support in `agentStatusLabel.ts`, keeping fauna compatibility.
2. Move quest presentation into the `quest` slot while retaining `QuestManager.labelMarker()` and sync lifecycle.
3. Replace `npcVendorMarker()` label use with `resolveNpcVendorKind()` -> shop `Chart` presentation.
4. Add structured name DOM/API, initially feeding current `displayName` as the main name.
5. Extend label debug state and GUI; gate diagnostic text independently.
6. Add activity/need debug presentation through the existing NPC update path.
7. Remove obsolete text-marker DOM/CSS/constants/tests.

## Tests / regressions

Prefer focused unit tests around pure presentation mapping and existing marker-sync tests. Important cases:

- all three slots coexist in fixed order;
- quest token mapping preserves `? > ✓ > ! > …` output semantics supplied by QuestManager;
- shop icon exists only for `resolveNpcVendorKind(role) != null`;
- shop remains hidden under the same observation levels as the old vendor marker;
- changing one slot does not recreate unrelated slots;
- activity and diagnostic toggles are independent;
- simple name remains unchanged; structured prefix/suffix DOM works without parsing strings;
- fauna label construction still works without NPC icons/name parts.

Do not expand tests into trade stock/order behavior; that is explicitly out of scope.
