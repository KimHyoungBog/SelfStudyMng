import { defineConfig, devices } from '@playwright/test'

/**
 * Harness 표준 Playwright config.
 *
 * ⚠️ 사용 전 필수 작업:
 * 1. package.json에 `dev` 스크립트 추가 (Vite면 "dev": "vite", Next면 "dev": "next dev", 등)
 *    아래 webServer.command가 `npm run dev`를 호출하므로 이 스크립트가 없으면 즉시 실패.
 * 2. 프로젝트의 dev server 포트가 5173과 다르면 아래 baseURL과 webServer.url을 함께 수정.
 * 3. UI가 없는 프로젝트(CLI/라이브러리)는 이 파일을 삭제하고 적절한 test runner로 대체.
 */
export default defineConfig({
  testDir: './test',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['list'],
    ['json', { outputFile: 'test-results.json' }],
  ],
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
})
