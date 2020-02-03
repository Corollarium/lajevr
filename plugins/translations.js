import Vue from 'vue';
import GetTextPlugin from 'vue-gettext';

import translations from '../components/translations.json';

export default ({ app }) => {
  const availableLanguages = {
    en_US: 'English',
    pt_BR: 'Português'
  };

  function getBestLanguage () {
    let lang = JSON.parse(window.localStorage.getItem('language'));
    if (lang in availableLanguages) {
      return lang;
    }
    lang = navigator.language.replace('-', '_');
    if (lang in availableLanguages) {
      return lang;
    }
    const langparts = lang.split('_');
    for (const l in availableLanguages) {
      const lsplit = l.split('_');
      if (lsplit[0] === langparts[0]) {
        return l;
      }
    }
    return 'en_US';
  }

  Vue.use(
    GetTextPlugin,
    {
      availableLanguages: {
        en_US: 'English',
        pt_BR: 'Português'
      },
      defaultLanguage: getBestLanguage(),
      translations,
      silent: false
    }
  );
};
