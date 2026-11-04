# Implementation notes: Equipment body layout

**Plan:** ui-input-045 · **Date:** 2026-11-04

- Follows review 032 F10 and 044-M: shoulders and forearms are real equipment keys. Grid geometry and narrow order follow the approved contract. `EquipmentSlotCell` renders armor and held actions; shield is non-interactive N/A. All commands still use existing InventoryScreen handlers.
- `equipmentLayout.ts` owns only presentation order/areas; catalog/state remain equipment authorities. Preview `targetSlot` is forwarded in desktop and mobile inventory views and both demo views.
- Verified: seven focused tests (layout + equipment preview), Vue type-check, scoped ESLint, production build. No browser check performed.
- Manual pending: desktop grid, narrow order/tab navigation, long label truncation/title, preview ring including forearms, select/unequip armor and held, primary shortcuts/ammo below grid. Demo: `/inventory-list-demo.html`; game reference seed `415424794`.
- No prior implementation notes existed; preflight confirmed only the panel/screen/demo owner cluster.
