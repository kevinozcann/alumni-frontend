import React from 'react';
import loadable from '@loadable/component';

import typesRoutes from './types/routes';

const AuthGuard = loadable(() => import('components/guard/AuthGuard'));
const MainLayout = loadable(() => import('layout/MainLayout'));

const routes = {
  path: 'users',
  element: (
    <AuthGuard>
      <MainLayout />
    </AuthGuard>
  ),
  children: [typesRoutes]
};

export default routes;
