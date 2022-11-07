import React from 'react';
import { lazy } from '@loadable/component';
import { Loadable } from 'layout';

const OnlineClassesList = Loadable(lazy(() => import('./OnlineClassesList')));
const NewOnlineClass = Loadable(lazy(() => import('./NewOnlineClass')));

const routes = {
  path: 'online',
  children: [
    {
      path: '',
      element: <OnlineClassesList />
    },
    {
      path: 'new',
      element: <NewOnlineClass />
    },
    {
      path: 'start',
      element: <OnlineClassesList />
    },
    {
      path: 'join',
      element: <OnlineClassesList />
    },
    {
      path: ':id',
      element: <OnlineClassesList />
    },
    {
      path: ':id/:action',
      element: <OnlineClassesList />
    },
    {
      path: ':id/:action/:role',
      element: <OnlineClassesList />
    }
  ]
};

export default routes;
