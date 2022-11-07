import React from 'react';
import { lazy } from '@loadable/component';
import { Loadable } from 'layout';

const TagList = Loadable(lazy(() => import('./TagList')));
const NewStudentTag = Loadable(lazy(() => import('./NewStudentTag')));

const routes = {
  path: 'tags',
  children: [
    {
      path: '',
      element: <TagList />
    },
    {
      path: 'new',
      element: <NewStudentTag />
    },
    {
      path: ':id',
      element: <TagList />
    },
    {
      path: ':id/:action',
      element: <TagList />
    }
  ]
};

export default routes;
