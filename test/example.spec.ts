import { test, expect } from '@playwright/test'

/**
 * Harness 표준 Playwright spec 템플릿.
 *
 * ⚠️ 이 spec이 동작하려면:
 * - package.json에 `dev` 스크립트가 있어야 함 (playwright.config.ts의 webServer가 호출)
 * - dev 서버가 baseURL(playwright.config.ts) 포트에서 응답해야 함
 *
 * 각 spec 파일은 plan.md의 테스트 케이스 1개에 대응.
 * 명명: NN-short-description.spec.ts (예: 01-normal-flow.spec.ts)
 *
 * 이 example 파일은 init 시 자동 생성됨 — 첫 spec 작성 후 삭제하거나 덮어써.
 */

test('example — 페이지 로드 + 핵심 요소 표시', async ({ page }) => {
  await page.goto('/')

  // 예: 페이지 타이틀, 핵심 인터랙티브 요소가 보이는지 확인
  await expect(page).toHaveTitle(/.+/)

  // TODO: 프로젝트 spec.md의 첫 완료 조건을 여기로 옮기기
})
