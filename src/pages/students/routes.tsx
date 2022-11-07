import React from 'react';
import loadable from '@loadable/component';

import tagsRoutes from './tags/routes';
import studentListRoutes from './student-list/routes';

const AuthGuard = loadable(() => import('components/guard/AuthGuard'));
const MainLayout = loadable(() => import('layout/MainLayout'));

const routes = {
  path: 'student',
  element: (
    <AuthGuard>
      <MainLayout />
    </AuthGuard>
  ),
  children: [tagsRoutes, studentListRoutes]
};

export default routes;
