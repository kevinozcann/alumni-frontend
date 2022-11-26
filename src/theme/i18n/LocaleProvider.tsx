import React from 'react';
import { IntlProvider } from 'react-intl';
// import '@formatjs/intl-relativetimeformat/polyfill';
// import '@formatjs/intl-relativetimeformat/dist/locale-data/en';
// import '@formatjs/intl-relativetimeformat/dist/locale-data/tr';

import { TLang } from 'utils/shared-types';
import arMessages from './messages/ar.json';
import deMessages from './messages/de.json';
import enMessages from './messages/en.json';
import esMessages from './messages/es.json';
import trMessages from './messages/tr.json';

export type IntlMessageID = keyof typeof enMessages;

type TLocaleProviderProps = {
  lang: TLang;
  children: React.ReactNode;
};

export const LocaleProvider = (props: TLocaleProviderProps) => {
  const { lang, children } = props;

  const messages =
    (lang === 'ar' && arMessages) ||
    (lang === 'de' && deMessages) ||
    (lang === 'es' && esMessages) ||
    (lang === 'tr' && trMessages) ||
    enMessages;

  return (
    // <IntlProvider locale={lang} defaultLocale='en' messages={messages} formats={formats}>
    <IntlProvider locale={lang} defaultLocale='en' messages={messages}>
      {children}
    </IntlProvider>
  );
};
