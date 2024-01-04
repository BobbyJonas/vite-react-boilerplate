#!/bin/bash

ssr="$SSR"

case "$ssr" in
"true")
  echo "启动前端服务(SSR)"
  node ./dist/server/ssr-server
  ;;
*)
  echo "启动前端服务"
  vite preview
  ;;

esac
