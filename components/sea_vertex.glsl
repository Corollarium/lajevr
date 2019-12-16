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

#include<bonesDeclaration>
#include<instancesDeclaration>

void main() {
    vec3 positionUpdated = position;

    // include shaders to calculate instances and bones
    #include<instancesVertex>
    #include<bonesVertex>

    // return normal, uv and position
    vec4 worldPos = finalWorld * vec4(positionUpdated, 1.0);
    vec4 viewPos = view * worldPos;

    vNormal = normalize(vec3(finalWorld * vec4(normal, 0.0)));
    vPosition = worldPos.xyz;
    // TODO vUV = uv * uvRepeat + uvOffset;
    vUV = uv;

    gl_Position = projection * viewPos;
}
