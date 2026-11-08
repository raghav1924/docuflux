import { FileNode, DependencyCycle } from './types.js';

export class CycleDetector {
  /**
   * Tarjan's Strongly Connected Components algorithm for finding cyclic dependencies
   */
  public static findCycles(nodes: Record<string, FileNode>): DependencyCycle[] {
    let index = 0;
    const indices: Record<string, number> = {};
    const lowlink: Record<string, number> = {};
    const onStack: Record<string, boolean> = {};
    const stack: string[] = [];
    const sccs: string[][] = [];

    const strongConnect = (v: string) => {
      indices[v] = index;
      lowlink[v] = index;
      index++;
      stack.push(v);
      onStack[v] = true;

      const node = nodes[v];
      if (node) {
        for (const w of node.dependencies) {
          if (indices[w] === undefined) {
            strongConnect(w);
            lowlink[v] = Math.min(lowlink[v], lowlink[w]);
          } else if (onStack[w]) {
            lowlink[v] = Math.min(lowlink[v], indices[w]);
          }
        }
      }

      if (lowlink[v] === indices[v]) {
        const scc: string[] = [];
        let w: string;
        do {
          w = stack.pop()!;
          onStack[w] = false;
          scc.push(w);
        } while (w !== v);

        // Only SCCs with size > 1 or self-loops represent cyclic dependencies
        if (scc.length > 1) {
          sccs.push(scc);
        } else if (scc.length === 1 && nodes[scc[0]]?.dependencies.includes(scc[0])) {
          sccs.push(scc);
        }
      }
    };

    for (const nodeId of Object.keys(nodes)) {
      if (indices[nodeId] === undefined) {
        strongConnect(nodeId);
      }
    }

    return sccs.map(scc => ({
      cycle: [...scc, scc[0]], // Close the cycle for presentation
      length: scc.length,
    }));
  }
}

