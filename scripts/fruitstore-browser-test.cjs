// Run with Playwright available in NODE_PATH and an Expo web server at BASE_URL.
// Example: NODE_PATH=/tmp/nua-qa/node_modules node scripts/fruitstore-browser-test.cjs
const { chromium } = require('playwright');
const assert = require('node:assert/strict');

(async () => {
  const browser = await chromium.launch({
    headless: true,
    ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}),
  });
  try {
    const page = await browser.newPage({ viewport: { width: 852, height: 393 }, hasTouch: true });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const button = name => page.getByRole('button', { name, exact: true });
    const screen = number => page.getByTestId(`fruitstore-screen-${number}`).waitFor({ timeout: 20000 });
    const basket = count => button(`바구니 ${count}개, 눌러서 한 개 되돌리기`);
    const drag = async points => {
      await page.mouse.move(89, 134);
      await page.mouse.down();
      for (const [x, y] of points) await page.mouse.move(x, y, { steps: 12 });
      await page.mouse.up();
      // Allow the cancellation spring to settle before starting the next gesture.
      await page.waitForTimeout(700);
    };
    await page.goto(`${process.env.BASE_URL || 'http://localhost:8082'}/games/fruitstore`);
    for (let customer = 0; customer < 4; customer++) {
      await button('과일 5개 주문 확인').click();
      await screen(8);
      if (customer === 0) {
        // These points used to count as successful drops outside the visible basket.
        for (const point of [[750, 372], [750, 290], [840, 325], [685, 325]]) {
          await drag([point]);
          await basket(0).waitFor();
        }
        await drag([[300, 150], [89, 134]]);
        await basket(0).waitFor();
        await drag([[750, 325]]);
        await basket(1).click();
        await screen(8);

        // Reopening the order must trap keyboard focus and hide background controls.
        await button('주문서 다시 보기').click();
        await page.getByRole('dialog').waitFor();
        assert.equal(await button('과일 1 담기').count(), 0);
        for (let i = 0; i < 8; i++) {
          await page.keyboard.press('Tab');
          assert.equal(await page.evaluate(() => !!document.activeElement.closest('[role="dialog"]')), true);
        }
        await page.keyboard.press('Escape');
        await page.getByRole('dialog').waitFor({ state: 'hidden' });
        await basket(0).waitFor();
        await button('과일 1 담기').tap();
        await basket(1).click();
        await button('과일 1 담기').focus();
        await page.keyboard.press('Enter');
        await basket(1).click();
      }
      const count = customer === 0 ? 6 : customer === 1 ? 3 : 5;
      for (let fruit = 1; fruit <= count; fruit++) await button(`과일 ${fruit} 담기`).click();
      await button('계산대로 이동').click();
      await screen(13);
      await button(`과일 ${count}개 건네주기`).click();
      if (customer === 0) {
        await screen(16);
        await button('과일이 많아요. 진열대에서 되돌리기').click();
        await basket(6).click();
        await screen(18);
      } else if (customer === 1) {
        await screen(20);
        await button('과일이 모자라요. 진열대에서 더 담기').click();
        await button('과일 4 담기').click();
        await button('과일 5 담기').click();
        await screen(22);
      }
      if (customer < 2) {
        await button('계산대로 이동').click();
        await screen(13);
        await button('과일 5개 건네주기').click();
      }
      await screen(24);
      await button(customer === 3 ? '오늘 장사 마치기' : '다음 손님 맞이하기').click();
      console.log(`Customer ${customer + 1} passed`);
    }
    await screen(25);
    await button('오늘 장사 결과 보기').click();
    await screen(26);
    assert.equal(await page.getByText('12', { exact: true }).count(), 2);
    await button('가게로 돌아가 새로 시작').click();
    await screen(1);
    assert.deepEqual(errors, []);
    console.log('PASS: drop bounds, cancelled drag, modal focus, touch, keyboard, corrections, 12 coins, restart');
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
