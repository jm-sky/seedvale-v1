# Pinned V3 equipment verification sources

**Created at:** 2026-10-27\
**Created by:** ChatGPT Codex

Original source bytes from `jm-sky/seedvale` at **`907e17cd2ad487547a25a1f928b2770348183d75`**, selected by Stage 1 [provenance](../../../../src/items/v3Equipment/provenance.ts). `manifest.json` records Git blob IDs. Paths under this directory mirror donor paths with a `.txt` suffix so they remain test fixtures rather than application modules. Do not lint, format or edit their contents.

The four item files preserve the original contract, constructors and catalogue composition. `src/game/data/character/types.ts.txt` is the original compile-only dependency needed to check donor item types without stubbing `SkillId`. The verifier evaluates only `weapons.ts` and `armor.ts`, in a bounded VM with no import/require facility; it never evaluates the goods catalogue or character systems. Resolved production records live separately in `src/items/v3Equipment/catalogue.ts`.

Run from the V1 repository root, after installing its locked dev dependencies:

```sh
node --import tsx scripts/items/verify-v3-equipment-source.ts
```

This works offline and in CI without a donor checkout. It checks original-source blob identity, donor/local types, the independently reviewed ID mapping, family counts and every imported own property/value, including explicit undefined. Failures exit nonzero with the source file, canonical ID/field path, or identity/count diagnostic. See [implementation notes](../../../../docs/research/v1-revival/2026-10-27--equipment-catalogue-stage-2-implementation-notes.md) for tests and outcomes.

For an additional read-only Git/worktree audit, place a clean donor checkout at `/home/madeyskij/projects/private/seedvale` on the exact pin, or pass its explicit path:

```sh
node --import tsx scripts/items/verify-v3-equipment-source.ts /home/madeyskij/projects/private/seedvale
```

The explicit checkout must have origin `jm-sky/seedvale`, exact pinned HEAD, matching source bytes and recon revision `94c464739d46afb982949fd6ed96b0d74d265b10` available. No fetch or checkout is performed and no newer-HEAD fallback exists. Fixtures were extracted using `git show <pin>:<original-path>`; their blob IDs were independently checked against both the pinned Git tree and the original working-tree bytes. Any future source update requires an explicit revision/provenance review; never regenerate expectations from the imported catalogue.

Stage 3 adds a Git-tree-only membership audit that allows a newer donor HEAD without changing it:

```sh
node --import tsx scripts/items/verify-v3-equipment-source.ts --git-tree /path/to/seedvale
```

This first runs the offline fidelity check, then checks the origin, pinned commit object and every `commit:path` blob. Missing Git objects fail explicitly. Offline fixture hashes alone still do not prove commit membership. Before any future pin change, run this audit against a repository containing the requested commit (or independently check all five GitHub Contents API blob SHAs at the exact ref), review source differences, and update provenance only with approval. Stage 3 checked all five SHAs through GitHub because the local donor lacks the old object; see its implementation notes.

The fixture-only `.gitattributes` LF rule preserves original bytes even with `core.autocrlf=true`. The reviewed Markdown ID table accepts both LF and CRLF; no source-byte hash normalization is performed.
