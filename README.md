# 학습관리 (SelfStudyMng)

중학생을 위한 과목별 학습 시간 관리 웹앱. 요일별 목표 학습 시간을 설정하고, 매일 실제 학습 시간을 기록하며, 주간 달성률을 확인할 수 있다.

## 주요 기능

- **오늘**: 오늘 예정된 과목 목록을 보여주고, 완료 여부와 실제 학습 시간(분)을 입력
- **주간**: 이번 주(월~일) 과목별 목표 시간 대비 실제 시간과 달성률을 표로 확인
- **설정**: 과목 추가/편집/삭제, 요일별 목표 학습 시간(분) 설정

데이터는 브라우저의 `localStorage`에 저장된다 (`study-app:subjects`, `study-app:records`).

## 기술 스택

- React 18 + TypeScript
- React Router
- Vite
- Playwright (E2E 테스트)

## 시작하기

```bash
npm install

# 개발 서버
npm run dev

# 빌드 / 미리보기
npm run build
npm run preview
```

## 테스트

```bash
npx playwright install chromium   # 최초 1회

npm run test:e2e          # 전체 E2E 테스트
npm run test:e2e:ui       # Playwright UI 모드
npm run test:e2e:headed   # 브라우저 확인하며 실행
```

테스트 파일은 `test/*.spec.ts`에 위치한다.

## 프로젝트 구조

```
src/
├── App.tsx              # 라우팅 및 상단 네비게이션
├── types.ts             # Subject, DailyRecord 등 도메인 타입
├── hooks/
│   └── useLocalStorage.ts
└── pages/
    ├── Today.tsx         # 오늘의 학습
    ├── Weekly.tsx        # 주간 요약
    └── Settings.tsx      # 과목 설정
```
