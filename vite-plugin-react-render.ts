import type { PluginOption } from "vite";

export const renderAppPlugin = (): PluginOption => {
  return {
    name: 'transform-file',
    enforce: 'pre',
    transform(src: string, id: string) {
      if (id.includes('/examples/index') && src.includes('App')) {
        const code = `
          import { createRoot } from 'react-dom/client';
          let app = undefined;
          ${src}
          if (!window.appLoaded || !app) {
            app = createRoot(document.getElementById('app'));
            window.appLoaded = true;
          }
          app.render(<App />);
        `;
        return {
          code
        }
      }

      if (id.includes('/examples/') && src.includes('App')) {
        const code = `
          import { createRoot } from 'react-dom/client';
          let component = undefined;
          ${src}
          if (!window.componentLoaded || !component) {
            component = createRoot(document.getElementById('component'));
            window.componentLoaded = true;
          }
          component.render(<App />);
        `;
        return {
          code,
        }
      }
    },
  }
}
