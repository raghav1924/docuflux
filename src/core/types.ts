export interface FileNode {
  id: string; // Relative normalized path, e.g., 'src/core/engine.ts'
  absolutePath: string;
  name: string;
  extension: string;
  lineCount: number;
  sizeBytes: number;
  dependencies: string[]; // List of target file node IDs
  dependents: string[];   // List of nodes that import this
  isEntryPoint: boolean;
  isOrphan: boolean;
}

export interface DependencyCycle {
  cycle: string[]; // e.g. ['src/a.ts', 'src/b.ts', 'src/a.ts']
  length: number;
}

export interface ArchitectureReport {
  rootPath: string;
  timestamp: string;
  totalFiles: number;
  totalDependencies: number;
  nodes: Record<string, FileNode>;
  cycles: DependencyCycle[];
  entryPoints: string[];
  orphans: string[];
  healthScore: number; // 0 - 100
  couplingIndex: number; // avg dependencies per file
  mermaidGraph: string;
}

