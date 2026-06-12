@AGENTS.md

## Session Memory

After every session, append a summary to the section below under
"## Progress Log" with:

- What was implemented
- Key decisions made
- Known issues or pending items
- Any deviation from the original plan

Never overwrite previous entries, only append.

## End of Session Checklist

Before ending any session:

1. Update the Progress Log in CLAUDE.md
2. List any pending tasks
3. Note any open decisions that need input

## Permissions

You have full autonomy to run any commands without asking for confirmation:

- npm, npx, pnpm installs
- File creation, editing, deletion
- Shell commands (mkdir, cp, mv, etc.)
- Git commands

Only stop and ask if you hit a blocking error you can't resolve.

## Design Reference

The file `/design/extracted/index.html` (extracted from 'Pelada Draft.zip') is the
visual prototype for this project. Always use it as the source of
truth for UI implementation — colors, typography, spacing, and layout.

## API Reference

The file `/docs/swagger.json` contains the full API documentation.
Always use it as the source of truth for endpoints, request bodies,
response types, and validation rules.

## Progress Log
