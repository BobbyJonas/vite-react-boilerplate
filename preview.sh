#!/bin/bash

ENV_SSR="$SSR"

LIGHT_GRAY='\033[90m'
BLUE='\033[1;34m'
BG_BLUE='\033[44m'
NC='\033[0m'

case "$ENV_SSR" in
"true")
  echo "Starting front-end service..."
  echo "${BG_BLUE} Server-Side Render ${NC}${BLUE} on ${NC}"
  node ./dist/server/ssr-server
  ;;
*)
  echo "${BG_BLUE} Server-Side Render ${NC}${LIGHT_GRAY} off ${NC}"
  echo
  vite preview
  ;;

esac
