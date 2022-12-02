import React from 'react';
import loadable, { lazy } from '@loadable/component';
import { Loadable } from 'layout';

const AuthGuard = loadable(() => import('components/guard/AuthGuard'));
const MainLayout = loadable(() => import('layout/MainLayout'));

// const Partner = Loadable(lazy(() => import('./index')));

const routes = {
  path: 'sso',
  element: (
    <AuthGuard>
      <MainLayout />
    </AuthGuard>
  )
  // children: [
  //   {
  //     path: 'partner',
  //     element: <Partner />
  //   }
  // ]
};

export default routes;
