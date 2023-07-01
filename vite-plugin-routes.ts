import { getRoutes } from "./src/scripts/route";

export const fileRoutesPlugin = () => {
  const virtualModuleId = 'virtual:file-routes';
  const resolvedVirtualModuleId = '\0' + virtualModuleId;

  return {
    name: 'file-routes-plugin',
    resolveId(id: string) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId
      }
    },
    load(id: string) {
      if (id === resolvedVirtualModuleId) {
        const routesMap = getRoutes();
        const routes = [...routesMap.entries()].reduce((obj, [key, value]) => Object.assign(obj, { [key]: value }), {})

        return `export const routes = ${JSON.stringify(routes)}`
      }
    },
  }
}
