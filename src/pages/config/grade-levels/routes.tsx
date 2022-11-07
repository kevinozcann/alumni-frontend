import React from 'react';
import { lazy } from '@loadable/component';
import { Loadable } from 'layout';

const GradeLevels = Loadable(lazy(() => import('./GradeLevels')));
const NewGradeLevel = Loadable(lazy(() => import('./new/NewGradeLevel')));

const routes = {
  path: 'grade-levels',
  children: [
    {
      path: '',
      element: <GradeLevels />
    },
    {
      path: 'new',
      element: <NewGradeLevel />
    },
    {
      path: ':id',
      element: <GradeLevels />
    },
    {
      path: ':id/:action',
      element: <GradeLevels />
    }
  ]
};

export default routes;
