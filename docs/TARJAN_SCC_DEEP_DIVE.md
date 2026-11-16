# Tarjan's Strongly Connected Components Algorithm

DocuFlux detects circular dependencies with linear time complexity $O(V + E)$:
- Assigns index and low-link values during depth-first search (DFS).
- Nodes with matching index and low-link define the root of a strongly connected cycle component.
