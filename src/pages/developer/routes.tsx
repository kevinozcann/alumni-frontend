import React from 'react';
import loadable, { lazy } from '@loadable/component';
import { LoadableScreen } from 'layout';

const AuthGuard = loadable(() => import('components/guard/AuthGuard'));
const MainLayout = loadable(() => import('layout/MainLayout'));

const Developer = LoadableScreen(lazy(() => import('./Developer')));
const HowTo = LoadableScreen(lazy(() => import('./HowTo')));
const ApiKey = LoadableScreen(lazy(() => import('./ApiKey')));
const EndPoints = LoadableScreen(lazy(() => import('./EndPoints')));

const routes = {
  path: 'developer',
  element: (
    <AuthGuard>
      <MainLayout />
    </AuthGuard>
  ),
  children: [
    {
      path: '',
      element: <Developer />
    },
    {
      path: 'howto',
      element: <HowTo />
    },
    {
      path: 'apikey',
      element: <ApiKey />
    },
    {
      path: 'endpoints',
      element: <EndPoints />
    }
  ]
};

export default routes;
