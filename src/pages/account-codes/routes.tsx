import React from 'react';
import loadable, { lazy } from '@loadable/component';
import { Loadable } from 'layout';

const AuthGuard = loadable(() => import('components/guard/AuthGuard'));
const MainLayout = loadable(() => import('layout/MainLayout'));

const CodeList = Loadable(lazy(() => import('./CodeList')));
const AccountCodeNew = Loadable(lazy(() => import('./AccountCodeNew')));
const routes = {
  path: 'account-codes',
  element: (
    <AuthGuard>
      <MainLayout />
    </AuthGuard>
  ),
  children: [
    {
      path: '',
      element: <CodeList />
    },
    {
      path: 'new',
      element: <AccountCodeNew />
    },
    {
      path: ':id',
      element: <CodeList />
    },
    {
      path: ':id/:action',
      element: <CodeList />
    }
  ]
};

export default routes;
