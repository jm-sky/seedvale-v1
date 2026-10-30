# WSL stability check (Q18) + Q6 A0 actor cost counters

**Date:** 2026-10-30 · **By:** Claude Opus 5.5 · **Platform: WSL2** (WSL 2.7.14, kernel 6.18.33.2, WSLg 1.0.73.2; Chrome `GALLIUM_DRIVER=d3d12`, Intel Arc 140V). First runs on the updated WSL stack — **do not compare with earlier WSL numbers or with Windows.**

Build `5a95c52c`, fixture `tools-001-v1`, `settlement-heavy`, High, 30 s, fresh profile, 20 s cooldown, 57 NPCs in every run. Artifacts: `results/wsl/2026-10-30--wsl-q18-stability-*`. Logs (`dmesg -w`, `free -m` every 2 s) kept on the Windows side (`C:\Users\madeyskij\seedvale-q18-logs`), outside the repo.

## Q18 — stability

- **4 / 4 reps completed, no VM restart.** Minimum available memory 9.9 GB, swap 0. The first attempt timed out because Chrome showed a GNOME keyring prompt; fixed with `--password-store=basic` (`d2c7ee32`).
- The `dxgkrnl` errors seen around the morning crash (`wait_for_completion failed: fffffe00`, `dxgkio_create_allocation` / `dxgkio_map_gpu_va: Ioctl failed: -512`) appeared again at 11:15:04 and 11:19:15, **exactly at the end of rep 1 and rep 2, when the script SIGTERMs Chrome.** `-512` is `ERESTARTSYS` (a GPU wait interrupted by a signal), so these lines are a teardown signature, not evidence of the crash cause. The script now closes Chrome via CDP `Browser.close` before killing it.
- One kernel `WARNING` (`dxgvmbus.c:3095` field-spanning write in `dxgvmb_send_wait_sync_object_gpu`) at 10:37, before any benchmark: a driver warning on kernel 6.x, no visible effect.
- The morning crash cause stays unconfirmed. Current reading: the updated stack is stable for consecutive benchmark reps with ~10 GB headroom.

## Q6 — A0 counters (per frame, averages; structural, not timing)

| Pass | Calls | Material switches | Program switches | Actor calls | Actor material sw. | Actor program sw. | Skinned calls | Skeletons first used |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Main | 1 368 | 623 | 208–213 | 308–310 | 187 | 86–88 | 302–304 | 264–266 |
| Shadow (refresh) | 394 | 87 | 93 | 42 | 0 | 4 | 47 | 47 |
| Mirror | 293 | 93 | 51 | 0 | 0 | 0 | 2 | 2 |

Stable across all four reps (±1 %).

**Reading:**

- **~313 `Skeleton.update()` per frame** (266 in main + 47 more in shadow), each recomputing the bone palette and re-uploading a bone texture. With 304 skinned main draws that is **~0.87 skeleton per skinned mesh** — almost every NPC part (body, head, hair, beard, outfit pieces) owns its own cloned skeleton.
- Actor draws cause 187 of 623 material switches and ~87 of ~210 program switches in the main pass: material state churn is high, program churn moderate.
- **A1 choice: (b) one skeleton per actor** — bind all skeletally compatible skinned parts of an actor to its body skeleton, so updates fall from ~313 towards the number of drawn actors. The reverted body-only experiment cut eligible updates only 61 → 14 ([Windows A/B](./2026-10-29--win-peasant-skeleton-sharing-ab.md)); this covers all parts of all families. (a) material-instance sharing stays second. RENDER p50 on WSL here: 30–36 ms.
