[한국어](NOTEBOOKLM_MCP_REFERENCE.md)

# NotebookLM CLI & MCP Server — Unified Reference

> **Original source**: [PleasePrompto/notebooklm-mcp](https://github.com/PleasePrompto/notebooklm-mcp) (jacob-bd/notebooklm-mcp-cli)
>
> This document is a unified reference combining the README, MCP Guide, and CLI Guide from the original repository.
> The **notebooklm-mcp-dashboard** project is built on top of this package (`notebooklm-mcp-cli`) and accesses Google NotebookLM by calling the `nlm` CLI from the backend.

---

## Table of Contents

1. [Overview](#overview)
2. [Installation](#installation)
3. [Authentication](#authentication)
4. [Feature Summary](#feature-summary)
5. [CLI Command Reference](#cli-command-reference)
6. [MCP Tool Reference (35 tools)](#mcp-tool-reference-35-tools)
7. [Workflow Examples](#workflow-examples)
8. [MCP Server Configuration](#mcp-server-configuration)
9. [Environment Variables](#environment-variables)
10. [Troubleshooting](#troubleshooting)
11. [Limitations](#limitations)

---

## Overview

`notebooklm-mcp-cli` is a unified package that provides programmatic access to Google NotebookLM. A single installation offers two interfaces:

- **`nlm`** — A CLI (Command-Line Interface) for use in the terminal
- **`notebooklm-mcp`** — An MCP (Model Context Protocol) server for AI agents

> **Disclaimer**: This uses an unofficial internal API. It may change at any time and should only be used for personal/experimental purposes.

---

## Installation

```bash
# uv (recommended)
uv tool install notebooklm-mcp-cli

# pip
pip install notebooklm-mcp-cli

# pipx
pipx install notebooklm-mcp-cli

# uvx (run without installing)
uvx --from notebooklm-mcp-cli nlm --help
```

Executables provided after installation:
- `nlm` — CLI
- `notebooklm-mcp` — MCP server

Upgrade:
```bash
uv tool upgrade notebooklm-mcp-cli
# or force reinstall
uv tool install --force notebooklm-mcp-cli
```

---

## Authentication

Cookie-based authentication. Cookies are automatically extracted after logging in to Google through the browser.

```bash
nlm login                              # automatic mode (launches browser)
nlm login --check                      # check authentication status
nlm login --profile work               # profile for multiple accounts
nlm login switch <profile>             # switch profile
nlm login profile list                 # list profiles
nlm login profile delete <name>        # delete profile
nlm login profile rename <old> <new>   # rename profile
```

| Component | Validity Period | Renewal |
|-----------|----------------|---------|
| Cookie | ~2-4 weeks | Automatically renewed via headless browser when profile is saved |
| CSRF Token | ~minutes | Automatically renewed on request failure |
| Session ID | Per MCP session | Automatically extracted on MCP startup |

---

## Feature Summary

| Feature | CLI Command | MCP Tool |
|---------|-------------|----------|
| List notebooks | `nlm notebook list` | `notebook_list` |
| Create notebook | `nlm notebook create` | `notebook_create` |
| Add source (URL, text, Drive, file) | `nlm source add` | `source_add` |
| Query notebook (AI chat) | `nlm notebook query` | `notebook_query` |
| Create studio content (audio, video, etc.) | `nlm audio/video/report create` | `studio_create` |
| Revise slides | `nlm slides revise` | `studio_revise` |
| Download artifact | `nlm download <type>` | `download_artifact` |
| Web/Drive research | `nlm research start` | `research_start` |
| Share notebook | `nlm share public/invite` | `notebook_share_*` |
| Sync Drive sources | `nlm source sync` | `source_sync_drive` |
| Batch operations | `nlm batch query/create/delete` | `batch` |
| Cross-notebook query | `nlm cross query` | `cross_notebook_query` |
| Pipeline (multi-step workflow) | `nlm pipeline run/list` | `pipeline` |
| Tags & smart selection | `nlm tag add/list/select` | `tag` |
| AI tool setup | `nlm setup add/remove/list` | — |
| Diagnostics | `nlm doctor` | — |

---

## CLI Command Reference

The CLI supports two syntax styles:
```bash
nlm notebook create "Title"    # noun-first (resource-oriented)
nlm create notebook "Title"    # verb-first (action-oriented)
```

### Notebooks

```bash
nlm notebook list                      # list all
nlm notebook list --json               # JSON output
nlm notebook create "Title"            # create
nlm notebook get <id>                  # detailed info
nlm notebook describe <id>             # AI summary
nlm notebook rename <id> "New Title"   # rename
nlm notebook delete <id> --confirm     # delete (irreversible)
nlm notebook query <id> "question"     # AI query
```

### Sources

```bash
nlm source list <notebook>                         # list sources
nlm source add <notebook> --url "https://..."      # add URL
nlm source add <notebook> --url "https://..." --wait  # add + wait for processing
nlm source add <notebook> --text "content" --title "Notes"  # add text
nlm source add <notebook> --file document.pdf --wait  # upload file
nlm source add <notebook> --youtube "https://..."  # add YouTube
nlm source add <notebook> --drive <doc-id>         # add Drive document
nlm source get <source-id>                         # view source content
nlm source describe <source-id>                    # AI summary
nlm source stale <notebook>                        # check stale Drive sources
nlm source sync <notebook> --confirm               # sync Drive sources
nlm source delete <source-id> --confirm            # delete
```

### Studio Content Creation

```bash
# Audio (podcast)
nlm audio create <notebook> --confirm
nlm audio create <notebook> --format deep_dive --length long --confirm
# Formats: deep_dive, brief, critique, debate / Lengths: short, default, long

# Video
nlm video create <notebook> --format explainer --style classic --confirm
# Formats: explainer, brief
# Styles: auto_select, classic, whiteboard, kawaii, anime, watercolor, retro_print, heritage, paper_craft

# Report
nlm report create <notebook> --format "Briefing Doc" --confirm
# Formats: "Briefing Doc", "Study Guide", "Blog Post", "Create Your Own"

# Quiz & Flashcards
nlm quiz create <notebook> --count 10 --difficulty medium --confirm
nlm flashcards create <notebook> --difficulty hard --confirm

# Other
nlm mindmap create <notebook> --confirm
nlm slides create <notebook> --confirm
nlm slides revise <artifact-id> --slide '1 Make title larger' --confirm
nlm infographic create <notebook> --orientation landscape --style professional --confirm
nlm data-table create <notebook> --description "Sales by region" --confirm
```

### Download

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

### Research

```bash
nlm research start "query" --notebook-id <id> --mode fast   # fast search (~30s)
nlm research start "query" --notebook-id <id> --mode deep   # deep search (~5min)
nlm research start "query" --notebook-id <id> --source drive # Drive search
nlm research status <notebook> --max-wait 300                # poll status
nlm research import <notebook> <task-id>                     # import results
```

### Batch Operations

```bash
nlm batch query "What are the key takeaways?" --notebooks "id1,id2"
nlm batch query "Summarize" --tags "ai,research"
nlm batch query "Summarize" --all
nlm batch add-source --url "https://..." --notebooks "id1,id2"
nlm batch create "Project A, Project B, Project C"
nlm batch delete --notebooks "id1,id2" --confirm
nlm batch studio --type audio --tags "research" --confirm
```

### Cross-Notebook Query

```bash
nlm cross query "What features are discussed?" --notebooks "id1,id2"
nlm cross query "Compare approaches" --tags "ai,research"
nlm cross query "Summarize everything" --all
```

### Pipeline

```bash
nlm pipeline list
nlm pipeline run <notebook> ingest-and-podcast --url "https://..."
nlm pipeline run <notebook> research-and-report --url "https://..."
nlm pipeline run <notebook> multi-format
```

Built-in pipelines: `ingest-and-podcast`, `research-and-report`, `multi-format`

Custom pipelines: Add YAML files to `~/.notebooklm-mcp-cli/pipelines/`

### Tags & Smart Selection

```bash
nlm tag add <notebook> --tags "ai,research,llm"
nlm tag remove <notebook> --tags "ai"
nlm tag list
nlm tag select "ai research"
```

### Sharing

```bash
nlm share status <notebook>
nlm share public <notebook>
nlm share private <notebook>
nlm share invite <notebook> email@example.com
nlm share invite <notebook> email --role editor
```

### Configuration

```bash
nlm config show
nlm config set auth.default_profile work
nlm config set output.format json
nlm config set auth.browser brave
```

| Key | Default | Description |
|-----|---------|-------------|
| `output.format` | `table` | Output format (table, json) |
| `output.color` | `true` | Color output |
| `output.short_ids` | `true` | Display short IDs |
| `auth.browser` | `auto` | Login browser (chrome, arc, brave, edge, etc.) |
| `auth.default_profile` | `default` | Default profile |

### Aliases

```bash
nlm alias set myproject <notebook-id>
nlm alias list
nlm alias get myproject
nlm alias delete myproject
# Use anywhere: nlm notebook get myproject
```

### Diagnostics

```bash
nlm doctor              # full check
nlm doctor --verbose    # detailed check
```

### Output Formats

| Flag | Description |
|------|-------------|
| (none) | Rich table |
| `--json` | JSON |
| `--quiet` | ID only |
| `--title` | "ID: Title" |
| `--full` | All columns |

---

## MCP Tool Reference (35 tools)

### Notebooks (6)

| Tool | Description |
|------|-------------|
| `notebook_list` | List all notebooks |
| `notebook_create` | Create a new notebook |
| `notebook_get` | Notebook details + source list |
| `notebook_describe` | AI summary + suggested topics |
| `notebook_rename` | Rename |
| `notebook_delete` | Delete (requires `confirm=True`) |

### Sources (6)

| Tool | Description |
|------|-------------|
| `source_add` | **Unified** — Add URL, text, file, or Drive source |
| `source_list_drive` | List with Drive source status |
| `source_sync_drive` | Sync stale Drive sources |
| `source_delete` | Delete (requires `confirm=True`) |
| `source_describe` | AI summary + keywords |
| `source_get_content` | Retrieve original text |

**`source_add` parameters:**
```python
source_add(
    notebook_id="...",
    source_type="url",        # url | text | file | drive
    url="https://...",        # source_type=url
    text="...",               # source_type=text
    title="...",              # optional
    file_path="/path/to.pdf", # source_type=file
    document_id="...",        # source_type=drive
    doc_type="doc",           # doc | slides | sheets | pdf
    wait=True,                # wait until processing completes
    wait_timeout=120.0        # wait timeout (seconds)
)
```

### Query (2)

| Tool | Description |
|------|-------------|
| `notebook_query` | Ask AI a source-based question |
| `chat_configure` | Set chat goal/response length |

### Studio Content (4)

| Tool | Description |
|------|-------------|
| `studio_create` | **Unified** — Create any artifact type |
| `studio_status` | Check creation progress |
| `studio_delete` | Delete (requires `confirm=True`) |
| `studio_revise` | Revise slides (requires `confirm=True`) |

**`studio_create` artifact types:**
- `audio` — Podcast (deep_dive, brief, critique, debate)
- `video` — Video (explainer, brief / 9 styles)
- `report` — Report (Briefing Doc, Study Guide, Blog Post)
- `quiz` — Quiz
- `flashcards` — Flashcards
- `mind_map` — Mind map
- `slide_deck` — Slides
- `infographic` — Infographic
- `data_table` — Data table

### Download (1)

| Tool | Description |
|------|-------------|
| `download_artifact` | **Unified** — Download any artifact |

### Export (1)

| Tool | Description |
|------|-------------|
| `export_artifact` | Export to Google Docs/Sheets |

### Research (3)

| Tool | Description |
|------|-------------|
| `research_start` | Start web/Drive research (fast/deep) |
| `research_status` | Poll progress |
| `research_import` | Import discovered sources |

### Notes (1)

| Tool | Description |
|------|-------------|
| `note` | **Unified** — Note management (list, create, update, delete) |

### Sharing (3)

| Tool | Description |
|------|-------------|
| `notebook_share_status` | View sharing settings |
| `notebook_share_public` | Enable/disable public link |
| `notebook_share_invite` | Invite collaborators by email |

### Authentication (2)

| Tool | Description |
|------|-------------|
| `refresh_auth` | Refresh authentication tokens |
| `save_auth_tokens` | Save cookies (alternative method) |

### Server (1)

| Tool | Description |
|------|-------------|
| `server_info` | Check version + update availability |

### Batch & Cross-Notebook (2)

| Tool | Description |
|------|-------------|
| `batch` | **Unified** — Multi-notebook batch operations (query, add_source, create, delete, studio) |
| `cross_notebook_query` | Multi-notebook query + per-notebook citations |

### Pipeline (1)

| Tool | Description |
|------|-------------|
| `pipeline` | **Unified** — Multi-step workflow (list, run) |

### Tags & Smart Selection (1)

| Tool | Description |
|------|-------------|
| `tag` | **Unified** — Tag management + smart search (add, remove, list, select) |

---

## Workflow Examples

### Research → Podcast

```python
research_start(query="AI trends 2026", mode="deep")
research_status(notebook_id, max_wait=300)
research_import(notebook_id, task_id)
studio_create(notebook_id, artifact_type="audio", confirm=True)
studio_status(notebook_id)
download_artifact(notebook_id, artifact_type="audio", output_path="podcast.mp3")
```

### Add Source (Wait Mode)

```python
source_add(notebook_id, source_type="url", url="https://...", wait=True)
```

### Generate Study Materials

```python
studio_create(notebook_id, artifact_type="quiz", question_count=10, confirm=True)
studio_create(notebook_id, artifact_type="flashcards", difficulty="hard", confirm=True)
studio_create(notebook_id, artifact_type="report", report_format="Study Guide", confirm=True)
```

### Tags → Batch → Cross Query

```python
tag(action="add", notebook_id="abc", tags="ai,research")
tag(action="select", query="ai research")
cross_notebook_query(query="What are the main conclusions?", tags="ai")
batch(action="studio", artifact_type="audio", tags="ai", confirm=True)
```

### Complete CLI Workflow

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

## MCP Server Configuration

```bash
# Automatic setup (recommended)
nlm setup add claude-code
nlm setup add gemini
nlm setup add cursor
nlm setup add windsurf
nlm setup add json              # generate JSON for other tools

nlm setup list                  # check setup status
nlm setup remove claude-code    # remove
```

Manual setup:
```bash
claude mcp add --scope user notebooklm-mcp notebooklm-mcp
gemini mcp add --scope user notebooklm-mcp notebooklm-mcp
```

| MCP Server Option | Description | Default |
|-------------------|-------------|---------|
| `--transport` | Protocol (stdio, http, sse) | stdio |
| `--port` | HTTP/SSE port | 8000 |
| `--debug` | Debug logging | false |

> **Context window warning**: The MCP server exposes **35 tools**. Disable it when not in use. In Claude Code: toggle with `@notebooklm-mcp`

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NOTEBOOKLM_MCP_TRANSPORT` | Transport type |
| `NOTEBOOKLM_MCP_PORT` | HTTP/SSE port |
| `NOTEBOOKLM_MCP_DEBUG` | Enable debug logging |
| `NOTEBOOKLM_HL` | Interface language (default: en) |
| `NOTEBOOKLM_QUERY_TIMEOUT` | Query timeout (seconds) |

---

## Troubleshooting

### Upgrade does not install the latest version
```bash
uv tool install --force notebooklm-mcp-cli
```

### Authentication issues
```bash
nlm login --check      # check status
nlm login              # re-authenticate
nlm doctor --verbose   # full diagnostics
```

---

## Limitations

- **Rate limits**: Free tier ~50 queries/day
- **API changes**: Unofficial API, subject to change without notice
- **Cookie expiration**: Re-authentication via `nlm login` required every 2-4 weeks
- **Session expiration**: Re-authentication required after ~20 minutes

---

*This document is based on the original documentation from [PleasePrompto/notebooklm-mcp](https://github.com/PleasePrompto/notebooklm-mcp) (jacob-bd/notebooklm-mcp-cli).*
