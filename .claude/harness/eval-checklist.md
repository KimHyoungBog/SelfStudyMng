# Evaluation Checklist — 중학생 학습관리 앱 — 2026-07-30

> `/evaluate` 슬래시 커맨드가 사용. 1차 평가(FAIL) → 결함 수정 → 재검증(PASS).

## Stage 1 — Spec Compliance

### 완료 조건 검증
- [x] `/settings` 과목 추가 후 새로고침해도 목록 유지
- [x] `/`에서 오늘 요일에 등록된 과목만 표시
- [x] 완료 체크+실제 시간 입력 후 새로고침해도 값 유지 — 자정 전후(00:00~08:59 KST) 포함, 로컬 타임존 기준 날짜 키로 수정 후 재검증 통과
- [x] `/weekly`에서 목표/실제 합계 정확 표시
- [x] 과목 미등록 시 `/`에 설정 링크 표시
- [x] 768px 미만 레이아웃 정상

### 테스트 케이스 실행
- [x] 케이스 1 (정상) — 공식 E2E `study-app.spec.ts` 통과
- [x] 케이스 2 (토요일 빈 상태) — 확인됨
- [x] 케이스 3 (시간 미입력) — 확인됨
- [x] 케이스 4 (과목 미등록) — 공식 E2E `study-app.spec.ts` 통과

## Stage 2 — Code Quality

- [x] 기존 코드베이스 컨벤션 준수
- [x] 중복 없음 — 날짜 로직을 `src/utils/date.ts`로 통합
- [x] 모듈 경계 적절
- [x] 모든 외부 호출(localStorage)에 에러 처리
- [x] 로딩/빈 상태 처리
- [x] 명명이 자명함
- [x] `tsc --noEmit` 0 에러
- [x] ESLint 0 에러 — `.eslintrc.cjs` + `npm run lint` 추가 후 확인

## 회의적 점검 (의도적 망가뜨리기)

- [x] 잘못된 입력(음수) — 클램프됨
- [x] 잘못된 입력(매우 큰 값) — 상한(720분/480분) 클램프 추가
- [x] localStorage 손상(JSON 파싱 실패) — 크래시 없이 폴백
- [x] 데이터 0건(첫 방문) — 정상
- [x] 동시(반복) 체크박스 토글 — 정상 upsert
- [x] 과목 삭제 시 관련 기록 처리 — 삭제 시 관련 `records` 함께 제거하도록 수정
- [x] 자정 전후 접속 — 로컬 타임존 기준 날짜 키로 수정 후 재현 테스트 통과

## 디자인 / UX

### AI Slop 패턴 검사
- [x] 흰 카드 + 보라 그라데이션 없음
- [x] generic copy 없음
- [x] placeholder 이미지 잔존 없음
- [x] 무난한 SaaS 레이아웃 회피

### 기술 완성도
- [x] 타이포그래피 계층 명확
- [x] 간격 일관성
- [x] 색상 하드코딩 있으나 프로젝트 규모상 허용 범위
- [x] 모바일(375px)/데스크탑 확인

## 비기능

- [ ] 성능 목표(<200ms) — 정량 계측 미실시(수동 조작상 체감 지연 없음). 필요 시 후속 측정 권장
- [x] 접근성 — 모든 입력에 `aria-label`/`label` 존재
- [x] 보안 — React 기본 이스케이프로 XSS 방지

## 판정

- [x] 모든 blocker 해결 → **통과**

## 결함 보고서 (1차 평가 — 전부 수정 완료)

### 결함 #1 — 자정 전후(00:00~08:59 KST) 접속 시 날짜 키 UTC/로컬 불일치 [blocker → 수정됨]
- 위치: `src/pages/Today.tsx`, `src/pages/Weekly.tsx`
- 수정: `src/utils/date.ts`의 `toLocalDateString()`(로컬 타임존 기준)으로 교체, 재현 테스트로 확인

### 결함 #2 — ESLint 하드 임계값 검증 수단 부재 [major → 수정됨]
- 수정: `.eslintrc.cjs` 추가, `npm run lint` 스크립트 추가, 0 에러 확인

### 결함 #3 — 과목 삭제 시 DailyRecord 고아 데이터 잔존 [major → 수정됨]
- 위치: `src/pages/Settings.tsx`
- 수정: `deleteSubject`에서 해당 `subjectId`의 `records`도 함께 제거, 재현 테스트로 확인

### 결함 #4 — 학습 시간 입력값 상한 미강제 [major → 수정됨]
- 위치: `src/pages/Today.tsx`, `src/pages/Settings.tsx`
- 수정: `Math.min(상한, Math.max(0, ...))`로 클램프

### 결함 #5 — Playwright 템플릿 예시 파일 잔존 [minor → 수정됨]
- 수정: `test/example.spec.ts` 삭제

### 결함 #6 — 날짜 계산 로직 중복 [minor → 수정됨]
- 수정: 결함 #1과 함께 `src/utils/date.ts`로 통합

### 결함 #7 — 자정 경과 시 화면 자동 갱신 없음 [minor → 보류]
- 판단: spec에 실시간 갱신 요구 없음. Out of Scope로 유지 (필요 시 후속 스프린트에서 검토)

## 참조
- spec: `.claude/harness/spec.md`
- plan: `.claude/harness/plan.md`
