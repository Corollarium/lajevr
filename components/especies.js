import galleryData from '~/components/gallery.json';

console.log(galleryData);
export default galleryData.filter((i) => { return ('size' in i); });
