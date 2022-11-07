import '@fortawesome/fontawesome-pro/css/fontawesome.css';
import '@fortawesome/fontawesome-pro/css/duotone.css';
import 'react-perfect-scrollbar/dist/css/styles.css';
import 'react-quill/dist/quill.snow.css';
import './index.scss';

import React, { StrictMode } from 'react';
import { render } from 'react-dom';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import StyledEngineProvider from '@mui/material/StyledEngineProvider';
import axios from 'axios';
import { ClearCacheProvider } from 'react-clear-cache';

import setupAxios from 'store';
import store, { persistor } from 'store/store';
import { SubheaderProvider } from 'contexts/SubheaderContext';
import { SettingsProvider } from 'contexts/SettingsContext';
import { AuthProvider } from 'contexts/JWTAuthContext';

import reportWebVitals from './reportWebVitals';
import * as serviceWorker from './serviceWorker';

import App from './App';

// Configure axios
setupAxios(axios, store);

const rootElement = document.getElementById('root');
const FullApp = () => (
  <StrictMode>
    <HelmetProvider>
      <ClearCacheProvider duration={300000}>
        <ReduxProvider store={store}>
          <StyledEngineProvider injectFirst>
            <SettingsProvider>
              <BrowserRouter>
                <PersistGate persistor={persistor}>
                  <AuthProvider>
                    <SubheaderProvider>
                      <App />
                    </SubheaderProvider>
                  </AuthProvider>
                </PersistGate>
              </BrowserRouter>
            </SettingsProvider>
          </StyledEngineProvider>
        </ReduxProvider>
      </ClearCacheProvider>
    </HelmetProvider>
  </StrictMode>
);

render(<FullApp />, rootElement);

serviceWorker.register();

// Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);
