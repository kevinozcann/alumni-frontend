import React from 'react';
import loadable, { lazy } from '@loadable/component';

import { Loadable, LoadableScreen } from 'layout';

const AuthGuard = loadable(() => import('components/guard/AuthGuard'));
const MainLayout = loadable(() => import('layout/MainLayout'));

const Account = Loadable(lazy(() => import('./Account')));
// @TODO delete this later once menu is updated
const Impersonate = LoadableScreen(lazy(() => import('pages/auth/Impersonate')));

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
      path: 'impersonate',
      element: <Impersonate />
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