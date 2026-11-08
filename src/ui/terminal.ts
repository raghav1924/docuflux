import { ArchitectureReport } from '../core/types.js';
import { colors } from '../utils/logger.js';

export class TerminalReporter {
  public static render(report: ArchitectureReport): void {
    console.log(`\n${colors.bold}📐 Codebase Architecture Analysis${colors.reset}`);
    console.log(`${colors.gray}Scan completed: ${report.timestamp}${colors.reset}\n`);

    const scoreColor = report.healthScore >= 80 ? colors.green : report.healthScore >= 60 ? colors.yellow : colors.red;

    console.log(`  Architecture Health:  ${scoreColor}${colors.bold}${report.healthScore}/100${colors.reset}`);
    console.log(`  Total Modules:        ${colors.bold}${report.totalFiles}${colors.reset}`);
    console.log(`  Total Dependencies:   ${colors.bold}${report.totalDependencies}${colors.reset}`);
    console.log(`  Coupling Index:       ${colors.cyan}${report.couplingIndex}${colors.reset} (avg imports/module)`);
    console.log(`  Entry Points:         ${colors.bold}${report.entryPoints.length}${colors.reset}`);
    console.log(`  Orphan Files:         ${report.orphans.length > 0 ? colors.yellow : colors.gray}${report.orphans.length}${colors.reset}`);
    console.log(`  Circular Dependencies: ${report.cycles.length > 0 ? colors.red + colors.bold : colors.green}${report.cycles.length}${colors.reset}\n`);

    // Circular Dependencies Section
    if (report.cycles.length > 0) {
      console.log(`${colors.red}${colors.bold}⚠ CRITICAL ARCHITECTURAL WARNING: Circular Dependencies Detected!${colors.reset}`);
      report.cycles.forEach((c, idx) => {
        console.log(`  Cycle #${idx + 1}: ${colors.yellow}${c.cycle.join(' ➔ ')}${colors.reset}`);
      });
      console.log();
    } else {
      console.log(`${colors.green}✔ No circular dependencies detected (Strict DAG verified).${colors.reset}\n`);
    }

    // Top coupled files
    const topCoupled = Object.values(report.nodes)
      .sort((a, b) => b.dependencies.length - a.dependencies.length)
      .slice(0, 5);

    if (topCoupled.length > 0) {
      console.log(`${colors.bold}Most Coupled Modules:${colors.reset}`);
      topCoupled.forEach(node => {
        console.log(`  ${colors.cyan}${node.id}${colors.reset} ➔ imports ${colors.bold}${node.dependencies.length}${colors.reset} files, imported by ${colors.bold}${node.dependents.length}${colors.reset} files`);
      });
      console.log();
    }

    console.log(`${colors.dim}💡 Run 'docuflux visualize --web' to interactively explore the live SVG graph.${colors.reset}\n`);
  }
}

