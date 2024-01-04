/**
 * Mock plugin for development and production.
 * https://github.com/anncwb/vite-plugin-mock
 */
import { viteMockServe } from 'vite-plugin-mock';
import { Plugin } from 'vite';

export default function configMockPlugin(isBuild: boolean): Plugin {
  return viteMockServe({
    ignore: /^_/,
    mockPath: 'mock',
    localEnabled: !isBuild,
    prodEnabled: isBuild,
    injectCode: `
      import { setupProdMockServer } from '../mock/createProdMockServer';
      setupProdMockServer();
    `,
  });
}
