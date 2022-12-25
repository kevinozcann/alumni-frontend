import React from 'react';
import loadable, { lazy } from '@loadable/component';
import { Loadable } from 'layout';

const AuthGuard = loadable(() => import('components/guard/AuthGuard'));
const MainLayout = loadable(() => import('layout/MainLayout'));

const ListPerson = Loadable(lazy(() => import('./ui/ListPerson')));
const NewPerson = Loadable(lazy(() => import('./ui/NewPerson')));

const routes = {
  path: 'persons',
  element: (
    <AuthGuard>
      <MainLayout />
    </AuthGuard>
  ),
  children: [
    {
      path: '',
      element: <ListPerson />
    },
    {
      path: 'new',
      element: <NewPerson />
    },
    {
      path: ':id',
      element: <ListPerson />
    },
    {
      path: ':id/:action',
      element: <ListPerson />
    }
  ]
};

export default routes;
