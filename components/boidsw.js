import { Vector3 } from '@babylonjs/core';
import { BoidsManager } from './boids';

/**
 * @type {BoidsManager}
 */
let boidsManager = null;

function construct (center, total, initialRadius = 1.0, boundRadiusScale = 100.0, initialVelocity = null) {
  // set bounds
  const boundsMin = new Vector3(
    center.x - boundRadiusScale, center.y - boundRadiusScale, center.z - boundRadiusScale
  );
  const boundsMax = new Vector3(
    center.x + boundRadiusScale, center.y + boundRadiusScale, center.z + boundRadiusScale
  );

  boidsManager = new BoidsManager(
    total,
    boundsMin.add(boundsMax.subtract(boundsMin).scale(0.5)),
    initialRadius,
    boundRadiusScale,
    initialVelocity
  );
  boidsManager.boundsMin = boundsMin;
  boidsManager.boundsMax = boundsMax;
  boidsManager.calculateBounds();
  boidsManager.cohesion = 0.001;
  boidsManager.alignment = 0.03;
  boidsManager.separationMinDistance = 0.5;
  boidsManager.maxSpeed = 1.0;
  boidsManager.stopThread = false;

  // start by calculating a single ideal frame
  boidsManager.updateForces(1.0 / 60);
}

function start () {
  let lastTickPosition = performance.now();

  // we want to updatePositions as often as possible
  const fpsLog = 3 * 60;
  let fpsCounter = 0; let fpsLastNow = performance.now();
  const updatePositions = () => {
    const now = performance.now();
    const deltaTime = now - lastTickPosition;
    lastTickPosition = now;
    boidsManager._updateCenter();
    boidsManager.updatePositions(deltaTime / 1000.00);

    postMessage({
      command: 'boids',
      boids: boidsManager.boids,
      center: boidsManager.center
    });
    if (!boidsManager.stopThread) {
      requestAnimationFrame(updatePositions);
    }
    fpsCounter++;
    if (fpsCounter % fpsLog === 0) {
      console.log('fpspos', fpsLog / ((now - fpsLastNow) / 1000.0)
      );
      fpsLastNow = now;
    }
  };
  postMessage({
    command: 'started',
    boids: boidsManager.boids,
    boundsMin: boidsManager.boundsMin,
    boundsMax: boidsManager.boundsMax,
    center: boidsManager.center,
    separationMinDistance: boidsManager.separationMinDistance
  });
  updatePositions();

  // this is slower and will update in its own rhythm
  const updateForces = () => {
    boidsManager.updateForces();
    if (!boidsManager.stopThread) {
      setTimeout(updateForces, 3000);
    }
  };
  updateForces();
}

function processCommand (data) {
  switch (data.command) {
  case 'construct':
    construct(
      new Vector3().copyFrom(data.center),
      data.total,
      data.initialRadius || 1.0,
      data.boundRadiusScale || 100.0
    );
    break;
  case 'start':
    start();
    break;
  case 'stop':
    boidsManager.stopThread = true;
    break;
  case 'set':
    if (data.name === 'boundsMax' || data.name === 'boundsMin') {
      boidsManager[data.name] = new Vector3().copyFrom(data.value);
    } else {
      boidsManager[data.name] = data.value;
    }
    break;
  case 'calculateBounds':
    boidsManager.calculateBounds();
    break;
  case 'reset':
    boidsManager.reset(
      data.total,
      data.initialRadius,
      data.initialVelocity ? new Vector3().copyFrom(data.initialVelocity) : null
    );
    break;
  case 'bundle':
    for (const c of data.list) {
      processCommand(c);
    }
    break;
  case 'dump':
    console.info(
      boidsManager
    );
    break;
  }
}

// eslint-disable-next-line no-unused-vars
onmessage = function (e) {
  processCommand(e.data);
};
