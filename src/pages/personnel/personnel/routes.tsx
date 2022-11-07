import React from 'react';
import { lazy } from '@loadable/component';
import { Loadable } from 'layout';

const PersonnelList = Loadable(lazy(() => import('./PersonnelList')));
const NewPersonnel = Loadable(lazy(() => import('./NewPersonnel')));

const routes = {
  path: 'personnel',
  children: [
    {
      path: '',
      element: <PersonnelList />
    },
    {
      path: 'new',
      element: <NewPersonnel />
    },
    {
      path: ':id',
      element: <PersonnelList />
    },
    {
      path: ':id/:action',
      element: <PersonnelList />
    }
  ]
};

export default routes;
