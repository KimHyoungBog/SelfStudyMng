# Sprint Contract — 중학생 학습관리 앱 — 2026-07-29

> `/sprint-contract` 슬래시 커맨드로 작성. 사용자 sign-off 후 구현 시작.

## 목표 (spec에서)
중학교 1학년 학생이 사전 등록된 일일 학습 스케줄을 기준으로 매일 완료 여부와 실제 공부 시간을 직접 기록하고, 주간 달성 현황을 확인할 수 있다.

## 작업 단위

**Phase 1 — 프로젝트 기반**
- [x] T01: Vite + React + TypeScript 프로젝트 초기화 (`npm create vite`)
- [x] T02: React Router 설치 + 3개 화면 라우팅 설정 (`/`, `/settings`, `/weekly`)
- [x] T03: 데이터 타입 정의 (`Subject`, `DailyRecord`)
- [x] T04: `useLocalStorage` 커스텀 훅 작성 (읽기·쓰기·초기값)

**Phase 2 — 과목 설정 화면 (`/settings`)**
- [x] T05: 저장된 과목 목록 표시
- [x] T06: 과목 추가 폼 (과목명 + 요일별 목표 시간 입력)
- [x] T07: 과목 편집 기능
- [x] T08: 과목 삭제 기능

**Phase 3 — 오늘의 학습 화면 (`/`)**
- [x] T09: 오늘 요일 기준 해당 과목 필터링
- [x] T10: 과목 목록 표시 + 완료 체크박스
- [x] T11: 실제 시간 입력 (분 단위, 숫자 입력)
- [x] T12: 빈 상태 처리 (과목 미등록 → 설정 링크, 해당 요일 없음 → 안내 메시지)

**Phase 4 — 주간 요약 화면 (`/weekly`)**
- [x] T13: 이번 주 월~일 날짜 범위 계산
- [x] T14: 과목별 목표 시간 합계 vs 실제 시간 합계 집계
- [x] T15: 주간 요약 표시 컴포넌트 (과목별 행, 목표/실제/달성률)

**Phase 5 — 마무리**
- [x] T16: 전체 반응형 스타일 (768px breakpoint)
- [x] T17: Playwright E2E 테스트 — 정상 시나리오(케이스 1) 작성 및 통과

## 데이터 모델

```typescript
type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0=일, 1=월, ..., 6=토

interface Subject {
  id: string;
  name: string;
  targetMinutes: Partial<Record<DayOfWeek, number>>; // 0이면 해당 요일 없음
}

interface DailyRecord {
  date: string;       // YYYY-MM-DD
  subjectId: string;
  completed: boolean;
  actualMinutes: number;
}
```

localStorage 키: `study-app:subjects`, `study-app:records`

## 완료 조건 (관찰 가능한 동작)
- [x] `/settings`에서 과목 추가 후 새로고침해도 목록이 유지된다
- [x] `/`에서 오늘 요일에 등록된 과목만 표시된다
- [x] 완료 체크 + 실제 시간 입력 후 새로고침해도 값이 유지된다 (자정 전후 포함, `/evaluate` 1차 결함 #1 수정 완료)
- [x] `/weekly`에서 이번 주 각 과목의 목표 합계와 실제 합계가 정확히 표시된다
- [x] 과목 미등록 상태에서 `/` 접속 시 설정 화면 링크가 표시된다
- [x] 768px 미만 화면에서 레이아웃이 깨지지 않는다

## 테스트 케이스

| # | 시나리오 | 입력 | 기대 출력 |
|---|---------|------|----------|
| 1 | 정상 흐름 | 수학 등록(월~금 30분) → 월요일 `/` 접속 → 완료 체크 + 실제 40분 → `/weekly` | 수학: 목표 30분 / 실제 40분 표시 |
| 2 | 해당 요일 없음 | 토요일 접속, 토요일 미등록 과목만 존재 | "오늘 예정된 학습이 없습니다" 메시지 |
| 3 | 시간 미입력 | 완료 체크만 하고 시간 입력 안 함 | 실제 시간 0분으로 처리, `/weekly`에 0분 반영 |
| 4 | 과목 미등록 | 과목 없는 상태에서 `/` | "과목을 먼저 등록하세요" + `/settings` 링크 |

## 하드 임계값
- **성능**: 체크·입력 반응 < 200ms
- **품질**: `tsc --noEmit` 에러 0건, ESLint 에러 0건
- **커버리지**: Playwright E2E 케이스 1번 통과

## 검증 방법
- **UI**: 브라우저에서 직접 조작 (과목 추가 → 오늘 화면 → 체크 → 주간 요약)
- **localStorage**: DevTools → Application → Local Storage 확인
- **반응형**: DevTools 모바일 뷰(375px) 확인
- **E2E**: `npm run test:e2e` → `test-results.json` PASS 확인
- **회의적 점검**: 새로고침 후 데이터 유지, 토·일 빈 화면, 과목 삭제 후 기존 기록 처리

## 영향 범위
- 변경 예상 파일: 전체 신규 생성 (빈 프로젝트)
- 기존 기능 영향: 없음
- 마이그레이션: 없음

## 사용자 Sign-off
- [x] 사용자가 명시적으로 확인함 (2026-07-29)

## 변경 이력
- 2026-07-29: 초안 작성

## 참조
- spec: `.claude/harness/spec.md`
- 다음 단계: 구현 → `/evaluate`
