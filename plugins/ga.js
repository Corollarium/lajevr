import Vue from 'vue';
import VueGtag from 'vue-gtag';

export default ({ app }) => {
  const enabled = process.env.NODE_ENV === 'production';

  Vue.use(VueGtag, {
    config: { id: 'G-X2YWWGDFS3' },
    bootstrap: enabled,
    appName: 'LAJEVR',
    enabled,
    pageTrackerScreenviewEnabled: true
  }, app.router);
};
