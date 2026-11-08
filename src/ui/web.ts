import http from 'node:http';
import { ArchitectureReport } from '../core/types.js';
import { log, colors } from '../utils/logger.js';

export class WebStudio {
  public static serve(report: ArchitectureReport, port = 4920): void {
    const html = this.renderHtml(report);

    const server = http.createServer((req, res) => {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(html);
    });

    server.listen(port, () => {
      log.success(`DocuFlux Architecture Studio running at: ${colors.bold}${colors.cyan}http://localhost:${port}${colors.reset}`);
      console.log(`${colors.dim}Press Ctrl+C to stop the studio.${colors.reset}\n`);
    });
  }

  public static exportHtml(report: ArchitectureReport): string {
    return this.renderHtml(report);
  }

  private static renderHtml(report: ArchitectureReport): string {
    const nodesJson = JSON.stringify(report.nodes);
    const scoreColor = report.healthScore >= 80 ? '#10b981' : report.healthScore >= 60 ? '#f59e0b' : '#ef4444';

    return `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DocuFlux — Interactive Architecture Studio</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;600&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <!-- Mermaid.js for interactive DAG rendering -->
  <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
  <style>
    :root {
      --bg: #09090b;
      --card-bg: #121215;
      --card-border: #27272a;
      --text: #f4f4f5;
      --text-muted: #a1a1aa;
      --accent: #06b6d4;
      --critical: #ef4444;
      --secure: #10b981;
      --highlight: #38bdf8;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: var(--bg);
      color: var(--text);
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.25rem 2rem;
      border-bottom: 1px solid var(--card-border);
      background: #0d0d10;
    }
    .brand { display: flex; align-items: center; gap: 0.75rem; }
    .brand-icon {
      font-size: 1.4rem;
      background: rgba(6, 182, 212, 0.1);
      border: 1px solid rgba(6, 182, 212, 0.25);
      border-radius: 8px;
      padding: 0.35rem 0.6rem;
    }
    .brand h1 { font-size: 1.25rem; font-weight: 700; letter-spacing: -0.02em; }
    .brand p { font-size: 0.8rem; color: var(--text-muted); }
    .author-badge {
      font-size: 0.75rem;
      padding: 0.35rem 0.75rem;
      border-radius: 9999px;
      background: #18181b;
      border: 1px solid var(--card-border);
      color: var(--text-muted);
      text-decoration: none;
    }
    .author-badge:hover { color: var(--accent); border-color: var(--accent); }

    .main-layout {
      display: grid;
      grid-template-columns: 320px 1fr;
      flex: 1;
      overflow: hidden;
    }
    .sidebar {
      background: var(--card-bg);
      border-right: 1px solid var(--card-border);
      padding: 1.5rem;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .metric-card {
      background: #18181b;
      border: 1px solid var(--card-border);
      border-radius: 10px;
      padding: 1rem;
    }
    .metric-title { font-size: 0.75rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; }
    .metric-value { font-size: 1.75rem; font-weight: 700; margin-top: 0.25rem; font-family: 'Geist Mono', monospace; }

    .graph-container {
      padding: 2rem;
      overflow: auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      background: radial-gradient(circle at 50% 50%, #15151c 0%, #09090b 100%);
    }
    .mermaid-box {
      background: #121215;
      border: 1px solid var(--card-border);
      border-radius: 12px;
      padding: 2rem;
      max-width: 100%;
      overflow: auto;
    }
    .cycle-alert {
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.3);
      border-radius: 8px;
      padding: 0.75rem 1rem;
      font-size: 0.85rem;
      color: #f87171;
    }
    .file-item {
      font-size: 0.8rem;
      font-family: 'Geist Mono', monospace;
      padding: 0.4rem 0.6rem;
      background: #18181b;
      border-radius: 6px;
      border: 1px solid var(--card-border);
      margin-top: 0.5rem;
      display: flex;
      justify-content: space-between;
    }
    footer {
      padding: 1rem 2rem;
      border-top: 1px solid var(--card-border);
      text-align: center;
      font-size: 0.75rem;
      color: var(--text-muted);
      background: #09090b;
    }
  </style>
</head>
<body>
  <header>
    <div class="brand">
      <div class="brand-icon">🌊</div>
      <div>
        <h1>DocuFlux Studio</h1>
        <p>Interactive Architecture & Dependency Visualizer</p>
      </div>
    </div>
    <a href="https://jatinsh.netlify.app/" target="_blank" class="author-badge">Built by Jatin Sharma ↗</a>
  </header>

  <div class="main-layout">
    <aside class="sidebar">
      <div class="metric-card">
        <div class="metric-title">Architecture Health</div>
        <div class="metric-value" style="color: ${scoreColor};">${report.healthScore}%</div>
      </div>

      <div class="metric-card">
        <div class="metric-title">Modules / Dependencies</div>
        <div class="metric-value">${report.totalFiles} / ${report.totalDependencies}</div>
        <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.25rem;">Coupling Index: ${report.couplingIndex}</div>
      </div>

      ${report.cycles.length > 0 ? `
        <div class="cycle-alert">
          <strong>⚠ ${report.cycles.length} Circular Dependencies</strong>
          <div style="font-size: 0.75rem; margin-top: 0.5rem; font-family: 'Geist Mono', monospace;">
            ${report.cycles.map(c => c.cycle.join(' ➔ ')).join('<br><br>')}
          </div>
        </div>
      ` : `
        <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 8px; padding: 0.75rem 1rem; color: #34d399; font-size: 0.8rem;">
          ✔ Strict DAG Architecture (Zero Cycles)
        </div>
      `}

      <div>
        <div class="metric-title">Entry Points (${report.entryPoints.length})</div>
        ${report.entryPoints.slice(0, 5).map(e => `
          <div class="file-item">
            <span>${e}</span>
          </div>
        `).join('')}
      </div>

      <div>
        <div class="metric-title">Orphan Files (${report.orphans.length})</div>
        ${report.orphans.length === 0 ? '<div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.5rem;">None</div>' : report.orphans.map(o => `
          <div class="file-item" style="color: #f59e0b;">
            <span>${o}</span>
          </div>
        `).join('')}
      </div>
    </aside>

    <main class="graph-container">
      <div class="mermaid-box">
        <div class="mermaid">
${report.mermaidGraph}
        </div>
      </div>
    </main>
  </div>

  <footer>
    DocuFlux is open-source software created by <a href="https://jatinsh.netlify.app/" target="_blank" style="color: var(--accent); text-decoration: none;">Jatin Sharma</a> • Distributed under MIT License
  </footer>

  <script>
    mermaid.initialize({
      startOnLoad: true,
      theme: 'dark',
      themeVariables: {
        darkMode: true,
        background: '#121215',
        primaryColor: '#1e293b',
        primaryTextColor: '#f8fafc',
        lineColor: '#06b6d4'
      }
    });
  </script>
</body>
</html>`;
  }
}
