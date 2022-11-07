import React from 'react';
import { lazy } from '@loadable/component';
import { Loadable } from 'layout';

const StudentList = Loadable(lazy(() => import('./StudentList')));
const StudentPage = Loadable(lazy(() => import('./StudentPage')));

const routes = {
  path: '',
  children: [
    {
      path: '',
      element: <StudentList />
    },
    {
      path: ':id',
      element: <StudentPage />
    },
    {
      path: ':id/:section',
      element: <StudentPage />
    }
  ]
};

export default routes;
