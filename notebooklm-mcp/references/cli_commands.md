# CLI Command Reference

Complete command reference for the `nlm` command-line interface.

## Table of Contents

1. [Installation](#installation)
2. [Authentication](#authentication)
3. [Notebooks](#notebooks)
4. [Sources](#sources)
5. [Studio Content Creation](#studio-content-creation)
6. [Downloads](#downloads)
7. [Research](#research)
8. [Studio Status](#studio-status)
9. [Sharing](#sharing)
10. [Batch Operations](#batch-operations)
11. [Cross-Notebook Query](#cross-notebook-query)
12. [Pipelines](#pipelines)
13. [Tags & Smart Select](#tags--smart-select)
14. [Chat Configuration](#chat-configuration)
15. [Aliases](#aliases)
16. [Configuration](#configuration)
17. [Setup (MCP Server)](#setup-mcp-server)
18. [Skills](#skills)
19. [Doctor (Diagnostics)](#doctor-diagnostics)
20. [Output Formats](#output-formats)

---

## Command Structure

The CLI supports two syntax styles:

```bash
# Noun-first (resource-oriented)
nlm notebook create "Title"
nlm source add <notebook> --url <url>

# Verb-first (action-oriented)
nlm create notebook "Title"
nlm add url <notebook> <url>
```

---

## Installation

```bash
uv tool install notebooklm-mcp-cli    # recommended
pip install notebooklm-mcp-cli         # alternative
pipx install notebooklm-mcp-cli        # alternative
```

## Authentication

```bash
nlm login                              # auto mode: launches browser
nlm login --profile work               # named profile
nlm login --check                      # check auth status
nlm login switch <profile>             # switch default profile
nlm login profile list                 # list profiles with emails
nlm login profile delete <name>        # delete profile
nlm login profile rename <old> <new>   # rename profile
nlm login --provider openclaw --cdp-url http://127.0.0.1:18800  # external CDP
```

## Notebooks

```bash
nlm notebook list                      # list all
nlm notebook list --json               # JSON output
nlm notebook create "Title"            # create
nlm notebook get <id>                  # details
nlm notebook describe <id>            # AI summary
nlm notebook rename <id> "New Title"   # rename
nlm notebook delete <id> --confirm     # delete (IRREVERSIBLE)
nlm notebook query <id> "question"     # chat with sources
```

## Sources

```bash
nlm source list <notebook>
nlm source add <notebook> --url "https://..." [--wait]
nlm source add <notebook> --text "content" --title "Notes"
nlm source add <notebook> --file document.pdf [--wait]
nlm source add <notebook> --youtube "https://..."
nlm source add <notebook> --drive <doc-id>
nlm source get <source-id>
nlm source describe <source-id>
nlm source stale <notebook>            # check stale Drive sources
nlm source sync <notebook> --confirm   # sync stale sources
nlm source delete <source-id> --confirm
```

## Studio Content Creation

```bash
# Audio (podcasts)
nlm audio create <notebook> --confirm
nlm audio create <notebook> --format deep_dive --length long --confirm
# Formats: deep_dive, brief, critique, debate
# Lengths: short, default, long

# Video
nlm video create <notebook> --confirm
nlm video create <notebook> --format explainer --style classic --confirm
# Formats: explainer, brief
# Styles: auto_select, classic, whiteboard, kawaii, anime, watercolor, retro_print, heritage, paper_craft

# Reports
nlm report create <notebook> --format "Briefing Doc" --confirm
# Formats: "Briefing Doc", "Study Guide", "Blog Post", "Create Your Own"

# Quiz & Flashcards
nlm quiz create <notebook> --count 10 --difficulty medium --focus "key concepts" --confirm
nlm flashcards create <notebook> --difficulty hard --focus "definitions" --confirm

# Other
nlm mindmap create <notebook> --confirm
nlm slides create <notebook> --confirm
nlm slides revise <artifact-id> --slide '1 Make the title larger' --confirm
nlm infographic create <notebook> --orientation landscape --style professional --confirm
nlm data-table create <notebook> --description "Sales by region" --confirm
```

## Downloads

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

## Research

```bash
nlm research start "query" --notebook-id <id> --mode fast
nlm research start "query" --notebook-id <id> --mode deep
nlm research start "query" --notebook-id <id> --source drive
nlm research status <notebook> --max-wait 300
nlm research import <notebook> <task-id>
```

## Studio Status

```bash
nlm studio status <notebook>
nlm studio delete <notebook> <artifact-id> --confirm
```

## Sharing

```bash
nlm share status <notebook>
nlm share public <notebook>
nlm share private <notebook>
nlm share invite <notebook> email@example.com
nlm share invite <notebook> email --role editor
```

## Batch Operations

```bash
nlm batch query "What are the key takeaways?" --notebooks "id1,id2"
nlm batch query "Summarize" --tags "ai,research"
nlm batch query "Summarize" --all
nlm batch add-source --url "https://..." --notebooks "id1,id2"
nlm batch create "Project A, Project B, Project C"
nlm batch delete --notebooks "id1,id2" --confirm
nlm batch studio --type audio --tags "research" --confirm
```

## Cross-Notebook Query

```bash
nlm cross query "What features are discussed?" --notebooks "id1,id2"
nlm cross query "Compare approaches" --tags "ai,research"
nlm cross query "Summarize everything" --all
```

## Pipelines

```bash
nlm pipeline list
nlm pipeline run <notebook> ingest-and-podcast --url "https://..."
nlm pipeline run <notebook> research-and-report --url "https://..."
nlm pipeline run <notebook> multi-format
```

Built-in: `ingest-and-podcast`, `research-and-report`, `multi-format`.
Custom: add YAML files to `~/.notebooklm-mcp-cli/pipelines/`.

## Tags & Smart Select

```bash
nlm tag add <notebook> --tags "ai,research,llm"
nlm tag add <notebook> --tags "ai" --title "My Notebook"
nlm tag remove <notebook> --tags "ai"
nlm tag list
nlm tag select "ai research"
```

## Chat Configuration

```bash
nlm chat configure <notebook> --goal default --length default
nlm chat configure <notebook> --goal learning_guide --length longer
nlm chat configure <notebook> --goal custom --prompt "You are an expert..."
```

## Aliases

```bash
nlm alias set myproject <notebook-id>
nlm alias list
nlm alias get myproject
nlm alias delete myproject
# Then use: nlm notebook get myproject, nlm source list myproject, etc.
```

## Configuration

```bash
nlm config show
nlm config get auth.default_profile
nlm config set auth.default_profile work
nlm config set output.format json
```

| Key | Default | Description |
|-----|---------|-------------|
| `output.format` | `table` | Default output format (table, json) |
| `output.color` | `true` | Enable colored output |
| `output.short_ids` | `true` | Show shortened IDs |
| `auth.browser` | `auto` | Preferred browser (auto, chrome, arc, brave, edge, chromium, vivaldi, opera) |
| `auth.default_profile` | `default` | Profile to use when `--profile` not specified |

## Setup (MCP Server)

```bash
nlm setup add claude-code
nlm setup add gemini
nlm setup add cursor
nlm setup add windsurf
nlm setup add json               # interactive JSON config generator
nlm setup remove gemini
nlm setup list
```

Supported clients: `claude-code`, `gemini`, `cursor`, `windsurf`, `cline`, `antigravity`, `codex`.

## Skills

```bash
nlm skill list
nlm skill install claude-code
nlm skill install cursor
nlm skill install agents
nlm skill uninstall <tool>
nlm skill show
```

Supported tools: `claude-code`, `cursor`, `agents`, `opencode`, `antigravity`, `cline`, `openclaw`, `other`.

## Doctor (Diagnostics)

```bash
nlm doctor
nlm doctor --verbose
```

Checks: installation, authentication, browser, AI tool configuration.

## Output Formats

| Flag | Description |
|------|-------------|
| (none) | Rich table format |
| `--json` | JSON output |
| `--quiet` | IDs only |
| `--title` | "ID: Title" format |
| `--full` | All columns |

---

## Complete Workflow Example

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

## Tips

- Session lasts ~20 minutes; run `nlm login` if operations fail
- Use `--confirm` for all create/delete commands in scripts
- Use `--wait` when adding sources to ensure they're ready before querying
- Use aliases for frequently-used notebooks
- Audio/video takes 1-5 minutes; poll with `nlm studio status`
- Run `nlm doctor` to diagnose installation, auth, or config issues
