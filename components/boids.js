import * as BABYLON from 'babylonjs';
import * as GUI from 'babylonjs-gui';

/* eslint-disable no-unreachable */
/* eslint-disable no-unused-vars */

class Bird {
  constructor (id, position, velocity) {
    this.id = id;
    this.position = position;
    this.velocity = velocity;
    this.force = new BABYLON.Vector3(0, 0, 0);
  }

  get orientation () {
    return this.velocity.normalize();
  }
}

class Boids {
  constructor (total, center, initialRadius = 1.0, boundRadiusScale = 100.0, initialVelocity = null) {
    this.cohesion = 0.3;
    this.separation = 0.4;
    this.alignment = 1.0;
    this.separationMinDistance = 3.0;
    this.maxSpeed = 1.0; // in units per second
    this.boundsMin = new BABYLON.Vector3(
      center.x - boundRadiusScale, center.y - boundRadiusScale, center.z - boundRadiusScale
    );
    this.boundsMax = new BABYLON.Vector3(
      center.x + boundRadiusScale, center.y + boundRadiusScale, center.z + boundRadiusScale
    );
    this.otherForces = [];

    // debug
    this.birds = [];
    this.debug = {
      show: false,
      influences: [],
      arrows: []
    };

    if (!initialVelocity) {
      initialVelocity = new BABYLON.Vector3(0.0, 0.0, 0.0);
    }
    const initialSpeed = 0.93;

    // internal data, cached per frame
    this.center = center.clone();
    this.avgVel = new BABYLON.Vector3(0.0, 0.0, 0.0);

    for (let i = 0; i < total; i++) {
      const position = this.center.add(
        new BABYLON.Vector3((Math.random() - 0.5) * initialRadius, (Math.random() - 0.5) * initialRadius, (Math.random() - 0.5) * initialRadius)
      );
      const velocity = this.center.add(
        new BABYLON.Vector3((Math.random() - 0.5) * initialSpeed, (Math.random() - 0.5) * initialSpeed, (Math.random() - 0.5) * initialSpeed)
      );
      const bird = new Bird(i, position, initialVelocity);
      this.birds.push(bird);
    }
  }

  /**
   * Updates the boids.
   *
   * @param {Number} deltaTime The time since last frame in seconds
   */
  update (deltaTime) {
    this._updateCenter();
    const maxSpeedSquared = this.maxSpeed * this.maxSpeed;
    this.birds.forEach((bird) => {
      const f1 = this._forceCentreMass(bird);
      const f2 = this._forceSeparation(bird);
      const f3 = this._forceMatchVelocity(bird);
      const f4 = this._forceBoundaries(bird);
      const f = f1.add(f2).add(f3).add(f4);

      this.otherForces.forEach(
        (forceCallback) => {
          f.add(forceCallback(this, bird));
        }
      );

      // force = mass * acceleration
      bird.force.copyFrom(f);
      bird.velocity.addInPlace(f.scale(deltaTime));

      // clamp velocity
      if (bird.velocity.lengthSquared() > maxSpeedSquared) {
        bird.velocity = bird.velocity.normalize().scale(this.maxSpeed);
      }

      bird.position.addInPlace(bird.velocity.scale(deltaTime));
    });
    this._updateDebug();
  }

  /**
   * Recalculates the center of mass amd average velocity
   */
  _updateCenter () {
    if (!this.birds.length) {
      return;
    }
    const center = new BABYLON.Vector3(0, 0, 0);
    const avgVel = new BABYLON.Vector3(0, 0, 0);

    this.birds.forEach((bird) => {
      center.addInPlace(bird.position);
      avgVel.addInPlace(bird.velocity);
    });

    center.scaleInPlace(1.0 / this.birds.length);
    avgVel.scaleInPlace(1.0 / this.birds.length);

    this.center = center;
    this.avgVel = avgVel;
  }

  /**
   * Boids try to fly towards the centre of mass of neighbouring boids.
   * @param {Bird} bird
   */
  _forceCentreMass (bird) {
    // TODO: we could remove the bird position from the average
    return this.center.subtract(bird.position).scale(this.cohesion);
  }

  /**
   * Boids try to keep a small distance away from other objects (including other boids).
   * @param {Bird} bird
   */
  _forceSeparation (bird) {
    const f = new BABYLON.Vector3(0, 0, 0);

    // TODO this is n^2, improve
    this.birds.forEach((other) => {
      if (bird.id === other.id) {
        return;
      }
      const v = bird.position.subtract(other.position);
      const d2 = v.length();
      if (d2 < this.separationMinDistance) {
        f.addInPlace(v.scale(this.separationMinDistance - d2));
      }
    });
    return f.scale(this.separation);
  }

  /**
   * Boids try to match velocity with near boids.
   * @param {Bird} bird
   */
  _forceMatchVelocity (bird) {
    // TODO: we could remove the bird position from the average
    return this.avgVel.subtract(bird.velocity).scale(this.alignment);
  }

  // Boids try to match velocity with near boids.
  _forceObstacles (bird) {
    // TODO
  }

  /**
   * Boids want to get away from boundaries
   * @param {Bird} bird
   */
  _forceBoundaries (bird) {
    const f = new BABYLON.Vector3(0, 0, 0);
    const amount = 0.2;
    // clamp to area
    if (bird.position.x < this.boundsMin.x * 0.9) {
      f.x = amount;
    } else if (bird.position.x > this.boundsMax.x * 0.9) {
      f.x = -amount;
    }
    if (bird.position.y < this.boundsMin.y * 0.9) {
      f.y = amount;
    } else if (bird.position.y > this.boundsMax.y * 0.9) {
      f.y = -amount;
    }
    if (bird.position.z < this.boundsMin.z * 0.9) {
      f.z = amount;
    } else if (bird.position.z > this.boundsMax.z * 0.9) {
      f.z = -amount;
    }
    return f;
  }

  addForce (c) {
    this.otherForces.push(c);
  }

  showDebug (scene) {
    this.debug.show = true;

    // init if we don't have data.
    if (!this.debug.center) {
      const centerMaterial = new BABYLON.StandardMaterial('debug_center', scene);
      centerMaterial.diffuseColor = BABYLON.Color3.FromHexString('#FF0000');
      this.debug.center = BABYLON.MeshBuilder.CreateSphere(
        'center',
        {
          diameter: 0.1,
          segments: 8
        }
      );

      const bboxMaterial = new BABYLON.StandardMaterial('debug_bbox', scene);
      bboxMaterial.diffuseColor = BABYLON.Color3.FromHexString('#00FF00');
      bboxMaterial.wireframe = true;
      this.debug.center.material = centerMaterial;

      this.debug.bbox = BABYLON.Mesh.CreateBox('boids_bbox', 1.0, scene);
      this.debug.bbox.scaling.x = Math.abs(this.boundsMax.x - this.boundsMin.x);
      this.debug.bbox.scaling.y = Math.abs(this.boundsMax.y - this.boundsMin.y);
      this.debug.bbox.scaling.z = Math.abs(this.boundsMax.z - this.boundsMin.z);
      this.debug.bbox.position.x = Math.abs(this.boundsMax.x - this.boundsMin.x) / 2;
      this.debug.bbox.position.y = Math.abs(this.boundsMax.y - this.boundsMin.y) / 2;
      this.debug.bbox.position.z = Math.abs(this.boundsMax.z - this.boundsMin.z) / 2;
      this.debug.bbox.material = bboxMaterial;

      const wireframeMaterial = new BABYLON.StandardMaterial('debug_wireframe', scene);
      wireframeMaterial.diffuseColor = BABYLON.Color3.FromHexString('#FFFFFF');
      wireframeMaterial.wireframe = true;
      this.birds.forEach((bird) => {
        bird.debug = {};
        bird.debug.force = BABYLON.MeshBuilder.CreateTube(
          'bird_arrow_' + bird.uniqueId,
          {
            path: [bird.position.add(bird.velocity), bird.position.clone()],
            radius: 0.01,
            updatable: true
          }, scene);
        bird.debug.influence = BABYLON.MeshBuilder.CreateSphere(
          'bird_influence_' + bird.uniqueId,
          {
            diameter: 1.0,
            segments: 8
          }
        );
        bird.debug.influence.scaling.setAll(this.separationMinDistance);
        bird.debug.influence.material = wireframeMaterial;
      });
    }
  }

  _updateDebug () {
    if (!this.debug.show) {
      return;
    }
    this.debug.center.position.copyFrom(this.center);
    this.birds.forEach((bird) => {
      const path = [bird.position.add(bird.force.scale(20.0)), bird.position.clone()];
      bird.debug.force = BABYLON.MeshBuilder.CreateTube(bird.debug.force.name, { path, radius: 0.01, instance: bird.debug.force });
      bird.debug.influence.position.copyFrom(bird.position);
    });
  }

  gui (scene) {
    // GUI
    const advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI('UI', undefined, undefined, scene);

    const panel = new GUI.StackPanel();
    panel.width = '220px';
    panel.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    panel.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    advancedTexture.addControl(panel);

    let header, slider;

    const makeSlider = (name, maximum = 2.0, callback = () => {}) => {
      header = new GUI.TextBlock();
      header.text = name + ' ' + this[name];
      header.height = '30px';
      header.color = 'white';
      panel.addControl(header);
      slider = new GUI.Slider();
      slider.minimum = 0;
      slider.maximum = maximum;
      slider.value = this[name];
      slider.height = '20px';
      slider.width = '200px';
      const f = (function (boids, header, name) {
        return (value) => {
          boids[name] = value;
          header.text = name + ' ' + value;
          callback.apply(boids);
        };
      })(this, header, name);
      slider.onValueChangedObservable.add(f);
      panel.addControl(slider);
    };
    makeSlider('cohesion');
    makeSlider('separation');
    makeSlider('alignment');
    makeSlider('separationMinDistance', 10.0, (boids) => {
      if (this.debug.center) {
        this.birds.forEach((bird) => {
          bird.debug.influence.scaling.setAll(this.separationMinDistance);
        });
      }
    });
  }
}

export default Boids;
