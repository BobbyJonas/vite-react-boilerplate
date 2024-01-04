#!/bin/bash

ENV_SSR="$SSR"

rm -rf dist

LIGHT_GRAY='\033[90m'
YELLOW='\033[1;33m'
BLUE='\033[1;34m'
BG_BLUE='\033[44m'
NC='\033[0m'

pnpm i

echo "${YELLOW}bundling...${NC}"

case "$ENV_SSR" in
"true")
  echo "${BG_BLUE} Server-Side Render ${NC}${BLUE} on ${NC}"
  vite build --ssrManifest --outDir dist/client
  vite build --ssr src/entry-server.tsx --outDir dist/server
  tsc ./src/server/ssr-server --target esnext --module nodenext --outDir ./dist/server
  ;;
*)
  echo "${BG_BLUE} Server-Side Render ${NC}${LIGHT_GRAY} off ${NC}"
  vite build
  ;;

esac
