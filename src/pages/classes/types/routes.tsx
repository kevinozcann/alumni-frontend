import React from 'react';
import { lazy } from '@loadable/component';
import { Loadable } from 'layout';

const ClassTypeList = Loadable(lazy(() => import('./ClassTypeList')));
const NewClassType = Loadable(lazy(() => import('./new/NewClassType')));

const routes = {
  path: 'types',
  children: [
    {
      path: '',
      element: <ClassTypeList />
    },
    {
      path: 'new',
      element: <NewClassType />
    },
    {
      path: ':id',
      element: <ClassTypeList />
    },
    {
      path: ':id/:action',
      element: <ClassTypeList />
    }
  ]
};

export default routes;
