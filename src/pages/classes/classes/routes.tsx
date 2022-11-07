import React from 'react';
import { lazy } from '@loadable/component';
import { Loadable } from 'layout';

const ClassesList = Loadable(lazy(() => import('./ClassesList')));
const NewClass = Loadable(lazy(() => import('./NewClass')));

const routes = {
  path: 'classes',
  children: [
    {
      path: '',
      element: <ClassesList />
    },
    {
      path: 'new',
      element: <NewClass />
    },
    {
      path: ':id',
      element: <ClassesList />
    },
    {
      path: ':id/:action',
      element: <ClassesList />
    }
  ]
};

export default routes;
