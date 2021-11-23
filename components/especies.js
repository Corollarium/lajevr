import galleryData from '~/components/gallery.json';

export default galleryData.filter(
  (i) => { return ('size' in i); }
).sort(
  (a, b) => {
    if (a.name < b.name) { return -1; }
    if (a.name > b.name) { return 1; }
    return 0;
  }
);
