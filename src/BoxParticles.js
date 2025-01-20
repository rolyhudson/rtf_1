import React, { useRef, useState, useEffect } from "react";
import {
  BufferGeometry,
  Float32BufferAttribute,
  Matrix4,
  EdgesGeometry,
  BoxGeometry,
  Vector3,
} from "three";
import { useFrame } from "@react-three/fiber";
import { usePoints } from "./PointContext";
let particleData = [];
let lineData = [];

/***************************************************/

function generatepositionsCube(countMin, countMax, dim) {
  const count = getRandomInt(countMin, countMax);
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * dim; // x
    positions[i * 3 + 1] = (Math.random() - 0.5) * dim; // y
    positions[i * 3 + 2] = (Math.random() - 0.5) * dim; // z
  }

  return positions;
}

/***************************************************/

function getRandomInt(min, max) {
  // Ensure min and max are integers
  min = Math.ceil(min);
  max = Math.floor(max);
  // Generate a random integer between min (inclusive) and max (inclusive)
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/***************************************************/

function CubeWithEdges({ dim = 1 }) {
  const cubeRef = React.useRef();

  // Create a box geometry
  const geometry = new BoxGeometry(dim, dim, dim);
  // Create edges geometry from the box geometry
  const edges = new EdgesGeometry(geometry);

  return (
    <group ref={cubeRef}>
      <lineSegments geometry={edges}>
        <lineBasicMaterial
          attach="material"
          color="black"
          transparent
          opacity={0.1}
        />
      </lineSegments>
    </group>
  );
}

/***************************************************/

function LinesBetweenPoints(positions) {
  lineData = [];
  // Create line segments geometry by connecting pairs of points
  let ptCount = positions.length / 3;

  let lineCount = getRandomInt(ptCount, ptCount * 2);

  for (let i = 0; i < lineCount - 1; i++) {
    let start = getRandomInt(0, ptCount);
    let end = getRandomInt(0, ptCount);
    while (start === end) end = getRandomInt(0, ptCount);

    lineData.push({ start: start, end: end });
  }
}

/***************************************************/

export default function BoxParticles({
  center,
  maxPts,
  minPts,
  dim,
  particleSpeed,
}) {
  //const { points, setPoints } = usePoints();
  const positions = generatepositionsCube(minPts, maxPts, dim);
  LinesBetweenPoints(positions);
  particleData = [];
  for (const p of positions) {
    particleData.push({
      velocity: new Vector3(
        -particleSpeed / 2 + Math.random() * particleSpeed,
        -particleSpeed / 2 + Math.random() * particleSpeed,
        -particleSpeed / 2 + Math.random() * particleSpeed
      ),
      numConnections: 0,
    });
  }
  const bufferGeo = new BufferGeometry();
  bufferGeo.setAttribute("position", new Float32BufferAttribute(positions, 3));
  //bufferGeo.computeBoundingSphere();
  //let center = bufferGeo.boundingSphere.center;
  //bufferGeo.applyMatrix4(new Matrix4().makeRotationX(-Math.PI / 2));
  //bufferGeo.translate(-center.x, -center.y, -center.z);
  const lineGeometry = new BufferGeometry();
  const geoRef = useRef();

  // useEffect(() => {
  //   // Register points when the component mounts
  //   setPoints((prevPoints) => [...prevPoints, ...positions]);

  //   return () => {
  //     // Cleanup points when the component unmounts
  //     setPoints((prevPoints) =>
  //       prevPoints.filter((p) => !positions.includes(p))
  //     );
  //   };
  // }, [positions, setPoints]);

  useFrame(() => {
    const rHalf = dim / 2;
    //console.log(center);
    for (let i = 0; i < positions.length / 3; i++) {
      // get the particle
      const pData = particleData[i];
      positions[i * 3] += pData.velocity.x;
      positions[i * 3 + 1] += pData.velocity.y;
      positions[i * 3 + 2] += pData.velocity.z;

      if (
        positions[i * 3 + 1] < center.y - rHalf ||
        positions[i * 3 + 1] > center.y + rHalf
      )
        pData.velocity.y = -pData.velocity.y;
      if (
        positions[i * 3] < center.x - rHalf ||
        positions[i * 3] > center.x + rHalf
      )
        pData.velocity.x = -pData.velocity.x;
      if (
        positions[i * 3 + 2] < center.z - rHalf ||
        positions[i * 3 + 2] > center.z + rHalf
      )
        pData.velocity.z = -pData.velocity.z;
    }
    const lineCoords = new Float32Array(lineData.length * 6);
    for (let i = 0; i < lineData.length; i++) {
      let start = lineData[i].start;
      let end = lineData[i].end;
      lineCoords[i * 6] = positions[start * 3];
      lineCoords[i * 6 + 1] = positions[start * 3 + 1];
      lineCoords[i * 6 + 2] = positions[start * 3 + 2];
      lineCoords[i * 6 + 3] = positions[end * 3];
      lineCoords[i * 6 + 4] = positions[end * 3 + 1];
      lineCoords[i * 6 + 5] = positions[end * 3 + 2];
    }

    lineGeometry.setAttribute(
      "position",
      new Float32BufferAttribute(lineCoords, 3)
    );

    bufferGeo.setAttribute(
      "position",
      new Float32BufferAttribute(positions, 3)
    );
  });

  const groupRef = useRef();

  // Translate the group once after the component mounts
  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.position.set(center.x, center.y, center.z); // Translate the group to the box centre
      groupRef.current.applyMatrix4(new Matrix4().makeRotationX(-Math.PI / 2));
    }
  }, [center]);

  return (
    <group ref={groupRef}>
      <points visible geometry={bufferGeo}>
        <pointsMaterial attach="material" color="black" size={0.2} />
      </points>
      <CubeWithEdges dim={dim} />
      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial attach="material" color="black" />
      </lineSegments>
    </group>
  );
}
