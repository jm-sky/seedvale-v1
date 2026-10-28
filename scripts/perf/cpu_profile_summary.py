"""Self/inclusive CPU per function from a Chrome trace's ProfileChunk samples (uses timeDeltas).
Usage: python scripts/perf/cpu_profile_summary.py TRACE.json
Complements scripts/analyze_trace.py, which reports sample counts only (see runbook)."""
import json, sys, collections, re
path = sys.argv[1]
d = json.load(open(path, encoding='utf-8'))
ev = d['traceEvents'] if isinstance(d, dict) else d
nodes = {}
parent = {}
samples = []
deltas = []
for e in ev:
    if e.get('name') != 'ProfileChunk':
        continue
    a = e.get('args', {}).get('data', {})
    cp = a.get('cpuProfile', {})
    for n in cp.get('nodes', []):
        nodes[n['id']] = n
        for c in n.get('children', []):
            parent[c] = n['id']
        if 'parent' in n:
            parent[n['id']] = n['parent']
    samples += cp.get('samples', [])
    deltas += a.get('timeDeltas', [])
n = min(len(samples), len(deltas))
# time attributed to a sample = the delta to the next sample
dur = [deltas[i + 1] if i + 1 < n else 0 for i in range(n)]
total = sum(dur) / 1000.0


def key(nid):
    cf = nodes[nid]['callFrame']
    url = re.sub(r'\?v=\w+', '', cf.get('url', ''))
    url = re.sub(r'^https?://localhost:\d+/', '', url)
    return (cf['functionName'] or '(anon)', url, cf.get('lineNumber', 0) + 1)


self_t = collections.Counter()
incl_t = collections.Counter()
for i in range(n):
    nid = samples[i]
    if nid not in nodes:
        continue
    self_t[key(nid)] += dur[i]
    seen = set()
    cur = nid
    while cur in nodes:
        k = key(cur)
        if k not in seen:
            incl_t[k] += dur[i]
            seen.add(k)
        cur = parent.get(cur)
        if cur is None:
            break
print(f'samples={n} sampled_total_ms={total:.0f}')
print('\n## SELF (top 25)')
for k, v in self_t.most_common(25):
    print(f'{v/1000:8.0f} ms {100*v/1000/total:5.1f}%  {k[0]}  {k[1]}:{k[2]}')
print('\n## INCLUSIVE, project code only (src/), top 25')
rows = [(k, v) for k, v in incl_t.items() if k[1].startswith('src/')]
rows.sort(key=lambda x: -x[1])
for k, v in rows[:25]:
    print(f'{v/1000:8.0f} ms {100*v/1000/total:5.1f}%  {k[0]}  {k[1]}:{k[2]}')
print('\n## INCLUSIVE, three.js/render (top 12)')
rows = [(k, v) for k, v in incl_t.items() if k[0] in ('render', 'renderBufferDirect', 'projectObject', 'renderObject', 'setProgram', 'compile', 'getProgram', 'updateMatrixWorld', 'animate', 'tick', 'loop')]
rows.sort(key=lambda x: -x[1])
for k, v in rows[:12]:
    print(f'{v/1000:8.0f} ms {100*v/1000/total:5.1f}%  {k[0]}  {k[1]}:{k[2]}')
