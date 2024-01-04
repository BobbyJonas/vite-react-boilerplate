#!/bin/bash

ssr="$SSR"

rm -rf dist

echo "执行生产环境打包..."

case "$ssr" in
"true")
  echo "SSR: 开启"
  vite build --ssrManifest --outDir dist/client
  vite build --ssr src/entry-server.tsx --outDir dist/server
  tsc ./src/server/ssr-server --target esnext --module nodenext --outDir ./dist/server
  ;;
*)
  echo "SSR: 关闭"
  vite build
  ;;

esac
