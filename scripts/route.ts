import { readdirSync, statSync } from "fs-extra";
import { join, parse } from "path";

const getFileStat = (path: string) => {
  try {
    return statSync(path);
  }catch(e) {
    return null;
  }
}

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

// 根据文件路径快速建立路由
export const getRoutes = (dirPath: string) => {
  const routeMap = new Map();
  const routeFiles = getFilesFromPaths([dirPath]);
  routeFiles.forEach(filename => {
    const { dir, name } = parse(filename);
    const relativePath = dir.replace(process.cwd(), '');
    const basePathname = name === 'index' ? '' : name;
    const route = join(relativePath, basePathname);
    routeMap.set(route, filename.replace(process.cwd(), ''));
  })
  return routeMap;
}
