import React from 'react';
import loadable from '@loadable/component';

import classesRoutes from './classes/routes';
import onlineRoutes from './online/routes';
import typesRoutes from './types/routes';

const AuthGuard = loadable(() => import('components/guard/AuthGuard'));
const MainLayout = loadable(() => import('layout/MainLayout'));

const routes = {
  path: 'classes',
  element: (
    <AuthGuard>
      <MainLayout />
    </AuthGuard>
  ),
  children: [classesRoutes, onlineRoutes, typesRoutes]
};

export default routes;
