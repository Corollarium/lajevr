import galleryData from '~/components/gallery.json';

export default galleryData.filter((i) => { return ('size' in i); });
