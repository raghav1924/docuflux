# DocuFlux Architecture & Dependency Graph Theory

This document details the graph analysis engine, Tarjan's Strongly Connected Components (SCC) algorithm, and interactive rendering architecture of **DocuFlux**.

Author: [Jatin Sharma](https://jatinsh.netlify.app/) (`@raghav1924`)

---

## Technical Architecture

```
TypeScript / JavaScript Source Files
               │
               ▼
   [ Lexical AST Tokenizer ]
   - Import/Export Statements (ESM & CJS)
   - Dynamic imports & tsconfig path aliases (@/...)
               │
               ▼
     [ Directed Graph Builder ]
   - Adjacency list representation: G = (V, E)
   - In-degree & Out-degree metrics
               │
               ├────────────────────────┬────────────────────────┐
               ▼                        ▼                        ▼
     [ Tarjan's SCC Engine ]    [ Coupling Metrics ]    [ Mermaid Synthesizer ]
     - $O(|V| + |E|)$ cycles    - Instability ($I$)     - Subgraph cluster syntax
     - Root-cause paths         - Abstractness ($A$)    - SVG rendering
               │                        │                        │
               └────────────────────────┴────────────────────────┘
                                        │
                                        ▼
                         [ Interactive Dark-Mode Studio ]
                         (Embedded HTTP Server :4040)
```

---

## 1. Tarjan's Strongly Connected Components Algorithm

DocuFlux detects circular dependencies in linear time $O(|V| + |E|)$ using Tarjan's DFS traversal:
- Each node is assigned a depth-first search discovery index `dfn[u]` and a low-link value `low[u]`.
- A stack tracks candidate nodes in the current search path.
- When `low[u] === dfn[u]`, an entire strongly connected component (SCC) is popped, isolating the exact circular cycle.

---

## 2. Software Architecture Metrics

DocuFlux computes classical Robert C. Martin package metrics:
- **Afferent Coupling ($C_a$):** Number of external files depending on this file.
- **Efferent Coupling ($C_e$):** Number of external files this file depends on.
- **Instability Metric ($I$):** $I = \frac{C_e}{C_a + C_e}$ (0 = maximally stable, 1 = maximally unstable).

---

## Zero-Dependency Philosophy

DocuFlux requires no external parsing frameworks or binary graphviz tools. It runs completely inside native Node.js (`node:fs`, `node:path`, `node:http`).

