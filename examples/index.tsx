import { tree } from 'virtual:layout-menu';
import type { PathTreeNode } from 'scripts/tree';

const renderMenu = (tree: PathTreeNode) => {
  try {
    return [tree].map(node => {
      const currentNode = node;
      const key = `${currentNode.level}-${currentNode.path}`;
      if (currentNode.children.length) {
        return (
          <li key={key}>
            <span>{currentNode.path}</span>
            <br />
            <ul style={{ padding: '0 10px' }} key={`${currentNode.level}-ul`}>{currentNode.children.map(renderMenu)}</ul>
          </li>
        )
      }
      return (
        <li
          style={{ display: 'flex', cursor: 'pointer' }}
          onClick={() => {
            location.href = `${node.parent}/${node.path.split('.')[0]}`;
          }}
          key={key}
        >{currentNode.path}</li>
      );
    })
  } catch (e) { }
}

export const App = () => {
  return (
    <ul style={{ width: '300px', minHeight: '100%', margin: 0, borderRight: '1px solid #000' }}>
      {renderMenu(tree)}
    </ul>
  )
}