import { FileNode } from './types.js';

export class MermaidGenerator {
  public static generate(nodes: Record<string, FileNode>): string {
    const lines: string[] = ['graph TD'];

    // Subgraphs grouped by top-level directories
    const directoryGroups: Record<string, string[]> = {};

    for (const [id] of Object.entries(nodes)) {
      const parts = id.split('/');
      const dir = parts.length > 1 ? parts.slice(0, -1).join('/') : 'root';
      if (!directoryGroups[dir]) directoryGroups[dir] = [];
      directoryGroups[dir].push(id);
    }

    let clusterIdx = 0;
    for (const [dir, fileIds] of Object.entries(directoryGroups)) {
      lines.push(`  subgraph cluster_${clusterIdx++} ["${dir}"]`);
      for (const id of fileIds) {
        const safeId = this.sanitizeId(id);
        const label = nodes[id].name;
        lines.push(`    ${safeId}["${label}"]`);
      }
      lines.push('  end');
    }

    // Edges
    for (const [id, node] of Object.entries(nodes)) {
      const source = this.sanitizeId(id);
      for (const depId of node.dependencies) {
        if (nodes[depId]) {
          const target = this.sanitizeId(depId);
          lines.push(`  ${source} --> ${target}`);
        }
      }
    }

    return lines.join('\n');
  }

  private static sanitizeId(id: string): string {
    return id.replace(/[^a-zA-Z0-9_]/g, '_');
  }
}
