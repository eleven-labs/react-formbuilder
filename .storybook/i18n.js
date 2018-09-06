import i18n from 'i18next';
import Backend from './i18next-cross-fetch-backend';
import { capitalize } from 'lodash';
import { reactI18nextModule } from 'react-i18next';

i18n
  .use(Backend)
  .use(reactI18nextModule) // if not using I18nextProvider
  .init({
    fallbackLng: 'en',
    debug: true,

    ns: ['formbuilder_validators'],
    backend: {
      // for all available options read the backend's repository readme file
      loadPath: '/locales/{{lng}}/{{ns}}.json'
    },

    interpolation: {
      escapeValue: false, // not needed for react!!
      format: function (value, format, lng) {
        if (format === 'capitalize') return capitalize(value);
        return value;
      }
    },

    // react i18next special options (optional)
    react: {
      wait: false,
      bindI18n: 'languageChanged loaded',
      bindStore: 'added removed',
      nsMode: 'default'
    },
  });


export default i18n;