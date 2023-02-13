import { readdirSync, statSync } from 'fs-extra';
import { join } from 'path';


export const getFileStat = (path: string) => {
  try {
    return statSync(path);
  } catch (e) {
    return null;
  }
}

export interface PathTreeNode {
  level: number;
  parent: string;
  path: string;
  children: PathTreeNode[]; // relative parent path
}

// 根据目录获取对应的 tree 结构对象
export const path2Tree = (dirPath: string) => {
  const pathInfo = getFileStat(dirPath);
  if (!pathInfo || !pathInfo.isDirectory()) {
    return;
  }

  const result: PathTreeNode = {
    level: 1,
    parent: '/',
    path: dirPath,
    children: [],
  }

  const _path2Tree = (node: PathTreeNode = result) => {
    const pathInfo = getFileStat(node.path);
    if (!pathInfo || !pathInfo.isDirectory()) {
      return;
    }

    readdirSync(node.path).forEach(path => {
      const newNode: PathTreeNode = {
        level: node.level + 1,
        parent: node.path,
        path: join(node.path, path),
        children: [],
      }
      node.children.push(newNode);
      _path2Tree(newNode);
    })
  }
  _path2Tree();

  return result;
}