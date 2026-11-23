import test from 'node:test';
import assert from 'node:assert/strict';
import { gameReducer, initialState, STOCK_SIZE, packShells } from './game.ts';
import { shouldPickFruit } from './interaction.ts';

const advance = state => gameReducer(state, { type: 'advance', fromScreen: state.screen });
const start = () => Array.from({ length: 7 }).reduce(advance, { ...initialState, selected: [] });
const pick = (state, n) => Array.from({ length: n }, (_, fruit) => fruit).reduce((s, fruit) => gameReducer(s, { type: 'pick', fruit }), state);
const handOver = state => advance(advance(advance(gameReducer(state, { type: 'counter' }))));

test('orders advance only after confirmation and quantities conserve shelf stock', () => {
  const state = start();
  assert.equal(state.screen, 7);
  assert.equal(advance(state), state);
  const full = pick(state, STOCK_SIZE);
  assert.equal(full.selected.length, STOCK_SIZE);
  assert.equal(gameReducer(full, { type: 'pick', fruit: 0 }), full);
  assert.equal(gameReducer(full, { type: 'pick', fruit: STOCK_SIZE }), full);
  assert.equal(gameReducer(full, { type: 'pick', fruit: 0.5 }), full);
  assert.equal(gameReducer(state, { type: 'remove' }), state);
  assert.equal(gameReducer(state, { type: 'counter' }), state);
});

test('excess can be returned and handed over without losing the order', () => {
  let s = handOver(pick(start(), 6));
  assert.equal(s.screen, 15);
  s = gameReducer(s, { type: 'shelf' });
  assert.equal(s.screen, 16);
  s = gameReducer(s, { type: 'remove' });
  assert.equal(s.screen, 17);
  s = handOver(s);
  assert.equal(s.screen, 18);
  assert.equal(advance(s).coins, 3);
});

test('short orders preserve existing fruit and can be completed', () => {
  let s = handOver(pick(start(), 3));
  assert.equal(s.screen, 19);
  s = gameReducer(s, { type: 'shelf' });
  assert.equal(s.screen, 20);
  s = gameReducer(s, { type: 'pick', fruit: 3 });
  s = gameReducer(s, { type: 'pick', fruit: 4 });
  assert.equal(s.screen, 21);
  assert.equal(handOver(s).screen, 22);
});

test('four customers earn exactly twelve coins and replay resets the day', () => {
  let s = start();
  for (let customer = 0; customer < 4; customer++) {
    s = handOver(pick(s, 5));
    assert.equal(s.screen, 14);
    s = advance(s);
    assert.equal(s.coins, (customer + 1) * 3);
    assert.equal(s.completed, customer + 1);
    s = advance(s);
    if (customer < 3) for (let i = 0; i < 7; i++) s = advance(s);
  }
  assert.equal(s.screen, 24);
  s = advance(s);
  assert.equal(s.screen, 25);
  assert.equal(advance(s), s);
  assert.deepEqual(gameReducer(s, { type: 'restart' }), initialState);
});

test('navigation and fruit events cannot modify a completed reward', () => {
  const result = advance(handOver(pick(start(), 5)));
  for (const action of [{ type: 'counter' }, { type: 'shelf' }, { type: 'pick', fruit: 8 }, { type: 'remove' }]) {
    assert.equal(gameReducer(result, action), result);
  }
});

test('a stale transition cannot dismiss the order or advance the next customer', () => {
  const modal = { ...initialState, screen: 4 };
  assert.equal(gameReducer(modal, { type: 'advance', fromScreen: 3 }), modal);
  const confirmed = advance(modal);
  assert.equal(gameReducer(confirmed, { type: 'advance', fromScreen: 4 }), confirmed);
  const success = handOver(pick(start(), 5));
  const reward = advance(success);
  assert.equal(gameReducer(reward, { type: 'advance', fromScreen: success.screen }), reward);
  const next = advance(reward);
  assert.equal(gameReducer(next, { type: 'advance', fromScreen: 23 }), next);
});

test('dragging onto the counter button, floor, or above the basket does not pick fruit', () => {
  assert.equal(shouldPickFruit(130, 660, 400), true);
  assert.equal(shouldPickFruit(130, 755, 400), false);
  assert.equal(shouldPickFruit(130, 600, 400), false);
  assert.equal(shouldPickFruit(205, 660, 400), false);
  assert.equal(shouldPickFruit(60, 660, 400), false);
});

test('a drag that returns to its starting point is a cancellation, not a tap', () => {
  assert.equal(shouldPickFruit(89, 134, 0), true);
  assert.equal(shouldPickFruit(89, 134, 200), false);
});

test('packs add the displayed quantity atomically and cannot be added twice', () => {
  let s = gameReducer(start(), { type: 'pick-pack', pack: 0 });
  assert.equal(s.selected.length, 2);
  assert.equal(gameReducer(s, { type: 'pick-pack', pack: 0 }), s);
  s = gameReducer(s, { type: 'pick-pack', pack: 1 });
  assert.equal(s.selected.length, 5);
  assert.equal(s.screen, 9);
  assert.equal(handOver(s).screen, 14);
});

test('undo returns one shell to its pack and picking it again does not duplicate stock', () => {
  let s = gameReducer(start(), { type: 'pick-pack', pack: 3 });
  assert.equal(s.selected.length, 6);
  s = gameReducer(s, { type: 'remove' });
  assert.equal(s.selected.length, 5);
  assert.equal(packShells(3).filter(id => !s.selected.includes(id)).length, 1);
  s = gameReducer(s, { type: 'pick-pack', pack: 3 });
  assert.equal(s.selected.length, 6);
  assert.equal(new Set(s.selected).size, 6);
});

test('invalid packs and pack events outside the shelf cannot change a round', () => {
  const s = start();
  for (const pack of [-1, 9, 1.5, NaN]) assert.equal(gameReducer(s, { type: 'pick-pack', pack }), s);
  assert.equal(gameReducer(initialState, { type: 'pick-pack', pack: 0 }), initialState);
});
