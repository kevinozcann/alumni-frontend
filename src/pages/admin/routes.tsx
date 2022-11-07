import React from 'react';
import loadable from '@loadable/component';

import databasesRoutes from './databases/routes';
import menusRoutes from './menus/routes';

const AdminGuard = loadable(() => import('components/guard/AdminGuard'));
const MainLayout = loadable(() => import('layout/MainLayout'));

const routes = {
  path: 'admin',
  element: (
    <AdminGuard>
      <MainLayout />
    </AdminGuard>
  ),
  children: [databasesRoutes, menusRoutes]
};

export default routes;
