import React from 'react';
import { lazy } from '@loadable/component';
import { Loadable } from 'layout';

const MenuList = Loadable(lazy(() => import('./MenuList')));

const routes = {
  path: 'menus',
  children: [
    {
      path: '',
      element: <MenuList />
    },
    {
      path: ':section',
      element: <MenuList />
    },
    {
      path: ':section/:action',
      element: <MenuList />
    },
    {
      path: ':section/:id/:action',
      element: <MenuList />
    }
  ]
};

export default routes;
