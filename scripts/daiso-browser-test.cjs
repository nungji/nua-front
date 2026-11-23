const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const path = require('node:path');
const outputDir = process.env.QA_OUTPUT_DIR || path.join(require('node:os').tmpdir(), 'nua-daiso-qa');
require('node:fs').mkdirSync(outputDir, { recursive: true });
(async () => {
 const browser = await chromium.launch({ headless: true, ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}) });
 try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  const waitForImages = () => page.waitForFunction(() => [...document.images].filter(img => img.getBoundingClientRect().width > 0).every(img => img.complete && img.naturalWidth > 0));
  const errors = []; page.on('pageerror', error => errors.push(error.message));
  await page.goto((process.env.BASE_URL || 'http://localhost:8082') + '/');
  await page.getByRole('button', { name: '이전 게임', exact: true }).click();
  await page.waitForTimeout(900);
  await page.getByRole('button', { name: '만물상', exact: true }).click();
  await page.getByTestId('daiso-stage-1').waitFor();
  await page.waitForTimeout(1000);
  await waitForImages();
  await page.waitForTimeout(700);
  await page.screenshot({ path: path.join(outputDir, 'daiso-map.png') });
  assert.equal(await page.getByTestId('daiso-stage-2').getAttribute('aria-disabled'), 'true');
  await page.getByTestId('daiso-stage-4').scrollIntoViewIfNeeded();
  await page.getByTestId('daiso-stage-1').scrollIntoViewIfNeeded();
  await page.getByTestId('daiso-stage-1').click();
  await page.getByRole('button', { name: '다음 이야기', exact: true }).click();
  await waitForImages();
  await page.waitForTimeout(700);
  await page.screenshot({ path: path.join(outputDir, 'daiso-story.png') });
  await page.getByRole('button', { name: '도와주러 가기', exact: true }).click();
  await waitForImages();
  await page.waitForTimeout(700);
  await page.screenshot({ path: path.join(outputDir, 'daiso-choose.png') });
  await page.getByRole('button', { name: '양말 선택', exact: true }).click();
  for (let i = 0; i < 2; i++) await page.getByRole('button', { name: '다음 장면', exact: true }).click();
  await page.getByRole('button', { name: '다시 고르기', exact: true }).click();
  await page.getByRole('button', { name: '양동이 선택', exact: true }).click();
  for (let i = 0; i < 3; i++) await page.getByRole('button', { name: '다음 장면', exact: true }).click();
  await waitForImages();
  await page.waitForTimeout(700);
  await page.screenshot({ path: path.join(outputDir, 'daiso-result.png') });
  await page.getByRole('button', { name: '완료', exact: true }).click();
  await page.getByTestId('daiso-complete').waitFor();
  await page.getByRole('button', { name: '스테이지 지도', exact: true }).click();
  await page.getByText('✓ 꽃을 도와줬어요!', { exact: true }).waitFor();
  await page.setViewportSize({ width: 844, height: 390 });
  await page.getByTestId('daiso-stage-1').click();
  await page.getByRole('button', { name: '다음 이야기', exact: true }).click();
  await page.getByRole('button', { name: '도와주러 가기', exact: true }).click();
  await waitForImages();
  await page.waitForTimeout(700);
  await page.screenshot({ path: path.join(outputDir, 'daiso-small.png') });
  for (const name of ['양동이 선택', '양말 선택']) {
   const r = await page.getByRole('button', { name, exact: true }).boundingBox();
   assert.ok(r.x >= 0 && r.y >= 0 && r.x + r.width <= 844 && r.y + r.height <= 390);
  }
  assert.deepEqual(errors, []);
  console.log('PASS home entry, locked stages, story, sock retry, bucket completion, replay, small landscape');
 } finally { await browser.close(); }
})();
