import { BrowserRouter, Switch, Route } from 'react-router-dom';
import './App.css'
import { AuthProvider } from './context/AuthContext';
import routes from './routes';
import 'bootstrap/dist/css/bootstrap.min.css';
import Dashboard from './pages/Dashboard'
import Home from './pages/Home'
import PATHS from './config/path';
import { PrivateRouteDashboard, PrivateRouteLogin } from './routes/PrivateRoute';
const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Switch>
          <PrivateRouteLogin exact path={PATHS.DASHBOARD} component={Dashboard} />
          <PrivateRouteDashboard exact path={PATHS.HOME} component={Home} />
          {
            routes.map((route, idx) => {
              return (
                <Route key={idx} {...route} />
              )
            })
          }
        </Switch>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App;
