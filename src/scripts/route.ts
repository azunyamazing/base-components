import { readdirSync } from "fs-extra";
import { dirname, join, parse, resolve, sep } from "path";
import { getFileStat } from './tree';

// 以 examples 建立路由系统
const ROOT_PATH = resolve(process.cwd(), 'examples');

// 递归获取所有是文件的路径
export const getFilesFromPaths = (paths: string[]): string[] => {
  const result: string[] = [];
  try {
    paths.forEach(path => {
      const stat = getFileStat(path);
      if (stat) {
        stat.isFile() && result.push(path);
        if (stat.isDirectory()) {
          const childrenPathnames = readdirSync(path).map(name => join(path, name));
          result.push(...getFilesFromPaths(childrenPathnames));
        }
      }
    })
  } catch (e) {}
  return result;
}

// 统一 window & mac 路径符号
export const replacePathsep = (path: string) => {
  return path.split(sep).join('/');
}

// 根据文件路径快速建立路由
export const getRoutes = (dirPath: string = ROOT_PATH) => {
  const routeMap = new Map();
  const routeFiles = getFilesFromPaths([dirPath]);
  routeFiles.forEach(filename => {
    const { dir, name } = parse(filename);
    const relativePath = dir.replace(process.cwd(), '');
    const basePathname = name === 'index' ? '' : name;

    const route = replacePathsep(join(relativePath, basePathname));
    const value =replacePathsep(filename.replace(process.cwd(), ''));
    routeMap.set(route, value);
  })
  return routeMap;
}

// 根据访问 url 匹配路由
export const getRoute = (pathname: string) => {
  if (pathname.endsWith('index')) {
    return dirname(pathname);
  }
  return pathname;
}