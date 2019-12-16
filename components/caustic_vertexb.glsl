precision highp float;

attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;

uniform mat4 view;
uniform mat4 projection;
uniform mat4 worldViewProjection;
uniform vec2 cameraMinMaxZ;

varying vec2 vUV;
varying vec3 vNormal;
varying vec3 vPosition;
// varying float normalizedDepth;

#include<bonesDeclaration>
#include<instancesDeclaration>

/*
 * Vertex shader for caustic and babylonjs.
 */
void main() {
    vec3 positionUpdated = position;

    // include shaders to calculate instances and bones
    #include<instancesVertex>
    #include<bonesVertex>

    // return normal, uv and position
    vec4 worldPos = finalWorld * vec4(positionUpdated, 1.0);
    vec4 viewPos = view * worldPos;

    // float distancetoCamera = -viewPos.z;
    // float distance = (cameraMinMaxZ.x + (cameraMinMaxZ.y - cameraMinMaxZ.x)*depth);
    // float normalizedDistance = distance / cameraMinMaxZ.x;
    // normalizedDepth = (distancetoCamera - cameraMinMaxZ.x)/(cameraMinMaxZ.y - cameraMinMaxZ.x);

    vNormal = normalize(vec3(finalWorld * vec4(normal, 0.0)));
    vPosition = worldPos.xyz;
    vUV = uv;

    gl_Position = projection * viewPos;
}
