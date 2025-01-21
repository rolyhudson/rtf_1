import React, { useRef, useState, useEffect } from "react";
import { useControls } from "leva";
import {
  Vector3,
  ConeGeometry,
  Matrix4,
  LineSegments,
  LineBasicMaterial,
  BufferGeometry,
  Float32BufferAttribute,
} from "three";
//import { PointProvider } from "./PointContext";
import { useFrame } from "@react-three/fiber";

import BoxParticles from "./BoxParticles";

const ConeLines = ({ coneHeight, coneRadius }) => {
  const linesRef = useRef();

  useEffect(() => {
    // Create an array to hold the vertices of the lines
    const vertices = [];
    const radialSegments = 16;
    // The tip of the cone is at (0, height / 2, 0) after translation
    const tip = [0, 0, 0];

    for (let i = 0; i <= radialSegments; i++) {
      const theta = (i / radialSegments) * Math.PI * 2;
      const x = coneRadius * Math.cos(theta);
      const z = coneRadius * Math.sin(theta);
      const y = coneHeight;

      // Push the tip vertex and the base vertex to create a line
      vertices.push(...tip, x, y, z);

      // Create the geometry and set the vertices
      const geometry = new BufferGeometry();
      geometry.setAttribute(
        "position",
        new Float32BufferAttribute(vertices, 3)
      );
      geometry.applyMatrix4(new Matrix4().makeRotationX(-Math.PI / 2));
      // Assign the geometry to the lines mesh
      linesRef.current.geometry = geometry;
    }
  }, [coneHeight, coneRadius]);

  return (
    <lineSegments ref={linesRef}>
      <lineBasicMaterial color="blue" transparent opacity={0.1} />
    </lineSegments>
  );
};

/***************************************************/

function generateBoxPositions(coneHeight, coneRadius, nBoxes) {
  const boxPositions = [];

  for (let i = 0; i < nBoxes; i++) {
    // Random height along the cone
    const h = Math.random() * coneHeight;

    // Random radius at this height
    const r = (h / coneHeight) * coneRadius * Math.sqrt(Math.random());

    // Random angle
    const theta = Math.random() * 2 * Math.PI;

    // Convert to Cartesian coordinates
    const x = r * Math.cos(theta); // x
    const y = h; // y
    const z = r * Math.sin(theta); // z
    boxPositions.push(new Vector3(x, y, z));
  }
  return boxPositions;
}

/***************************************************/

export default function BoxController() {
  const {
    maxPts,
    minPts,
    boxDim,
    nBoxes,
    coneHeight,
    coneRadius,
    particleSpeed,
  } = useControls({
    maxPts: {
      value: 9,
      min: 2,
      max: 200,
    },
    minPts: {
      value: 4,
      min: 2,
      max: 200,
    },
    nBoxes: {
      value: 1,
      min: 1,
      max: 50,
      step: 1,
    },
    boxDim: {
      value: 4,
      min: 2,
      max: 10,
    },
    coneHeight: {
      value: 50,
      min: 2,
      max: 100,
    },
    coneRadius: {
      value: 20,
      min: 2,
      max: 100,
    },
    particleSpeed: {
      value: 0.02,
      min: 0.001,
      max: 0.2,
    },
  });

  const [boxPositions, setBoxPositions] = useState([]);

  useEffect(() => {
    setBoxPositions(generateBoxPositions(coneHeight, coneRadius, nBoxes));
  }, [coneHeight, coneRadius, nBoxes]);

  return (
    <>
      {/* <PointProvider> */}
      {boxPositions.map((position, index) => (
        <BoxParticles
          key={index}
          center={position}
          minPts={minPts}
          maxPts={maxPts}
          dim={boxDim}
          particleSpeed={particleSpeed}
          name={"box_" + index}
        />
      ))}
      <ConeLines coneHeight={coneHeight} coneRadius={coneRadius} />
      {/* </PointProvider> */}
    </>
  );
}
