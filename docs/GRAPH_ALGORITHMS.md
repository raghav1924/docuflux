# Graph Algorithms in DocuFlux

DocuFlux uses graph theory to analyze TypeScript and JavaScript dependency networks:
- **Depth-First Search (DFS)**: Builds topological depth maps and traverses import trees.
- **Tarjan's Algorithm for Strongly Connected Components (SCC)**: Detects circular dependencies with linear time complexity $O(V + E)$.
- **Modularity Score**: Computes ratio of internal module coupling to external cross-package dependencies.
