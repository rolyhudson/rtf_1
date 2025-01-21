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
  AxesHelper,
} from "three";
import ConeLines from "./ConeLines";
import { StackControls } from "./StackControls";
import { useFrame } from "@react-three/fiber";

/***************************************************/

function positionsInCone(coneHeight, coneRadius, n) {
  const positions = [];

  for (let i = 0; i < n; i++) {
    // Random height along the cone
    const h = Math.random() * coneHeight;

    // Random radius at this height
    const r = (h / coneHeight) * coneRadius * Math.sqrt(Math.random());

    // Random angle
    const theta = Math.random() * 2 * Math.PI;

    // Convert to Cartesian coordinates
    const y = r * Math.cos(theta); // x
    const x = h; // y
    const z = r * Math.sin(theta); // z
    positions.push(new Vector3(x, y, z));
  }
  return positions;
}

/***************************************************/

function positionsInStack(
  stackPositions,
  stackRad,
  minPts,
  maxPts,
  particleSpeed
) {
  const positions = [];

  for (let i = 0; i < stackPositions.length; i++) {
    const nPts = getRandomInt(minPts, maxPts);
    const center = stackPositions[i];
    const cluster = [];
    for (let p = 0; p < nPts; p++) {
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      const distance = Math.random() * stackRad;
      const x = center.x + distance * Math.sin(phi) * Math.cos(theta);
      const y = center.y + distance * Math.sin(phi) * Math.sin(theta);
      const z = center.z + distance * Math.cos(phi);
      const speed = new Vector3(
        -particleSpeed / 2 + Math.random() * particleSpeed,
        -particleSpeed / 2 + Math.random() * particleSpeed,
        -particleSpeed / 2 + Math.random() * particleSpeed
      );
      cluster.push({ location: new Vector3(x, y, z), speed: speed });
    }
    positions.push(cluster);
  }
  return positions;
}

/***************************************************/

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/***************************************************/

function centroid(points) {
  let x = 0;
  let y = 0;
  let z = 0;
  for (const point of points) {
    x += point.x;
    y += point.y;
    z += point.z;
  }

  return new Vector3(x / points.length, y / points.length, z / points.length);
}

/***************************************************/

function cloudGeometry(positions) {
  const bufferGeo = new BufferGeometry();
  const vertices = [];
  positions.flat().forEach((element) => {
    vertices.push(element.location.x, element.location.y, element.location.z);
  });
  bufferGeo.setAttribute("position", new Float32BufferAttribute(vertices, 3));
  return bufferGeo;
}

/***************************************************/

function lineGeometry(positions, lineData) {
  const bufferGeo = new BufferGeometry();
  const lineCoords = new Float32Array(lineData.flat().length * 6);
  let i = 0;
  let c = 0;
  for (const cluster of lineData) {
    const ptData = positions[c];
    if (ptData === undefined) continue;
    for (const line of cluster) {
      let start = line.start;
      let end = line.end;
      if (ptData.length - 1 < start || ptData.length - 1 < end) continue;
      lineCoords[i * 6] = ptData[start].location.x;
      lineCoords[i * 6 + 1] = ptData[start].location.y;
      lineCoords[i * 6 + 2] = ptData[start].location.z;
      lineCoords[i * 6 + 3] = ptData[end].location.x;
      lineCoords[i * 6 + 4] = ptData[end].location.y;
      lineCoords[i * 6 + 5] = ptData[end].location.z;

      i++;
    }
    c++;
  }

  bufferGeo.setAttribute("position", new Float32BufferAttribute(lineCoords, 3));
  return bufferGeo;
}

/***************************************************/

function setLineIndices(positions) {
  const lineIndices = [];
  for (const cluster of positions) {
    const clusterIndices = [];
    const ptCount = cluster.length;
    let lineCount = getRandomInt(1, ptCount * 2);
    for (let i = 0; i < lineCount - 1; i++) {
      let start = getRandomInt(0, ptCount - 1);
      let end = getRandomInt(0, ptCount - 1);
      while (start === end) end = getRandomInt(0, ptCount - 1);
      const index = clusterIndices.findIndex(
        (pair) => pair.start === start && pair.end === end
      );
      if (index === -1) clusterIndices.push({ start: start, end: end });
    }
    lineIndices.push(clusterIndices);
  }
  return lineIndices;
}

/***************************************************/

function Scene() {
  const axesRef = useRef();

  useEffect(() => {
    // Create an AxesHelper and add it to the scene
    const axesHelper = new AxesHelper(2.5);
    axesRef.current.add(axesHelper);
  }, []);

  return <group ref={axesRef}>{/* Other scene objects */}</group>;
}

/***************************************************/

export default function StackCloud() {
  const {
    maxPts,
    minPts,
    stackDim,
    nStacks,
    coneHeight,
    coneRadius,
    particleSpeed,
  } = StackControls();

  /***********************/

  const [stackPositions, setStackPositions] = useState([]);

  useEffect(() => {
    const p = positionsInCone(coneHeight, coneRadius, nStacks);
    setStackPositions(p);
  }, [coneHeight, coneRadius, nStacks]);

  /***********************/

  const [particleData, setParticleData] = useState([]);

  useEffect(() => {
    if (stackPositions.length == 0) return;
    setParticleData(
      positionsInStack(stackPositions, stackDim, minPts, maxPts, particleSpeed)
    );
  }, [stackPositions, stackDim, minPts, maxPts, particleSpeed]);

  /***********************/

  const [cloudBuffer, setCloudBuffer] = useState(new BufferGeometry());

  useEffect(() => {
    if (particleData.length == 0) return;
    setCloudBuffer(cloudGeometry(particleData));
  }, [particleData]);

  const [lineData, setLineData] = useState([]);

  useEffect(() => {
    if (particleData.length == 0) return;
    setLineData(setLineIndices(particleData));
  }, [particleData.flat().length]);

  /***********************/

  const [lineBuffer, setLineBuffer] = useState(new BufferGeometry());

  useEffect(() => {
    if (particleData.length == 0 || lineData.length == 0) return;
    setLineBuffer(lineGeometry(particleData, lineData));
  }, [particleData]);

  /***********************/

  useFrame(() => {
    const dataUpdate = [];
    const sqStackDim = stackDim * stackDim;
    for (const cluster of particleData) {
      const clusterUpdate = [];
      const locations = cluster.map((obj) => obj.location);
      const clusterCentroid = centroid(locations);
      for (const element of cluster) {
        const newPos = element.location.add(element.speed);
        const sqDist = clusterCentroid.distanceToSquared(newPos);
        if (sqDist > sqStackDim) {
          clusterUpdate.push({
            location: newPos,
            speed: element.speed.negate(),
          });
        } else {
          clusterUpdate.push({ location: newPos, speed: element.speed });
        }
      }
      dataUpdate.push(clusterUpdate);
    }

    setParticleData(dataUpdate);
  });

  return (
    <>
      <points visible geometry={cloudBuffer}>
        <pointsMaterial attach="material" color="black" size={0.2} />
      </points>
      <ConeLines coneHeight={coneHeight} coneRadius={coneRadius} />
      <lineSegments geometry={lineBuffer}>
        <lineBasicMaterial attach="material" color="black" />
      </lineSegments>
      <Scene />
    </>
  );
}
