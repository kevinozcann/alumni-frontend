import React from 'react';
import loadable from '@loadable/component';

import personnelRoutes from './personnel/routes';

const AuthGuard = loadable(() => import('components/guard/AuthGuard'));
const MainLayout = loadable(() => import('layout/MainLayout'));

const routes = {
  path: 'personnel',
  element: (
    <AuthGuard>
      <MainLayout />
    </AuthGuard>
  ),
  children: [personnelRoutes]
};

export default routes;
