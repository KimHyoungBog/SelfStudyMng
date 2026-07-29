# TestProject

> 하네스 테스트 환경 학습용

## 기술 스택
TypeScript + React

## 하네스 운영

이 프로젝트는 **Harness 표준 개발 환경**을 따른다. 전체 원칙은 `~/.claude/harness/`를 참조.

### Harness 모드
- 모드: **on** (기본)  <!-- on | lite | off -->
- 모델 티어: **auto**  <!-- H | P | auto — auto는 실행 모델로 자동 판별. 상세: ~/.claude/harness/model-tier.md -->
- 이유: 표준 워크플로우 적용

선택지:
- `on`: 풀 워크플로우 적용 (모든 기능 개발 시 /plan → /sprint-contract → /evaluate)
- `lite`: spec만 작성, sprint-contract와 evaluate는 사용자 명시 호출 시에만
- `off`: 하네스 비활성. 어떤 자동 권고도 하지 않음. (일회성 프로토타입, 학습 프로젝트 등)

### 핵심 워크플로우 (모드 on 기준)
```
/grill (선택) → /plan → /sprint-contract → [구현] → /evaluate → /handoff (선택)
```

### 산출물 위치
- `.claude/harness/spec.md` — Planner 산출물 (요구사항 → spec)
- `.claude/harness/plan.md` — 스프린트 계약 (완료 정의)
- `.claude/harness/eval-checklist.md` — Evaluator 체크리스트
- `.claude/harness/handoff-*.md` — 세션 핸드오프 문서

### 현재 단계 확인
```
/harness-status
```

## 프로젝트 고유 규칙

<!-- 프로젝트별 규칙을 여기에 추가
- 코드 스타일 / 네이밍 컨벤션
- 디렉토리 구조
- 빌드 / 테스트 명령
- 배포 절차
- 도메인 용어집
- 외부 의존성과 그 사용 패턴
-->

### 빌드 / 실행
```
# 여기에 프로젝트 실행 명령을 채워 넣으세요
```

### 테스트 (Playwright 표준 — v2.0+)
```bash
# 첫 셋업 (한 번만)
npm install
npx playwright install chromium    # ~200MB

# E2E 실행
npm run test:e2e          # 전체 케이스
npm run test:e2e:ui       # Playwright UI 모드 (디버깅용)
npm run test:e2e:headed   # 브라우저 보면서 실행
```

- 테스트 파일: `test/*.spec.ts` (plan.md의 테스트 케이스 1개 = spec 1개)
- 외부 API (OpenAI 등)는 `page.route()`로 mock — 재현성 ↑, 비용 0
- `/evaluate` subagent가 자동으로 `npm run test:e2e` 실행 + `test-results.json` 파싱

## 디자인 지향점 (해당 시)
<!-- 예: "Brutalist editorial", "Swiss design grid", "박물관 수준 품질" -->

## 도메인 용어

| 용어 | 의미 |
|------|------|
| (예시) User | 시스템에 로그인 가능한 인격체 |
| (예시) Account | 결제 단위. 한 User가 여러 Account 소유 가능 |

## 평가 시 특별 주의 사항
<!-- 예: 결제 시스템이면 트랜잭션 무결성, 의료 시스템이면 PII 처리 등 -->

---

**상속**: 글로벌 `~/.claude/CLAUDE.md`와 `harness/` 원칙이 자동 적용된다.
