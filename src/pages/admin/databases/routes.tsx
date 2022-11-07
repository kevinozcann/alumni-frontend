import React from 'react';
import { lazy } from '@loadable/component';
import { Loadable } from 'layout';

const Databases = Loadable(lazy(() => import('./Databases')));

const routes = {
  path: 'databases',
  children: [
    {
      path: '',
      element: <Databases />
    },
    {
      path: ':action',
      element: <Databases />
    }
  ]
};

export default routes;
