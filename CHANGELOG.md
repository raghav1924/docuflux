# Changelog

All notable changes to **DocuFlux** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-11-08

### Added
- TypeScript/JavaScript AST dependency import parser supporting ESM, CommonJS, and tsconfig path aliases.
- Tarjan's Strongly Connected Components (SCC) algorithm for detecting circular dependency loops.
- Mermaid.js graph synthesis (`graph TD`) optimized for GitHub README embedding.
- Interactive dark-mode Architecture Web Studio running on `http://localhost:4321`.
- Standalone HTML graph report export (`--export docuflux-report.html`).
- Automated CI/CD gates (`--fail-on-cycles`, `--max-coupling 0.8`).
- Zero external runtime dependencies.

