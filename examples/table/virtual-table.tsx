import { createRoot } from 'react-dom/client';
import { VirtualTable } from '../../components/table/virtual-table';

export const App = () => {
  return <VirtualTable />
}

createRoot(document.getElementById('app')).render(<App />);
