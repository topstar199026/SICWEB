import React, {
  Suspense,
  Fragment,
  lazy
} from 'react';
import {
  Switch,
  Route
} from 'react-router-dom';

import AuthGuard from 'src/components/AuthGuard';
import GuestGuard from 'src/components/GuestGuard';
import MainGuard from 'src/components/MainGuard';


import DashboardLayout from './Layout/DashboardLayout';

import LoadingScreen from './components/LoadingScreen';


type Routes = {
  exact?: boolean;
  path?: string | string[];
  guard?: any;
  layout?: any;
  component?: any;
  routes?: Routes;
}[];

export const renderRoutes = (routes: Routes = []): JSX.Element =>{ 
  
  return (
  <Suspense fallback={<LoadingScreen />}>
    <Switch>
      {routes.map((route, i) => {
        const Guard = route.guard || Fragment;
        const Layout = route.layout || Fragment;
        const Component = route.component;

        return (
          <Route
            key={i}
            path={route.path}
            exact={route.exact}
            render={(props) => (
              <Guard>
                <Layout>
                  {route.routes
                    ? renderRoutes(route.routes)
                    : <Component {...props} />}
                </Layout>
              </Guard>
            )}
          />
        );
      })}
    </Switch>
  </Suspense>
)};

const routes: Routes = [
  {
    exact: true,
    path: '/404',
    component: lazy(() => import('src/views/errors/NotFoundView'))
  },
  {
    exact: true,
    guard: GuestGuard,
    path: '/login',
    component: lazy(() => import('src/views/auth/LoginView'))
  },
  {
    exact: true,
    guard: GuestGuard,
    path: '/register',
    component: lazy(() => import('src/views/auth/RegisterView'))
  },
  {
    path: '/principal',
    guard: AuthGuard,
    layout: DashboardLayout,
    routes: [
      {
        exact: true,
        path: '/principal/tablero',
        component: lazy(() => import('src/views/app/DashboardView'))
      }
    ]
  },
  {
    path: '/interfaces',
    guard: AuthGuard,
    layout: DashboardLayout,
    routes: [
      {
        exact: true,
        path: '/interfaces/mantenimiento/frmregitem',
        component: lazy(() => import('src/views/maintenance/ItemView'))
      },
    ]
  },
  {
    exact: true,
    path: '/',
    guard: MainGuard,
    component: lazy(() => import('src/views/auth/LoginView'))
  },
];

export default routes;
