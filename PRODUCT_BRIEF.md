# DocuFlux — Product Brief

**Product Name:** `docuflux` (CLI: `docuflux`)  
**Date:** 2026-11-08  
**Author:** Jatin Sharma ([https://jatinsh.netlify.app/](https://jatinsh.netlify.app/))  
**GitHub Repository:** `https://github.com/raghav1924/docuflux`  
**License:** MIT  

---

## 1. Executive Summary & Problem Discovery
In November 2026, engineering teams and AI coding agents produce code at unprecedented velocity. However, this creates a major systemic bottleneck: **codebase comprehension & architectural drift**.
- Traditional doc generators (TypeDoc, JSDoc) produce dry, text-heavy lists of function signatures that nobody reads.
- Developers, engineering leaders, and open-source contributors struggle to see **how modules actually connect**, where data flows, and where circular dependencies lurk.
- "Vibe-coded" AI applications frequently introduce hidden cyclic dependencies and architectural debt that traditional compilers ignore until runtime deadlocks occur.
- Pull request reviewers and new joiners need instant visual architecture graphs and exportable documentation artifacts without setting up heavy cloud enterprise platforms.

---

## 2. Product Solution: DocuFlux
**DocuFlux** is a high-speed, zero-dependency Architecture Visualizer, Dependency Graph Generator & Living Documentation Engine for TypeScript and JavaScript codebases.

### Core Capabilities:
- ⚡ **Zero-Config AST Dependency Extraction:** Parses ES Modules, CommonJS, and TypeScript path aliases (`@/*`, `~/*`) to construct a deterministic Directed Acyclic Graph (DAG) of the entire codebase.
- 🕸️ **Circular Dependency Detector:** Detects cyclic imports with Tarjan's strongly connected components algorithm, flagging architectural smell before runtime crashes.
- 📐 **Instant Mermaid & Markdown Synthesis:** Generates interactive Mermaid.js architecture diagrams (`graph TD` / `flowchart LR`) ready for GitHub READMEs.
- 🌐 **Interactive Dark-Mode Web Studio (`--web`):** Built-in HTTP server rendering a sleek, interactive canvas (Linear/Vercel aesthetic) featuring zoom, search, node metrics, dependency depth analysis, and component inspection.
- 📊 **Architecture Health Score (0-100%):** Evaluates modularity, coupling index, entry-point cohesion, and orphan file counts.
- 📄 **Static Single-File HTML Exporter (`--export`):** Compiles the visual canvas and documentation into a standalone `.html` bundle for static hosting (GitHub Pages, Netlify, Vercel) or internal PR reviews.
- 🚀 **CI/CD Quality Gate:** Native flags (`--max-cycles 0`, `--min-health 80`) to fail PRs when circular dependencies are introduced.

---

## 3. Tech Stack & Architecture
- **Language:** TypeScript 5.9 (Strict mode)
- **Runtime:** Node.js (>=18.0.0, zero external production dependencies)
- **Design System:** Dark-mode typography + Responsive Interactive Web Canvas (SVG Graph rendering, CSS Grid, high-contrast badges)
- **Testing:** Native Node.js test runner (`node:test`, `node:assert`)

