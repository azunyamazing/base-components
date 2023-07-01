import { useEffect, useMemo, useRef } from 'react';
import { tree } from 'virtual:layout-menu';
import { bootstrapRouter, useRouter } from './base/router';

import type { PathTreeNode } from './scripts/tree';

export const App = () => {
  const routerRef = useRef<Record<string, string>>({});
  const router = useRouter();

  const menuNode = useMemo(() => {
    const renderMenu = (tree: PathTreeNode) => {
      try {
        return [tree].map(currentNode => {
          const key = `${currentNode.level}-${currentNode.path}`;
          const text = currentNode.path.replace(currentNode.parent, '');
          if (currentNode.children.length) {
            return (
              <li key={key}>
                <span>{text}</span>
                <br />
                <ul style={{ padding: '0 10px' }} key={`${currentNode.level}-ul`}>{currentNode.children.map(renderMenu)}</ul>
              </li>
            )
          }

          const url = currentNode.path.replace(/(\.vue)|(\.tsx)|(\.)/g, '');
          if (!routerRef.current[url]) {
            routerRef.current[url] = url;
          }

          return (
            <li
              style={{ display: 'flex', cursor: 'pointer' }}
              onClick={() => {
                router.pushState(url);
              }}
              key={key}
            >{text}</li>
          );
        })
      } catch (e) { }
    }
    return renderMenu(tree);
  }, []);

  useEffect(() => {
    bootstrapRouter();
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <ul style={{ width: '300px', minHeight: '100%', margin: 0, borderRight: '1px solid #000' }}>
        {menuNode}
      </ul>
    </div>
  )
}