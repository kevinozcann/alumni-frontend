import React from 'react';
import { lazy } from '@loadable/component';
import { Loadable } from 'layout';

const TypeList = Loadable(lazy(() => import('./TypeList')));
const UserTypesNew = Loadable(lazy(() => import('./new/UserTypesNew')));

const routes = {
  path: 'types',
  children: [
    {
      path: '',
      element: <TypeList />
    },
    {
      path: 'new',
      element: <UserTypesNew />
    },
    {
      path: ':id',
      element: <TypeList />
    },
    {
      path: ':id/:action',
      element: <TypeList />
    }
  ]
};

export default routes;
