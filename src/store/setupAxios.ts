import { Store } from 'redux';
import { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { globalApiUrl } from './ApiUrls';

export default function setupAxios(axios: AxiosInstance, store: Store) {
  axios.interceptors.request.use(
    (config) => {
      const {
        auth: { authToken },
        user: { activeSchool, activeSeason }
      } = store.getState();

      if (config.url.includes(globalApiUrl)) {
        config.headers.common['Authorization'] = `Bearer ${process.env.REACT_APP_GLOBAL_API_TOKEN}`;
      } else {
        if (authToken && !config.headers.Authorization) {
          config.headers.common['Authorization'] = `Bearer ${authToken}`;
        }
        if (activeSchool) {
          config.headers.common['schoolId'] = activeSchool.id;
        }
        if (activeSeason) {
          config.headers.common['seasonId'] = activeSeason.database;
        }
      }
      if (config.method === 'patch') {
        config.headers['Content-Type'] = 'application/merge-patch+json';
      } else {
        config.headers['Content-Type'] = 'application/json';
        config.headers['Accept'] = 'application/json';
      }

      return config;
    },
    (error: AxiosError) => Promise.reject(error)
  );

  axios.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    (error: AxiosError) => {
      return error.response;
    }
  );
}
