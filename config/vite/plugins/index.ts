/**
 * vite plugin
 */

import type { PluginOption } from 'vite';
import legacy from '@vitejs/plugin-legacy';
import react from '@vitejs/plugin-react';
import { ViteEjsPlugin } from 'vite-plugin-ejs';
import viteCompression from 'vite-plugin-compression2';

import {
  VITE_APP_TITLE,
  VITE_APP_ANALYZE,
  VITE_APP_COMPRESS_GZIP,
  VITE_APP_COMPRESS_GZIP_DELETE_FILE,
  VITE_APP_LEGACY,
  VITE_APP_MOCK,
} from '../../constant';
import configMockPlugin from './mock';
import configVisualizerPlugin from './visualizer';

export function createVitePlugins(viteEnv: string, isBuild: boolean) {
  const vitePlugins: (PluginOption | PluginOption[])[] = [react()];

  vitePlugins.push(
    ViteEjsPlugin({
      title: VITE_APP_TITLE,
    })
  );

  // @vitejs/plugin-legacy
  VITE_APP_LEGACY && isBuild && vitePlugins.push(legacy());

  // vite-plugin-mock
  VITE_APP_MOCK && vitePlugins.push(configMockPlugin(isBuild));

  // rollup-plugin-visualizer
  VITE_APP_ANALYZE && vitePlugins.push(configVisualizerPlugin());

  // vite-plugin-theme
  // vitePlugins.push(configThemePlugin(isBuild));

  // The following plugins only work in the production environment
  if (isBuild) {
    // rollup-plugin-gzip
    VITE_APP_COMPRESS_GZIP &&
      vitePlugins.push(
        viteCompression({
          algorithm: 'brotliCompress',
          exclude: [/\.(br)$/, /\.(gz)$/],
          deleteOriginalAssets: VITE_APP_COMPRESS_GZIP_DELETE_FILE,
        })
      );
  }

  return vitePlugins;
}
