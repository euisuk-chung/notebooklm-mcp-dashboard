# NotebookLM CLI & MCP Server — 통합 레퍼런스

> **원본 출처**: [PleasePrompto/notebooklm-mcp](https://github.com/PleasePrompto/notebooklm-mcp) (jacob-bd/notebooklm-mcp-cli)
>
> 이 문서는 원본 레포지토리의 README, MCP Guide, CLI Guide를 하나로 통합한 레퍼런스입니다.
> **notebooklm-mcp-dashboard** 프로젝트는 이 패키지(`notebooklm-mcp-cli`)를 기반으로 동작하며, 백엔드에서 `nlm` CLI를 호출하여 Google NotebookLM에 접근합니다.

---

## 목차

1. [개요](#개요)
2. [설치](#설치)
3. [인증](#인증)
4. [기능 요약](#기능-요약)
5. [CLI 명령어 레퍼런스](#cli-명령어-레퍼런스)
6. [MCP 도구 레퍼런스 (35 tools)](#mcp-도구-레퍼런스-35-tools)
7. [워크플로우 예시](#워크플로우-예시)
8. [MCP 서버 설정](#mcp-서버-설정)
9. [환경 변수](#환경-변수)
10. [트러블슈팅](#트러블슈팅)
11. [제한사항](#제한사항)

---

## 개요

`notebooklm-mcp-cli`는 Google NotebookLM에 프로그래밍 방식으로 접근할 수 있는 통합 패키지입니다. 하나의 설치로 두 가지 인터페이스를 제공합니다:

- **`nlm`** — 터미널에서 사용하는 CLI (Command-Line Interface)
- **`notebooklm-mcp`** — AI 에이전트용 MCP (Model Context Protocol) 서버

> **Disclaimer**: 비공식 내부 API를 사용합니다. 언제든 변경될 수 있으며 개인/실험 용도로만 사용하세요.

---

## 설치

```bash
# uv (권장)
uv tool install notebooklm-mcp-cli

# pip
pip install notebooklm-mcp-cli

# pipx
pipx install notebooklm-mcp-cli

# uvx (설치 없이 실행)
uvx --from notebooklm-mcp-cli nlm --help
```

설치 후 제공되는 실행 파일:
- `nlm` — CLI
- `notebooklm-mcp` — MCP 서버

업그레이드:
```bash
uv tool upgrade notebooklm-mcp-cli
# 또는 강제 재설치
uv tool install --force notebooklm-mcp-cli
```

---

## 인증

쿠키 기반 인증. 브라우저에서 Google 로그인 후 쿠키를 자동 추출합니다.

```bash
nlm login                              # 자동 모드 (브라우저 실행)
nlm login --check                      # 인증 상태 확인
nlm login --profile work               # 다중 계정용 프로필
nlm login switch <profile>             # 프로필 전환
nlm login profile list                 # 프로필 목록
nlm login profile delete <name>        # 프로필 삭제
nlm login profile rename <old> <new>   # 프로필 이름 변경
```

| 구성 요소 | 유효 기간 | 갱신 |
|-----------|----------|------|
| 쿠키 | ~2-4주 | 프로필 저장 시 headless 브라우저로 자동 갱신 |
| CSRF 토큰 | ~분 단위 | 요청 실패 시 자동 갱신 |
| 세션 ID | MCP 세션 당 | MCP 시작 시 자동 추출 |

---

## 기능 요약

| 기능 | CLI 명령어 | MCP 도구 |
|------|-----------|----------|
| 노트북 목록 | `nlm notebook list` | `notebook_list` |
| 노트북 생성 | `nlm notebook create` | `notebook_create` |
| 소스 추가 (URL, 텍스트, Drive, 파일) | `nlm source add` | `source_add` |
| 노트북 질의 (AI 채팅) | `nlm notebook query` | `notebook_query` |
| 스튜디오 콘텐츠 생성 (오디오, 영상 등) | `nlm audio/video/report create` | `studio_create` |
| 슬라이드 수정 | `nlm slides revise` | `studio_revise` |
| 아티팩트 다운로드 | `nlm download <type>` | `download_artifact` |
| 웹/Drive 리서치 | `nlm research start` | `research_start` |
| 노트북 공유 | `nlm share public/invite` | `notebook_share_*` |
| Drive 소스 동기화 | `nlm source sync` | `source_sync_drive` |
| 배치 작업 | `nlm batch query/create/delete` | `batch` |
| 크로스 노트북 질의 | `nlm cross query` | `cross_notebook_query` |
| 파이프라인 (다단계 워크플로우) | `nlm pipeline run/list` | `pipeline` |
| 태그 & 스마트 선택 | `nlm tag add/list/select` | `tag` |
| AI 도구 설정 | `nlm setup add/remove/list` | — |
| 진단 | `nlm doctor` | — |

---

## CLI 명령어 레퍼런스

CLI는 두 가지 문법을 지원합니다:
```bash
nlm notebook create "Title"    # 명사 우선 (리소스 중심)
nlm create notebook "Title"    # 동사 우선 (액션 중심)
```

### 노트북

```bash
nlm notebook list                      # 전체 목록
nlm notebook list --json               # JSON 출력
nlm notebook create "Title"            # 생성
nlm notebook get <id>                  # 상세 정보
nlm notebook describe <id>             # AI 요약
nlm notebook rename <id> "New Title"   # 이름 변경
nlm notebook delete <id> --confirm     # 삭제 (되돌릴 수 없음)
nlm notebook query <id> "question"     # AI 질의
```

### 소스

```bash
nlm source list <notebook>                         # 소스 목록
nlm source add <notebook> --url "https://..."      # URL 추가
nlm source add <notebook> --url "https://..." --wait  # 추가 + 처리 대기
nlm source add <notebook> --text "content" --title "Notes"  # 텍스트 추가
nlm source add <notebook> --file document.pdf --wait  # 파일 업로드
nlm source add <notebook> --youtube "https://..."  # YouTube 추가
nlm source add <notebook> --drive <doc-id>         # Drive 문서 추가
nlm source get <source-id>                         # 소스 내용 조회
nlm source describe <source-id>                    # AI 요약
nlm source stale <notebook>                        # 오래된 Drive 소스 확인
nlm source sync <notebook> --confirm               # Drive 소스 동기화
nlm source delete <source-id> --confirm            # 삭제
```

### 스튜디오 콘텐츠 생성

```bash
# 오디오 (팟캐스트)
nlm audio create <notebook> --confirm
nlm audio create <notebook> --format deep_dive --length long --confirm
# 포맷: deep_dive, brief, critique, debate / 길이: short, default, long

# 영상
nlm video create <notebook> --format explainer --style classic --confirm
# 포맷: explainer, brief
# 스타일: auto_select, classic, whiteboard, kawaii, anime, watercolor, retro_print, heritage, paper_craft

# 리포트
nlm report create <notebook> --format "Briefing Doc" --confirm
# 포맷: "Briefing Doc", "Study Guide", "Blog Post", "Create Your Own"

# 퀴즈 & 플래시카드
nlm quiz create <notebook> --count 10 --difficulty medium --confirm
nlm flashcards create <notebook> --difficulty hard --confirm

# 기타
nlm mindmap create <notebook> --confirm
nlm slides create <notebook> --confirm
nlm slides revise <artifact-id> --slide '1 Make title larger' --confirm
nlm infographic create <notebook> --orientation landscape --style professional --confirm
nlm data-table create <notebook> --description "Sales by region" --confirm
```

### 다운로드

```bash
nlm download audio <notebook> <artifact-id> --output podcast.mp3
nlm download video <notebook> <artifact-id> --output video.mp4
nlm download report <notebook> <artifact-id> --output report.md
nlm download mind-map <notebook> <artifact-id> --output mindmap.json
nlm download slide-deck <notebook> <artifact-id> --output slides.pdf
nlm download infographic <notebook> <artifact-id> --output infographic.png
nlm download data-table <notebook> <artifact-id> --output data.csv
nlm download quiz <notebook> <artifact-id> --format html --output quiz.html
nlm download flashcards <notebook> <artifact-id> --format markdown --output cards.md
```

### 리서치

```bash
nlm research start "query" --notebook-id <id> --mode fast   # 빠른 검색 (~30초)
nlm research start "query" --notebook-id <id> --mode deep   # 심층 검색 (~5분)
nlm research start "query" --notebook-id <id> --source drive # Drive 검색
nlm research status <notebook> --max-wait 300                # 상태 폴링
nlm research import <notebook> <task-id>                     # 결과 가져오기
```

### 배치 작업

```bash
nlm batch query "What are the key takeaways?" --notebooks "id1,id2"
nlm batch query "Summarize" --tags "ai,research"
nlm batch query "Summarize" --all
nlm batch add-source --url "https://..." --notebooks "id1,id2"
nlm batch create "Project A, Project B, Project C"
nlm batch delete --notebooks "id1,id2" --confirm
nlm batch studio --type audio --tags "research" --confirm
```

### 크로스 노트북 질의

```bash
nlm cross query "What features are discussed?" --notebooks "id1,id2"
nlm cross query "Compare approaches" --tags "ai,research"
nlm cross query "Summarize everything" --all
```

### 파이프라인

```bash
nlm pipeline list
nlm pipeline run <notebook> ingest-and-podcast --url "https://..."
nlm pipeline run <notebook> research-and-report --url "https://..."
nlm pipeline run <notebook> multi-format
```

빌트인 파이프라인: `ingest-and-podcast`, `research-and-report`, `multi-format`

커스텀 파이프라인: `~/.notebooklm-mcp-cli/pipelines/`에 YAML 파일 추가

### 태그 & 스마트 선택

```bash
nlm tag add <notebook> --tags "ai,research,llm"
nlm tag remove <notebook> --tags "ai"
nlm tag list
nlm tag select "ai research"
```

### 공유

```bash
nlm share status <notebook>
nlm share public <notebook>
nlm share private <notebook>
nlm share invite <notebook> email@example.com
nlm share invite <notebook> email --role editor
```

### 설정

```bash
nlm config show
nlm config set auth.default_profile work
nlm config set output.format json
nlm config set auth.browser brave
```

| 키 | 기본값 | 설명 |
|----|--------|------|
| `output.format` | `table` | 출력 형식 (table, json) |
| `output.color` | `true` | 색상 출력 |
| `output.short_ids` | `true` | 짧은 ID 표시 |
| `auth.browser` | `auto` | 로그인 브라우저 (chrome, arc, brave, edge 등) |
| `auth.default_profile` | `default` | 기본 프로필 |

### 별칭 (Alias)

```bash
nlm alias set myproject <notebook-id>
nlm alias list
nlm alias get myproject
nlm alias delete myproject
# 어디서든 사용: nlm notebook get myproject
```

### 진단

```bash
nlm doctor              # 전체 검사
nlm doctor --verbose    # 상세 검사
```

### 출력 형식

| 플래그 | 설명 |
|--------|------|
| (없음) | 리치 테이블 |
| `--json` | JSON |
| `--quiet` | ID만 |
| `--title` | "ID: Title" |
| `--full` | 전체 컬럼 |

---

## MCP 도구 레퍼런스 (35 tools)

### 노트북 (6)

| 도구 | 설명 |
|------|------|
| `notebook_list` | 전체 노트북 목록 |
| `notebook_create` | 새 노트북 생성 |
| `notebook_get` | 노트북 상세 + 소스 목록 |
| `notebook_describe` | AI 요약 + 추천 주제 |
| `notebook_rename` | 이름 변경 |
| `notebook_delete` | 삭제 (`confirm=True` 필요) |

### 소스 (6)

| 도구 | 설명 |
|------|------|
| `source_add` | **통합** — URL, 텍스트, 파일, Drive 소스 추가 |
| `source_list_drive` | Drive 소스 상태 포함 목록 |
| `source_sync_drive` | 오래된 Drive 소스 동기화 |
| `source_delete` | 삭제 (`confirm=True` 필요) |
| `source_describe` | AI 요약 + 키워드 |
| `source_get_content` | 원본 텍스트 조회 |

**`source_add` 파라미터:**
```python
source_add(
    notebook_id="...",
    source_type="url",        # url | text | file | drive
    url="https://...",        # source_type=url
    text="...",               # source_type=text
    title="...",              # 선택
    file_path="/path/to.pdf", # source_type=file
    document_id="...",        # source_type=drive
    doc_type="doc",           # doc | slides | sheets | pdf
    wait=True,                # 처리 완료까지 대기
    wait_timeout=120.0        # 대기 시간 (초)
)
```

### 질의 (2)

| 도구 | 설명 |
|------|------|
| `notebook_query` | AI에게 소스 기반 질문 |
| `chat_configure` | 채팅 목표/응답 길이 설정 |

### 스튜디오 콘텐츠 (4)

| 도구 | 설명 |
|------|------|
| `studio_create` | **통합** — 모든 아티팩트 타입 생성 |
| `studio_status` | 생성 진행 상태 조회 |
| `studio_delete` | 삭제 (`confirm=True` 필요) |
| `studio_revise` | 슬라이드 수정 (`confirm=True` 필요) |

**`studio_create` 아티팩트 타입:**
- `audio` — 팟캐스트 (deep_dive, brief, critique, debate)
- `video` — 영상 (explainer, brief / 9종 스타일)
- `report` — 리포트 (Briefing Doc, Study Guide, Blog Post)
- `quiz` — 퀴즈
- `flashcards` — 플래시카드
- `mind_map` — 마인드맵
- `slide_deck` — 슬라이드
- `infographic` — 인포그래픽
- `data_table` — 데이터 테이블

### 다운로드 (1)

| 도구 | 설명 |
|------|------|
| `download_artifact` | **통합** — 모든 아티팩트 다운로드 |

### 내보내기 (1)

| 도구 | 설명 |
|------|------|
| `export_artifact` | Google Docs/Sheets로 내보내기 |

### 리서치 (3)

| 도구 | 설명 |
|------|------|
| `research_start` | 웹/Drive 리서치 시작 (fast/deep) |
| `research_status` | 진행 상태 폴링 |
| `research_import` | 발견된 소스 가져오기 |

### 노트 (1)

| 도구 | 설명 |
|------|------|
| `note` | **통합** — 노트 관리 (list, create, update, delete) |

### 공유 (3)

| 도구 | 설명 |
|------|------|
| `notebook_share_status` | 공유 설정 조회 |
| `notebook_share_public` | 공개 링크 활성화/비활성화 |
| `notebook_share_invite` | 이메일로 협업자 초대 |

### 인증 (2)

| 도구 | 설명 |
|------|------|
| `refresh_auth` | 인증 토큰 갱신 |
| `save_auth_tokens` | 쿠키 저장 (대체 방법) |

### 서버 (1)

| 도구 | 설명 |
|------|------|
| `server_info` | 버전 확인 + 업데이트 체크 |

### 배치 & 크로스 노트북 (2)

| 도구 | 설명 |
|------|------|
| `batch` | **통합** — 다중 노트북 배치 작업 (query, add_source, create, delete, studio) |
| `cross_notebook_query` | 다중 노트북 질의 + 노트북별 인용 |

### 파이프라인 (1)

| 도구 | 설명 |
|------|------|
| `pipeline` | **통합** — 다단계 워크플로우 (list, run) |

### 태그 & 스마트 선택 (1)

| 도구 | 설명 |
|------|------|
| `tag` | **통합** — 태그 관리 + 스마트 검색 (add, remove, list, select) |

---

## 워크플로우 예시

### 리서치 → 팟캐스트

```python
research_start(query="AI trends 2026", mode="deep")
research_status(notebook_id, max_wait=300)
research_import(notebook_id, task_id)
studio_create(notebook_id, artifact_type="audio", confirm=True)
studio_status(notebook_id)
download_artifact(notebook_id, artifact_type="audio", output_path="podcast.mp3")
```

### 소스 추가 (대기 모드)

```python
source_add(notebook_id, source_type="url", url="https://...", wait=True)
```

### 학습 자료 생성

```python
studio_create(notebook_id, artifact_type="quiz", question_count=10, confirm=True)
studio_create(notebook_id, artifact_type="flashcards", difficulty="hard", confirm=True)
studio_create(notebook_id, artifact_type="report", report_format="Study Guide", confirm=True)
```

### 태그 → 배치 → 크로스 질의

```python
tag(action="add", notebook_id="abc", tags="ai,research")
tag(action="select", query="ai research")
cross_notebook_query(query="What are the main conclusions?", tags="ai")
batch(action="studio", artifact_type="audio", tags="ai", confirm=True)
```

### 완전한 CLI 워크플로우

```bash
nlm login
nlm setup add claude-code
nlm notebook create "AI Research"
nlm alias set ai <notebook-id>
nlm source add ai --url "https://example.com/article" --wait
nlm source add ai --file research.pdf --wait
nlm audio create ai --format deep_dive --confirm
nlm studio status ai
nlm download audio ai <artifact-id> --output podcast.mp3
```

---

## MCP 서버 설정

```bash
# 자동 설정 (권장)
nlm setup add claude-code
nlm setup add gemini
nlm setup add cursor
nlm setup add windsurf
nlm setup add json              # 기타 도구용 JSON 생성

nlm setup list                  # 설정 상태 확인
nlm setup remove claude-code    # 제거
```

수동 설정:
```bash
claude mcp add --scope user notebooklm-mcp notebooklm-mcp
gemini mcp add --scope user notebooklm-mcp notebooklm-mcp
```

| MCP 서버 옵션 | 설명 | 기본값 |
|--------------|------|--------|
| `--transport` | 프로토콜 (stdio, http, sse) | stdio |
| `--port` | HTTP/SSE 포트 | 8000 |
| `--debug` | 디버그 로깅 | false |

> **컨텍스트 윈도우 경고**: MCP 서버는 **35개 도구**를 노출합니다. 사용하지 않을 때는 비활성화하세요. Claude Code에서: `@notebooklm-mcp`으로 토글

---

## 환경 변수

| 변수 | 설명 |
|------|------|
| `NOTEBOOKLM_MCP_TRANSPORT` | 트랜스포트 타입 |
| `NOTEBOOKLM_MCP_PORT` | HTTP/SSE 포트 |
| `NOTEBOOKLM_MCP_DEBUG` | 디버그 로깅 활성화 |
| `NOTEBOOKLM_HL` | 인터페이스 언어 (기본: en) |
| `NOTEBOOKLM_QUERY_TIMEOUT` | 질의 타임아웃 (초) |

---

## 트러블슈팅

### 업그레이드가 최신 버전을 설치하지 않을 때
```bash
uv tool install --force notebooklm-mcp-cli
```

### 인증 문제
```bash
nlm login --check      # 상태 확인
nlm login              # 재인증
nlm doctor --verbose   # 전체 진단
```

---

## 제한사항

- **Rate limits**: Free tier ~50 쿼리/일
- **API 변경**: 비공식 API이므로 사전 공지 없이 변경 가능
- **쿠키 만료**: 2-4주마다 `nlm login` 재인증 필요
- **세션 만료**: ~20분 후 재인증 필요

---

*이 문서는 [PleasePrompto/notebooklm-mcp](https://github.com/PleasePrompto/notebooklm-mcp) (jacob-bd/notebooklm-mcp-cli) 원본 문서를 기반으로 작성되었습니다.*
