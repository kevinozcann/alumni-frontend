import React from 'react';
import loadable, { lazy } from '@loadable/component';
import { Loadable } from 'layout';

const AuthGuard = loadable(() => import('components/guard/AuthGuard'));
const MainLayout = loadable(() => import('layout/MainLayout'));

const Dashboard = Loadable(lazy(() => import('./ui/Dashboard')));

const routes = {
  path: 'school',
  element: (
    <AuthGuard>
      <MainLayout />
    </AuthGuard>
  ),
  children: [
    {
      path: '',
      element: <Dashboard />
    },
    {
      path: 'dashboard',
      element: <Dashboard />
    }
  ]
};

export default routes;
