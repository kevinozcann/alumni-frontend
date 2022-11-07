import React from 'react';
import loadable from '@loadable/component';

import menuRoutes from './menus/routes';

const AdminGuard = loadable(() => import('components/guard/AdminGuard'));
const MainLayout = loadable(() => import('layout/MainLayout'));

const routes = {
  path: 'global',
  element: (
    <AdminGuard>
      <MainLayout />
    </AdminGuard>
  ),
  children: [menuRoutes]
};

export default routes;
