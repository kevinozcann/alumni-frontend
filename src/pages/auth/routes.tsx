import React from 'react';
import loadable, { lazy } from '@loadable/component';
import { Loadable } from 'layout';

const GuestGuard = loadable(() => import('components/guard/GuestGuard'));
const AuthPage = loadable(() => import('./AuthPage'));

const Login = Loadable(lazy(() => import('./Login')));
const Registration = Loadable(lazy(() => import('./Registration')));
const Verify = Loadable(lazy(() => import('./Verify')));
const Logout = Loadable(lazy(() => import('./Logout')));

const routes = {
  path: 'auth',
  element: (
    <GuestGuard>
      <AuthPage />
    </GuestGuard>
  ),
  children: [
    {
      path: '',
      element: <Login />
    },
    {
      path: 'login',
      element: <Login />
    },
    {
      path: 'registration',
      element: <Registration />
    },
    {
      path: 'verify',
      element: <Verify />
    },
    {
      path: 'logout',
      element: <Logout />
    }
  ]
};

export default routes;
