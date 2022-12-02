import React from 'react';
import loadable, { lazy } from '@loadable/component';

import { Loadable, LoadableScreen } from 'layout';

import accountRoutes from 'pages/account/routes';
import authRoutes from 'pages/auth/routes';
import configRoutes from 'pages/config/routes';
import developerRoutes from 'pages/developer/routes';
import feedsRoutes from 'pages/posts/routes';
import mailRoutes from 'pages/mail/routes';
import organizationRoutes from 'pages/organization/routes';
import schoolRoutes from 'pages/school/routes';
import studentsRoutes from 'pages/students/routes';
import usersRoutes from 'pages/users/routes';
import SSORoutes from 'pages/sso/routes';

const GuestGuard = loadable(() => import('components/guard/GuestGuard'));

const AuthPage = LoadableScreen(lazy(() => import('pages/auth/AuthPage')));
const Login = LoadableScreen(lazy(() => import('pages/auth/Login')));
const Logout = LoadableScreen(lazy(() => import('pages/auth/Logout')));
const ForgotPassword = LoadableScreen(lazy(() => import('pages/auth/ForgotPassword')));
const Registration = LoadableScreen(lazy(() => import('pages/auth/Registration')));
const Verify = LoadableScreen(lazy(() => import('pages/auth/Verify')));
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
  configRoutes,
  developerRoutes,
  feedsRoutes,
  mailRoutes,
  organizationRoutes,
  schoolRoutes,
  studentsRoutes,
  usersRoutes,
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
        path: 'verify',
        element: <Verify />
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
