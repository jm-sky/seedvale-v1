#!/usr/bin/env python3
"""Voice QC ledger (npc-065 S1). Dev-only tool, not a runtime dependency.

Transcribes every NPC voice MP3 with faster-whisper (small.en, CPU), compares the
result with the catalog text and writes docs/assets/voice-qc/ledger.json.

Usage (from repo root):
  python3 -m venv .venv-voice-qc && .venv-voice-qc/bin/pip install faster-whisper jiwer
  .venv-voice-qc/bin/python scripts/voice/voice-qc-ledger.py [--limit N]

Existing rows keep their author-owned fields (`author`, `verdict`, editorial tags set by hand);
ASR fields are recomputed only when the blob hash changed or `--force` is passed.
"""
import argparse
import hashlib
import json
import re
import subprocess
import sys
from pathlib import Path

from voice_decisions import load_decisions, retain_removed_rows
from voice_assets import recording_path

ROOT = Path(__file__).resolve().parents[2]
V1_DIR = ROOT / "public/sounds/voices"
CATALOG = ROOT / "docs/design/npc-voices/CATALOG.md"
OUT = ROOT / "docs/assets/voice-qc/ledger.json"

# Fish voice UUID -> speaker id (catalog "Voice sources"). campfire_* are aliases of general_*.
SPEAKERS = {
    "d4f161bee1934b47ad3090f05649270c": "merchant_female",
    "e3cd384158934cc9a01029cd7d278634": "merchant_female_b",
    "c2a3921fd7024b9189cb912bdfe5266a": "general_male",
    "65c0b8155c464a648161af8877404f11": "general_male_b",
    "c29549f41b3b4aa498d66d76fba0e887": "guard_male",
    "7a18a1851d2649108c48ec9f2c80eb2c": "guard_male_b",
    "bd22266aba38416cb602e90ce651520c": "hunter_male",
    "a2cecd3eda8b44178b7f1bc1379edae0": "hunter_male_b",
    "5e3be339f2df45e6a1a338bb2ce94800": "general_female",
    "9a9cf47702da476aa4629e2506d4a857": "general_female_b",
    "4af16ba03cee422996ec29a43e1947ee": "shepherd_male",
    "beb44e5fac1e4b33a15dfcdcc2a9421d": "shepherd_male_b",
    "2adcdee4b3ce4b648dc16ea65430ea76": "mark_hornblower",
}

WER_MATCH = 0.15
WEATHER_WORDS = {
    "rain": r"\b(rain|rains|raining|drizzle|shower|wet|soaked)\b",
    "snow": r"\b(snow|snowing|snowy|blizzard|frost|frozen)\b",
    "storm": r"\b(storm|stormy|thunder|lightning|gale)\b",
}
ROLE_WORDS = {
    "guard": r"\b(guard|watch|patrol|sentry|post)\b",
    "hunter": r"\b(hunt|hunter|hunting|prey|game|trail|tracks?)\b",
    "merchant": r"\b(merchant|wares|goods|coin|coins|customers?|trade|shop|stall|buy|sell)\b",
    "shepherd": r"\b(sheep|flock|shepherd|herd|pasture|lamb|wolf|wolves)\b",
    "farmer": r"\b(field|fields|crops?|harvest|plough|plow|soil)\b",
}
CLAIM_WORDS = {
    "species": r"\b(wolf|wolves|bear|boar|deer|fox|bandits?|raiders?)\b",
    "time": r"\b(morning|evening|night|dawn|dusk|midday|noon|tonight|today|tomorrow|sunset|sunrise)\b",
    "forecast": r"\b(forecast|looks like|going to|will be|clouds?|clearing)\b",
    "location": r"\b(village|bridge|gate|river|road|forest|hill|well|market)\b",
}


def norm(s: str) -> str:
    s = s.lower().replace("’", "'")
    s = re.sub(r"\[[^\]]*\]", " ", s)
    s = re.sub(r"[^a-z0-9' ]+", " ", s)
    return re.sub(r"\s+", " ", s).strip()


def git_blob(path: Path) -> str:
    return subprocess.check_output(["git", "hash-object", str(path)], cwd=ROOT, text=True).strip()


def parse_catalog() -> dict:
    """filename -> {voiceId, status, catalogText, generationInput}; later duplicates keep the first in_repo row."""
    rows: dict = {}
    cur = None
    for line in CATALOG.read_text(encoding="utf-8").splitlines():
        m = re.fullmatch(r"`([\w\-.]+\.mp3)`", line.strip())
        if m:
            cur = {"voiceId": None, "status": None, "catalogText": "", "generationInput": ""}
            name = m.group(1)
            if name not in rows or rows[name]["status"] != "in_repo":
                rows[name] = cur
            continue
        if cur is None:
            continue
        if line.startswith("- voice_id:"):
            cur["voiceId"] = line.split("`")[1]
        elif line.startswith("- status:"):
            cur["status"] = line.split("`")[1]
        elif line.startswith("- generation_input:"):
            cur["generationInput"] = line.split("`", 1)[1].rsplit("`", 1)[0] if "`" in line else ""
        elif line.startswith("> "):
            cur["catalogText"] = (cur["catalogText"] + " " + line[2:]).strip()
        elif line.startswith("#"):
            cur = None
    return rows


def intent_of(name: str, speaker: str | None) -> str:
    stem = name[:-4]
    stem = re.sub(r"_\d+$", "", stem)
    if speaker:
        for prefix in (speaker, speaker.replace("_male", "").replace("_female", "")):
            pass
    stem = stem.replace("shepard_", "shepherd_")
    m = re.match(r"^(general|guard|hunter|merchant|shepherd|campfire)_(male|female)(_b)?_(.*)$", stem)
    if m:
        return m.group(4)
    m = re.match(r"^npc_[\w]+?_(.*)$", stem)
    return m.group(1) if m else stem


def tags(text: str) -> dict:
    t = norm(text)
    weather = [k for k, rx in WEATHER_WORDS.items() if re.search(rx, t)]
    return {
        "weatherWord": weather[0] if len(weather) == 1 else ("+".join(weather) if weather else "none"),
        "roles": [k for k, rx in ROLE_WORDS.items() if re.search(rx, t)],
        "claims": [k for k, rx in CLAIM_WORDS.items() if re.search(rx, t)],
    }


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--limit", type=int, default=0)
    ap.add_argument("--force", action="store_true")
    ap.add_argument("--model", default="small.en")
    args = ap.parse_args()

    catalog = parse_catalog()
    prev = {}
    if OUT.exists():
        prev = {r["file"]: r for r in json.loads(OUT.read_text(encoding="utf-8"))["rows"]}
    decisions = load_decisions(list(prev.values())) if prev else {}

    files = sorted((recording_path(name) for name in prev if decisions[name]['disposition'] != 'replace'), key=lambda p: p.name)
    if args.limit:
        files = files[: args.limit]
    # Removed takes remain historical ledger rows. Validate inventory before ASR/write.
    if not args.limit:
        retain_removed_rows(prev, [{"file": p.name} for p in files], decisions)
    model = None

    rows = []
    for i, p in enumerate(files, 1):
        name = p.name
        blob = git_blob(p)
        old = prev.get(name)
        if old and old.get('gitBlob') == blob and not args.force and 'asrText' in old:
            # The ledger is historical evidence: migration must not rewrite presence or catalog fields.
            rows.append(old)
            print(f"[{i}/{len(files)}] {name} cached historical row", file=sys.stderr, flush=True)
            continue
        cat = catalog.get(name, {})
        vid = cat.get("voiceId") or ""
        speaker = SPEAKERS.get(vid) or (vid if vid in SPEAKERS.values() else None)  # some banks list the profile name
        if speaker is None and name.startswith("mark_"):
            speaker = "mark_hornblower"
        row = {
            "file": name,
            "inV1Public": (V1_DIR / name).exists(),
            "gitBlob": blob,
            "speaker": speaker,
            "voiceId": cat.get("voiceId"),
            "intent": intent_of(name, speaker),
            "catalogStatus": cat.get("status"),
            "catalogText": cat.get("catalogText", ""),
        }
        if old and old.get("gitBlob") == blob and not args.force and "asrText" in old:
            for k in ("asrText", "wer", "durationSec", "auto"):
                row[k] = old[k]
        else:
            import jiwer
            from faster_whisper import WhisperModel
            if model is None:
                model = WhisperModel(args.model, device="cpu", compute_type="int8", cpu_threads=6)
            segs, info = model.transcribe(str(p), language="en", beam_size=5, vad_filter=False)
            asr = " ".join(s.text.strip() for s in segs).strip()
            ref = norm(cat.get("catalogText", ""))
            hyp = norm(asr)
            if not hyp:
                wer, auto = None, "unreadable"
            elif not ref:
                wer, auto = None, "no-catalog-text"
            else:
                wer = round(jiwer.wer(ref, hyp), 3)
                auto = "match" if wer <= WER_MATCH else "mismatch"
            row.update(asrText=asr, wer=wer, durationSec=round(info.duration, 2), auto=auto)
        row.update(tags(row["asrText"] or row["catalogText"]))
        row["humor"] = (old or {}).get("humor")
        row["author"] = (old or {}).get("author", "unheard")
        row["verdict"] = (old or {}).get("verdict", "pending")
        rows.append(row)
        print(f"[{i}/{len(files)}] {name} {row['auto']} wer={row['wer']}", file=sys.stderr, flush=True)

    if not args.limit:
        rows = retain_removed_rows(prev, rows, decisions)
    else:
        # A bounded run must not discard records outside the selected sample.
        selected = {r['file'] for r in rows}
        rows = sorted(rows + [r for name, r in prev.items() if name not in selected], key=lambda r: r['file'])
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(
        json.dumps({"model": args.model, "werMatchThreshold": WER_MATCH, "rows": rows}, indent=1, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
