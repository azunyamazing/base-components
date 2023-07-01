import { createRoot } from 'react-dom/client';
import { App } from './app';

const menu = createRoot(document.getElementById('menu'));
menu.render(<App />);