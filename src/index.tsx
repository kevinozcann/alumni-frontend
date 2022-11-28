import '@fortawesome/fontawesome-pro/css/duotone.css';
import '@fortawesome/fontawesome-pro/css/fontawesome.css';
import 'react-perfect-scrollbar/dist/css/styles.css';
import 'react-quill/dist/quill.snow.css';
import './index.scss';

import StyledEngineProvider from '@mui/material/StyledEngineProvider';
import axios from 'axios';
import { StrictMode } from 'react';
import { ClearCacheProvider } from 'react-clear-cache';
import { render } from 'react-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Provider as ReduxProvider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';

import { SettingsProvider } from 'contexts/SettingsContext';
import { SubheaderProvider } from 'contexts/SubheaderContext';
import setupAxios from 'store';
import store, { persistor } from 'store/store';

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
                  <SubheaderProvider>
                    <App />
                  </SubheaderProvider>
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
