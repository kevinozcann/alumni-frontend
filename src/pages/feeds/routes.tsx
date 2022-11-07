import React from 'react';
import loadable, { lazy } from '@loadable/component';
import { Loadable } from 'layout';

const AuthGuard = loadable(() => import('components/guard/AuthGuard'));
const MainLayout = loadable(() => import('layout/MainLayout'));

const Feed = Loadable(lazy(() => import('./Feed')));

const routes = {
  path: 'feeds',
  element: (
    <AuthGuard>
      <MainLayout />
    </AuthGuard>
  ),
  children: [
    {
      path: '',
      element: <Feed />
    },
    {
      path: 'new',
      element: <Feed />
    }
  ]
};

export default routes;
