// Playwright is a development-only external tool; run with NODE_PATH and CHROME_PATH.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');

(async () => {
  const browser = await chromium.launch({ headless: true, ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}) });
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const button = name => page.getByRole('button', { name, exact: true });
    const screen = n => page.getByTestId(`fruitstore-screen-${n}`).waitFor({ timeout: 20000 });
    const basket = count => button(`바구니 ${count}개, 눌러서 한 개 되돌리기`);
    const pack = (index, count) => button(`조개 묶음 ${index}, ${count}개 담기`);
    const drag = async points => {
      const from = await pack(1, 2).boundingBox();
      await page.mouse.move(from.x + from.width / 2, from.y + from.height / 2);
      await page.mouse.down();
      for (const [x, y] of points) await page.mouse.move(x, y, { steps: 12 });
      await page.mouse.up();
      await page.waitForTimeout(600);
    };
    const base = process.env.BASE_URL || 'http://localhost:8082';
    await page.goto(base);
    await button('이전 게임').click();
    await page.getByText('조개 상점', { exact: true }).waitFor();
    await button('조개 상점').click();
    await button('게임으로 들어가기').click();
    for (let customer = 0; customer < 4; customer++) {
      await button('조개 5개 주문 확인').click();
      await screen(8);
      if (customer === 0) {
        const target = await basket(0).boundingBox();
        const cx = target.x + target.width / 2, cy = target.y + target.height / 2;
        for (const point of [[cx, target.y - 20], [cx, target.y + target.height + 20], [target.x - 20, cy], [target.x + target.width + 20, cy]]) {
          await drag([point]); await basket(0).waitFor();
        }
        const from = await pack(1, 2).boundingBox();
        await drag([[200, 450], [from.x + from.width / 2, from.y + from.height / 2]]);
        await basket(0).waitFor();
        await drag([[cx, cy]]);
        await basket(2).click();
        await pack(1, 1).waitFor(); // returned exactly one shell, not the whole pack
        await basket(1).click();
        await pack(1, 2).waitFor();

        await button('주문서 다시 보기').click();
        await page.getByRole('dialog').waitFor();
        assert.equal(await pack(1, 2).count(), 0);
        for (let i = 0; i < 8; i++) {
          await page.keyboard.press('Tab');
          assert.equal(await page.evaluate(() => !!document.activeElement.closest('[role="dialog"]')), true);
        }
        await page.keyboard.press('Escape');
        await page.getByRole('dialog').waitFor({ state: 'hidden' });
        await basket(0).waitFor();
        await pack(6, 1).tap();
        await basket(1).click();
        await pack(6, 1).focus();
        await page.keyboard.press('Enter');
        await basket(1).click();
      }
      const count = customer === 0 ? 6 : customer === 1 ? 3 : 5;
      if (customer === 0) await pack(4, 6).click();
      else if (customer === 1) await pack(2, 3).click();
      else { await pack(1, 2).click(); await pack(2, 3).click(); }
      await basket(count).waitFor();
      await button('계산대로 이동').click();
      await screen(13);
      await button(`조개 ${count}개 건네주기`).click();
      if (customer === 0) {
        await screen(16);
        await button('조개가 많아요. 진열대에서 되돌리기').click();
        await basket(6).click();
        await screen(18);
      } else if (customer === 1) {
        await screen(20);
        await button('조개가 모자라요. 진열대에서 더 담기').click();
        await pack(1, 2).click();
        await screen(22);
      }
      if (customer < 2) {
        await button('계산대로 이동').click();
        await button('조개 5개 건네주기').click();
      }
      await screen(24);
      await button(customer === 3 ? '오늘 장사 마치기' : '다음 손님 맞이하기').click();
      console.log(`Customer ${customer + 1} passed`);
    }
    await button('오늘 장사 결과 보기').click();
    await screen(26);
    assert.equal(await page.getByTestId('shellstore-coins').innerText(), '12');
    assert.equal(await page.getByTestId('shellstore-total').innerText(), '12');
    await button('가게로 돌아가 새로 시작').click();
    await page.getByTestId('shellstore-welcome').waitFor();
    await button('게임 선택으로 돌아가기').click();
    await button('다음 게임').waitFor();

    for (const [width, height] of [[390,844], [393,852], [375,667], [320,568], [852,393]]) {
      await page.setViewportSize({ width, height });
      await page.goto(`${base}/games/fruitstore?screen=8`);
      await screen(8);
      const rect = await page.getByTestId('fruitstore-screen-8').boundingBox();
      assert(rect.x >= -1 && rect.y >= -1 && rect.x + rect.width <= width + 1 && rect.y + rect.height <= height + 1);
      assert(Math.abs(rect.width / rect.height - 390 / 844) < .001);
      await page.waitForFunction(() => [...document.images].every(i => i.complete && i.naturalWidth > 0));
    }
    assert.deepEqual(errors, []);
    console.log('PASS: portrait selector entry, pack drag/tap/keyboard, partial undo, modal focus, excess/short corrections, 4 orders, 12 coins, replay, home, responsive bounds, assets');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
