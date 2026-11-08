import { ArchitectureReport } from './types.js';
import { AstParser } from './ast.js';
import { CycleDetector } from './cycles.js';
import { MermaidGenerator } from './mermaid.js';

export class ArchitectureEngine {
  public static analyze(rootDir: string): ArchitectureReport {
    const nodes = AstParser.scanDirectory(rootDir);
    const cycles = CycleDetector.findCycles(nodes);
    const mermaidGraph = MermaidGenerator.generate(nodes);

    let totalDependencies = 0;
    const entryPoints: string[] = [];
    const orphans: string[] = [];

    for (const [id, node] of Object.entries(nodes)) {
      totalDependencies += node.dependencies.length;
      if (node.isEntryPoint) entryPoints.push(id);
      if (node.isOrphan) orphans.push(id);
    }

    const totalFiles = Object.keys(nodes).length;
    const couplingIndex = totalFiles > 0 ? parseFloat((totalDependencies / totalFiles).toFixed(2)) : 0;

    // Health Score Calculation:
    // Deduct 25 pts per circular dependency
    // Deduct 2 pts per orphan file
    // Deduct if coupling index > 4 (tight coupling)
    let deductions = cycles.length * 25 + orphans.length * 2;
    if (couplingIndex > 4) {
      deductions += Math.min(20, Math.round((couplingIndex - 4) * 5));
    }

    const healthScore = Math.max(0, 100 - deductions);

    return {
      rootPath: rootDir,
      timestamp: new Date().toISOString(),
      totalFiles,
      totalDependencies,
      nodes,
      cycles,
      entryPoints,
      orphans,
      healthScore,
      couplingIndex,
      mermaidGraph,
    };
  }
}
