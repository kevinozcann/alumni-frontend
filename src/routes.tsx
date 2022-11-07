import React from 'react';
import loadable, { lazy } from '@loadable/component';

import { Loadable, LoadableScreen } from 'layout';

import accountRoutes from 'pages/account/routes';
import apiRoutes from 'pages/api/routes';
import adminRoutes from 'pages/admin/routes';
import authRoutes from 'pages/auth/routes';
import classesRoutes from 'pages/classes/routes';
import configRoutes from 'pages/config/routes';
import developerRoutes from 'pages/developer/routes';
import feedsRoutes from 'pages/feeds/routes';
import globalRoutes from 'pages/global/routes';
import mailRoutes from 'pages/mail/routes';
import organizationRoutes from 'pages/organization/routes';
import personnelRoutes from 'pages/personnel/routes';
import schoolRoutes from 'pages/school/routes';
import smartclassRoutes from 'pages/smartclass/routes';
import storeRoutes from 'pages/store/routes';
import studentsRoutes from 'pages/students/routes';
import usersRoutes from 'pages/users/routes';
import accountCodeRoutes from 'pages/account-codes/routes';
import IncomeExpenseRoutes from 'pages/income-expense/routes';
import SSORoutes from 'pages/sso/routes';

const GuestGuard = loadable(() => import('components/guard/GuestGuard'));

const AuthPage = LoadableScreen(lazy(() => import('pages/auth/AuthPage')));
const Login = LoadableScreen(lazy(() => import('pages/auth/Login')));
const Logout = LoadableScreen(lazy(() => import('pages/auth/Logout')));
const ForgotPassword = LoadableScreen(lazy(() => import('pages/auth/ForgotPassword')));
const Registration = LoadableScreen(lazy(() => import('pages/auth/Registration')));
const VerifyEmail = LoadableScreen(lazy(() => import('pages/auth/VerifyEmail')));
const ResetPassword = LoadableScreen(lazy(() => import('pages/auth/ResetPassword')));
const FileManager = Loadable(lazy(() => import('pages/filemanager/FileManager')));

const AuthorizationRequired = Loadable(lazy(() => import('pages/error/AuthorizationRequired')));
const NotFound = Loadable(lazy(() => import('pages/error/NotFound')));
const ServerError = Loadable(lazy(() => import('pages/error/ServerError')));

const routes = [
  authRoutes,
  {
    path: 'logout',
    element: <Logout />
  },
  {
    path: 'filemanager',
    element: <FileManager />
  },
  accountRoutes,
  apiRoutes,
  adminRoutes,
  classesRoutes,
  configRoutes,
  developerRoutes,
  feedsRoutes,
  globalRoutes,
  mailRoutes,
  organizationRoutes,
  personnelRoutes,
  schoolRoutes,
  smartclassRoutes,
  storeRoutes,
  studentsRoutes,
  usersRoutes,
  accountCodeRoutes,
  IncomeExpenseRoutes,
  SSORoutes,
  {
    path: '*',
    element: (
      <GuestGuard>
        <AuthPage />
      </GuestGuard>
    ),
    children: [
      {
        path: '',
        element: <Login />
      },
      {
        path: 'forgot-password',
        element: <ForgotPassword />
      },
      {
        path: 'reset-password',
        element: <ResetPassword />
      },
      {
        path: 'register',
        element: <Registration />
      },
      {
        path: 'verify-email',
        element: <VerifyEmail />
      },
      {
        path: '401',
        element: <AuthorizationRequired />
      },
      {
        path: '404',
        element: <NotFound />
      },
      {
        path: '500',
        element: <ServerError />
      },
      {
        path: '*',
        element: <NotFound />
      }
    ]
  }
];

export default routes;
