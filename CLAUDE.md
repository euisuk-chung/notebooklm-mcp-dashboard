# NotebookLM MCP Dashboard

Google NotebookLM을 프로그래밍 방식으로 관리하는 개인용 웹 대시보드.
`notebooklm-mcp-cli` 패키지의 CLI(`nlm`)를 백엔드에서 호출하여 NotebookLM API에 접근한다.

## 아키텍처

```
┌─────────────────────────────────────────────────────────┐
│  Browser (localhost:5173 / LAN IP:5173)                 │
│  React + Vite + TailwindCSS + TanStack Query            │
├─────────────────────────────────────────────────────────┤
│  Vite Dev Server (proxy /api → :8000)                   │
├─────────────────────────────────────────────────────────┤
│  FastAPI (0.0.0.0:8000)                                 │
│  - NLMClientWrapper: nlm CLI를 async subprocess로 호출  │
│  - 인증: ~/.notebooklm-mcp-cli/ 의 쿠키 사용           │
├─────────────────────────────────────────────────────────┤
│  nlm CLI (notebooklm-mcp-cli)                           │
│  - 내부적으로 Google NotebookLM 비공식 API 호출         │
└─────────────────────────────────────────────────────────┘
```

## 기술 스택

| 레이어 | 기술 |
|--------|------|
| Frontend | React 18 + TypeScript + Vite |
| 스타일 | TailwindCSS v4 + @tailwindcss/typography |
| 상태관리 | TanStack Query (React Query) |
| 라우팅 | React Router DOM |
| 마크다운 | react-markdown |
| Backend | FastAPI (Python) |
| NotebookLM 연동 | nlm CLI async subprocess |
| 로컬 설정 | JSON 파일 (~/.notebooklm-mcp-dashboard/settings.json) |
| 패키지 매니저 | uv (백엔드) / npm (프론트엔드) |

## 디렉토리 구조

```
notebooklm-mcp-dashboard/
├── CLAUDE.md                          # 이 파일
├── README.md
├── .gitignore
├── LICENSE
│
├── backend/
│   ├── pyproject.toml                 # uv 프로젝트 (fastapi, uvicorn, notebooklm-mcp-cli)
│   └── src/app/
│       ├── main.py                    # FastAPI 앱 (CORS, lifespan, 라우터 등록)
│       ├── config.py                  # 설정 경로, 기본값
│       ├── dependencies.py            # NLMClientWrapper (nlm CLI 호출), DI
│       ├── routers/
│       │   ├── auth.py                # 인증 상태/갱신
│       │   ├── notebooks.py           # 노트북 CRUD + 일괄삭제 + 사용량 + 질의
│       │   ├── sources.py             # 소스 추가(URL/텍스트/YouTube/배치) + 리서치 + 파이프라인
│       │   ├── studio.py              # 콘텐츠 생성/상태/삭제/다운로드 + 일괄 생성
│       │   └── settings.py            # 대시보드 설정 읽기/쓰기
│       ├── schemas/
│       │   ├── notebooks.py           # Pydantic 모델 (NotebookSummary, UsageResponse, QueryRequest 등)
│       │   ├── studio.py              # ArtifactType enum, CreateArtifactRequest, BulkCreateArtifactRequest
│       │   └── settings.py            # DashboardSettings
│       └── services/
│           ├── notebook_service.py    # 노트북 목록, 검색, 삭제, 사용량/정리 제안
│           ├── studio_service.py      # 콘텐츠 생성, 상태 조회, 다운로드
│           └── settings_service.py    # JSON 설정 파일 I/O
│
├── frontend/
│   ├── package.json
│   ├── vite.config.ts                 # /api 프록시 → localhost:8000, host: 0.0.0.0
│   ├── index.html
│   └── src/
│       ├── main.tsx                   # 엔트리 (QueryClientProvider, BrowserRouter)
│       ├── App.tsx                    # 라우트 정의
│       ├── api/
│       │   ├── client.ts             # fetch 래퍼 (get, post, del)
│       │   ├── notebooks.ts          # 노트북 CRUD + 질의 API
│       │   ├── sources.ts            # 소스 추가 + 배치 URL + 리서치 + 파이프라인 API
│       │   └── studio.ts             # 콘텐츠 생성/상태/다운로드 + 일괄 생성 API
│       ├── hooks/
│       │   ├── useNotebooks.ts       # 노트북 CRUD + 질의 훅
│       │   ├── useStudio.ts          # 콘텐츠 생성 + 일괄 생성 훅
│       │   ├── useSources.ts         # 소스 추가 + 배치 + 리서치 + 파이프라인 훅
│       │   └── useBulkSelect.ts      # 체크박스 선택 + 구간 선택 모드
│       ├── components/
│       │   ├── ui/                    # Button, Card, Dialog, Badge, Spinner, Checkbox, ProgressBar, SearchInput
│       │   ├── layout/               # AppShell
│       │   ├── notebooks/
│       │   │   ├── NotebookList.tsx          # 리스트/카드/테이블 3가지 뷰
│       │   │   ├── NotebookListItem.tsx      # 리스트 뷰 아이템 (타임라인 스타일)
│       │   │   ├── NotebookCard.tsx          # 카드 뷰 아이템
│       │   │   ├── NotebookRow.tsx           # 테이블 뷰 아이템
│       │   │   ├── NotebookToolbar.tsx       # 검색 + 정렬 + 뷰 전환 + 구간 선택 + 새로고침 + 생성
│       │   │   ├── BulkActionsBar.tsx        # 일괄 삭제 + 일괄 콘텐츠 생성
│       │   │   ├── UsageDisplay.tsx          # 사용량 프로그레스 바 (/500)
│       │   │   ├── CleanupSuggestions.tsx    # 정리 제안 사이드바
│       │   │   ├── CreateNotebookDialog.tsx  # 노트북 생성 다이얼로그
│       │   │   └── NotebookQueryPanel.tsx    # 노트북 질의 Q&A 패널 (마크다운 렌더링)
│       │   ├── sources/
│       │   │   └── AddSourcePanel.tsx        # 소스 추가 (URL/YouTube/텍스트/리서치/파이프라인)
│       │   └── studio/
│       │       ├── ContentStudio.tsx         # 9타입 콘텐츠 생성 허브
│       │       ├── ArtifactTypeCard.tsx      # 콘텐츠 타입 선택 카드
│       │       ├── CreateArtifactForm.tsx    # 옵션 설정 폼
│       │       ├── ArtifactCard.tsx          # 생성된 콘텐츠 카드 (상태/다운로드)
│       │       └── ArtifactList.tsx          # 콘텐츠 목록
│       ├── pages/
│       │   ├── NotebooksPage.tsx             # 메인: 목록 + 검색 + 일괄 작업 + 사용량
│       │   └── NotebookDetailPage.tsx        # 상세: 정보 + 질의 + 소스 추가 + 스튜디오
│       ├── types/                     # TypeScript 인터페이스
│       └── utils/                     # 상수 (ARTIFACT_CONFIGS), 포맷터
│
├── docs/                              # notebooklm-mcp-cli 원본 문서
│   ├── MCP_GUIDE.md
│   ├── CLI_GUIDE.md
│   └── README.md
│
└── notebooklm-mcp/                    # Claude Code 스킬
    ├── SKILL.md
    └── references/
        ├── mcp_tools.md
        └── cli_commands.md
```

## API 엔드포인트

### 인증
| Method | Path | 설명 |
|--------|------|------|
| GET | `/api/auth/status` | 인증 상태 확인 |
| POST | `/api/auth/refresh` | 인증 토큰 갱신 |

### 노트북
| Method | Path | 설명 |
|--------|------|------|
| GET | `/api/notebooks` | 전체 목록 (query 파라미터로 검색) |
| POST | `/api/notebooks` | 노트북 생성 |
| GET | `/api/notebooks/usage` | 사용량 + 정리 제안 (Pro: /500) |
| GET | `/api/notebooks/{id}` | 노트북 상세 (소스 포함, AI 요약) |
| DELETE | `/api/notebooks/{id}` | 단일 삭제 |
| POST | `/api/notebooks/bulk-delete` | 일괄 삭제 |
| POST | `/api/notebooks/{id}/query` | 노트북 질의 (AI 답변) |

### 소스
| Method | Path | 설명 |
|--------|------|------|
| POST | `/api/notebooks/{id}/sources/url` | URL 소스 추가 |
| POST | `/api/notebooks/{id}/sources/batch-url` | URL 다중 추가 |
| POST | `/api/notebooks/{id}/sources/text` | 텍스트 소스 추가 |
| POST | `/api/notebooks/{id}/sources/youtube` | YouTube 소스 추가 |
| POST | `/api/notebooks/{id}/sources/research` | 웹/Drive 리서치 시작 |
| GET | `/api/notebooks/{id}/sources/research/status` | 리서치 상태 조회 |
| POST | `/api/notebooks/{id}/sources/research/import` | 리서치 결과 가져오기 |
| POST | `/api/notebooks/{id}/sources/pipeline` | 파이프라인 실행 |

### 스튜디오
| Method | Path | 설명 |
|--------|------|------|
| GET | `/api/notebooks/{id}/studio` | 콘텐츠 생성 상태 |
| POST | `/api/notebooks/{id}/studio` | 콘텐츠 생성 요청 |
| DELETE | `/api/notebooks/{id}/studio/{artifact_id}` | 콘텐츠 삭제 |
| GET | `/api/notebooks/{id}/studio/{artifact_id}/download` | 콘텐츠 다운로드 |
| POST | `/api/studio/bulk-create` | 선택 노트북 일괄 콘텐츠 생성 |

### 설정
| Method | Path | 설명 |
|--------|------|------|
| GET | `/api/settings` | 대시보드 설정 읽기 |
| PATCH | `/api/settings` | 대시보드 설정 업데이트 |

## 구현된 기능

### 노트북 관리
- 리스트/카드/테이블 3가지 뷰 (기본: 리스트 - 타임라인 스타일)
- 검색 (제목/태그), 정렬 (수정일/생성일/이름/소스수), 오름차순/내림차순 토글
- 노트북 생성 (대시보드에서 바로)
- 단일 삭제 + 일괄 삭제 (체크박스 + 구간 선택 모드)
- 사용량 프로그레스 바 (현재/500, Pro 계정)
- 스마트 정리 제안 (오래된/빈 노트북)
- NotebookLM 웹 링크 (노트북 상세에서 바로 열기)

### 소스 관리
- URL 추가 (단일 + 여러 개 줄바꿈 일괄)
- YouTube URL 추가
- 텍스트 직접 입력
- 웹/Drive 리서치 (빠른/심층 모드)
- 리서치 결과 가져오기

### 콘텐츠 스튜디오
- 9가지 타입: 팟캐스트, 영상, 리포트, 퀴즈, 플래시카드, 슬라이드, 인포그래픽, 마인드맵, 데이터테이블
- 타입별 옵션 설정 (포맷, 스타일, 난이도 등)
- 생성 상태 실시간 폴링
- 다운로드
- 선택 노트북 일괄 콘텐츠 생성

### 자동화
- 원클릭 파이프라인 (URL→팟캐스트, 리서치→리포트, 전체 콘텐츠)
- 노트북 질의 (Q&A 패널, 마크다운 렌더링, 세션 히스토리)

## 핵심 설계 결정

### NotebookLM 연동: CLI subprocess 방식
`notebooklm-mcp-cli`의 내부 Python API 구조가 보장되지 않으므로, `nlm` CLI를 `asyncio.create_subprocess_exec`로 호출한다. `--json` 플래그로 구조화된 출력을 받아 파싱한다. CLI 응답은 `{"value": {...}}` wrapper를 사용하므로 `NLMClientWrapper`에서 unwrap 처리한다.

### DB 없음
모든 데이터(노트북, 소스, 콘텐츠)는 NotebookLM API에서 직접 fetch한다. 로컬에는 대시보드 UI 설정만 JSON 파일로 저장한다.

### React Query로 서버 상태 관리
API 응답 캐싱, 포커스 시 자동 리프레시, 삭제 시 캐시 무효화를 React Query가 처리한다. Studio 콘텐츠 생성 중에는 `refetchInterval`로 폴링한다.

### 인증 흐름
세션은 ~20분 지속. 만료 시 백엔드가 에러를 반환하고, 프론트엔드에서 `nlm login` 실행 안내를 표시한다. 백엔드가 자체적으로 브라우저를 열 수는 없으므로 사용자가 터미널에서 수동 재인증한다.

### LAN 접근
Vite와 uvicorn 모두 `0.0.0.0`에 바인딩하여 같은 네트워크의 다른 기기에서 접근 가능하다.

## 개발 환경 실행

### 사전 요구사항
```bash
uv tool install notebooklm-mcp-cli   # nlm CLI 설치
nlm login                             # Google 인증
```

### 백엔드 실행
```bash
cd backend
uv sync
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 --app-dir src
```

### 프론트엔드 실행
```bash
cd frontend
npm install
npm run dev                            # 0.0.0.0:5173 에서 실행
```

Vite가 `/api` 요청을 `localhost:8000`으로 프록시한다.

## 스튜디오 콘텐츠 타입

| 타입 | 옵션 |
|------|------|
| audio | 포맷: deep_dive, brief, critique, debate / 길이: short, default, long |
| video | 포맷: explainer, brief / 스타일: classic, whiteboard, kawaii, anime 등 9종 |
| report | 포맷: Briefing Doc, Study Guide, Blog Post, Create Your Own |
| quiz | question_count, difficulty (easy/medium/hard), focus |
| flashcards | difficulty, focus |
| slide_deck | 생성 후 studio_revise로 슬라이드별 수정 가능 |
| infographic | orientation (landscape/portrait), style |
| mind_map | 옵션 없음 |
| data_table | description |

## 향후 기능

- 소스 관리 전용 뷰 (전체 소스 통합 검색, 중복 탐지)
- 영상 스타일 썸네일 프리뷰
- 슬라이드 브라우저 내 미리보기 + 슬라이드별 수정 UI
- 비주얼 파이프라인 빌더 (드래그앤드롭)
- 다크모드

## 주의사항

- NotebookLM은 비공식 내부 API를 사용한다. 언제든 변경될 수 있다.
- Pro 계정 기준 노트북 최대 500개. Free tier 일일 쿼리 제한: ~50회.
- 쿠키 기반 인증은 2-4주 후 만료된다. `nlm login`으로 재인증 필요.
- Studio 콘텐츠 생성은 1-5분 소요. 폴링 간격은 10-15초가 적절하다.
