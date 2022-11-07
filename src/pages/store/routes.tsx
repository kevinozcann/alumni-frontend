import React from 'react';
import loadable, { lazy } from '@loadable/component';
import { Loadable } from 'layout';

const AuthGuard = loadable(() => import('components/guard/AuthGuard'));
const MainLayout = loadable(() => import('layout/MainLayout'));

const Store = Loadable(lazy(() => import('./Store')));
const StoreAdmin = Loadable(lazy(() => import('./StoreAdmin')));

const routes = {
  path: 'store',
  element: (
    <AuthGuard>
      <MainLayout />
    </AuthGuard>
  ),
  children: [
    {
      path: '',
      element: <Store />
    },
    {
      path: 'admin',
      element: <StoreAdmin />
    }
  ]
};

export default routes;
