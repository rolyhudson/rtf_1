import React, { useRef, useState, useEffect } from "react";
import {
  BufferGeometry,
  Float32BufferAttribute,
  Matrix4,
  PointsMaterial,
  Points,
} from "three";
import { useFrame } from "@react-three/fiber";
import { LookAtObj } from "./LookAtObj";

function generateParticlePositionsCube(count, dim) {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * dim; // x
    positions[i * 3 + 1] = (Math.random() - 0.5) * dim; // y
    positions[i * 3 + 2] = (Math.random() - 0.5) * dim; // z
  }
  return positions;
}

// Function to generate random positions within a cone
function generateParticlePositionsCone(count, height, radius) {
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    // Random height along the cone
    const h = Math.random() * height;

    // Random radius at this height
    const r = (h / height) * radius * Math.sqrt(Math.random());

    // Random angle
    const theta = Math.random() * 2 * Math.PI;

    // Convert to Cartesian coordinates
    positions[i * 3] = r * Math.cos(theta); // x
    positions[i * 3 + 1] = h; // y
    positions[i * 3 + 2] = r * Math.sin(theta); // z
  }

  return positions;
}

export default function Particles(props) {
  const particleCount = 1000;
  const positions = generateParticlePositionsCone(particleCount, 10, 5);

  const bufferGeo = new BufferGeometry();
  bufferGeo.setAttribute("position", new Float32BufferAttribute(positions, 3));
  bufferGeo.computeBoundingSphere();
  let center = bufferGeo.boundingSphere.center;
  bufferGeo.applyMatrix4(new Matrix4().makeRotationX(-Math.PI / 2));
  bufferGeo.translate(-center.x, -center.y, -center.z);

  const geoRef = useRef();
  let [camera, setCamera] = useState(false);

  useFrame(() => {
    geoRef.current.rotation.y += 0.001;

    // const positions = geoRef.current.geometry.attributes.position.array;
    // for (let i = 0; i < particleCount; i++) {
    //   // Simple oscillation logic
    //   positions[i * 3 + 1] += Math.sin((Date.now() + i * 100) * 0.001) * 0.01; // y
    // }
    // geoRef.current.geometry.attributes.position.needsUpdate = true; // notify Three.js that positions have been updated
  });

  useFrame((state) => {
    if (geoRef.current && !camera) {
      if (geoRef.current.geometry.attributes.position.count === 0) return;
      let c = LookAtObj(geoRef.current.geometry);
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
    <points ref={geoRef} visible geometry={bufferGeo}>
      <pointsMaterial attach="material" color="black" size={0.2} />
    </points>
  );
}
