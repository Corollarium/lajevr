const fs = require('fs');
const path = require('path');

const isDirectory = source => fs.lstatSync(source).isDirectory();

const isMedia = (source) => {
  return isImage(source) || isVideo(source);
};

const isImage = (source) => {
  const lower = source.toLowerCase();
  return lower.endsWith('jpg') || lower.endsWith('jpeg') || lower.endsWith('png');
};

const isVideo = (source) => {
  const lower = source.toLowerCase();
  return lower.endsWith('mp4');
};

const main = () => {
  const gallery = [];
  const basedir = path.join(__dirname, 'static/images/');
  const dirs = fs.readdirSync(basedir).map(name => path.join(basedir, name)).filter(isDirectory);
  for (const d of dirs) {
    try {
      const urlpath = d.replace(path.join(__dirname, '/static/'), '', d);
      const attribution = JSON.parse(fs.readFileSync(path.join(d, 'attribution.json')));
      const media = fs.readdirSync(d).filter(isMedia);

      for (const m of media) {
        const data = Object.assign({}, attribution);
        data.url = '/' + urlpath + '/' + m;
        data.description = '';
        data.type = (isImage(m) ? 'image' : (isVideo(m) ? 'video' : ''));
        gallery.push(data);
      }
    } catch (error) {
      // pass
      // console.trace(error);
    }
  }

  fs.writeFileSync(path.join(__dirname, 'components/gallery.json'), JSON.stringify(gallery));
};

main();
