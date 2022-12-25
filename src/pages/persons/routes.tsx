import React from 'react';
import loadable, { lazy } from '@loadable/component';
import { Loadable } from 'layout';

const AuthGuard = loadable(() => import('components/guard/AuthGuard'));
const MainLayout = loadable(() => import('layout/MainLayout'));

const ListPerson = Loadable(lazy(() => import('./ui/ListPerson')));
const NewPerson = Loadable(lazy(() => import('./ui/NewPerson')));
const PersonPage = Loadable(lazy(() => import('./ui/PersonPage')));

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
      path: 'person-page/:id',
      element: <PersonPage />
    },
    {
      path: ':id/:action',
      element: <ListPerson />
    }
  ]
};

export default routes;
