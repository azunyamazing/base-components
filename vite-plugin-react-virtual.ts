import { basename, resolve } from "path";
import { path2Tree } from "./scripts/tree";
import type { PathTreeNode } from './scripts/tree';

export const virtualTreePlugin = () => {
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
        const pathTree = path2Tree(resolve(process.cwd(), 'examples'));

        // 对数据进行优化使得前端页面可以直接使用
        const normalize = (node: PathTreeNode) => {
          node.path = basename(node.path);
          node.parent = node.parent.replace(process.cwd(), '');
          if (node.children.length) {
            node.children.forEach(node => normalize(node));
          }
          return node;
        }

        const jsonStr = JSON.stringify(normalize(pathTree));
        return `export const tree = ${jsonStr}`
      }
    },
  }
}
