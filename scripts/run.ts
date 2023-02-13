import chalk from "chalk";
import vite from 'vite';
import { readFileSync } from "fs";
import { createServer } from "http";
import { resolve } from "path";
import { getRoutes } from './route';

import type { ViteDevServer } from 'vite';

const isProd = process.env.NODE_ENV === 'production';

let viteServer: ViteDevServer | null = null;

// dev 使用 vite 服务器进行代理
const createViteServer = async () => {
  if (viteServer) {
    return viteServer;
  }

  const { createServer } = vite;
  viteServer = await createServer({
    server: {
      middlewareMode: true,
      watch: {
        usePolling: true,
        interval: 100,
      },
    },
    appType: 'custom',
  })

  return viteServer;
};

(async () => {
  const routeMap = getRoutes(resolve(process.cwd(), 'examples'));
  const template = readFileSync('index.html', 'utf-8');

  const app = createServer(async (req, res) => {
    const route = req.url;

    if (isProd) {
      // TODO: production code
    } else {
      const { middlewares, transformIndexHtml } = await createViteServer();

      if (routeMap.has(route)) {
        // 处理直出的模板
        const resultTemplate = (await transformIndexHtml(route, template))
          .replace('<!-- __COMPONET_SCRIPT__ -->', `<script type="module" src="${routeMap.get(route)}"></script>`);

        res.setHeader('content-type', 'text/html');
        res.setHeader('cache-control', 'no-cache');
        res.write(resultTemplate);
        res.end();
        return;
      }

      middlewares(req, res, async () => {
        res.write('CANNOT FOUND PAGE');
        res.end();
      });
    }
  });

  app.on('close', () => {
    if (viteServer) {
      viteServer.close();
      viteServer = null;
    }
  })

  app.listen(2333, () => {
    console.log(`\n ${chalk.cyan('-')} Local: ${chalk.greenBright(`http://localhost:2333`)}`);
  });
})();

