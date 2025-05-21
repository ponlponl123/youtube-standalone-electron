import './App.css'
import IndexPage from './pages';
import NotFoundPage from './pages/notFound';
import { useRoute } from './contexts/routeContext';

function App() {
  const { route } = useRoute();

  switch (route) {

    case '/':
    case '/setting':
      return IndexPage();
    
    default:
      return NotFoundPage();
    
  }
}

export default App
