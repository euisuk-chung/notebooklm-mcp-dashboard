# MCP Tool Reference

Complete catalog of all 35 NotebookLM MCP tools.

## Table of Contents

1. [Notebooks (6 tools)](#notebooks-6-tools)
2. [Sources (6 tools)](#sources-6-tools)
3. [Querying (2 tools)](#querying-2-tools)
4. [Studio Content (4 tools)](#studio-content-4-tools)
5. [Downloads (1 tool)](#downloads-1-tool)
6. [Exports (1 tool)](#exports-1-tool)
7. [Research (3 tools)](#research-3-tools)
8. [Notes (1 tool)](#notes-1-tool)
9. [Sharing (3 tools)](#sharing-3-tools)
10. [Auth (2 tools)](#auth-2-tools)
11. [Server (1 tool)](#server-1-tool)
12. [Batch & Cross-Notebook (2 tools)](#batch--cross-notebook-2-tools)
13. [Pipelines (1 tool)](#pipelines-1-tool)
14. [Tags & Smart Select (1 tool)](#tags--smart-select-1-tool)

---

## Notebooks (6 tools)

| Tool | Description |
|------|-------------|
| `notebook_list` | List all notebooks |
| `notebook_create` | Create new notebook |
| `notebook_get` | Get notebook details with sources |
| `notebook_describe` | Get AI summary and suggested topics |
| `notebook_rename` | Rename a notebook |
| `notebook_delete` | Delete notebook (requires `confirm=True`) |

## Sources (6 tools)

| Tool | Description |
|------|-------------|
| `source_add` | **Unified** - Add URL, text, file, or Drive source |
| `source_list_drive` | List sources with Drive freshness status |
| `source_sync_drive` | Sync stale Drive sources |
| `source_delete` | Delete source (requires `confirm=True`) |
| `source_describe` | Get AI summary with keywords |
| `source_get_content` | Get raw text content |

### `source_add` parameters

```python
source_add(
    notebook_id="...",
    source_type="url",        # url | text | file | drive
    url="https://...",        # for source_type=url
    text="...",               # for source_type=text
    title="...",              # optional title
    file_path="/path/to.pdf", # for source_type=file
    document_id="...",        # for source_type=drive
    doc_type="doc",           # doc | slides | sheets | pdf
    wait=True,                # wait for processing to complete
    wait_timeout=120.0        # seconds to wait
)
```

## Querying (2 tools)

| Tool | Description |
|------|-------------|
| `notebook_query` | Ask AI about sources in notebook |
| `chat_configure` | Set chat goal and response length |

Chat goals: `default`, `learning_guide`, `custom` (with custom prompt).
Response lengths: `default`, `shorter`, `longer`.

## Studio Content (4 tools)

| Tool | Description |
|------|-------------|
| `studio_create` | **Unified** - Create any artifact type |
| `studio_status` | Check generation progress |
| `studio_delete` | Delete artifact (requires `confirm=True`) |
| `studio_revise` | Revise slides in existing deck (requires `confirm=True`) |

### `studio_create` artifact types and options

- `audio` — Podcast. Formats: `deep_dive`, `brief`, `critique`, `debate`. Lengths: `short`, `default`, `long`.
- `video` — Video overview. Formats: `explainer`, `brief`. Styles: `auto_select`, `classic`, `whiteboard`, `kawaii`, `anime`, `watercolor`, `retro_print`, `heritage`, `paper_craft`.
- `report` — Text report. Formats: `Briefing Doc`, `Study Guide`, `Blog Post`, `Create Your Own`.
- `quiz` — Multiple choice. Options: `question_count`, `difficulty` (easy/medium/hard), `focus`.
- `flashcards` — Study flashcards. Options: `difficulty`, `focus`.
- `mind_map` — Visual mind map.
- `slide_deck` — Presentation slides.
- `infographic` — Visual infographic. Options: `orientation` (landscape/portrait), `style` (professional, etc.).
- `data_table` — Structured data. Option: `description`.

## Downloads (1 tool)

| Tool | Description |
|------|-------------|
| `download_artifact` | **Unified** - Download any artifact type |

Types: `audio`, `video`, `report`, `mind_map`, `slide_deck`, `infographic`, `data_table`, `quiz`, `flashcards`.

## Exports (1 tool)

| Tool | Description |
|------|-------------|
| `export_artifact` | Export to Google Docs/Sheets |

## Research (3 tools)

| Tool | Description |
|------|-------------|
| `research_start` | Start web/Drive research. Modes: `fast`, `deep`. Source: `web` (default), `drive`. |
| `research_status` | Poll research progress. Option: `max_wait` (seconds). |
| `research_import` | Import discovered sources into notebook. |

## Notes (1 tool)

| Tool | Description |
|------|-------------|
| `note` | **Unified** - Manage notes (action: list, create, update, delete) |

```python
note(notebook_id, action="list")
note(notebook_id, action="create", content="...", title="...")
note(notebook_id, action="update", note_id="...", content="...")
note(notebook_id, action="delete", note_id="...", confirm=True)
```

## Sharing (3 tools)

| Tool | Description |
|------|-------------|
| `notebook_share_status` | Get sharing settings |
| `notebook_share_public` | Enable/disable public link |
| `notebook_share_invite` | Invite collaborator by email (roles: viewer, editor) |

## Auth (2 tools)

| Tool | Description |
|------|-------------|
| `refresh_auth` | Reload auth tokens |
| `save_auth_tokens` | Save cookies (fallback method) |

## Server (1 tool)

| Tool | Description |
|------|-------------|
| `server_info` | Get version and check for updates |

## Batch & Cross-Notebook (2 tools)

| Tool | Description |
|------|-------------|
| `batch` | **Unified** — Batch operations across notebooks |
| `cross_notebook_query` | Query multiple notebooks with aggregated answers and per-notebook citations |

### `batch` actions

```python
batch(action="query", query="What are the key findings?", notebook_names="AI Research, Dev Tools")
batch(action="add_source", source_url="https://...", tags="ai,research")
batch(action="create", titles="Project A, Project B, Project C")
batch(action="delete", notebook_names="Old Project", confirm=True)
batch(action="studio", artifact_type="audio", tags="research", confirm=True)
```

### `cross_notebook_query`

```python
cross_notebook_query(query="Compare approaches", notebook_names="Notebook A, Notebook B")
cross_notebook_query(query="Summarize", tags="ai,research")
cross_notebook_query(query="Everything", all=True)
```

## Pipelines (1 tool)

| Tool | Description |
|------|-------------|
| `pipeline` | **Unified** — List or run multi-step workflows |

```python
pipeline(action="list")
pipeline(action="run", notebook_id="...", pipeline_name="ingest-and-podcast", input_url="https://...")
```

Built-in pipelines: `ingest-and-podcast`, `research-and-report`, `multi-format`.
Custom pipelines: add YAML files to `~/.notebooklm-mcp-cli/pipelines/`.

## Tags & Smart Select (1 tool)

| Tool | Description |
|------|-------------|
| `tag` | **Unified** — Tag notebooks and find relevant ones |

```python
tag(action="add", notebook_id="...", tags="ai,research,llm")
tag(action="remove", notebook_id="...", tags="ai")
tag(action="list")
tag(action="select", query="ai research")
```

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NOTEBOOKLM_MCP_TRANSPORT` | Transport type (stdio, http, sse) |
| `NOTEBOOKLM_MCP_PORT` | HTTP/SSE port (default: 8000) |
| `NOTEBOOKLM_MCP_DEBUG` | Enable debug logging |
| `NOTEBOOKLM_HL` | Interface/artifact language (default: en) |
| `NOTEBOOKLM_QUERY_TIMEOUT` | Query timeout in seconds |
