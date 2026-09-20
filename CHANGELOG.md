# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)
and [Common Changelog](https://common-changelog.org/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.1.0] - 2026-09-20

### Added
- **Math Functions:** Support converting standard LaTeX mathematical function and operator names (`\exp`, `\ln`, `\log`, `\sin`, `\cos`, `\tan`, `\min`, `\max`, `\argmax`, `\argmin`, `\lim`, etc.) to clean upright Roman font with native sub/superscripts.
- **Operator Limits:** Support for `\operatorname*{...}` operators with sub/superscript limits.
- **Modulo Notation:** Support for `\pmod{...}` conversion to `(mod ...)`.
- **Versioning UI:** Added active version badge (`v1.1.0`) in the KaTeX sidebar header and footer with direct links to the project changelog.
- **What's New Menu:** Added **What's New & Changelog** dialog to the Google Docs toolbar menu displaying recent release notes and documentation links.
- **Clasp Guidance:** Documented `--parentId` for binding to existing documents and step-by-step Apps Script API enablement in README.

### Fixed
- **Function Name Escaping:** Prevented raw LaTeX escape backslashes from remaining on function names like `\exp` when rendering into Google Docs symbols.

## [1.0.0] - 2026-09-20

_Initial release._

### Added
- **Native Symbol Conversion:** 100% local conversion of raw LaTeX formulas into native Google Docs special characters and subscript/superscript formatting.
- **Dual Rendering Modes:** Support for transforming selected expressions or scanning and converting all in-line (`$...$`) and block (`$$...$$`) equations across the entire document.
- **Live KaTeX Sidebar:** Interactive equation preview sidebar with single-click equation insertion.
- **Syntax Auto-Healing:** Safe parsing of underscores and special characters within `\text{...}` and `\operatorname{...}` blocks.
- **Comprehensive Math Mappings:** Greek lowercase and uppercase, Blackboard Bold (`\mathbb`), Mathematical Script (`\mathcal`), relational symbols, arrows, and operator runs.
- **Zero External Network Dependencies:** Operates without external image rendering services (CodeCogs) or third-party servers.

[Unreleased]: https://github.com/ghchinoy/docs-latex-addon/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/ghchinoy/docs-latex-addon/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/ghchinoy/docs-latex-addon/releases/tag/v1.0.0
