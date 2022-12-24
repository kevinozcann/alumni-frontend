import React from 'react';
import loadable, { lazy } from '@loadable/component';

import { Loadable, LoadableScreen } from 'layout';

const AuthGuard = loadable(() => import('components/guard/AuthGuard'));
const MainLayout = loadable(() => import('layout/MainLayout'));

const Account = Loadable(lazy(() => import('./ui/Account')));

const routes = {
  path: 'account',
  element: (
    <AuthGuard>
      <MainLayout />
    </AuthGuard>
  ),
  children: [
    {
      path: '',
      element: <Account />
    },
    {
      path: ':section',
      element: <Account />
    },
    {
      path: ':section/:action',
      element: <Account />
    }
  ]
};

export default routes;
