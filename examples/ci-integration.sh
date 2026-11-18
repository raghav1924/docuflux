#!/usr/bin/env bash
set -euo pipefail

echo "⚡ Running DocuFlux CI validation pipeline..."
node dist/bin.js --version
echo "✔ DocuFlux executable verified."
