import fs from 'node:fs';
import path from 'node:path';
import { banner, log, colors } from './utils/logger.js';
import { ArchitectureEngine } from './core/engine.js';
import { TerminalReporter } from './ui/terminal.js';
import { WebStudio } from './ui/web.js';

export function runCli(argv: string[]): void {
  const args = argv.slice(2);
  const command = args[0] || 'analyze';

  if (command === '--help' || command === '-h' || command === 'help') {
    banner();
    printHelp();
    return;
  }

  banner();

  if (command === 'analyze' || command === 'scan') {
    const targetPath = args[1] && !args[1].startsWith('--') ? args[1] : '.';
    const resolvedPath = path.resolve(process.cwd(), targetPath);

    const isWeb = args.includes('--web');
    const isJson = args.includes('--json');
    const exportPath = getFlagValue(args, '--export');
    const exportMermaid = getFlagValue(args, '--mermaid');
    const minHealth = parseInt(getFlagValue(args, '--min-health') || '0', 10);
    const maxCycles = getFlagValue(args, '--max-cycles') !== undefined
      ? parseInt(getFlagValue(args, '--max-cycles')!, 10)
      : undefined;

    log.info(`Analyzing architecture in: ${colors.bold}${resolvedPath}${colors.reset}`);

    const report = ArchitectureEngine.analyze(resolvedPath);

    if (isJson) {
      console.log(JSON.stringify(report, null, 2));
      return;
    }

    // Render Terminal Report
    TerminalReporter.render(report);

    // Export standalone HTML if requested
    if (exportPath) {
      const html = WebStudio.exportHtml(report);
      fs.writeFileSync(path.resolve(process.cwd(), exportPath), html, 'utf-8');
      log.success(`Exported interactive Architecture Studio to: ${colors.bold}${exportPath}${colors.reset}`);
    }

    // Export raw Mermaid graph if requested
    if (exportMermaid) {
      fs.writeFileSync(path.resolve(process.cwd(), exportMermaid), report.mermaidGraph, 'utf-8');
      log.success(`Exported Mermaid.js diagram to: ${colors.bold}${exportMermaid}${colors.reset}`);
    }

    // Launch Web Studio if requested
    if (isWeb) {
      WebStudio.serve(report);
      return;
    }

    // CI/CD Failure Gates
    if (maxCycles !== undefined && report.cycles.length > maxCycles) {
      log.error(`Detected ${report.cycles.length} circular dependencies (allowed max: ${maxCycles}). Failing CI gate.`);
      process.exit(1);
    }

    if (minHealth > 0 && report.healthScore < minHealth) {
      log.error(`Architecture health score (${report.healthScore}%) fell below required threshold (${minHealth}%). Failing CI gate.`);
      process.exit(1);
    }

    return;
  }

  if (command === 'visualize' || command === 'studio') {
    const targetPath = args[1] && !args[1].startsWith('--') ? args[1] : '.';
    const resolvedPath = path.resolve(process.cwd(), targetPath);
    const report = ArchitectureEngine.analyze(resolvedPath);
    WebStudio.serve(report);
    return;
  }

  log.warn(`Unknown command '${command}'`);
  printHelp();
}

function getFlagValue(args: string[], flag: string): string | undefined {
  const idx = args.indexOf(flag);
  if (idx !== -1 && args[idx + 1] && !args[idx + 1].startsWith('--')) {
    return args[idx + 1];
  }
  return undefined;
}

function printHelp(): void {
  console.log(`
${colors.bold}USAGE:${colors.reset}
  $ docuflux <command> [directory] [options]

${colors.bold}COMMANDS:${colors.reset}
  ${colors.cyan}analyze, scan [dir]${colors.reset}     Analyze imports, dependency graph & detect cycles (default: '.')
  ${colors.cyan}visualize, studio [dir]${colors.reset} Launch interactive browser architecture canvas
  ${colors.cyan}help, --help${colors.reset}            Show this documentation

${colors.bold}OPTIONS:${colors.reset}
  ${colors.yellow}--web${colors.reset}                   Start interactive browser Studio after analysis
  ${colors.yellow}--export <file.html>${colors.reset}  Save static standalone HTML architecture dashboard
  ${colors.yellow}--mermaid <file.mmd>${colors.reset} Save raw Mermaid.js graph definition
  ${colors.yellow}--json${colors.reset}                Output machine-readable JSON for CI/CD
  ${colors.yellow}--min-health <score>${colors.reset} Fail process if health score is below score (0-100)
  ${colors.yellow}--max-cycles <num>${colors.reset}   Fail process if circular dependencies exceed num (e.g. 0)

${colors.bold}EXAMPLES:${colors.reset}
  $ docuflux analyze
  $ docuflux analyze src/ --web
  $ docuflux analyze . --max-cycles 0 --min-health 80
  $ docuflux analyze . --export ./architecture.html --mermaid ./graph.mmd
`);
}
