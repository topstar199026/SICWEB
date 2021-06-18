import './App.css';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { AuthProvider } from 'src/contexts/JWTAuthContext';
import { SnackbarProvider } from 'notistack';
import routes, { renderRoutes } from './routes';

const history = createBrowserHistory();

function App() {
  return (
    <SnackbarProvider
      dense
      maxSnack={3}
    >
      <Router history={history}>
        <AuthProvider>
          {renderRoutes(routes)}
        </AuthProvider>
      </Router>
    </SnackbarProvider>
  );
}

export default App;
