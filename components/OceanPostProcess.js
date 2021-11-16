/* eslint-disable */
import * as BABYLON from 'babylonjs';
/* eslint-enable */

/**
 * OceanPostProcess helps rendering an infinite ocean surface that can reflect and refract environment.
 *
 * Simmply add it to your scene and let the nerd that lives in you have fun.
 * Example usage:
 *  var pp = new OceanPostProcess("myOcean", camera);
 *  pp.reflectionEnabled = true;
 *  pp.refractionEnabled = true;
 */
export default class OceanPostProcess extends BABYLON.PostProcess {
  /**
     * Instantiates a new Ocean Post Process.
     * @param name the name to give to the postprocess.
     * @camera the camera to apply the post process to.
     * @param options optional object following the IOceanPostProcessOptions format used to customize reflection and refraction render targets sizes.
     */
  constructor (name, camera, options = {}) {
    super(
      name,
      './oceanPostProcess',
      ['time', 'fov', 'resolution', 'cameraPosition', 'cameraRotation', 'worldScale'],
      ['positionSampler', 'reflectionSampler', 'refractionSampler', 'skyTexture'],
      {
        width: options.width || camera.getEngine().getRenderWidth(),
        height: options.height || camera.getEngine().getRenderHeight()
      },
      options.isPipeline ? null : camera,
      BABYLON.Texture.TRILINEAR_SAMPLINGMODE,
      camera.getEngine(),
      true
    );
    this._time = 0;
    this.worldScale = 1.0;
    this._cameraRotation = BABYLON.Vector3.Zero();
    this._cameraViewMatrix = BABYLON.Matrix.Identity();
    this._reflectionEnabled = false;
    this._refractionEnabled = false;
    this._skyTexture = null;
    this._camera = camera;
    this._options = options;
    this.reflectionTexture = null;
    this.refractionTexture = null;
    // Get geometry shader
    this._geometryRenderer = camera.getScene().enableGeometryBufferRenderer(1.0);
    if (this._geometryRenderer && this._geometryRenderer.isSupported) {
      // Eanble position buffer
      this._geometryRenderer.enablePosition = true;
    } else {
      this.updateEffect('#define NOT_SUPPORTED\n');
    }
    // On apply the post-process
    this.onApply = (effect) => {
      if (!this._geometryRenderer || !this._geometryRenderer.isSupported) {
        return;
      }
      const engine = camera.getEngine();
      const scene = camera.getScene();
      this._time += engine.getDeltaTime() * 0.001;
      effect.setFloat('time', this._time);
      const RESOLUTION_SCALE = 1.0;
      effect.setVector2('resolution', new BABYLON.Vector2(engine.getRenderWidth() / RESOLUTION_SCALE, engine.getRenderHeight() / RESOLUTION_SCALE));
      if (scene) {
        // Position
        effect.setVector3('cameraPosition', camera.globalPosition);
        // Rotation
        this._computeCameraRotation(camera);
        effect.setVector3('cameraRotation', this._cameraRotation);
        effect.setFloat('fov', camera.fov);
        effect.setFloat('worldScale', this.worldScale);
        // Samplers
        effect.setTexture('positionSampler', this._geometryRenderer.getGBuffer().textures[2]);
        if (this._reflectionEnabled) {
          effect.setTexture('reflectionSampler', this.reflectionTexture);
        }
        if (this._refractionEnabled) {
          effect.setTexture('refractionSampler', this.refractionTexture);
        }
        if (this._skyTexture) {
          effect.setTexture('skyTexture', this._skyTexture);
        }
      }
    };
  }
  /**
     * Gets a boolean indicating if the real-time reflection is enabled on the ocean.
     */
  get reflectionEnabled () {
    return this._reflectionEnabled;
  }
  /**
     * Sets weither or not the real-time reflection is enabled on the ocean.
     * Is set to true, the reflection mirror texture will be used as reflection texture.
     */
  set reflectionEnabled (enabled) {
    if (this._reflectionEnabled === enabled) {
      return;
    }
    this._reflectionEnabled = enabled;
    if (enabled && !this.reflectionTexture) {
      this.reflectionTexture = new BABYLON.MirrorTexture(
        'oceanPostProcessReflection',
        this._options.reflectionSize || { width: 512, height: 512 },
        this._camera.getScene()
      );
      // Create mirror textures
      this.reflectionTexture.mirrorPlane = BABYLON.Plane.FromPositionAndNormal(BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, -1, 0));
    }

    this.updateEffect(this._getDefines());
    // Remove or add custom render target
    const customRenderTargets = this.getCamera().getScene().customRenderTargets;
    if (!enabled) {
      const index = customRenderTargets.indexOf(this.reflectionTexture);
      if (index !== -1) {
        customRenderTargets.splice(index, 1);
      }
    } else {
      customRenderTargets.push(this.reflectionTexture);
    }
  }
  /**
     * Gets a boolean indicating if the real-time refraction is enabled on the ocean.
     */
  get refractionEnabled () {
    return this._refractionEnabled;
  }
  /**
     * Sets weither or not the real-time refraction is enabled on the ocean.
     * Is set to true, the refraction render target texture will be used as refraction texture.
     */
  set refractionEnabled (enabled) {
    if (this._refractionEnabled === enabled) {
      return;
    }
    this._refractionEnabled = enabled;
    if (enabled && !this.refractionTexture) {
      this.refractionTexture = new BABYLON.RenderTargetTexture(
        'oceanPostProcessRefraction',
        this._options.refractionSize || { width: 512, height: 512 },
        this._camera.getScene()
      );
    }

    this.updateEffect(this._getDefines());
    // Remove or add custom render target
    const customRenderTargets = this.getCamera().getScene().customRenderTargets;
    if (!enabled) {
      const index = customRenderTargets.indexOf(this.refractionTexture);
      if (index !== -1) {
        customRenderTargets.splice(index, 1);
      }
    } else {
      customRenderTargets.push(this.refractionTexture);
    }
  }
  set skyTexture (texture) {
    this._skyTexture = texture;
    this.updateEffect(this._getDefines());
  }
  /**
     * Gets wether or not the post-processes is supported by the running hardware.
     * This requires draw buffer supports.
     */
  get isSupported () {
    return this._geometryRenderer !== null && this._geometryRenderer.isSupported;
  }
  /**
     * Returns the appropriate defines according to the current configuration.
     */
  _getDefines () {
    const defines = [];
    if (this._reflectionEnabled) {
      defines.push('#define REFLECTION_ENABLED');
    }
    if (this._refractionEnabled) {
      defines.push('#define REFRACTION_ENABLED');
    }
    if (this._skyTexture) {
      defines.push('#define SKY_ENABLED');
    }
    return defines.join('\n');
  }
  /**
     * Computes the current camera rotation as the shader requires a camera rotation.
     */
  _computeCameraRotation (camera) {
    camera.upVector.normalize();
    const target = camera.getTarget();
    camera._initialFocalDistance = target.subtract(camera.position).length();
    if (camera.position.z === target.z) {
      camera.position.z += BABYLON.Epsilon;
    }
    const direction = target.subtract(camera.position);
    camera._viewMatrix.invertToRef(this._cameraViewMatrix);
    this._cameraRotation.x = Math.atan(this._cameraViewMatrix.m[6] / this._cameraViewMatrix.m[10]);
    if (direction.x >= 0.0) {
      this._cameraRotation.y = (-Math.atan(direction.z / direction.x) + Math.PI / 2.0);
    } else {
      this._cameraRotation.y = (-Math.atan(direction.z / direction.x) - Math.PI / 2.0);
    }
    this._cameraRotation.z = 0;
    if (isNaN(this._cameraRotation.x)) {
      this._cameraRotation.x = 0;
    }
    if (isNaN(this._cameraRotation.y)) {
      this._cameraRotation.y = 0;
    }
    if (isNaN(this._cameraRotation.z)) {
      this._cameraRotation.z = 0;
    }
  }
}
