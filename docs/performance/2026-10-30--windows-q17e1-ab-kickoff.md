# Kick-off — Q17 E1 template program prewarm, Windows A/B (native Arc)

**Created:** 2026-10-30 · Claude Opus 5.5 · repo `jm-sky/seedvale-v1`, branch `main`
Paste the block below as the first prompt of a new Claude Code session started in the repo on Windows.

---

Robimy natywne Windows A/B dla slice'u **Q17 E1** (prewarm programów szablonów roślin/skał, commit `0a56f8cc`, flaga `?prewarmTemplates=1`, domyślnie OFF). WSL A/B pominięty świadomie — first-use compile zależy od sterownika, więc decyduje Windows (ANGLE D3D11).

**Przeczytaj tylko:** `CLAUDE.md`; `docs/research/v1-revival/2026-10-30--q17-travel-stutter-recon.md` (§1, §3 E1 + „A/B instructions”); `docs/performance/2026-10-27--arc-baseline-runbook.md` (sekcje uruchamiania na Windows); `docs/performance/results/2026-10-30--win-q5-ca2-ab.md` jako wzór raportu i sekcji „post-hoc tail attribution”.

**Kroki:**
1. `git pull --rebase origin main`. Uruchom Vite dev od nowa (SHA w meta musi się zgadzać), nic innego ciężkiego w tle, jedna karta Seedvale naraz.
2. Cztery przebiegi `stream`, kolejność **A B B A**, 1 rep każdy, 30 s cooldown, fresh profil (skrypt robi to sam). A = domyślnie (off), B = flaga. PowerShell:
   ```powershell
   Remove-Item Env:SEEDVALE_QUERY -ErrorAction SilentlyContinue
   node scripts/perf/run-benchmark-series.mjs <port> docs/performance/results/win q17e1-A1 1 30 stream
   $env:SEEDVALE_QUERY='&prewarmTemplates=1'
   node scripts/perf/run-benchmark-series.mjs <port> docs/performance/results/win q17e1-B1 1 30 stream
   node scripts/perf/run-benchmark-series.mjs <port> docs/performance/results/win q17e1-B2 1 30 stream
   Remove-Item Env:SEEDVALE_QUERY
   node scripts/perf/run-benchmark-series.mjs <port> docs/performance/results/win q17e1-A2 1 30 stream
   ```
   Sprawdź w meta każdego runu, że URL ma/nie ma `prewarmTemplates=1` i renderer to ANGLE D3D11 Intel Arc. Jeśli da się odczytać, zapisz `window.__seedvaleProgramPrewarm` (stagingRoots, programCountAfter, compileAsyncMs, glError) dla obu ramion.
3. Raport `docs/performance/results/2026-10-30--win-q17e1-template-prewarm-ab.md` (platforma w nagłówku, SHA, n = 2 na ramię, bez claimów FPS ponad dane):
   - **Strukturalnie:** z `[Seedvale Program Compile Cost]` / census — programy utworzone w oknie per run; czy w B zniknęły `MapleTree_Bark`, `Leaves`, `Green` i inne materiały szablonów (A powinno je mieć).
   - **Decyduje:** frame max, liczba klatek ≥ 100 ms, hitche, p99. **Guardy:** mean FPS, p50/p95, RENDER p50 — bez regresji.
   - Koszt ładowania: `compileAsyncMs` B − A.
   - Atrybucja ogona jak w raporcie CA2 (co zostało: postacie `MI_Eyes` → Q23, `riverTileBuild` → Q22, shadow depth).
4. **Decyzja:**
   - **Zielone** (szablony znikają z okna, ogon nie gorszy, guardy OK) → włącz domyślnie: w `src/perf/flags.ts` `isTemplateProgramPrewarmEnabled` zwraca `true` bez parametru, `?prewarmTemplates=0` wyłącza (popraw JSDoc), popraw komentarz w `src/app/createApp.ts`; `pnpm run test`, `npx tsc --noEmit` (3 znane błędy w `src/ui-vue/demos/hud/fixtures.ts` są stare), `pnpm run lint`.
   - **Niejednoznaczne lub regresja** → nic nie przełączaj, opisz w raporcie i zadaj mi pytanie (po polsku, krótkie opcje).
5. Zaktualizuj: `docs/research/v1-revival/AUTONOMOUS-SESSION-QUEUE.md` (wiersz Q17 + wpis E1 w §4: wynik, link do raportu, default), recon Q17 §4, tracker §E (`2026-10-27--performance-three-track-roadmap.md`), plan 149 §20 jedną linią. `pnpm docs:sync`, commit + push na `main` (bez force push, `git pull --rebase` przed push).

**Na końcu odpowiedz po polsku:** wynik strukturalny, liczby decydujące A vs B, decyzja (default on/off), SHA commitów, co zostało w ogonie.
