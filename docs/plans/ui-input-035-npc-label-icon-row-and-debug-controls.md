# Plan: NPC label icon row and debug controls

**Created:** 2026-09-21
**Status:** `planned` 📋
**Priority:** medium · **Effort:** M
**Depends on:** none
**Domain:** `ui-input`
**Type:** `refactor`
**Subdomains:** `hud` `feedback`
**Tags:** `npc-labels` `quest-markers` `debug` `lucide`
**Roadmap:** -

## Goal

Refactor floating NPC labels into a clearer presentation structure:

- quest marker above the NPC name as a Lucide icon,
- shop marker in the same icon row, using Lucide `Chart` instead of the current text token `◈`,
- optional debug need/activity icon in the first icon slot,
- NPC name split into prefix / main name / suffix presentation,
- detailed NPC diagnostic text controlled independently from global `?debug`,
- debug label controls exposed through the existing Debug GUI.

Target layout:

```text
[ activity/need ] [ quest ] [ shop: Chart ]
        Stary Jan Kowalski Starszy
                 status bars
           optional debug text
```

Quest/shop icons remain gameplay presentation. Activity/need is debug-only.

## Current implementation

### Shared label owner

`src/ui/agentStatusLabel.ts` owns the shared CSS2D label for NPCs/fauna.

Today `createAgentLabel()` builds one `.npc-label__name-row` containing:

- name,
- quest marker,
- shop marker,

followed by bars and optional assessment/debug text.

The controller already owns guarded DOM writes, distance fading, observation presentation and debug text. Extend this owner instead of creating a parallel NPC-only label renderer.

### Quest marker lifecycle

`src/app/npcQuestMarkerSync.ts` owns quest-marker projection onto loaded NPC runtime sinks. It already handles:

- quest dirty state,
- newly-created runtime NPC sinks,
- `WeakSet` lifecycle tracking.

Keep that lifecycle. Only adapt the sink/presentation contract as needed.

### Vendor identity

`src/ai/npcVendor.ts` owns semantic vendor identity through:

```ts
resolveNpcVendorKind(role)
```

The current presentation token:

```ts
NPC_VENDOR_MARKER = '◈'
```

is presentation-only and should no longer be the source used by labels.

### NPC activity / need data

`NpcAgent` already exposes current state through existing mechanisms including:

- `getActiveNeed()`,
- `getCurrentActivity()`,
- existing active need / action / phase state.

Do not recompute decision state in UI.

### Debug GUI

`src/ui/createDebugGui.ts` already owns label-related debug control through `labelDebug.fullLabelInfo` and `onFullLabelInfoChange`.

Extend that mechanism rather than adding another debug settings system.

### Lucide

Lucide dependencies already exist in the project. CSS2D labels are vanilla DOM, not Vue components; do not mount Vue per NPC just to render icons.

## Presentation structure

Refactor the label DOM into:

```text
.npc-label
  .npc-label__icon-row
  .npc-label__name-row
    .npc-label__name-prefix
    .npc-label__name-main
    .npc-label__name-suffix
  .npc-label__bars
  .npc-label__assessment
  .npc-label__debug
```

The icon row appears above the name.

### Icon slots

Use stable semantic slots rather than arbitrary appended DOM nodes:

```ts
type AgentLabelIconSlot =
  | 'activity'
  | 'quest'
  | 'shop'
```

Stable visual order:

1. activity / need,
2. quest,
3. shop.

All three may be visible simultaneously. Missing slots must not leave empty spacing.

Prefer an API equivalent to:

```ts
setIcon(slot, presentation)
```

rather than one setter per feature.

## Name presentation

Do not keep NPC display identity as one opaque label string internally.

Introduce a presentation contract equivalent to:

```ts
type AgentLabelNamePresentation = {
  prefix?: string
  name: string
  suffix?: string
}
```

Examples:

```text
Jan Kowalski
Stary Jan Kowalski
Jan Kowalski Starszy
Stary Jan Kowalski Starszy
```

Render prefix, main name and suffix as separate DOM spans.

This enables future styling or observation/knowledge gating without another label-layout refactor.

The label renderer must not invent prefixes/suffixes. It only renders presentation data supplied by the NPC identity/presentation layer.

Preserve compatibility with current simple names during migration.

## Icon presentation contract

The shared label renderer should receive presentation data, not domain state.

Use a small contract equivalent to:

```ts
type AgentLabelIconPresentation = {
  icon: AgentLabelIconKind
  color?: string
  title?: string
} | null
```

Do not make `agentStatusLabel.ts` depend directly on `NeedId`, vendor roles, QuestManager or NPC decision logic.

Map:

```text
domain/simulation state
  -> presentation mapping
  -> agentStatusLabel
```

## Lucide rendering

Add/reuse a small vanilla-DOM Lucide renderer suitable for CSS2D labels.

Requirements:

- SVG created only when icon identity changes,
- use `currentColor`,
- fixed shared icon sizing,
- no Vue app/component per label,
- no repeated `innerHTML` rewrite every frame,
- no new icon dependency.

Important architectural/public helpers should receive concise JSDoc with `@domain ui-input` where useful for preflight discovery.

## Quest icon

Preserve the existing `npcQuestMarkerSync.ts` dirty/sink lifecycle.

Change only presentation as necessary so quest state becomes an icon rather than text inside the name row.

Keep quest domain behavior unchanged. The current quest marker semantics already distinguish:

- available (`!`),
- in progress (`…`),
- ready (`✓`),
- required talk target (`?`).

Preserve those four semantic states and their existing priority/lifecycle. This plan changes only their presentation from text glyphs to Lucide icon/color mapping; do not collapse them to a boolean or redesign quest logic.

Do not change:

- quest availability,
- quest ranking,
- giver caps,
- completion rules,
- QuestManager dirty ownership.

Quest observation gating must remain equivalent to the current behavior.

## Shop icon

Keep this plan intentionally simple.

Use existing vendor identity from `resolveNpcVendorKind(role)` only to decide whether the NPC gets the shop slot.

For every recognizable vendor kind, render one shop icon:

- Lucide `Chart`,
- in the shared icon row,
- after quest,
- above the NPC name.

Do not implement stock, availability, order, or trade-state variants in this plan.

The shop slot API should remain extensible so a later plan can add a semantic variant/state without changing the icon-row structure. A minimal contract equivalent to this is sufficient:

```ts
type ShopLabelIconPresentation = {
  visible: boolean
}
```

or the equivalent representation through the generic `AgentLabelIconPresentation`.

Do not introduce `available`, `out-of-stock`, `order-in-progress`, artisan-order integration, or any new trade polling/cadence here.

Do not use the text token `◈` for label presentation after this refactor.

Preserve current observation gating: shop/vendor identity must not become visible at an observation level where it is currently hidden.

## Debug activity / need icon

Add an optional first slot for NPC debug state.

Use existing NPC state; do not add another simulation query.

Preferred presentation rule:

1. if the current activity is driven by a concrete need, show that need,
2. otherwise show the current activity.

Support the existing activity categories as relevant, e.g.:

- hunger,
- thirst,
- sleep,
- work,
- combat,
- talking,
- wander / idle.

Keep mapping from activity/need to icon/color in one presentation module, not scattered across `NpcAgent`.

Reuse existing need color semantics where they already fit; do not introduce a duplicate palette without reason.

The activity icon is developer-only and may intentionally expose information beyond normal observation gating, but only when its dedicated debug toggle is enabled.

## Debug controls

Extend existing runtime `labelDebug` state to include at least:

```ts
{
  fullLabelInfo: boolean
  showNpcActivityIcon: boolean
  showNpcDiagnosticText: boolean
}
```

Adapt names to current conventions if needed.

Add an `NPC labels` folder/group in `createDebugGui.ts` containing:

- Full label info,
- Activity / need icon,
- Diagnostic text.

### Diagnostic text ownership

`NpcAgent.updateDebugLabel()` currently gates the detailed line using global `isDebugMode()`.

Change that so the line depends on `showNpcDiagnosticText`.

Global `?debug` may still control whether debug tooling/panel is available or initially shown, but it must no longer automatically force verbose text below every NPC label.

Do not persist these debug switches.

Optional query params may be used only as initial overrides if that falls out naturally from current debug plumbing; do not create a parallel URL-config system just for this plan.

## Observation and information gating

Preserve existing gameplay information rules.

- Quest icon: same visibility semantics as current quest marker.
- Shop icon: same visibility semantics as current shop marker.
- Prefix/suffix: follow the same identity/knowledge rules as the name source that provides them.
- Activity/need debug icon: debug-only bypass controlled by its dedicated toggle.
- `fullLabelInfo`: preserve current bypass behavior.

Do not weaken normal observation gating as a side effect of moving DOM elements.

## Performance guardrails

Labels update frequently. Preserve the current write-if-changed approach.

- Do not rebuild the whole icon row every frame.
- Do not recreate unchanged SVG nodes.
- Update one slot only when its presentation changes.
- Do not mount Vue per NPC.
- Do not add per-frame quest scans.
- Do not add per-frame shop/trade availability resolution. Shop visibility is based only on existing vendor identity in this plan.
- Do not recompute NPC needs/activity outside the NPC's existing state.

## Main files / integration points

### `src/ui/agentStatusLabel.ts`

- add icon row,
- add semantic icon slots,
- move quest/shop presentation above the name,
- add structured name presentation,
- preserve guarded DOM updates,
- preserve distance/observation behavior.

### `src/ai/NpcAgent.ts`

- provide structured name presentation,
- provide debug activity/need presentation,
- consume dedicated diagnostic-text toggle,
- keep simulation state ownership unchanged.

### `src/app/npcQuestMarkerSync.ts`

- preserve dirty/sink lifecycle,
- adapt the presentation sink contract only if required.

### `src/ai/npcVendor.ts`

- preserve `resolveNpcVendorKind()`,
- use it only for simple shop-slot visibility,
- stop using `NPC_VENDOR_MARKER = '◈'` for label rendering,
- do not add stock/order state resolution,
- avoid changing trade semantics.

### `src/ui/createDebugGui.ts`

- extend NPC label debug controls.

### Current `labelDebug` owner / composition root

- extend runtime debug state,
- wire new callbacks/toggles,
- avoid WorldBundle rebuild for label-only toggles.

### `index.html`

- add `.npc-label__icon-row` styles,
- add shared SVG/icon sizing and spacing,
- add prefix/main/suffix styles,
- remove quest/shop separators from the name row.

If current code has moved these styles elsewhere by implementation time, follow current ownership rather than forcing changes into `index.html`.

## Tests

Add or extend focused tests for the shared label/presentation behavior.

Cover at least:

1. quest and shop icons coexist,
2. activity + quest + vendor render in stable order,
3. missing slots leave no empty separator/spacing artifact,
4. changing quest presentation does not recreate unrelated icon slots,
5. vendor presentation derives from current vendor identity,
6. diagnostic text and activity icon are independently toggleable,
7. activity icon disappears when disabled,
8. observation gating for quest/shop is unchanged,
9. simple name renders correctly,
10. prefix-only, suffix-only and prefix+suffix name presentations render correctly,
11. changing prefix/suffix does not require rebuilding the whole label,
12. fauna/shared-label callers continue to work without NPC-only data.

## Technical verification

Run the smallest relevant automated set, including:

```bash
pnpm run type-check
pnpm run test
```

Run lint for the changed scope when appropriate.

Do not manually run `pnpm docs:sync`; generated documentation is handled by the repository workflow.

## Manual verification by user

User verifies in browser:

- ordinary NPC without icons,
- NPC with quest icon,
- vendor without quest,
- vendor with quest,
- activity/need debug icon,
- all three icon slots simultaneously,
- plain name,
- prefix + name,
- name + suffix,
- prefix + name + suffix,
- toggling activity icon and diagnostic text live,
- `Full label info` on/off,
- label fading with distance,
- no visual jumping when icons appear/disappear,
- no clipping for a realistic longer name such as `Stary Jan Kowalski`.

AI agent does not perform browser verification.

## Non-goals

This plan does not include:

- quest availability/ranking changes,
- shop/vendor/trade mechanic changes,
- shop stock availability states,
- out-of-stock presentation,
- artisan/player-order status presentation,
- new NPC needs or activities,
- decision-system changes,
- new observation/perception rules,
- migrating CSS2D labels to Vue,
- redesigning fauna labels beyond compatibility with the shared label component,
- persistence for debug settings,
- defining gameplay rules for which NPCs receive specific prefixes/suffixes.

## Definition of done

- Quest marker is above the NPC name as a Lucide icon.
- Vendor marker is in the same icon row and uses Lucide `Chart`.
- Optional activity/need debug icon occupies the first slot.
- All three slots can coexist.
- Quest/vendor are no longer embedded in the name row.
- Name presentation supports separate prefix, main name and suffix.
- Existing simple-name callers remain supported during migration or are coherently migrated.
- Diagnostic text has its own debug toggle.
- Global `?debug` no longer forces NPC diagnostic text.
- Quest dirty sync and observation gating remain intact.
- Label updates preserve guarded DOM writes.
- No parallel label/debug state system is introduced.

> **Zrób git commit i push do main, rebase jeżeli trzeba**
