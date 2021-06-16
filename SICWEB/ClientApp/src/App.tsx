import './App.css';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { AuthProvider } from 'src/contexts/JWTAuthContext';
import routes, { renderRoutes } from './routes';

const history = createBrowserHistory();

function App() {
  return (
    <Router history={history}>
      <AuthProvider>
        {renderRoutes(routes)}
      </AuthProvider>
    </Router>
  );
}

export default App;
