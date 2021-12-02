import AOS from 'aos';

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
