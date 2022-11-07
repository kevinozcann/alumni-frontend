import React from 'react';
import { BrowserRouter, useRoutes } from 'react-router-dom';
import { render as rtlRender } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';

import routes from './routes';
import { rootReducer } from 'store/rootReducer';

function render(
  ui,
  {
    preloadedState,
    store = configureStore({ reducer: rootReducer, preloadedState }),
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }) {
    const content = useRoutes(routes);

    return (
      <BrowserRouter>
        <Provider store={store}>
          {children}
          {content}
        </Provider>
      </BrowserRouter>
    );
  }
  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

// re-export everything
export * from '@testing-library/react';

// override render method
export { render };
