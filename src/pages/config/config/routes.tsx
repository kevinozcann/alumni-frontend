import React from 'react';
import { lazy } from '@loadable/component';
import { Loadable } from 'layout';

const Config = Loadable(lazy(() => import('./Config')));

const routes = {
  path: 'dashboard',
  element: <Config />
};

export default routes;
