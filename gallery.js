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
      const datafile = path.join(d, 'attribution.json');
      if (!fs.existsSync(datafile)) {
        continue;
      }
      const dirdata = JSON.parse(fs.readFileSync(datafile));
      const media = fs.readdirSync(d).filter(isMedia);

      for (const m of media) {
        const data = Object.assign({ description: '' }, dirdata.attribution, (m in dirdata.media ? dirdata.media[m] : {}));
        if (!(m in dirdata.media)) {
          // eslint-disable
          console.warn(m + ' does not have metadata.');
        }
        data.url = urlpath + '/' + m;
        data.filename = m;
        data.type = (isImage(m) ? 'image' : (isVideo(m) ? 'video' : ''));
        gallery.push(data);
      }
    } catch (error) {
      console.trace(error);
    }
  }

  fs.writeFileSync(path.join(__dirname, 'components/gallery.json'), JSON.stringify(gallery));
};

main();
