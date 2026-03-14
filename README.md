# NotebookLM MCP Dashboard

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Powered by notebooklm-mcp-cli](https://img.shields.io/pypi/v/notebooklm-mcp-cli?label=notebooklm-mcp-cli&color=blue)](https://pypi.org/project/notebooklm-mcp-cli/)

[English](README_EN.md) | **한국어**

> Google NotebookLM을 더 쉽고 빠르게 관리하는 개인용 웹 대시보드

NotebookLM의 불편한 점들(검색 불가, 일괄 삭제 불가, 노트북 개수 제한 관리 어려움)을 해결하기 위해 만든 웹 대시보드입니다. [notebooklm-mcp-cli](https://github.com/PleasePrompto/notebooklm-mcp) 패키지의 CLI를 백엔드에서 호출하여 NotebookLM API에 접근합니다.

## Screenshots

<table>
  <tr>
    <td align="center"><b>노트북 목록 (리스트 뷰)</b></td>
    <td align="center"><b>노트북 상세 + 콘텐츠 스튜디오</b></td>
  </tr>
  <tr>
    <td><img src="docs/imgs/notebook-list.png" width="480" /></td>
    <td><img src="docs/imgs/notebook-detail.png" width="480" /></td>
  </tr>
  <tr>
    <td align="center"><b>소스 추가 / 웹 리서치</b></td>
    <td align="center"><b>노트북 질의 (Q&A)</b></td>
  </tr>
  <tr>
    <td><img src="docs/imgs/add-source.png" width="480" /></td>
    <td><img src="docs/imgs/query-panel.png" width="480" /></td>
  </tr>
</table>

## Features

### 노트북 관리
- **검색 & 필터** — 제목/태그로 검색, 수정일/생성일/이름/소스수 정렬, 오름차순/내림차순
- **3가지 뷰** — 리스트 (타임라인), 카드, 테이블
- **노트북 생성** — 대시보드에서 바로 생성
- **NotebookLM 링크** — 노트북 상세에서 원본 NotebookLM 페이지로 바로 이동

### 일괄 작업
- **복수 선택 + 일괄 삭제** — 체크박스 선택, 구간 선택 모드 지원
- **일괄 콘텐츠 생성** — 선택한 노트북들에 팟캐스트/영상 등 한번에 생성

### 용량 관리
- **사용량 표시** — 현재/500 (Pro 계정) 프로그레스 바
- **스마트 정리 제안** — 오래된/빈 노트북 자동 추천 + 원클릭 삭제

### 소스 관리
- **URL 추가** — 단일 또는 여러 개 줄바꿈으로 일괄 추가
- **YouTube / 텍스트** — YouTube URL, 텍스트 직접 입력
- **웹 리서치** — 빠른/심층 모드로 웹 또는 Google Drive 검색 → 결과 가져오기

### 콘텐츠 스튜디오
9가지 콘텐츠 타입 생성 + 상태 추적 + 다운로드:

| 타입 | 설명 |
|------|------|
| 🎙 팟캐스트 | deep_dive, brief, critique, debate |
| 🎬 영상 | classic, whiteboard, kawaii, anime 등 9종 스타일 |
| 📝 리포트 | Briefing Doc, Study Guide, Blog Post |
| ❓ 퀴즈 | 난이도/문제수 설정 |
| 📇 플래시카드 | 난이도/포커스 설정 |
| 📊 슬라이드 | 생성 후 슬라이드별 수정 가능 |
| 📈 인포그래픽 | 방향/스타일 선택 |
| 🧠 마인드맵 | 소스 기반 시각화 |
| 📋 데이터테이블 | 설명 기반 구조화 |

### 자동화
- **원클릭 파이프라인** — URL → 팟캐스트, 리서치 → 리포트, 전체 콘텐츠
- **노트북 질의** — 대시보드에서 직접 질문 → 마크다운 답변 (세션 히스토리)

## Tech Stack

```
Frontend:  React 18 + TypeScript + Vite + TailwindCSS v4 + TanStack Query
Backend:   FastAPI (Python) + nlm CLI async subprocess
연동:      notebooklm-mcp-cli (nlm CLI → Google NotebookLM 비공식 API)
```

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│  Browser (localhost:5173 / LAN IP:5173)                 │
│  React + Vite + TailwindCSS + TanStack Query            │
├─────────────────────────────────────────────────────────┤
│  Vite Dev Server (proxy /api → :8000)                   │
├─────────────────────────────────────────────────────────┤
│  FastAPI (0.0.0.0:8000)                                 │
│  NLMClientWrapper: nlm CLI를 async subprocess로 호출    │
├─────────────────────────────────────────────────────────┤
│  nlm CLI (notebooklm-mcp-cli)                           │
│  Google NotebookLM 비공식 API                           │
└─────────────────────────────────────────────────────────┘
```

## Quick Start

### 1. 사전 요구사항

```bash
# nlm CLI 설치
uv tool install notebooklm-mcp-cli

# Google 인증
nlm login
```

### 2. 클론 & 설치

```bash
git clone https://github.com/euisuk-chung/notebooklm-mcp-dashboard.git
cd notebooklm-mcp-dashboard

# 백엔드
cd backend && uv sync && cd ..

# 프론트엔드
cd frontend && npm install && cd ..
```

### 3. 실행

```bash
# 터미널 1: 백엔드
cd backend
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 --app-dir src

# 터미널 2: 프론트엔드
cd frontend
npm run dev
```

`http://localhost:5173` 에서 대시보드에 접속합니다.

같은 네트워크의 다른 기기에서도 `http://<your-ip>:5173` 으로 접근 가능합니다.

## API Reference

전체 API 엔드포인트 목록은 [CLAUDE.md](CLAUDE.md)를 참고하세요.

| 카테고리 | 주요 엔드포인트 |
|----------|----------------|
| 노트북 | `GET/POST /api/notebooks`, `DELETE /{id}`, `POST /bulk-delete`, `POST /{id}/query` |
| 소스 | `POST /{id}/sources/url`, `/batch-url`, `/youtube`, `/text`, `/research`, `/pipeline` |
| 스튜디오 | `GET/POST /{id}/studio`, `POST /api/studio/bulk-create` |
| 설정 | `GET/PATCH /api/settings` |

Swagger UI: `http://localhost:8000/docs`

## Project Structure

```
notebooklm-mcp-dashboard/
├── backend/                # FastAPI 서버
│   ├── pyproject.toml
│   └── src/app/
│       ├── main.py         # 앱 팩토리, CORS, 라우터
│       ├── dependencies.py # NLMClientWrapper (nlm CLI 호출)
│       ├── routers/        # auth, notebooks, sources, studio, settings
│       ├── schemas/        # Pydantic 모델
│       └── services/       # 비즈니스 로직
├── frontend/               # React 앱
│   └── src/
│       ├── api/            # API 호출 함수
│       ├── hooks/          # React Query 훅
│       ├── components/     # UI, notebooks, sources, studio
│       ├── pages/          # NotebooksPage, NotebookDetailPage
│       └── utils/          # 상수, 포맷터
├── docs/                   # notebooklm-mcp-cli 원본 문서
├── notebooklm-mcp/         # Claude Code 스킬
└── CLAUDE.md               # 상세 아키텍처 문서
```

## Disclaimer

이 프로젝트는 NotebookLM의 **비공식 내부 API**를 사용합니다. 언제든 변경될 수 있으며, 개인/실험 용도로만 사용하세요.

- 쿠키 기반 인증: 2-4주마다 `nlm login` 재인증 필요
- 세션 만료: ~20분 (만료 시 재인증 안내 표시)
- Pro 계정 노트북 한도: 500개

## License

[MIT License](LICENSE)
