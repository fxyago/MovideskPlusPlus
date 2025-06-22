import { MainMenu } from '@/pages/content/Menu';
import { createRoot } from 'react-dom/client';

const root = document.getElementById('root');
if (root) createRoot(root).render(<MainMenu />);
