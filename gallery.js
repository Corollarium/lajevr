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
  const getDirs = (basedir) => {
    return fs.readdirSync(basedir).map(name => path.join(basedir, name)).filter(isDirectory);
  };
  const dirs = getDirs(path.join(__dirname, 'static/images/')).concat(getDirs(path.join(__dirname, 'static/videos/')));

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
        data.suburl = data.url.replace('images/', '');
        data.filename = m;
        data.type = (isImage(m) ? 'image' : (isVideo(m) ? 'video' : ''));
        gallery.push(data);
      }
    } catch (error) {
      console.trace(error);
    }
  }

  gallery.sort(
    (a, b) => {
      if (a.name < b.name) { return -1; }
      if (a.name > b.name) { return 1; }
      return 0;
    }
  );

  console.log(gallery.map(a => a.name));
  fs.writeFileSync(path.join(__dirname, 'components/gallery.json'), JSON.stringify(gallery));
};

main();
