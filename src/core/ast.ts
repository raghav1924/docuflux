import fs from 'node:fs';
import path from 'node:path';
import { FileNode } from './types.js';

export class AstParser {
  private static readonly SUPPORTED_EXTS = ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs'];

  public static scanDirectory(rootDir: string): Record<string, FileNode> {
    const nodes: Record<string, FileNode> = {};
    const allFiles: string[] = [];

    this.collectFiles(rootDir, rootDir, allFiles);

    // Initialize nodes
    for (const abs of allFiles) {
      const rel = path.relative(rootDir, abs).replace(/\\/g, '/');
      const content = fs.readFileSync(abs, 'utf-8');
      const stat = fs.statSync(abs);

      nodes[rel] = {
        id: rel,
        absolutePath: abs,
        name: path.basename(abs),
        extension: path.extname(abs),
        lineCount: content.split('\n').length,
        sizeBytes: stat.size,
        dependencies: [],
        dependents: [],
        isEntryPoint: false,
        isOrphan: false,
      };
    }

    // Extract dependencies and resolve targets
    for (const [id, node] of Object.entries(nodes)) {
      const content = fs.readFileSync(node.absolutePath, 'utf-8');
      const rawImports = this.extractRawImports(content);

      for (const imp of rawImports) {
        const resolved = this.resolveImport(imp, node.absolutePath, rootDir, nodes);
        if (resolved && resolved !== id && !node.dependencies.includes(resolved)) {
          node.dependencies.push(resolved);
        }
      }
    }

    // Populate inverted dependents and identify entry points / orphans
    for (const [id, node] of Object.entries(nodes)) {
      for (const depId of node.dependencies) {
        if (nodes[depId] && !nodes[depId].dependents.includes(id)) {
          nodes[depId].dependents.push(id);
        }
      }
    }

    for (const [id, node] of Object.entries(nodes)) {
      if (node.dependents.length === 0 && node.dependencies.length > 0) {
        node.isEntryPoint = true;
      }
      if (node.dependents.length === 0 && node.dependencies.length === 0) {
        node.isOrphan = true;
      }
    }

    return nodes;
  }

  private static collectFiles(currentDir: string, rootDir: string, out: string[]): void {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const full = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        // Skip node_modules, dist, .git, .next, etc.
        const ignored = ['node_modules', 'dist', '.git', '.next', 'build', 'coverage', '.turbo'];
        if (!ignored.includes(entry.name)) {
          this.collectFiles(full, rootDir, out);
        }
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name);
        if (this.SUPPORTED_EXTS.includes(ext) && !entry.name.endsWith('.d.ts')) {
          out.push(full);
        }
      }
    }
  }

  public static extractRawImports(content: string): string[] {
    const results: string[] = [];

    // Static imports & exports: import/export ... from '...' OR export * from '...'
    const importRegex = /(?:import|export)\s+(?:(?:(?:\*\s+as\s+\w+)|(?:\*)|(?:\w+)|(?:\{[^}]*\}))\s+from\s+)?['"]([^'"]+)['"]/g;
    let match;
    while ((match = importRegex.exec(content)) !== null) {
      results.push(match[1]);
    }

    // Dynamic imports: import('...')
    const dynamicRegex = /import\(\s*['"]([^'"]+)['"]\s*\)/g;
    while ((match = dynamicRegex.exec(content)) !== null) {
      results.push(match[1]);
    }

    // CommonJS: require('...')
    const requireRegex = /require\(\s*['"]([^'"]+)['"]\s*\)/g;
    while ((match = requireRegex.exec(content)) !== null) {
      results.push(match[1]);
    }

    return results;
  }

  private static resolveImport(
    importSpec: string,
    importerAbsPath: string,
    rootDir: string,
    nodes: Record<string, FileNode>
  ): string | null {
    // Only resolve relative or path-aliased local files, skip npm node_modules packages
    if (!importSpec.startsWith('.') && !importSpec.startsWith('@/') && !importSpec.startsWith('~/')) {
      return null;
    }

    const importerDir = path.dirname(importerAbsPath);
    let targetBase: string;

    if (importSpec.startsWith('@/') || importSpec.startsWith('~/')) {
      targetBase = path.join(rootDir, 'src', importSpec.slice(2));
      if (!fs.existsSync(targetBase)) {
        targetBase = path.join(rootDir, importSpec.slice(2));
      }
    } else {
      targetBase = path.resolve(importerDir, importSpec);
    }

    // 1. Direct match with extension
    for (const ext of this.SUPPORTED_EXTS) {
      // Check candidate with extension if missing
      const withExt = targetBase.endsWith(ext) ? targetBase : `${targetBase}${ext}`;
      const rel = path.relative(rootDir, withExt).replace(/\\/g, '/');
      if (nodes[rel]) return rel;

      // Handle .js import pointing to .ts source
      if (targetBase.endsWith('.js')) {
        const tsVariant = targetBase.slice(0, -3) + '.ts';
        const relTs = path.relative(rootDir, tsVariant).replace(/\\/g, '/');
        if (nodes[relTs]) return relTs;
      }

      // Check candidate index file
      const indexCandidate = path.join(targetBase, `index${ext}`);
      const relIndex = path.relative(rootDir, indexCandidate).replace(/\\/g, '/');
      if (nodes[relIndex]) return relIndex;
    }

    return null;
  }
}
