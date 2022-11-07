import React from 'react';
import loadable, { lazy } from '@loadable/component';
import { Loadable } from 'layout';

const AuthGuard = loadable(() => import('components/guard/AuthGuard'));
const MainLayout = loadable(() => import('layout/MainLayout'));

const Mail = Loadable(lazy(() => import('./Mail')));

const routes = {
  path: 'mail',
  element: (
    <AuthGuard>
      <MainLayout />
    </AuthGuard>
  ),
  children: [
    {
      path: '',
      element: <Mail />
    },
    {
      path: 'label',
      element: <Mail />
    },
    {
      path: 'label/:label',
      element: <Mail />
    },
    {
      path: 'label/:label/:id',
      element: <Mail />
    },
    {
      path: ':section',
      element: <Mail />
    },
    {
      path: ':section/deleted',
      element: <Mail />
    },
    {
      path: ':section/:id',
      element: <Mail />
    }
  ]
};

export default routes;
