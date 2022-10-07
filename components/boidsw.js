import { Vector3 } from '@babylonjs/core';
import BoidsManager from './boids';

let boidsManager = null;

function start (center, total, initialRadius = 1.0, boundRadiusScale = 100.0, initialVelocity = null) {
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
    1.0,
    30.0
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
  boidsManager.updateForces(1 / 60);

  let lastTickPosition = performance.now();

  // we want to updatePositions as often as possible
  const updatePositions = () => {
    const now = performance.now();
    const deltaTime = now - lastTickPosition;
    lastTickPosition = now;
    boidsManager.updatePositions(deltaTime);
    postMessage({ command: 'boids', boids: boidsManager.boids });
    if (!boidsManager.stopThread) {
      requestAnimationFrame(updatePositions);
    }
  };
  updatePositions();

  // this is slower and will update in its own rhythm
  const updateForces = () => {
    boidsManager.updateForces();
    if (!boidsManager.stopThread) {
      setTimeout(updateForces, 1);
    }
  };
  updateForces();
}

function processCommand (data) {
  if (data.command === 'start') {
    start(
      data.center,
      data.total,
      data.initialRadius || 1.0,
      data.boundRadiusScale || 100.0
    );
  } else if (data.command === 'stop') {
    boidsManager.stopThread = true;
  } else if (data.command === 'set') {
    boidsManager[data.name] = data.value;
  } else if (data.command === 'calculateBounds') {
    boidsManager.calculateBounds();
  } else if (data.command === 'bundle') {
    for (const c of data.list) {
      processCommand(c);
    }
  }
}

// eslint-disable-next-line no-unused-vars
onmessage = function (e) {
  processCommand(e.data);
};
