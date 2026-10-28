===================================  
# Running Analyze Trace v16  
===================================  
  
Reading: _temp\trace-settlement-heavy-98ddfbd1.json  
  
  
------------------------------------------------------------------------  
## TRACE ANALYSIS  
Events: 1,063,587  
  
Timed intervals: 639,085  
  
  
------------------------------------------------------------------------  
## TOP 5 REAL CPU OPERATIONS  
1. 393.7 ms self  V8.InvokeApiInterruptCallbacks  
   CPU  
   Total: 393.9 ms   Self: 393.7 ms  
   pid=2196 tid=25412 ph=X  
  
   Call tree:  
→ V8.StackGuard (393.9 ms)  
  → V8.HandleInterrupts (393.9 ms)  
    → V8.InvokeApiInterruptCallbacks (393.9 ms)  
  
2. 124.9 ms self  ThreadControllerImpl::RunTask  
   CPU  
   Total: 125.1 ms   Self: 124.9 ms  
   pid=2196 tid=25412 ph=X  
  
   Call tree:  
→ RunTask (125.2 ms)  
  → ThreadControllerImpl::RunTask (125.1 ms)  
  
3. 123.6 ms self  FunctionCall  
   CPU  
   Total: 124.0 ms   Self: 123.6 ms  
   pid=2196 tid=25412 ph=X  
  
   Call tree:  
→ RunTask (125.5 ms)  
  → ThreadControllerImpl::RunTask (125.5 ms)  
    → FireAnimationFrame (124.4 ms)  
      → FunctionCall (124.0 ms)  
  
4. 122.9 ms self  FunctionCall  
   CPU  
   Total: 123.2 ms   Self: 122.9 ms  
   pid=2196 tid=25412 ph=X  
  
   Call tree:  
→ FireAnimationFrame (123.4 ms)  
  → FunctionCall (123.2 ms)  
  
5. 115.1 ms self  FunctionCall  
   CPU  
   Total: 116.9 ms   Self: 115.1 ms  
   pid=2196 tid=25412 ph=X  
  
   Call tree:  
→ RunTask (118.7 ms)  
  → ThreadControllerImpl::RunTask (118.6 ms)  
    → FireAnimationFrame (117.2 ms)  
      → FunctionCall (116.9 ms)  
  
  
------------------------------------------------------------------------  
## TOP 5 AGGREGATED REAL CPU OPERATIONS  
1. 44,786.8 ms self  ThreadControllerImpl::RunTask  
   Total: 69,262.2 ms   Calls: 77929   CPU  
2. 28,250.3 ms self  FunctionCall  
   Total: 28,503.7 ms   Calls: 12404   CPU  
3. 7,107.5 ms self  CommandBufferService:PutChanged  
   Total: 7,492.3 ms   Calls: 20635   CPU  
4. 1,759.2 ms self  ThreadPool_RunTask  
   Total: 2,215.8 ms   Calls: 5669   CPU  
5. 972.9 ms self  GpuChannel::ExecuteDeferredRequest  
   Total: 8,028.5 ms   Calls: 20652   CPU  
  
------------------------------------------------------------------------  
## TOP 5 LONG CPU TASKS / HITCHES  
Ranked by wall-clock duration of top-level (root) call-tree nodes — each root is a disjoint span on its own thread, so this list cannot double-count nested work. An event name such as "RunTask" is not assumed to be a hitch by itself; ranking is purely by duration.  
  
1. 393.9 ms  V8.StackGuard  
   CPU  
   Start: 84.6 ms (trace-relative)   pid=2196 tid=25412 ph=X  
  
   Call tree:  
→ V8.StackGuard (393.9 ms)  
  
2. 125.5 ms  RunTask  
   CPU  
   Start: 20,917.0 ms (trace-relative)   pid=2196 tid=25412 ph=X  
  
   Call tree:  
→ RunTask (125.5 ms)  
  
3. 125.2 ms  RunTask  
   CPU  
   Start: 21,525.6 ms (trace-relative)   pid=2196 tid=25412 ph=X  
  
   Call tree:  
→ RunTask (125.2 ms)  
  
4. 123.4 ms  FireAnimationFrame  
   CPU  
   Start: 21,526.2 ms (trace-relative)   pid=2196 tid=25412 ph=X  
  
   Call tree:  
→ FireAnimationFrame (123.4 ms)  
  
5. 118.7 ms  RunTask  
   CPU  
   Start: 18,191.2 ms (trace-relative)   pid=2196 tid=25412 ph=X  
  
   Call tree:  
→ RunTask (118.7 ms)  
  
  
------------------------------------------------------------------------  
## FRAME / HITCH SUMMARY  
Frames: 650  
Median frame duration: 42.2 ms  
Average frame duration: 45.3 ms  
P95 frame duration: 76.5 ms  
P99 frame duration: 107.6 ms  
Longest frame: 125.9 ms (start 20,917.3 ms, trace-relative)  
Frames > 16.7 ms (<60 FPS): 650  
Frames > 33.3 ms (<30 FPS): 597  
Frames > 100 ms: 8  
  
Extracting embedded CPU profiles...  
CPU profiles: 1  
  
------------------------------------------------------------------------  
## TOP 5 WEBGL / THREE.JS / SHADER OPERATIONS  
1. projectObject  
   THREE.JS RENDERER   Profile CPU: 0.0 ms   Samples: 3608   Profiles: 1   Nodes: 1  
   Location: http://localhost:5590/node_modules/.vite/deps/chunk-4SR3H3JQ.js?v=e0296693:42152:27  
  
   Profile call tree:  
   → projectObject  
  
2. renderObject  
   THREE.JS RENDERER   Profile CPU: 0.0 ms   Samples: 1975   Profiles: 1   Nodes: 1  
   Location: http://localhost:5590/node_modules/.vite/deps/chunk-4SR3H3JQ.js?v=e0296693:37526:24  
  
   Profile call tree:  
   → renderObject  
  
3. renderObject  
   THREE.JS RENDERER   Profile CPU: 0.0 ms   Samples: 1547   Profiles: 1   Nodes: 1  
   Location: http://localhost:5590/node_modules/.vite/deps/three_addons_renderers_CSS2DRenderer__js.js?v=e0296693:89:26  
  
   Profile call tree:  
   → renderObject  
  
4. setProgram  
   THREE.JS RENDERER   Profile CPU: 0.0 ms   Samples: 1008   Profiles: 1   Nodes: 1  
   Location: http://localhost:5590/node_modules/.vite/deps/chunk-4SR3H3JQ.js?v=e0296693:42425:24  
  
   Profile call tree:  
   → setProgram  
  
5. WebGLRenderer.renderBufferDirect  
   THREE.JS RENDERER   Profile CPU: 0.0 ms   Samples: 977   Profiles: 1   Nodes: 1  
   Location: http://localhost:5590/node_modules/.vite/deps/chunk-4SR3H3JQ.js?v=e0296693:41862:39  
  
   Profile call tree:  
   → WebGLRenderer.renderBufferDirect  
  
  
------------------------------------------------------------------------  
## TOP APPLICATION CPU OPERATIONS  
This trace's embedded CPU profiles carry no `timeDeltas` (per-sample timing), so sampled CPU time cannot be computed for any function, application or otherwise. Ranking below falls back to sample/node count, which reflects sampling frequency, not wall-clock CPU cost. To get real per-function CPU time, re-record with a capture path that preserves `timeDeltas` on `disabled-by-default-v8.cpu_profiler` `ProfileChunk` events.  
  
1. nearestRiverShoreCandidate  
   APPLICATION   Sampled CPU: 0.0 ms   Samples: 5773   Profiles: 1   Nodes: 1  
   Location: http://localhost:5590/src/terrain/riverNetwork.ts:214:43  
  
   Profile call tree:  
   → nearestRiverShoreCandidate  
  
2. isPointWalkableForNpc  
   APPLICATION   Sampled CPU: 0.0 ms   Samples: 420   Profiles: 1   Nodes: 1  
   Location: http://localhost:5590/src/ai/npcColliderRim.ts:45:38  
  
   Profile call tree:  
   → isPointWalkableForNpc  
  
3. classifyObject  
   APPLICATION   Sampled CPU: 0.0 ms   Samples: 320   Profiles: 1   Nodes: 1  
   Location: http://localhost:5590/src/perf/sceneCensus.ts:111:31  
  
   Profile call tree:  
   → classifyObject  
  
4. colliderSignedDistance  
   APPLICATION   Sampled CPU: 0.0 ms   Samples: 303   Profiles: 1   Nodes: 1  
   Location: http://localhost:5590/src/world/collision.ts:22:39  
  
   Profile call tree:  
   → colliderSignedDistance  
  
5. recordDraw  
   APPLICATION   Sampled CPU: 0.0 ms   Samples: 271   Profiles: 1   Nodes: 1  
   Location: http://localhost:5590/src/perf/passSubmissionCollector.ts:150:22  
  
   Profile call tree:  
   → recordDraw  
  
  
------------------------------------------------------------------------  
## TOP 5 TRACE WEBGL / SHADER EVENTS  
No WebGL/Three.js/shader trace events found.  
  
------------------------------------------------------------------------  
## GPU SUMMARY  
Total GPU task time: 7,948.6 ms  
Total GPU task self: 7,948.6 ms  
GPU task calls: 20657  
  
------------------------------------------------------------------------  
### TOP 5 GPU TASKS  
1. 3.6 ms  GPUTask  
   GPU  
   pid=2792 tid=30664 ph=X  
   Total: 3.6 ms  
  
   Call tree:  
→ GPUTask (3.6 ms)  
  
2. 2.7 ms  GPUTask  
   GPU  
   pid=2792 tid=30664 ph=X  
   Total: 2.7 ms  
  
   Call tree:  
→ GPUTask (2.7 ms)  
  
3. 2.1 ms  GPUTask  
   GPU  
   pid=2792 tid=30664 ph=X  
   Total: 2.1 ms  
  
   Call tree:  
→ GPUTask (2.1 ms)  
  
4. 2.0 ms  GPUTask  
   GPU  
   pid=2792 tid=30664 ph=X  
   Total: 2.0 ms  
  
   Call tree:  
→ GPUTask (2.0 ms)  
  
5. 1.9 ms  GPUTask  
   GPU  
   pid=2792 tid=30664 ph=X  
   Total: 1.9 ms  
  
   Call tree:  
→ GPUTask (1.9 ms)  
  
  
DONE  
