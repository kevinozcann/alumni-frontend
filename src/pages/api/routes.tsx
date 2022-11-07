import React from 'react';

import Api from './Api';

const routes = {
  path: 'api',
  children: [
    {
      path: ':id',
      element: <Api />
    },
    {
      path: ':section/:action',
      element: <Api />
    }
  ]
};

export default routes;
