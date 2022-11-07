import React from 'react';
import loadable, { lazy } from '@loadable/component';
import { Loadable } from 'layout';

const AuthGuard = loadable(() => import('components/guard/AuthGuard'));
const MainLayout = loadable(() => import('layout/MainLayout'));

const SmartClass = Loadable(lazy(() => import('./SmartClass')));

const routes = {
  path: 'smartclass',
  element: (
    <AuthGuard>
      <MainLayout />
    </AuthGuard>
  ),
  children: [
    {
      path: '',
      element: <SmartClass />
    },
    {
      path: ':op',
      element: <SmartClass />
    }
  ]
};

export default routes;
