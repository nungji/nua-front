// Run with: node scripts/repairman-data-test.cjs
// Load the TypeScript-only puzzle data without a native runtime.
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const ts = require('typescript');
const resolve = Module._resolveFilename;
Module._resolveFilename = function (request, ...args) {
  return resolve.call(this, request.startsWith('@/') ? path.join(root, 'src', request.slice(2)) : request, ...args);
};
require.extensions['.ts'] = (mod, file) => mod._compile(ts.transpileModule(fs.readFileSync(file, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 }
}).outputText, file);

const { STAGES, buildPuzzle } = require('../src/games/repairman/game/stages.ts');
const { piecePolygon } = require('../src/games/repairman/game/shapes.ts');
const originalCounts = [3, 4, 5, 5, 3, 5, 6, 5, 6, 7, 4, 6, 7, 4, 6, 8, 4, 6, 7, 9];
assert.equal(STAGES.length, 20);
for (const size of [{ width: 480, height: 298 }, { width: 658, height: 408 }, { width: 829, height: 310 }, { width: 1252, height: 568 }]) {
  for (const [index, stage] of STAGES.entries()) {
    assert.equal(stage.parts.length, originalCounts[index]);
    assert.equal(stage.slots, stage.id <= 4);
    assert.equal(stage.connectors, stage.id <= 4);
    assert.equal(stage.rotate, (stage.id >= 11 && stage.id <= 13) || stage.id >= 17);
    assert.equal(stage.flip, stage.id >= 14);
    assert.equal(stage.dependency, stage.id === 20);
    const puzzle = buildPuzzle(stage, size);
    assert.equal(new Set(puzzle.pieces.map(piece => piece.id)).size, stage.parts.length);
    for (const piece of puzzle.pieces) {
      assert(piece.slot.x >= 0 && piece.slot.y >= 0, `${stage.name}: target origin`);
      assert(piece.slot.x + piece.width <= size.width, `${stage.name}: target width`);
      assert(piece.slot.y + piece.height <= size.height, `${stage.name}: target height`);
      assert(piece.start.y + piece.height <= size.height, `${stage.name}: scatter height`);
      assert(piece.symmetry[0], `${stage.name}: correct orientation accepted`);
      assert(piecePolygon(piece).length >= 3, `${stage.name}: collision polygon`);
    }
    if (stage.dependency) assert(puzzle.pieces.some(piece => piece.requires));
  }
}
console.log('PASS: 20 ocean puzzles, 4 sizes, unchanged counts and difficulty flags, valid target/scatter bounds and symmetry');
