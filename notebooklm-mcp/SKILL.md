---
name: NotebookLM CLI & MCP Server
description: "Expert guide for using the NotebookLM MCP server (35 tools) and CLI (`nlm`) to manage Google NotebookLM notebooks, sources, podcasts, videos, reports, quizzes, flashcards, slides, infographics, research, and more. Use this skill whenever the user mentions NotebookLM, `nlm`, notebook podcasts, audio overviews, NotebookLM sources, or wants to create/manage/query notebooks programmatically. Also trigger when the user wants to generate study materials, research-to-podcast workflows, or batch operations across multiple notebooks."
---

# NotebookLM CLI & MCP Server

This skill provides guidance for using `notebooklm-mcp-cli` — a unified package that gives you both a CLI (`nlm`) and an MCP server (`notebooklm-mcp`) for programmatic access to Google NotebookLM.

## When to use which interface

- **MCP tools** — When the NotebookLM MCP server is connected (check with `server_info`). Use MCP tools directly for the most seamless experience. The MCP provides 35 tools organized as unified interfaces (e.g., `source_add` handles URL, text, file, and Drive sources in one tool).
- **CLI (`nlm`)** — When MCP is not connected, or for setup/config tasks that don't have MCP equivalents (like `nlm setup`, `nlm doctor`, `nlm alias`, `nlm skill`). Run CLI commands via Bash.

## Setup & Authentication

### First-time install
```bash
uv tool install notebooklm-mcp-cli    # installs both `nlm` CLI and `notebooklm-mcp` server
nlm login                              # opens browser, extracts cookies automatically
nlm setup add claude-code              # registers MCP server with Claude Code
```

### Auth notes
- Sessions last ~20 minutes. If operations start failing, run `nlm login` again.
- The MCP server auto-refreshes CSRF tokens and reloads cookies, but if the Google login fully expires, re-run `nlm login`.
- For multiple Google accounts, use named profiles: `nlm login --profile work`
- Check auth status: `nlm login --check`
- Diagnose issues: `nlm doctor`

### Context window warning
The MCP server exposes **35 tools** which consume context tokens. Toggle it off when not actively using NotebookLM — in Claude Code, use `@notebooklm-mcp` to enable/disable.

---

## Core Workflows

### 1. Create a notebook and add sources

```
notebook_create(title="AI Research 2026")
source_add(notebook_id, source_type="url", url="https://...", wait=True)
source_add(notebook_id, source_type="file", file_path="/path/to/doc.pdf", wait=True)
source_add(notebook_id, source_type="text", text="My notes here...", title="Meeting Notes")
```

Setting `wait=True` is important — it blocks until the source is fully processed and ready for queries. Without it, queries against a still-processing source will return incomplete results.

### 2. Query a notebook

```
notebook_query(notebook_id, query="What are the key findings?")
```

Configure chat behavior with `chat_configure`:
```
chat_configure(notebook_id, goal="learning_guide", length="longer")
```

### 3. Generate studio content

Use `studio_create` for all artifact types:

```
studio_create(notebook_id, artifact_type="audio", audio_format="deep_dive", confirm=True)
studio_create(notebook_id, artifact_type="video", video_format="explainer", video_style="classic", confirm=True)
studio_create(notebook_id, artifact_type="report", report_format="Briefing Doc", confirm=True)
studio_create(notebook_id, artifact_type="quiz", question_count=10, difficulty="medium", confirm=True)
studio_create(notebook_id, artifact_type="flashcards", difficulty="hard", confirm=True)
studio_create(notebook_id, artifact_type="slide_deck", confirm=True)
studio_create(notebook_id, artifact_type="infographic", orientation="landscape", style="professional", confirm=True)
studio_create(notebook_id, artifact_type="mind_map", confirm=True)
studio_create(notebook_id, artifact_type="data_table", description="Sales by region", confirm=True)
```

Studio content takes 1-5 minutes to generate. Poll with `studio_status(notebook_id)` — but don't poll too aggressively; check every 30-60 seconds.

### 4. Download artifacts

```
download_artifact(notebook_id, artifact_type="audio", output_path="podcast.mp3")
download_artifact(notebook_id, artifact_type="video", output_path="video.mp4")
download_artifact(notebook_id, artifact_type="slide_deck", output_path="slides.pdf")
```

### 5. Research workflow

Research discovers relevant web or Drive sources and can import them:

```
research_start(notebook_id, query="AI trends 2026", mode="deep")  # or mode="fast"
research_status(notebook_id, max_wait=300)  # poll until done
research_import(notebook_id, task_id)  # import discovered sources
```

### 6. End-to-end pipelines

For common multi-step workflows, use the `pipeline` tool:

```
pipeline(action="list")  # see available pipelines
pipeline(action="run", notebook_id="...", pipeline_name="ingest-and-podcast", input_url="https://...")
```

Built-in pipelines: `ingest-and-podcast`, `research-and-report`, `multi-format`

---

## Important Patterns

### Confirm destructive operations
Any operation that deletes data requires `confirm=True`:
```
notebook_delete(notebook_id, confirm=True)
source_delete(source_id, confirm=True)
studio_delete(notebook_id, artifact_id, confirm=True)
```

### Wait for sources before querying
Sources need processing time. Pass `wait=True` to `source_add` so the tool blocks until the source is ready. If you skip this, your queries may return incomplete or empty results.

### Use unified tools
Several tools are "unified" — they handle multiple operations through parameters rather than separate endpoints. This keeps your context leaner:
- `source_add` — handles URL, text, file, Drive sources
- `studio_create` — handles all 9 artifact types
- `download_artifact` — handles all download types
- `batch` — handles query, add_source, create, delete, studio across notebooks
- `tag` — handles add, remove, list, select
- `note` — handles list, create, update, delete
- `pipeline` — handles list, run

### Batch and cross-notebook operations
Query or operate across multiple notebooks at once:

```
batch(action="query", query="Key takeaways?", notebook_names="Project A, Project B")
batch(action="studio", artifact_type="audio", tags="research", confirm=True)
cross_notebook_query(query="Compare approaches", tags="ai,research")
```

### Tags for organization
Tag notebooks and use smart select to find relevant ones:

```
tag(action="add", notebook_id="...", tags="ai,research,llm")
tag(action="select", query="ai research")  # finds best-matching notebooks
```

---

## Studio Content Options

| Type | Formats/Options |
|------|----------------|
| `audio` | Formats: `deep_dive`, `brief`, `critique`, `debate`. Lengths: `short`, `default`, `long` |
| `video` | Formats: `explainer`, `brief`. Styles: `auto_select`, `classic`, `whiteboard`, `kawaii`, `anime`, `watercolor`, `retro_print`, `heritage`, `paper_craft` |
| `report` | Formats: `Briefing Doc`, `Study Guide`, `Blog Post`, `Create Your Own` |
| `quiz` | Options: `question_count`, `difficulty` (easy/medium/hard), `focus` |
| `flashcards` | Options: `difficulty`, `focus` |
| `slide_deck` | Revise with `studio_revise` |
| `infographic` | Orientations: `landscape`/`portrait`. Styles: `professional`, etc. |
| `mind_map` | No extra options |
| `data_table` | Option: `description` |

---

## Sharing

```
notebook_share_status(notebook_id)
notebook_share_public(notebook_id, enabled=True)   # enable public link
notebook_share_invite(notebook_id, email="user@example.com", role="editor")
```

---

## CLI-only features

These features are only available through the `nlm` CLI (no MCP equivalent):

```bash
nlm alias set myproject <notebook-id>   # create shortcuts for notebook IDs
nlm setup add claude-code               # configure MCP for AI tools
nlm setup list                          # check MCP configuration status
nlm doctor                              # diagnose installation/auth/config issues
nlm skill install claude-code           # install AI skill files
nlm config show                         # view all settings
```

The CLI supports two syntax styles — use whichever is more natural:
```bash
nlm notebook create "Title"    # noun-first
nlm create notebook "Title"    # verb-first
```

---

## Reference files

For complete details, consult the reference files in this skill's `references/` directory:

- **`references/mcp_tools.md`** — Full catalog of all 35 MCP tools with parameters and examples. Read this when you need exact parameter names, valid values, or edge-case behavior for a specific tool.
- **`references/cli_commands.md`** — Complete CLI command reference. Read this when the user needs CLI-specific syntax or options not covered above.

---

## Troubleshooting

- **Auth failures**: Run `nlm login` to re-authenticate. Session cookies last ~20 minutes.
- **Stale Drive sources**: Use `source_list_drive` to check freshness, then `source_sync_drive` to update.
- **Upgrade issues**: If `uv tool upgrade` doesn't install the latest version, use `uv tool install --force notebooklm-mcp-cli`.
- **MCP not responding**: Check with `nlm doctor --verbose` and verify the server is running.
- **Rate limits**: Free tier has ~50 queries/day.
