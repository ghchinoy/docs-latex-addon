<!-- headroom:rtk-instructions -->
# RTK (Rust Token Killer) - Token-Optimized Commands

When running shell commands, **always prefix with `rtk`**. This reduces context
usage by 60-90% with zero behavior change. If rtk has no filter for a command,
it passes through unchanged — so it is always safe to use.

## Key Commands
```bash
# Git (59-80% savings)
rtk git status          rtk git diff            rtk git log

# Files & Search (60-75% savings)
rtk ls <path>           rtk read <file>         rtk grep <pattern>
rtk find <pattern>      rtk diff <file>

# Test (90-99% savings) — shows failures only
rtk pytest tests/       rtk cargo test          rtk test <cmd>

# Build & Lint (80-90% savings) — shows errors only
rtk tsc                 rtk lint                rtk cargo build
rtk prettier --check    rtk mypy                rtk ruff check

# Analysis (70-90% savings)
rtk err <cmd>           rtk log <file>          rtk json <file>
rtk summary <cmd>       rtk deps                rtk env

# GitHub (26-87% savings)
rtk gh pr view <n>      rtk gh run list         rtk gh issue list

# Infrastructure (85% savings)
rtk docker ps           rtk kubectl get         rtk docker logs <c>

# Package managers (70-90% savings)
rtk pip list            rtk pnpm install        rtk npm run <script>
```

## Rules
- In command chains, prefix each segment: `rtk git add . && rtk git commit -m "msg"`
- For debugging, use raw command without rtk prefix
- `rtk proxy <cmd>` runs command without filtering but tracks usage
<!-- /headroom:rtk-instructions -->

## Google Apps Script & Clasp Workflow
- **Binding to Existing Docs**: Use `clasp create --parentId "<DOC_ID>" --title "<TITLE>"`.
- **API Prerequisite**: Ensure the Google Apps Script API is enabled at `https://script.google.com/home/usersettings`.
- **Manifest Protection**: `clasp create` automatically pulls remote stubs which overwrite `appsscript.json`; always restore `appsscript.json` (to preserve `oauthScopes`) before pushing.
- **Privacy & Portability**: Keep `.clasp.json` in `.gitignore` so personal script/document IDs are never committed or distributed.
- **Deployment**: Deploy updates using `rtk clasp push`.

## Versioning & Changelog
- Maintain `CHANGELOG.md` adhering to Keep a Changelog v1.1.0 and Common Changelog standards (reference the [changelog-manager skill](https://github.com/ghchinoy/agent-skills/tree/main/plugins/repo-authoring/skills/changelog-manager)).
- Synchronize version numbers across `package.json` (`version`), `Code.js` (`APP_VERSION`), and `CHANGELOG.md`.
- Always run `rtk npm test` to verify syntax, math mappings, and version synchronization before pushing or committing.

## Licensing
- When running `addlicense` on this repository, use:
  ```bash
  addlicense -l mit -c "Hussain Chinoy" -s -y <YEAR> <files>
  ```
  to match the MIT license and independent open-source project disclaimer.
