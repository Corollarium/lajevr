import AOS from 'aos';

import 'aos/dist/aos.css';

export default ({ app }) => {
  app.AOS = new AOS.init({ // eslint-disable-line new-cap
    disable () {
      const maxWidth = 800;
      return window.innerWidth < maxWidth;
    },
    duration: 1000,
    delay: 250
  });
};
