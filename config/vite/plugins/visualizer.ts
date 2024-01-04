import { type Plugin } from 'vite';
import visualizer from 'rollup-plugin-visualizer';

export default function configVisualizerConfig() {
  return visualizer({
    filename: './node_modules/.cache/visualizer/stats.html',
    open: true,
    gzipSize: true,
    brotliSize: true,
  }) satisfies Plugin;
}
