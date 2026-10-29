import ts from 'typescript'
export default {
  esbuild: false,
  resolve: { preserveSymlinks: true },
  plugins: [{ name: 'sandbox-in-process-typescript', enforce: 'pre', transform(code, id) {
    if (!/\.tsx?(?:\?|$)/.test(id)) return
    return { code: ts.transpileModule(code, { compilerOptions: { target: ts.ScriptTarget.ESNext, module: ts.ModuleKind.ESNext } }).outputText, map: null }
  } }],
  test: { pool: 'threads', maxWorkers: 1, include: ['src/characters/mergePeasantBody.assets.test.ts', 'src/render/actorCullBounds.assets.test.ts', 'src/render/actorCullBounds.test.ts', 'src/perf/passSubmissionCollector.test.ts'] },
}
