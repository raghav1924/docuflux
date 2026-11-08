# 🌊 DocuFlux

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-emerald.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Mermaid.js](https://img.shields.io/badge/Mermaid-DAG-cyan.svg)](https://mermaid.js.org/)

**High-speed Architecture Visualizer, Dependency Graph Generator & Living Documentation Engine for TypeScript and JavaScript codebases.**

[Key Features](#-key-features) • [Quick Start](#-quick-start) • [Architecture Studio](#-interactive-architecture-studio) • [CI/CD Quality Gates](#-cicd-pipeline-integration) • [CLI Flags](#-cli-options--flags)

</div>

---

## 💡 Why DocuFlux?

In late 2026, autonomous AI coding assistants and team velocity have scaled code generation exponentially. However, this has triggered a massive systemic bottleneck: **codebase comprehension and architectural drift**.
- Traditional documentation generators (TypeDoc, JSDoc) produce dense, unreadable lists of function signatures.
- Rapid "vibe-coding" and multi-file agent edits quietly introduce **circular dependencies** and tight coupling that compilers ignore until runtime deadlocks occur.
- Engineers and new joiners struggle to understand how modular boundaries connect across real files.

**DocuFlux** solves this in under **100 milliseconds**: it parses TypeScript/JavaScript AST import statements across your workspace, detects circular dependencies via Tarjan's SCC algorithm, calculates a composite **Architecture Health Score (0-100%)**, and spins up a sleek, interactive dark-mode visual architecture studio in your browser.

---

## ✨ Key Features

- 🏎️ **Ultra-Fast AST Parser:** Scans ES Modules, CommonJS, dynamic imports, and TypeScript path aliases (`@/*`, `~/*`) with zero build step required.
- 🕸️ **Circular Dependency Detection:** Uses Tarjan's Strongly Connected Components algorithm to identify multi-hop import cycles before they reach production.
- 📐 **Mermaid.js Generation:** Automatically compiles clean, GitHub-ready `graph TD` diagrams grouped by module directories.
- 🌐 **Interactive Web Studio (`--web`):** Instant local HTTP canvas (Linear/Vercel dark-mode aesthetic) with module metrics, coupling stats, and live SVG DAG rendering.
- 📄 **Single-File HTML Exporter (`--export`):** Compiles the visual canvas and documentation into a standalone `.html` file ready for GitHub Pages or pull request summaries.
- 🛡️ **CI/CD Quality Gates:** Enforce architectural cleanliness in GitHub Actions (`--max-cycles 0`, `--min-health 80`).
- ⚡ **Zero External Dependencies:** Built with pure TypeScript and Node.js standard libraries for zero supply-chain risk and instant execution.

---

## 🚀 Quick Start

### 1. Analyze Your Codebase in the Terminal
\`\`\`bash
# Scan current directory
npx docuflux analyze

# Scan specific source folder
npx docuflux analyze src/
\`\`\`

### 2. Launch the Interactive Visual Studio
\`\`\`bash
# Launches browser canvas on http://localhost:4920
npx docuflux visualize
\`\`\`

---

## 🌐 Interactive Architecture Studio

Run DocuFlux with the `--web` flag to open the embedded Web Studio:

\`\`\`bash
docuflux analyze src/ --web
\`\`\`

Studio Capabilities:
- High-contrast dark mode with responsive metrics grid.
- Visual DAG rendering powered by Mermaid.js with automatic directory clustering.
- Deep-dive panel showing coupling index, entry points, and orphan files.
- Live alerts for circular dependency chains.
- Direct portfolio backlink to [Jatin Sharma](https://jatinsh.netlify.app/).

---

## 🚢 CI/CD Pipeline Integration

Enforce architectural discipline across your team to prevent accidental circular loops:

\`\`\`bash
# Fail CI build if any circular dependencies exist
docuflux analyze src/ --max-cycles 0

# Fail CI build if architecture health score falls below 85%
docuflux analyze src/ --min-health 85

# Export diagram directly to a Markdown file
docuflux analyze src/ --mermaid ./docs/architecture.mmd
\`\`\`

### GitHub Actions Workflow Example
\`\`\`yaml
name: Architecture Quality Gate
on: [push, pull_request]

jobs:
  architecture-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - name: Verify Architecture Cleanliness
        run: npx docuflux analyze src/ --max-cycles 0 --min-health 80
\`\`\`

---

## 🛠 CLI Options & Flags

\`\`\`bash
docuflux <command> [directory] [options]

Commands:
  analyze, scan [dir]     Analyze imports, dependency graph & detect cycles (default: '.')
  visualize, studio [dir] Launch interactive browser architecture canvas
  help                    Show help documentation

Flags:
  --web                   Start interactive browser Studio after analysis
  --export <file.html>    Save static standalone HTML architecture dashboard
  --mermaid <file.mmd>    Save raw Mermaid.js graph definition
  --json                  Output machine-readable JSON for CI/CD
  --min-health <score>    Fail process if health score is below score (0-100)
  --max-cycles <num>      Fail process if circular dependencies exceed num (e.g. 0)
\`\`\`

---

## 👨‍💻 Author & Open Source

Created with ❤️ by **[Jatin Sharma](https://jatinsh.netlify.app/)**  
*Full-Stack Engineer & Product Designer*

- 🌐 **Portfolio & Case Studies:** [https://jatinsh.netlify.app/](https://jatinsh.netlify.app/)
- 🐙 **GitHub:** [@raghav1924](https://github.com/raghav1924)
- 📦 **Repository:** [https://github.com/raghav1924/docuflux](https://github.com/raghav1924/docuflux)

Distributed under the [MIT License](LICENSE).
