export const APP_VERSION = '1.0.1';

export const ENABLE_REDUX_DEV_TOOLS = true;

export const THEMES = {
  LIGHT: 'LIGHT',
  DARK: 'DARK',
  NATURE: 'NATURE'
};

export const schoostWebUrl = 'https://www.schoost.com';
export const privacyUrl = 'https://www.schoost.com/en/privacy';
export const termsOfUseUrl = 'https://www.schoost.com/en/terms';
export const smartClassLogo = 'https://schst.in/smartclass';
export const defaultLogo = 'https://schst.in/schoost';
export const SmartClassStartYear = new Date('2004-01-31').getFullYear();

export const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET
};

export const gtmConfig = {
  containerId: process.env.REACT_APP_GTM_CONTAINER_ID
};

export const googleMapsApiUrl = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`;
