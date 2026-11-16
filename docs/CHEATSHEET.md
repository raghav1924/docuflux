# DocuFlux CLI Cheatsheet

```bash
# Generate architecture dependency graph
docuflux graph src

# Output Mermaid syntax for README
docuflux graph src --mermaid

# Detect circular dependencies and exit with code 1 if found
docuflux cycles src --fail-on-cycles

# Start Architecture Studio
docuflux studio --port 4040
```
