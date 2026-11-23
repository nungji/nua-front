import test from 'node:test';
import assert from 'node:assert/strict';
import { gameReducer, initialState, STOCK_SIZE, availablePack, SHELL_PACKS } from './game.ts';
import { BASKET, FLOOR, floorSlotAt, containsPoint } from './interaction.ts';

const advance = state => gameReducer(state, { type: 'advance', fromScreen: state.screen });
const start = () => Array.from({ length: 7 }).reduce(advance, initialState);
const stage = (s, pack, slot) => gameReducer(s, { type: 'stage-pack', pack, slot });
const basket = (s, slot) => gameReducer(s, { type: 'basket-floor', slot });
const handOver = s => advance(advance(advance(gameReducer(s, { type: 'counter' }))));
const exact = s => basket(stage(stage(s, 0, 0), 1, 0), 0);
const conserve = s => {
  const ids = [...s.selected, ...s.floor.flat(), ...SHELL_PACKS.flatMap((_, i) => availablePack(s, i))];
  assert.equal(ids.length, STOCK_SIZE);
  assert.equal(new Set(ids).size, STOCK_SIZE);
};

test('shelf packs go to the floor first and do not allow checkout', () => {
  const s = stage(start(), 0, 0);
  assert.equal(s.floor[0].length, 2);
  assert.equal(s.selected.length, 0);
  assert.equal(gameReducer(s, { type: 'counter' }), s);
  assert.equal(stage(s, 0, 1), s);
  conserve(s);
});

test('two floor groups combine and the combined group moves into the basket', () => {
  let s = stage(stage(start(), 0, 0), 1, 1);
  s = gameReducer(s, { type: 'move-floor', from: 0, to: 1 });
  assert.equal(s.floor[0].length, 0);
  assert.equal(s.floor[1].length, 5);
  assert.equal(s.selected.length, 0);
  s = basket(s, 1);
  assert.equal(s.selected.length, 5);
  assert.equal(s.floor.flat().length, 0);
  assert.equal(s.screen, 9);
  assert.equal(basket(s, 1), s);
  conserve(s);
});

test('dropping another shelf pack on a floor group combines it without filling basket', () => {
  const s = stage(stage(start(), 0, 0), 1, 0);
  assert.equal(s.floor[0].length, 5);
  assert.equal(s.selected.length, 0);
  conserve(s);
});

test('split removes one shell into a separate floor group and return restores original shelf', () => {
  let s = stage(start(), 3, 2);
  s = gameReducer(s, { type: 'split-floor', slot: 2 });
  assert.equal(s.floor[2].length, 5);
  assert.equal(s.floor[0].length, 1);
  s = gameReducer(s, { type: 'return-floor', slot: 0 });
  assert.equal(availablePack(s, 3).length, 1);
  s = basket(s, 2);
  assert.equal(handOver(s).screen, 14);
  conserve(s);
});

test('dragging basket contents out moves all shells to the floor, not the shelf', () => {
  let s = exact(start());
  s = gameReducer(s, { type: 'unbasket', slot: 0 });
  assert.equal(s.selected.length, 0);
  assert.equal(s.floor.flat().length, 5);
  assert.equal(availablePack(s, 1).length, 0);
  conserve(s);
});

test('full floor rejects implicit additions and splitting, but allows merging and undo', () => {
  let s = basket(stage(start(), 8, 0), 0);
  for (let i = 0; i < 6; i++) s = stage(s, i, i);
  assert.equal(stage(s, 6), s);
  assert.equal(gameReducer(s, { type: 'split-floor', slot: 0 }), s);
  s = gameReducer(s, { type: 'unbasket', slot: 0 });
  assert.equal(s.floor[0].length, 6);
  s = gameReducer(s, { type: 'move-floor', from: 0, to: 1 });
  assert.equal(s.floor[1].length, 9);
  conserve(s);
});

test('excess and short orders preserve all floor work through correction', () => {
  let s = stage(basket(stage(start(), 3, 0), 0), 5, 1);
  s = handOver(s);
  assert.equal(s.screen, 15);
  assert.equal(s.floor[1].length, 1);
  s = gameReducer(s, { type: 'shelf' });
  s = gameReducer(s, { type: 'unbasket', slot: 0 });
  s = gameReducer(s, { type: 'split-floor', slot: 0 });
  s = basket(s, 0);
  assert.equal(handOver(s).screen, 18);
  conserve(s);
  s = handOver(basket(stage(start(), 1, 0), 0));
  assert.equal(s.screen, 19);
  s = gameReducer(s, { type: 'shelf' });
  s = basket(stage(s, 0, 0), 0);
  assert.equal(handOver(s).screen, 22);
});

test('four customers earn exactly twelve coins and reset floor between orders', () => {
  let s = start();
  for (let customer = 0; customer < 4; customer++) {
    s = exact(s);
    s = stage(s, 5, 0); // leftover floor work must not leak into the next order
    s = advance(handOver(s));
    assert.equal(s.coins, (customer + 1) * 3);
    s = advance(s);
    if (customer < 3) {
      assert.equal(s.floor.flat().length, 0);
      for (let i = 0; i < 7; i++) s = advance(s);
    }
  }
  assert.equal(s.screen, 24);
  s = advance(s);
  assert.equal(s.screen, 25);
  assert.deepEqual(gameReducer(s, { type: 'restart' }), initialState);
});

test('invalid slots and actions outside shelf do not mutate inventory', () => {
  const s = start();
  for (const slot of [-1, 6, 1.5, NaN]) {
    assert.equal(stage(s, 0, slot), s);
    assert.equal(basket(s, slot), s);
    assert.equal(gameReducer(s, { type: 'move-floor', from: 0, to: slot }), s);
  }
  for (const pack of [-1, 9, 1.5, NaN]) assert.equal(stage(s, pack, 0), s);
  assert.equal(stage(initialState, 0, 0), initialState);
});

test('stale transitions cannot skip the next order or double-award rewards', () => {
  const success = handOver(exact(start()));
  const reward = advance(success);
  assert.equal(gameReducer(reward, { type: 'advance', fromScreen: success.screen }), reward);
  const next = advance(reward);
  assert.equal(gameReducer(next, { type: 'advance', fromScreen: 23 }), next);
});

test('floor and basket targets are separate and floor positions snap into six slots', () => {
  assert.equal(floorSlotAt(BASKET.x + 30, BASKET.y + 30), null);
  assert.equal(floorSlotAt(FLOOR.x - 1, FLOOR.y), null);
  assert.equal(floorSlotAt(50, 450), 0);
  assert.equal(floorSlotAt(180, 450), 1);
  assert.equal(floorSlotAt(320, 530), 5);
  assert.equal(containsPoint(BASKET, 130, 660), true);
  assert.equal(containsPoint(BASKET, 130, 750), false);
});
