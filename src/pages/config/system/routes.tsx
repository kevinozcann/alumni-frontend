import React from 'react';
import { lazy } from '@loadable/component';
import { Loadable } from 'layout';

const System = Loadable(lazy(() => import('./System')));

const routes = {
  path: 'system',
  children: [
    {
      path: '',
      element: <System />
    }
  ]
};

export default routes;
