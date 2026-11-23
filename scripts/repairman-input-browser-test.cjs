// Run with NODE_PATH pointing to Playwright and optional CHROME_PATH.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
(async () => {
  const browser = await chromium.launch({ headless: true, ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}) });
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, hasTouch: true });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    for (const [stage, part, action] of [[11, 'tail', 'click'], [11, 'tail', 'tap'], [11, 'body', 'tap'], [17, 'tip', 'tap'], [14, 'leafLeft', 'hold']]) {
      await page.goto((process.env.BASE_URL || 'http://localhost:8082') + '/games/repairman');
      await page.getByText(String(stage), { exact: true }).click();
      await page.getByRole('button', { name: '시작', exact: true }).click();
      const piece = page.getByTestId(`repair-piece-ocean${stage}_${part}`);
      await piece.waitFor();
      await page.waitForTimeout(1600);
      const transform = () => piece.evaluate(el => {
        const m = new DOMMatrix(getComputedStyle(el).transform);
        return { angle: Math.atan2(m.b, m.a) * 180 / Math.PI, determinant: m.a * m.d - m.b * m.c };
      });
      const before = await transform();
      if (action === 'hold') {
        const r = await piece.boundingBox();
        await page.mouse.move(r.x + r.width / 2, r.y + r.height / 2);
        await page.mouse.down();
        await page.waitForTimeout(300);
        await page.mouse.up();
      } else await piece[action]();
      await page.waitForTimeout(450);
      const after = await transform();
      if (action === 'hold') assert(before.determinant * after.determinant < 0, 'hold flips piece');
      else assert(Math.abs(((after.angle - before.angle + 360) % 360) - 90) < 2, 'tap rotates exactly 90 degrees');
      console.log(`PASS stage ${stage}: ${action}`);
      await page.getByRole('button', { name: '뒤로', exact: true }).click();
    }
    assert.deepEqual(errors, []);
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
