import React from 'react';

import loadable, { lazy } from '@loadable/component';
import { Loadable } from 'layout';
import IncomeExpenseNew from './IncomeExpenseNew';

const AuthGuard = loadable(() => import('components/guard/AuthGuard'));
const MainLayout = loadable(() => import('layout/MainLayout'));

const IncomeExpenseList = Loadable(lazy(() => import('./IncomeExpenseList')));

const routes = {
  path: 'income-expense',
  element: (
    <AuthGuard>
      <MainLayout />
    </AuthGuard>
  ),
  children: [
    {
      path: '',
      element: <IncomeExpenseList />
    },
    {
      path: 'new',
      element: <IncomeExpenseNew />
    },
    {
      path: ':id',
      element: <IncomeExpenseList />
    },
    {
      path: ':id/:action',
      element: <IncomeExpenseList />
    }
  ]
};

export default routes;
