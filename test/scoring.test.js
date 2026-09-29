import test from 'node:test';
import assert from 'node:assert/strict';
import { score, rank } from '../src/scoring.js';

test('net return accounts for effort, acceptance and payout uncertainty', () => {
  const s = score({ reward: 100, fee: 10, hours: 3, acceptance: 50, payout: 80 });
  assert.deepEqual(s, { net: 90, expected: 36, hourly: 12 });
});
test('a smaller quick task can outrank a larger uncertain task', () => {
  const small = { reward: 80, fee: 0, hours: 2, acceptance: 75, payout: 95 };
  const large = { reward: 350, fee: 20, hours: 18, acceptance: 35, payout: 85 };
  assert.equal(rank([large, small])[0], small);
});
test('invalid effort and impossible fees do not produce a score', () => {
  assert.equal(score({ reward: 20, fee: 30, hours: 2, acceptance: 80, payout: 80 }), null);
  assert.equal(score({ reward: 20, fee: 0, hours: 0, acceptance: 80, payout: 80 }), null);
});
