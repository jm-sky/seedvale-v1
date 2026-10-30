# WSL2 VM restart during benchmarks (Q18)

**Date:** 2026-10-30 · **By:** author (diagnosis), Claude Opus 5.5 (summary) · **Status:** GPU acceleration fixed; stability unverified.

## Incident

The Q6 `settlement-heavy` WSL run (`scripts/perf/run-benchmark-series.mjs`) restarted the whole WSL VM; no artifacts were written. Before the run WSL used ~9 / 15 GB (Vite dev + a second agent session).

## Findings

- Host: Windows build 26200.8655, 32 GB RAM. `.wslconfig`: `memory=16GB`, `swap=8GB`, `autoMemoryReclaim=gradual`, `sparseVhd=true` (left unchanged).
- **No OOM evidence:** no Windows event 2004, no Linux OOM messages.
- **Repeated `dxgkrnl` GPU errors** on 2026-10-29 and at 10:03 on 2026-10-30: `dxgkio_reserve_gpu_va: Ioctl failed: -75`, `dxgvmb_send_sync_msg: wait_for_completion failed`, `dxgkio_create_allocation` / `dxgkio_map_gpu_va: Ioctl failed: -512`. Hyper-V logs show the WSL network detaching/reattaching around 10:05.
- No single message explains the restart; the GPU paravirtualization path is the stronger suspect.

## Actions taken

- WSL 2.4.13 → 2.7.14, kernel 5.15 → 6.18, WSLg 1.0.65 → 1.0.73.2; Windows restarted.
- Mesa in WSL defaults to `llvmpipe`; `GALLIUM_DRIVER=d3d12` gives `D3D12 (Intel Arc 140V)`, hardware-accelerated WebGL/WebGPU in Chrome. The benchmark script sets it for the Chrome process only and aborts reps not on D3D12 (`6d16ca8a`). All 2026-10-29 WSL artifacts already ran on D3D12.

## Consequences

Rules (new WSL baseline after the stack update, safe-run conditions): [runbook §WSL stack and stability](../2026-10-27--arc-baseline-runbook.md#wsl-stack-and-stability-q18-2026-10-30). Next step: controlled stability test with `dmesg -w` / `free -m` logging (queue Q18).
