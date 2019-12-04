import { select, selectAll, event, customEvent } from 'd3-selection';
import { geoOrthographic, geoPath, geoGraticule } from 'd3-geo';
import { queue } from 'd3-queue';
import { json } from 'd3-fetch';
import { tree, hierarchy } from 'd3-hierarchy';

export default {
  json,
  select,
  selectAll,
  tree,
  hierarchy,
  // event,
  get event () { return event; },
  customEvent,
  geo: {
    ortographic: geoOrthographic,
    path: geoPath,
    graticule: geoGraticule
  },
  queue
};
