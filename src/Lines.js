import React, { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { coords } from "./facadeMarkers";
import { BufferGeometry, Float32BufferAttribute, Matrix4 } from "three";
import { LookAtObj } from "./LookAtObj";

export default function Lines(props) {
  const bufferGeo = new BufferGeometry();
  bufferGeo.setAttribute("position", new Float32BufferAttribute(coords, 3));
  bufferGeo.computeBoundingSphere();
  let center = bufferGeo.boundingSphere.center;
  bufferGeo.applyMatrix4(new Matrix4().makeRotationX(-Math.PI / 2));
  bufferGeo.translate(-center.x, -center.y, -center.z);

  const geoRef = useRef();

  let [camera, setCamera] = useState(false);

  useFrame(() => {
    geoRef.current.rotation.y += 0.001;
  });

  useFrame((state) => {
    if (geoRef.current && !camera) {
      if (geoRef.current.geometry.attributes.position.count === 0) return;
      let c = LookAtObj(geoRef.current.geometry);
      //   console.log("from useframe", c);
      state.camera.position.set(c.position.x, c.position.y, c.position.z);
      state.camera.far = c.far * 2;
      state.camera.near = c.near;
      state.camera.fov = 35;
      state.camera.aspect = c.aspect;
      state.camera.updateProjectionMatrix();
      setCamera(true);
    }
  });

  useEffect((state) => {}, []);

  return (
    <lineSegments ref={geoRef} visible geometry={bufferGeo}>
      <lineBasicMaterial attach="material" color="black" />
    </lineSegments>
  );
}
