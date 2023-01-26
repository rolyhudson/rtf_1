import * as THREE from "three";

export function LookAtObj(bufferGeo) {
  let fov = 0.610865; //35 degrees  m
  let camDist = bufferGeo.boundingSphere.radius / Math.sin(fov / 2); //to fit bounding sphere in view
  camDist = camDist * 0.5; // zoom in a little
  let camera = new THREE.PerspectiveCamera(
    35,
    window.innerWidth / window.innerHeight,
    1,
    camDist * 2 // is is the far clip doubling ensures whole model is included
  );
  camera.position.set(
    bufferGeo.boundingSphere.center.x + camDist,
    bufferGeo.boundingSphere.center.y,
    bufferGeo.boundingSphere.center.z + camDist
  );

  return camera;
}
