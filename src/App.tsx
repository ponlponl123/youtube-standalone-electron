import './App.css'
import IndexPage from './pages';
import NotFoundPage from './pages/notFound';
import { useRoute } from './contexts/routeContext';
import Setup from './pages/setup';

function App() {
  const { route } = useRoute();

  let PageComponent;
  if (
    route === '/' ||
    route === '/setting' ||
    route.startsWith('/setting/')
  )
    PageComponent = IndexPage;
  else if (route === '/setup')
    PageComponent = Setup;
  else
    PageComponent = NotFoundPage;

  return <PageComponent />;
}

export default App
