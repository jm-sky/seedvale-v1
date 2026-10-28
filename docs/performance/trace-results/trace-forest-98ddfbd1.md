===================================  
# Running Analyze Trace v16  
===================================  
  
Reading: _temp\trace-forest-98ddfbd1.json  
  
  
------------------------------------------------------------------------  
## TRACE ANALYSIS  
Events: 1,401,747  
  
Timed intervals: 828,053  
  
  
------------------------------------------------------------------------  
## TOP 5 REAL CPU OPERATIONS  
1. 332.9 ms self  V8.InvokeApiInterruptCallbacks  
   CPU  
   Total: 333.0 ms   Self: 332.9 ms  
   pid=3392 tid=27768 ph=X  
  
   Call tree:  
→ V8.StackGuard (333.0 ms)  
  → V8.HandleInterrupts (333.0 ms)  
    → V8.InvokeApiInterruptCallbacks (333.0 ms)  
  
2. 109.8 ms self  ThreadControllerImpl::RunTask  
   CPU  
   Total: 109.9 ms   Self: 109.8 ms  
   pid=3392 tid=27768 ph=X  
  
   Call tree:  
→ RunTask (109.9 ms)  
  → ThreadControllerImpl::RunTask (109.9 ms)  
  
3. 106.2 ms self  FunctionCall  
   CPU  
   Total: 108.5 ms   Self: 106.2 ms  
   pid=3392 tid=27768 ph=X  
  
   Call tree:  
→ FireAnimationFrame (108.9 ms)  
  → FunctionCall (108.5 ms)  
  
4. 84.1 ms self  FunctionCall  
   CPU  
   Total: 84.2 ms   Self: 84.1 ms  
   pid=3392 tid=27768 ph=X  
  
   Call tree:  
→ RunTask (85.8 ms)  
  → ThreadControllerImpl::RunTask (85.8 ms)  
    → FireAnimationFrame (84.7 ms)  
      → FunctionCall (84.2 ms)  
  
5. 65.0 ms self  ThreadControllerImpl::RunTask  
   CPU  
   Total: 65.1 ms   Self: 65.0 ms  
   pid=3392 tid=27768 ph=X  
  
   Call tree:  
→ RunTask (65.1 ms)  
  → ThreadControllerImpl::RunTask (65.1 ms)  
  
  
------------------------------------------------------------------------  
## TOP 5 AGGREGATED REAL CPU OPERATIONS  
1. 29,793.9 ms self  WaitForVSync Sleep  
   Total: 29,793.9 ms   Calls: 1715   CPU  
2. 28,059.4 ms self  FunctionCall  
   Total: 28,310.6 ms   Calls: 19875   CPU  
3. 17,595.8 ms self  ThreadControllerImpl::RunTask  
   Total: 72,052.2 ms   Calls: 100731   CPU  
4. 9,175.5 ms self  CommandBufferService:PutChanged  
   Total: 9,667.9 ms   Calls: 26907   CPU  
5. 1,399.8 ms self  GpuChannel::ExecuteDeferredRequest  
   Total: 10,316.6 ms   Calls: 26925   CPU  
  
------------------------------------------------------------------------  
## TOP 5 LONG CPU TASKS / HITCHES  
Ranked by wall-clock duration of top-level (root) call-tree nodes — each root is a disjoint span on its own thread, so this list cannot double-count nested work. An event name such as "RunTask" is not assumed to be a hitch by itself; ranking is purely by duration.  
  
1. 333.0 ms  V8.StackGuard  
   CPU  
   Start: 74.9 ms (trace-relative)   pid=3392 tid=27768 ph=X  
  
   Call tree:  
→ V8.StackGuard (333.0 ms)  
  
2. 109.9 ms  RunTask  
   CPU  
   Start: 26,815.1 ms (trace-relative)   pid=3392 tid=27768 ph=X  
  
   Call tree:  
→ RunTask (109.9 ms)  
  
3. 108.9 ms  FireAnimationFrame  
   CPU  
   Start: 26,815.4 ms (trace-relative)   pid=3392 tid=27768 ph=X  
  
   Call tree:  
→ FireAnimationFrame (108.9 ms)  
  
4. 85.8 ms  RunTask  
   CPU  
   Start: 25,619.7 ms (trace-relative)   pid=3392 tid=27768 ph=X  
  
   Call tree:  
→ RunTask (85.8 ms)  
  
5. 65.1 ms  RunTask  
   CPU  
   Start: 8,395.2 ms (trace-relative)   pid=3392 tid=27768 ph=X  
  
   Call tree:  
→ RunTask (65.1 ms)  
  
  
------------------------------------------------------------------------  
## FRAME / HITCH SUMMARY  
Frames: 1,045  
Median frame duration: 28.0 ms  
Average frame duration: 28.3 ms  
P95 frame duration: 33.4 ms  
P99 frame duration: 59.8 ms  
Longest frame: 109.5 ms (start 26,815.8 ms, trace-relative)  
Frames > 16.7 ms (<60 FPS): 1,045  
Frames > 33.3 ms (<30 FPS): 55  
Frames > 100 ms: 1  
  
Extracting embedded CPU profiles...  
CPU profiles: 1  
  
------------------------------------------------------------------------  
## TOP 5 WEBGL / THREE.JS / SHADER OPERATIONS  
1. projectObject  
   THREE.JS RENDERER   Profile CPU: 0.0 ms   Samples: 2788   Profiles: 1   Nodes: 1  
   Location: http://localhost:5590/node_modules/.vite/deps/chunk-4SR3H3JQ.js?v=e0296693:42152:27  
  
   Profile call tree:  
   → projectObject  
  
2. renderObject  
   THREE.JS RENDERER   Profile CPU: 0.0 ms   Samples: 1532   Profiles: 1   Nodes: 1  
   Location: http://localhost:5590/node_modules/.vite/deps/chunk-4SR3H3JQ.js?v=e0296693:37526:24  
  
   Profile call tree:  
   → renderObject  
  
3. renderObject  
   THREE.JS RENDERER   Profile CPU: 0.0 ms   Samples: 1379   Profiles: 1   Nodes: 1  
   Location: http://localhost:5590/node_modules/.vite/deps/three_addons_renderers_CSS2DRenderer__js.js?v=e0296693:89:26  
  
   Profile call tree:  
   → renderObject  
  
4. WebGLRenderer.renderBufferDirect  
   THREE.JS RENDERER   Profile CPU: 0.0 ms   Samples: 1225   Profiles: 1   Nodes: 1  
   Location: http://localhost:5590/node_modules/.vite/deps/chunk-4SR3H3JQ.js?v=e0296693:41862:39  
  
   Profile call tree:  
   → WebGLRenderer.renderBufferDirect  
  
5. setProgram  
   THREE.JS RENDERER   Profile CPU: 0.0 ms   Samples: 1171   Profiles: 1   Nodes: 1  
   Location: http://localhost:5590/node_modules/.vite/deps/chunk-4SR3H3JQ.js?v=e0296693:42425:24  
  
   Profile call tree:  
   → setProgram  
  
  
------------------------------------------------------------------------  
## TOP APPLICATION CPU OPERATIONS  
This trace's embedded CPU profiles carry no `timeDeltas` (per-sample timing), so sampled CPU time cannot be computed for any function, application or otherwise. Ranking below falls back to sample/node count, which reflects sampling frequency, not wall-clock CPU cost. To get real per-function CPU time, re-record with a capture path that preserves `timeDeltas` on `disabled-by-default-v8.cpu_profiler` `ProfileChunk` events.  
  
1. nearestRiverShoreCandidate  
   APPLICATION   Sampled CPU: 0.0 ms   Samples: 5387   Profiles: 1   Nodes: 1  
   Location: http://localhost:5590/src/terrain/riverNetwork.ts:214:43  
  
   Profile call tree:  
   → nearestRiverShoreCandidate  
  
2. recordDraw  
   APPLICATION   Sampled CPU: 0.0 ms   Samples: 437   Profiles: 1   Nodes: 1  
   Location: http://localhost:5590/src/perf/passSubmissionCollector.ts:150:22  
  
   Profile call tree:  
   → recordDraw  
  
3. classifyObject  
   APPLICATION   Sampled CPU: 0.0 ms   Samples: 412   Profiles: 1   Nodes: 1  
   Location: http://localhost:5590/src/perf/sceneCensus.ts:111:31  
  
   Profile call tree:  
   → classifyObject  
  
4. readField  
   APPLICATION   Sampled CPU: 0.0 ms   Samples: 328   Profiles: 1   Nodes: 1  
   Location: http://localhost:5590/src/terrain/chunkManager.ts:1569:21  
  
   Profile call tree:  
   → readField  
  
5. mutable.renderBufferDirect  
   APPLICATION   Sampled CPU: 0.0 ms   Samples: 296   Profiles: 1   Nodes: 1  
   Location: http://localhost:5590/src/perf/passSubmissionCollector.ts:192:34  
  
   Profile call tree:  
   → mutable.renderBufferDirect  
  
  
------------------------------------------------------------------------  
## TOP 5 TRACE WEBGL / SHADER EVENTS  
No WebGL/Three.js/shader trace events found.  
  
------------------------------------------------------------------------  
## GPU SUMMARY  
Total GPU task time: 10,230.8 ms  
Total GPU task self: 10,230.8 ms  
GPU task calls: 26927  
  
------------------------------------------------------------------------  
### TOP 5 GPU TASKS  
1. 7.3 ms  GPUTask  
   GPU  
   pid=17032 tid=33652 ph=X  
   Total: 7.3 ms  
  
   Call tree:  
→ GPUTask (7.3 ms)  
  
2. 6.5 ms  GPUTask  
   GPU  
   pid=17032 tid=33652 ph=X  
   Total: 6.5 ms  
  
   Call tree:  
→ GPUTask (6.5 ms)  
  
3. 3.0 ms  GPUTask  
   GPU  
   pid=17032 tid=33652 ph=X  
   Total: 3.0 ms  
  
   Call tree:  
→ GPUTask (3.0 ms)  
  
4. 2.9 ms  GPUTask  
   GPU  
   pid=17032 tid=33652 ph=X  
   Total: 2.9 ms  
  
   Call tree:  
→ GPUTask (2.9 ms)  
  
5. 2.8 ms  GPUTask  
   GPU  
   pid=17032 tid=33652 ph=X  
   Total: 2.8 ms  
  
   Call tree:  
→ GPUTask (2.8 ms)  
  
  
DONE  
