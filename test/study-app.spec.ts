import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.removeItem('study-app:subjects');
    localStorage.removeItem('study-app:records');
  });
});

// TC1: 정상 흐름 — 수학 등록 → 오늘 화면 체크 + 시간 입력 → 주간 요약 확인
test('TC1: 정상 흐름 - 과목 등록 후 완료 체크와 시간 입력이 주간 요약에 반영된다', async ({ page }) => {
  // 오늘이 주말이면 수학 스케줄이 없으므로 스킵
  const todayDay = new Date().getDay();
  if (todayDay === 0 || todayDay === 6) {
    test.skip(true, '오늘이 주말이라 수학(월~금) 스케줄 없음 — TC1 스킵');
    return;
  }

  // 설정 화면에서 수학 등록 (월~금 30분)
  await page.goto('/settings');
  await page.getByRole('button', { name: '+ 과목 추가' }).click();
  await page.getByLabel('과목명').fill('수학');
  for (const day of ['월', '화', '수', '목', '금']) {
    await page.getByLabel(`${day}요일 목표 시간`).fill('30');
  }
  await page.getByRole('button', { name: '저장' }).click();
  await expect(page.getByText('수학')).toBeVisible();

  // 오늘 화면: 완료 체크 + 실제 40분
  await page.getByRole('link', { name: '오늘' }).click();
  await page.waitForURL('/');
  await expect(page.getByText('수학')).toBeVisible();
  await page.getByLabel('수학 완료').check();
  await page.getByLabel('수학 실제 시간').fill('40');

  // 새로고침 후 데이터 유지 확인
  await page.reload();
  await expect(page.getByLabel('수학 완료')).toBeChecked();
  await expect(page.getByLabel('수학 실제 시간')).toHaveValue('40');

  // 주간 요약: 수학 행에 실제 40분이 표시되고 달성률이 0% 초과인지 확인
  await page.getByRole('link', { name: '주간' }).click();
  await page.waitForURL('/weekly');

  const row = page.locator('tr', { has: page.getByText('수학') });
  await expect(row).toBeVisible();

  // 실제 시간 40분이 주간 합산에 반영되어야 함
  await expect(row.getByText('40분')).toBeVisible();

  // 달성률이 0%가 아닌 값이어야 함
  const rateText = await row.locator('.rate-text').textContent();
  const rate = parseInt(rateText ?? '0');
  expect(rate).toBeGreaterThan(0);
});

// TC4: 과목 미등록 상태에서 오늘 화면 접속
test('TC4: 과목 미등록 시 오늘 화면에 안내 메시지와 설정 링크가 표시된다', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('과목을 먼저 등록하세요')).toBeVisible();
  await expect(page.getByRole('link', { name: '과목 설정으로 이동' })).toBeVisible();
});
