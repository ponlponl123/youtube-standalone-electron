import './App.css'
import IndexPage from './pages';
import NotFoundPage from './pages/notFound';
import { useRoute } from './contexts/routeContext';
import Setup from './pages/setup';

function App() {
  const { route } = useRoute();

  if (
    route === '/' ||
    route === '/setting' ||
    route.startsWith('/setting/')
  )
    return IndexPage();
  
  else if (route === '/setup')
    return Setup();

  else
    return NotFoundPage();
}

export default App
