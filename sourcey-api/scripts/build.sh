#!/usr/bin/env bash
set -euo pipefail

ROOT=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
PF4J_REPO="https://github.com/pf4j/pf4j.git"
PF4J_COMMIT="2ce777013963706c868b79da1483270e2690afab"
SOURCE_DIR="$ROOT/.source/pf4j"
OUTPUT_DIR="$ROOT/../api"

command -v git >/dev/null
command -v node >/dev/null
command -v npm >/dev/null
command -v doxygen >/dev/null

mkdir -p "$ROOT/.source"
if [[ ! -d "$SOURCE_DIR/.git" ]]; then
  git clone --filter=blob:none --no-checkout "$PF4J_REPO" "$SOURCE_DIR"
fi

git -C "$SOURCE_DIR" fetch --depth=1 origin "$PF4J_COMMIT"
git -C "$SOURCE_DIR" checkout --detach "$PF4J_COMMIT"
[[ "$(git -C "$SOURCE_DIR" rev-parse HEAD)" == "$PF4J_COMMIT" ]]

cd "$ROOT"
npm ci --ignore-scripts --no-audit --no-fund
npm run doxygen
npm run build

cp node_modules/sourcey/LICENSE "$OUTPUT_DIR/LICENSE.sourcey.txt"
cp THIRD_PARTY_NOTICES.md "$OUTPUT_DIR/THIRD_PARTY_NOTICES.md"

python3 scripts/verify-output.py "$OUTPUT_DIR"
