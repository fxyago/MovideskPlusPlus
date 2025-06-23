import { createRoot } from 'react-dom/client';
import { MainMenu } from '../../src/pages/content/Menu';

const root = document.getElementById('root');
if (root) createRoot(root).render(<MainMenu />);
