const i18next = require('i18next');
const XHR = require('i18next-xhr-backend');

const options = {
  lng: 'en',
  fallbackLng: ['en'],
  load: 'languageOnly', // we only provide en, de -> no region specific locals like en-US, de-DE

  // have a common namespace used around the full app
  ns: ['common'],
  defaultNS: 'common',

  debug: false,
  saveMissing: false,

  interpolation: {
    // escapeValue: false, // not needed for react!!
    formatSeparator: ',',
    format: (value, format) => {
      if (format === 'uppercase') {
        return value.toUpperCase();
      }

      return value;
    },
  },
};

const i18nInstance = i18next;

// for browser use xhr backend to load translations and browser lng detector
if (process.browser) {
  i18nInstance
    .use(XHR);
  // .use(Cache)
  // .use(LanguageDetector)
}

// initialize if not already initialized
if (!i18nInstance.isInitialized) {
  i18nInstance.init(options);
}

// a simple helper to getInitialProps passed on loaded i18n data
const getInitialProps = (req, namespaces) => {
  let nmspcs = namespaces;
  if (!nmspcs) {
    nmspcs = i18nInstance.options.defaultNS;
  }

  if (typeof nmspcs === 'string') {
    nmspcs = [nmspcs];
  }

  req.i18n.toJSON = () => null; // do not serialize i18next instance and send to client

  const initialI18nStore = {};
  req.i18n.languages.forEach((l) => {
    initialI18nStore[l] = {};
    nmspcs.forEach((ns) => {
      initialI18nStore[l][ns] = (req.i18n.services.resourceStore.data[l] || {})[ns] || {};
    });
  });

  return {
    i18n: req.i18n, // use the instance on req - fixed language on request
    initialI18nStore,
    initialLanguage: req.i18n.language,
  };
};

module.exports = {
  getInitialProps,
  i18nInstance,
  I18n: i18next.default,
};
