// Playwright is a development-only external tool; run with NODE_PATH and CHROME_PATH.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
(async () => {
  const browser = await chromium.launch({ headless: true, ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}) });
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    const button = name => page.getByRole('button', { name, exact: true });
    const screen = n => page.getByTestId(`fruitstore-screen-${n}`).waitFor({ timeout: 20000 });
    const basket = n => n === 0 ? page.getByTestId('empty-shell-basket') : button(`바구니 조개 ${n}개 꺼내기`);
    const pack = (i, n) => button(`조개 묶음 ${i}, ${n}개 바닥에 놓기`);
    const floor = (i, n) => button(`바닥 조개 묶음 ${i}, ${n}개 선택`);
    const drag = async (source, points) => {
      const r = await source.boundingBox();
      await page.mouse.move(r.x + r.width / 2, r.y + r.height / 2);
      await page.mouse.down();
      for (const [x,y] of points) await page.mouse.move(x,y,{ steps: 14 });
      await page.mouse.up();
      await page.waitForTimeout(500);
    };
    const put = async (i,n) => { await drag(pack(i,n), [[80,465]]); await drag(floor(1,n), [[130,660]]); };
    const base = process.env.BASE_URL || 'http://localhost:8082';
    await page.goto(base);
    await button('이전 게임').click();
    await button('조개 상점').click();
    await button('조개 5개 주문 확인').waitFor();
    assert.equal(await page.getByTestId('shellstore-welcome').count(), 0);
    for (let customer = 0; customer < 4; customer++) {
      const target = [5, 4, 6, 7][customer];
      await button(`조개 ${target}개 주문 확인`).click(); await screen(8);
      if (customer === 0) {
        // Clicking or pressing Enter does not transfer a shelf pack.
        await pack(1,2).click(); await pack(1,2).tap();
        await pack(1,2).focus(); await page.keyboard.press('Enter');
        assert.equal(await floor(1,2).count(), 0); await basket(0).waitFor();
        // A shelf pack cannot go straight to the basket or outside the floor.
        await drag(pack(1,2), [[130,660]]); await basket(0).waitFor(); await pack(1,2).waitFor();
        await drag(pack(1,2), [[380,800]]); await pack(1,2).waitFor();
        await drag(pack(1,2), [[200,450],[89,233]]); await pack(1,2).waitFor();
        await drag(pack(1,2), [[80,465]]); await floor(1,2).waitFor(); await basket(0).waitFor();
        assert.equal(await button('계산대로 이동').isDisabled(), true);
        await drag(pack(2,3), [[195,465]]); await floor(2,3).waitFor();
        await page.screenshot({ path: '/private/tmp/nua-review-qa/floor-separate.png' });
        await drag(floor(1,2), [[195,465]]); await floor(2,5).waitFor(); await basket(0).waitFor();
        await page.screenshot({ path: '/private/tmp/nua-review-qa/floor-combined.png' });
        await floor(2,5).click(); await floor(2,5).click();
        await floor(2,5).waitFor(); await basket(0).waitFor();
        assert.equal(await button('선택한 바닥 묶음 바구니에 담기').count(), 0);
        await button('선택한 바닥 묶음에서 조개 하나 떼기').click();
        await floor(1,1).waitFor(); await floor(2,4).waitFor();
        await drag(floor(1,1), [[195,465]]); await floor(2,5).waitFor();
        await drag(floor(2,5), [[380,800]]); await floor(2,5).waitFor();
        await drag(floor(2,5), [[130,660]]); await basket(5).waitFor();
        await basket(5).click(); await basket(5).waitFor(); // clicking basket does not remove shells
        await drag(basket(5), [[80,465]]); await floor(1,5).waitFor(); await basket(0).waitFor();
        await drag(floor(1,5), [[190,280]]); await pack(1,2).waitFor(); await pack(2,3).waitFor();
        await drag(pack(1,2), [[80,465]]); await drag(pack(2,3), [[80,465]]);
        await drag(floor(1,5), [[130,660]]); await basket(5).waitFor();
        // Order modal continues to isolate the floor and shelf controls.
        await button('주문서 다시 보기').click(); await page.getByRole('dialog').waitFor();
        assert.equal(await pack(3,4).count(), 0);
        for (let i=0;i<8;i++) { await page.keyboard.press('Tab'); assert(await page.evaluate(()=>!!document.activeElement.closest('[role="dialog"]'))); }
        await page.keyboard.press('Escape'); await page.getByRole('dialog').waitFor({ state:'hidden' });
      } else if (customer === 1) await put(4,6);
      else if (customer === 2) await put(2,3);
      else {
        await drag(pack(1,2), [[80,465]]); await drag(pack(2,3), [[195,465]]);
        // Clicking two groups does not combine them; only dropping onto a group does.
        await floor(1,2).click(); await floor(2,3).click();
        await floor(1,2).waitFor(); await floor(2,3).waitFor();
        await drag(floor(1,2), [[195,465]]); await drag(floor(2,5), [[130,660]]);
        await put(7,2);
      }
      const count = customer === 1 ? 6 : customer === 2 ? 3 : customer === 3 ? 7 : 5;
      await button('계산대로 이동').click(); await button(`조개 ${count}개 건네주기`).click();
      if (customer === 1) {
        await button('조개가 많아요. 진열대에서 되돌리기').click();
        await drag(basket(6), [[80,465]]);
        await button('선택한 바닥 묶음에서 조개 하나 떼기').click();
        await floor(2,1).waitFor();
        await button('선택한 바닥 묶음에서 조개 하나 떼기').click();
        await drag(floor(1,4), [[130,660]]); // extra stays on floor
      } else if (customer === 2) {
        await button('조개가 모자라요. 진열대에서 더 담기').click(); await put(8,3);
      }
      if (customer === 1 || customer === 2) { await button('계산대로 이동').click(); await button(`조개 ${target}개 건네주기`).click(); }
      await screen(24);
      await button(customer === 3 ? '오늘 장사 마치기' : '다음 손님 맞이하기').click();
      console.log(`Customer ${customer+1} passed`);
    }
    await button('오늘 장사 결과 보기').click(); await screen(26);
    assert.equal(await page.getByTestId('shellstore-total').innerText(),'12');
    await button('가게로 돌아가 새로 시작').click(); await button('조개 5개 주문 확인').waitFor();
    assert.equal(await page.getByTestId('shellstore-welcome').count(), 0);
    await button('게임 선택으로 돌아가기').click(); await button('다음 게임').waitFor();
    for (const [width,height] of [[393,852],[375,667],[320,568],[852,393]]) {
      await page.setViewportSize({width,height}); await page.goto(`${base}/games/fruitstore?screen=8`); await screen(8);
      const r=await page.getByTestId('fruitstore-screen-8').boundingBox();
      assert(r.x>=-1&&r.y>=-1&&r.x+r.width<=width+1&&r.y+r.height<=height+1);
    }
    assert.deepEqual(errors,[]);
    console.log('PASS: mandatory floor staging, combining, splitting, return, cancelled drops, drag-only transfer/return, no click transfers, modal, all orders, responsive bounds');
  } finally { await browser.close(); }
})().catch(e=>{console.error(e);process.exitCode=1});
