import { basename, resolve } from "path";
import { path2Tree } from "./src/scripts/tree";
import type { PathTreeNode } from './src/scripts/tree';
import { getRoutes } from "./src/scripts/route";

export const menuPlugin = () => {
  const virtualModuleId = 'virtual:layout-menu';
  const resolvedVirtualModuleId = '\0' + virtualModuleId;

  return {
    name: 'tree-menu-plugin', // 必须的，将会在 warning 和 error 中显示
    resolveId(id: string) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId
      }
    },
    load(id: string) {
      if (id === resolvedVirtualModuleId) {
        const pathTree = path2Tree('./examples');
        return `export const tree = ${JSON.stringify(pathTree)}`
      }
    },
  }
}
