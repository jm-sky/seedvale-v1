# Sesja: Stage F follow-ups — currency display + capability dropdown

**Status (2026-10-27):** both follow-ups **landed** (presentation-only). Visual PASS still author screenshots.

## Done
1. **Currency:** `formatCoins` in `src/ui-vue/lib/formatCoins.ts` — `coin` inventory count = copper; Stage F leaves + demo show `g`/`s`/`c` (Sakiewka). No save/schema change.
2. **Capability filter:** custom dropdown (`MerchantFilterDropdown.vue` + Teleport); price/sort stay native `<select>`.

## Next (author)
- Visual PASS: live Merchant + `merchant-demo.html` (purse format, capability menu, filters).
- Optional later: dialogue / artisan / inventory value strings still say „monet” — out of Stage F scope.

Kick-off for broader UI migration: see [README](./README.md) / draft stages later slices.
