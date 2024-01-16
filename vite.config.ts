import type { ConfigEnv, UserConfig } from 'vite';
import dayjs from 'dayjs';

import { PORT, VITE_BASE_PATH, VITE_DROP_CONSOLE } from './config/constant';
import { themeVariables } from './config/theme';
import { createVitePlugins } from './config/vite/plugins';
import { createProxy } from './config/vite/proxy';
import packageJson from './package.json';

const { dependencies, devDependencies, name, version } = packageJson;
const __APP_INFO__ = {
  pkg: { dependencies, devDependencies, name, version },
  lastBuildTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
};

// 函数式配置
export default ({ command, mode }: ConfigEnv): UserConfig => {
  const isBuild = command === 'build';

  return {
    base: VITE_BASE_PATH,
    plugins: createVitePlugins(mode, isBuild),
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
          modifyVars: themeVariables,
        },
      },
    },
    resolve: {},
    server: {
      host: true,
      port: PORT, // 开发环境启动的端口
      proxy: createProxy(),
    },
    build: {
      minify: 'terser',
      terserOptions: {
        compress: {
          keep_infinity: true,
          // Used to delete console in production environment
          drop_console: VITE_DROP_CONSOLE,
        },
      },
    },

    define: {
      // 设置应用信息
      __APP_INFO__: JSON.stringify(__APP_INFO__),
      'process.env': {
        ...(process.env || {}),
      },
    },
  } satisfies UserConfig;
};
