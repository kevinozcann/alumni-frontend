import React from 'react';
import loadable, { lazy } from '@loadable/component';
import { Loadable } from 'layout';

import configRoutes from './config/routes';
import gradeLevelsRoutes from './grade-levels/routes';
import systemRoutes from './system/routes';

const AuthGuard = loadable(() => import('components/guard/AuthGuard'));
const MainLayout = loadable(() => import('layout/MainLayout'));

const Config = Loadable(lazy(() => import('./config/Config')));

const routes = {
  path: 'config',
  element: (
    <AuthGuard>
      <MainLayout />
    </AuthGuard>
  ),
  children: [
    {
      path: '',
      element: <Config />
    },
    configRoutes,
    gradeLevelsRoutes,
    systemRoutes
  ]
};

export default routes;
