# Automated Living Documentation in CI

Keep your architecture diagrams synchronized with your codebase:
```yaml
- name: Generate Living Architecture Diagrams
  run: |
    node dist/bin.js graph src --mermaid > docs/ARCHITECTURE.md
```
