import React from 'react';
import loadable, { lazy } from '@loadable/component';
import { Loadable } from 'layout';

const AuthGuard = loadable(() => import('components/guard/AuthGuard'));
const MainLayout = loadable(() => import('layout/MainLayout'));

const Post = Loadable(lazy(() => import('./Post')));

const routes = {
  path: 'posts',
  element: (
    <AuthGuard>
      <MainLayout />
    </AuthGuard>
  ),
  children: [
    {
      path: '',
      element: <Post />
    },
    {
      path: 'new',
      element: <Post />
    }
  ]
};

export default routes;
