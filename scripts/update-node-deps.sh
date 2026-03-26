#!/bin/bash

# List of package names or regex patterns to ignore.
# Use "^pkgname$" for exact matching (e.g., "^vite$" won't match "vite-plugin-pwa").
IGNORE_LIST=("^vite$")

# Convert array to a regex pattern (pkg1|pkg2) for jq
IGNORE_PATTERN=$(printf "|%s" "${IGNORE_LIST[@]}")
IGNORE_PATTERN="${IGNORE_PATTERN:1}"

echo "Updating dependencies (excluding: ${IGNORE_LIST[*]})..."

# Update dependencies
DEPS=$(jq -r --arg pattern "$IGNORE_PATTERN" '.dependencies | keys[] | select(test($pattern) | not) | . + "@latest"' package.json)
if [ -n "$DEPS" ]; then
  npm install $DEPS --save-exact
fi

# Update devDependencies
DEV_DEPS=$(jq -r --arg pattern "$IGNORE_PATTERN" '.devDependencies | keys[] | select(test($pattern) | not) | . + "@latest"' package.json)
if [ -n "$DEV_DEPS" ]; then
  npm install $DEV_DEPS --save-dev --save-exact
fi
