import React from 'react';
import { IntlProvider } from 'react-intl';
// import '@formatjs/intl-relativetimeformat/polyfill';
// import '@formatjs/intl-relativetimeformat/dist/locale-data/en';
// import '@formatjs/intl-relativetimeformat/dist/locale-data/tr';

import { TLang } from 'utils/shared-types';
import { ISchool } from 'pages/organization/organization-types';

import enMessages from './messages/en.json';

// const formats = {
//   number: {
//     TRY: {
//       style: 'currency',
//       currency: 'TRY'
//     },
//     USD: {
//       style: 'currency',
//       currency: 'USD'
//     }
//   }
// };

export type IntlMessageID = keyof typeof enMessages;

type TLocaleProviderProps = {
  lang: TLang;
  activeSchool: ISchool;
  children: React.ReactNode;
};

export const LocaleProvider = (props: TLocaleProviderProps) => {
  const { lang, activeSchool, children } = props;
  let messages = enMessages;

  React.useEffect(() => {
    if (lang) {
      import(`./messages/${lang}.json`)
        .then((module) => (messages = Object.assign(messages, module.default)))
        .then(() => {
          // Country overrides
          if (activeSchool?.config?.countryId?.toLowerCase() === 'tr') {
            import(`./overrides/country/tr/${lang}.json`)
              .then((module) => (messages = Object.assign(messages, module.default)))
              .catch(() => null);
          }

          // Institution Type overrides
          if (activeSchool?.config?.institutionType?.toLowerCase() === 'academy') {
            import(`./overrides/type/academy/${lang}.json`)
              .then((module) => (messages = Object.assign(messages, module.default)))
              .catch(() => null);
          }
        })
        .catch(() => null);
    }
  }, [activeSchool, lang]);

  return (
    // <IntlProvider locale={lang} defaultLocale='en' messages={messages} formats={formats}>
    <IntlProvider locale={lang} defaultLocale='en' messages={messages}>
      {children}
    </IntlProvider>
  );
};
