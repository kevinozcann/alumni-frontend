import React from 'react';
import loadable, { lazy } from '@loadable/component';
import { Loadable } from 'layout';

const AuthGuard = loadable(() => import('components/guard/AuthGuard'));
const MainLayout = loadable(() => import('layout/MainLayout'));

const School = Loadable(lazy(() => import('./School')));
const NewSchool = Loadable(lazy(() => import('./NewSchool')));

const routes = {
  path: 'organization',
  element: (
    <AuthGuard>
      <MainLayout />
    </AuthGuard>
  ),
  children: [
    {
      path: '',
      element: <School />
    },
    {
      path: 'chart',
      element: <School />
    },
    {
      path: ':id',
      element: <School />
    },
    {
      path: ':id/delete',
      element: <School />
    },
    {
      path: ':id/:section',
      element: <School />
    },
    {
      path: ':id/campuses/new',
      element: <NewSchool />
    },
    {
      path: ':id/schools/new',
      element: <NewSchool />
    },
    {
      path: ':id/:section/:action',
      element: <School />
    },
    {
      path: ':id/:section/:action/:subsection',
      element: <School />
    },
    {
      path: ':id/:section/:action/:subsection/:subaction',
      element: <School />
    },
    {
      path: ':id/:section/:action/:subsection/:subaction/:gid',
      element: <School />
    }
  ]
};

export default routes;
