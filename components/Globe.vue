<template>
  <div id="globe_wrapper">
    <svg />
  </div>
</template>

<script>

// outra ideia https://mappa.js.org/docs/examples-three-js.html
// https://bl.ocks.org/atanumallick/8d18989cd538c72ae1ead1c3b18d7b54
// https://bl.ocks.org/wwymak/raw/dcdd12937bd4643cd9b3/
import { feature } from 'topojson-client';
import * as d3 from 'd3';

export default {
  data () {
    return {
    };
  },

  mounted () {
    this.basicGlobe();
  },

  methods: {
    basicGlobe () {
      const width = 960;
      const height = 500;
      const config = {
        speed: 0.05,
        verticalTilt: 20,
        horizontalTilt: 0
      };
      const svg = d3.select('svg')
        .attr('width', width).attr('height', height);
      const markerGroup = svg.append('g');
      const projection = d3.geoOrthographic();
      const path = d3.geoPath().projection(projection);
      const center = [width / 2, height / 2];
      const locations = [
        { 'latitude': -24.2949, 'longitude': -46.1770 }
      ];

      drawGlobe();
      drawGraticule();
      enableRotation();

      function drawGlobe () {
        d3.json('https://s3-us-west-2.amazonaws.com/s.cdpn.io/95802/world-110m.json').then((worldData) => {
          svg.selectAll('.segment')
            .data(feature(worldData, worldData.objects.countries).features)
            .enter().append('path')
            .attr('class', 'segment')
            .attr('d', path)
            .style('stroke', '#888')
            .style('stroke-width', '1px')
            .style('fill', (d, i) => '#e5e5e5')
            .style('opacity', '.6');
          drawMarkers();
        });
      }

      function drawGraticule () {
        const graticule = d3.geoGraticule()
          .step([10, 10]);

        svg.append('path')
          .datum(graticule)
          .attr('class', 'graticule')
          .attr('d', path)
          .style('fill', '#fff')
          .style('stroke', '#ccc');
      }

      function enableRotation () {
        d3.timer(function (elapsed) {
          projection.rotate([config.speed * elapsed - 120, config.verticalTilt, config.horizontalTilt]);
          svg.selectAll('path').attr('d', path);
          drawMarkers();
        });
      }

      function drawMarkers () {
        const markers = markerGroup.selectAll('circle')
          .data(locations);
        markers
          .enter()
          .append('circle')
          .merge(markers)
          .attr('cx', d => projection([d.longitude, d.latitude])[0])
          .attr('cy', d => projection([d.longitude, d.latitude])[1])
          .attr('fill', (d) => {
            const coordinate = [d.longitude, d.latitude];
            const gdistance = d3.geoDistance(coordinate, projection.invert(center));
            return gdistance > 1.57 ? 'none' : 'steelblue';
          })
          .attr('r', 7);

        markerGroup.each(function () {
          this.parentNode.appendChild(this);
        });
      }
    },
    globe () {
      // https://codepen.io/lushen/pen/PNJXoX
      const width = 700;
      const height = 700;
      const speed = -1e-2;
      const start = Date.now();

      const sphere = { type: 'Sphere' };

      const projection = d3.geoOrthographic()
        .scale(width / 2.1)
        .translate([width / 2, height / 2])
        .precision(0.5);

      const graticule = d3.geoGraticule();

      const canvas = d3.select('#globe_wrapper').append('canvas')
        .attr('width', width)
        .attr('height', height);

      const context = canvas.node().getContext('2d');

      const path = d3.geoPath()
        .projection(projection)
        .context(context);

      d3.json('https://s3-us-west-2.amazonaws.com/s.cdpn.io/95802/world-110m.json').then((topo) => {
        const land = feature(topo, topo.objects.land);
        const grid = graticule();

        d3.timer(function () {
          context.clearRect(0, 0, width, height);

          projection.rotate([speed * (Date.now() - start), -15]).clipAngle(90);

          context.beginPath();
          path(sphere);
          context.lineWidth = 0;
          context.strokeStyle = 'transparent';
          context.stroke();
          context.fillStyle = 'transparent';
          context.fill();

          projection.clipAngle(180);

          context.beginPath();
          path(land);
          context.fillStyle = '#dadac4';
          context.fill();

          context.beginPath();
          path(grid);
          context.lineWidth = 0.5;
          context.strokeStyle = 'rgba(119,119,119,0)';
          context.stroke();

          projection.clipAngle(90);

          context.beginPath();
          path(land);
          context.fillStyle = '#737368';
          context.fill();
          context.lineWidth = 0;
          context.strokeStyle = 'transparent';
          context.stroke();

          const markerGroup = canvas.append('g');
          const locations = [{ 'latitude': 22, 'longitude': 88 }, { 'latitude': 0, 'longitude': 0 }];
          const markers = markerGroup.selectAll('circle')
            .data(locations);
          console.log(markers);
          markers.append('g')
            .selectAll('circle')
            .data(locations)
            .enter()
            .append('circle')
            .merge(markers)
            .attr('cx', d => projection([d.longitude, d.latitude])[0])
            .attr('cy', d => projection([d.longitude, d.latitude])[1])
            .attr('fill', (d) => {
              return 'steelblue';
            })
            .attr('r', 70);
          markerGroup.each(function () {
            this.parentNode.appendChild(this);
          });
          /* svg.append('g').attr('class', 'points')
          .selectAll('text').data(places.features)
          .enter().append('path')
          .attr('class', 'point')
          .attr('d', path);

        svg.append('g').attr('class', 'labels')
          .selectAll('text').data(places.features)
          .enter().append('text')
          .attr('class', 'label')
          .text(function (d) { return d.properties.name; }); */
        });
      });

      d3.select(self.frameElement).style('height', height + 'px');
    },

    start () {
      /* eslint-disable */
      d3.select(window)
        .on('mousemove', mousemove)
        .on('mouseup', mouseup);

      const width = 960;
      const height = 500;

      const proj = d3.geoOrthographic()
        .scale(220)
        .translate([width / 2, height / 2])
        .clipAngle(90);

      const path = d3.geoPath().projection(proj).pointRadius(1.5);

      const graticule = d3.geoGraticule();

      const svg = d3.select('#globe_wrapper').append('svg')
        .attr('width', width)
        .attr('height', height)
        .on('mousedown', mousedown);

      /* eslint-disable camelcase */
      function ready (world) {
        const ocean_fill = svg.append('defs').append('radialGradient')
          .attr('id', 'ocean_fill')
          .attr('cx', '75%')
          .attr('cy', '25%');
        ocean_fill.append('stop').attr('offset', '5%').attr('stop-color', '#ddf');
        ocean_fill.append('stop').attr('offset', '100%').attr('stop-color', '#9ab');

        const globe_highlight = svg.append('defs').append('radialGradient')
          .attr('id', 'globe_highlight')
          .attr('cx', '75%')
          .attr('cy', '25%');
        globe_highlight.append('stop')
          .attr('offset', '5%').attr('stop-color', '#ffd')
          .attr('stop-opacity', '0.6');
        globe_highlight.append('stop')
          .attr('offset', '100%').attr('stop-color', '#ba9')
          .attr('stop-opacity', '0.2');

        const globe_shading = svg.append('defs').append('radialGradient')
          .attr('id', 'globe_shading')
          .attr('cx', '50%')
          .attr('cy', '40%');
        globe_shading.append('stop')
          .attr('offset', '50%').attr('stop-color', '#9ab')
          .attr('stop-opacity', '0');
        globe_shading.append('stop')
          .attr('offset', '100%').attr('stop-color', '#3e6184')
          .attr('stop-opacity', '0.3');

        const drop_shadow = svg.append('defs').append('radialGradient')
          .attr('id', 'drop_shadow')
          .attr('cx', '50%')
          .attr('cy', '50%');
        drop_shadow.append('stop')
          .attr('offset', '20%').attr('stop-color', '#000')
          .attr('stop-opacity', '.5');
        drop_shadow.append('stop')
          .attr('offset', '100%').attr('stop-color', '#000')
          .attr('stop-opacity', '0');

        svg.append('ellipse')
          .attr('cx', 440).attr('cy', 450)
          .attr('rx', proj.scale() * 0.90)
          .attr('ry', proj.scale() * 0.25)
          .attr('class', 'noclicks')
          .style('fill', 'url(#drop_shadow)');

        svg.append('circle')
          .attr('cx', width / 2).attr('cy', height / 2)
          .attr('r', proj.scale())
          .attr('class', 'noclicks')
          .style('fill', 'url(#ocean_fill)');

        svg.append('path')
          .data(feature(world, world.objects.land))
          .attr('class', 'land')
          .attr('d', path);

        svg.append('path')
          .datum(graticule)
          .attr('class', 'graticule noclicks')
          .attr('d', path);

        svg.append('circle')
          .attr('cx', width / 2).attr('cy', height / 2)
          .attr('r', proj.scale())
          .attr('class', 'noclicks')
          .style('fill', 'url(#globe_highlight)');

        svg.append('circle')
          .attr('cx', width / 2).attr('cy', height / 2)
          .attr('r', proj.scale())
          .attr('class', 'noclicks')
          .style('fill', 'url(#globe_shading)');

        /*svg.append('g').attr('class', 'points')
          .selectAll('text').data(places.features)
          .enter().append('path')
          .attr('class', 'point')
          .attr('d', path);

        svg.append('g').attr('class', 'labels')
          .selectAll('text').data(places.features)
          .enter().append('text')
          .attr('class', 'label')
          .text(function (d) { return d.properties.name; }); */

        // uncomment for hover-able country outlines

        // svg.append("g").attr("class","countries")
        //   .selectAll("path")
        //     .data(topojson.object(world, world.objects.countries).geometries)
        //   .enter().append("path")
        //     .attr("d", path);

        // position_labels();
      }
      d3.json('/world-110m.v1.json').then((world) => ready(world));

      // modified from http://bl.ocks.org/1392560
      let m0, o0;
      function mousedown () {
        m0 = [d3.event.pageX, d3.event.pageY];
        o0 = proj.rotate();
        d3.event.preventDefault();
      }
      function mousemove () {
        if (m0) {
          const m1 = [d3.event.pageX, d3.event.pageY];
          const o1 = [o0[0] + (m1[0] - m0[0]) / 6, o0[1] + (m0[1] - m1[1]) / 6];
          o1[1] = o1[1] > 30 ? 30
            : o1[1] < -30 ? -30
              : o1[1];
          proj.rotate(o1);
          refresh();
        }
      }
      function mouseup () {
        if (m0) {
          mousemove();
          m0 = null;
        }
      }

      function refresh () {
        svg.selectAll('.land').attr('d', path);
        svg.selectAll('.countries path').attr('d', path);
        svg.selectAll('.graticule').attr('d', path);
        svg.selectAll('.point').attr('d', path);
      }
      /* eslint-enable */
    }
  }
};
</script>

<style>
#earth_div{
  height: 100vh;
}

#globe_canvas {
  cursor: move;
  height: 500px;
}

</style>
