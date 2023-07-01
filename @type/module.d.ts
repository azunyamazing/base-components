declare module 'virtual:layout-menu' {
  export const tree: import('@/src/scripts/tree').PathTreeNode;
}

declare module 'virtual:file-routes' {
  export const routes: Record<string, string>;
}

declare module '*.vue';

interface Window {
  globalState: {
    componentSrc: string;
    isReactComponent: string;
  }
}

interface History {
  pushState(path: string): void;
}