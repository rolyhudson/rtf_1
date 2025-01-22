import React, { useRef, useState, useEffect } from "react";
import {
  Vector3,
  BufferGeometry,
  Float32BufferAttribute,
  AxesHelper,
} from "three";
import ConeLines from "./ConeLines";
import TransparentCone from "./TransparentCone";
import { StackControls } from "./StackControls";
import { useFrame, useThree } from "@react-three/fiber";
import { LookAtObj } from "./LookAtObj";

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

function hsvToRgb(h, s, v) {
  let r, g, b;
  let i = Math.floor(h * 6);
  let f = h * 6 - i;
  let p = v * (1 - s);
  let q = v * (1 - f * s);
  let t = v * (1 - (1 - f) * s);

  switch (i % 6) {
    case 0:
      r = v;
      g = t;
      b = p;
      break;
    case 1:
      r = q;
      g = v;
      b = p;
      break;
    case 2:
      r = p;
      g = v;
      b = t;
      break;
    case 3:
      r = p;
      g = q;
      b = v;
      break;
    case 4:
      r = t;
      g = p;
      b = v;
      break;
    case 5:
      r = v;
      g = p;
      b = q;
      break;
  }

  return [r, g, b];
}

/***************************************************/

function cloudGeometry(positions) {
  const bufferGeo = new BufferGeometry();
  const vertices = [];
  const colors = [];
  let p = 0;
  let totalElements = positions.flat().length;
  positions.flat().forEach((element) => {
    vertices.push(element.location.x, element.location.y, element.location.z);
    let hue = 0.9 + (p / totalElements) * 0.17; // Vary hue between 0.83 (300°) and 1.0 (360° or 0°)

    // Convert HSV to RGB
    let [r, g, b] = hsvToRgb(hue, 1, 1);
    colors.push(r, g, b, 0.5);
    p++;
  });
  bufferGeo.setAttribute("position", new Float32BufferAttribute(vertices, 3));
  bufferGeo.setAttribute("color", new Float32BufferAttribute(colors, 3));
  return bufferGeo;
}

/***************************************************/

function stackLineGeometry(positions, lineData) {
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
  bufferGeo.computeBoundingSphere();
  return bufferGeo;
}

/***************************************************/

function setStackLineIndices(positions) {
  const lineIndices = [];
  for (const cluster of positions) {
    const clusterIndices = [];
    const ptCount = cluster.length;
    let lineCount = getRandomInt(1, ptCount * 2);
    for (let i = 0; i < lineCount; i++) {
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

function interStackLineGeometry(positions, lineData) {
  const bufferGeo = new BufferGeometry();
  const lineCoords = new Float32Array(lineData.flat().length * 6);
  let i = 0;

  for (const cluster of lineData) {
    for (const line of cluster) {
      const ptStartData = positions[line.startCluster];
      const ptEndData = positions[line.endCluster];
      if (ptStartData === undefined || ptEndData === undefined) continue;

      let start = line.start;
      let end = line.end;
      if (ptStartData.length - 1 < start || ptEndData.length - 1 < end)
        continue;
      lineCoords[i * 6] = ptStartData[start].location.x;
      lineCoords[i * 6 + 1] = ptStartData[start].location.y;
      lineCoords[i * 6 + 2] = ptStartData[start].location.z;
      lineCoords[i * 6 + 3] = ptEndData[end].location.x;
      lineCoords[i * 6 + 4] = ptEndData[end].location.y;
      lineCoords[i * 6 + 5] = ptEndData[end].location.z;

      i++;
    }
  }
  bufferGeo.setAttribute("position", new Float32BufferAttribute(lineCoords, 3));
  return bufferGeo;
}

/***************************************************/

function setInterStackLineIndices(positions, stackOrder) {
  const lineIndices = [];
  //order is cluster order from origin
  for (let i = 0; i < stackOrder.length - 1; i++) {
    const startIndex = stackOrder[i];
    const endIndex = stackOrder[i + 1];
    const startStack = positions[startIndex];
    const endStack = positions[endIndex];
    let lineCount = getRandomInt(1, 5);
    const spanIndices = [];
    for (let i = 0; i < lineCount; i++) {
      let start = getRandomInt(0, startStack.length - 1);
      let end = getRandomInt(0, endStack.length - 1);

      while (start === end) end = getRandomInt(0, endStack.length - 1);
      const index = spanIndices.findIndex(
        (pair) => pair.start === start && pair.end === end
      );
      if (index === -1)
        spanIndices.push({
          startCluster: startIndex,
          endCluster: endIndex,
          start: start,
          end: end,
        });
    }
    lineIndices.push(spanIndices);
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

function getStackOrder(positions) {
  // Step 1: Calculate distances from the origin and store with original indices
  const vectorsWithDistances = positions.map((vector, index) => {
    const distance = vector.lengthSq(); // Distance from the origin (0, 0, 0)
    return { index, distance };
  });
  // Step 2: Sort the array of objects by distance
  vectorsWithDistances.sort((a, b) => a.distance - b.distance);

  // Step 3: Extract the sorted indices
  const sortedIndices = vectorsWithDistances.map((item) => item.index);
  return sortedIndices;
}

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

  const [stackOrder, setStackOrder] = useState([]);

  useEffect(() => {
    if (stackPositions.length === 0) return;
    setStackOrder(getStackOrder(stackPositions));
  }, [stackPositions]);

  /***********************/

  const [particleData, setParticleData] = useState([]);

  useEffect(() => {
    if (stackPositions.length === 0) return;
    setParticleData(
      positionsInStack(stackPositions, stackDim, minPts, maxPts, particleSpeed)
    );
  }, [stackPositions, stackDim, minPts, maxPts, particleSpeed]);

  /***********************/

  const [cloudBuffer, setCloudBuffer] = useState(new BufferGeometry());

  useEffect(() => {
    if (particleData.length === 0) return;
    setCloudBuffer(cloudGeometry(particleData));
  }, [particleData]);

  /***********************/

  const [stackLineData, setStackLineData] = useState([]);

  useEffect(() => {
    if (particleData.length === 0) return;
    setStackLineData(setStackLineIndices(particleData));
  }, [particleData.flat().length]);

  /***********************/

  const [stackLineBuffer, setStackLineBuffer] = useState(new BufferGeometry());

  useEffect(() => {
    if (particleData.length === 0 || stackLineData.length === 0) return;
    setStackLineBuffer(stackLineGeometry(particleData, stackLineData));
  }, [particleData]);

  /***********************/

  const [interStackLineData, setInterStackLineData] = useState([]);

  useEffect(() => {
    if (particleData.length === 0) return;
    setInterStackLineData(setInterStackLineIndices(particleData, stackOrder));
  }, [particleData.flat().length]);

  /***********************/

  const [interStackLineBuffer, setInterStackLineBuffer] = useState(
    new BufferGeometry()
  );

  useEffect(() => {
    if (particleData.length === 0 || interStackLineData.length === 0) return;
    setInterStackLineBuffer(
      interStackLineGeometry(particleData, interStackLineData)
    );
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

  /***********************/

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <points visible geometry={cloudBuffer}>
        <pointsMaterial attach="material" vertexColors size={0.2} />
      </points>
      <TransparentCone
        coneHeight={coneHeight}
        coneRadius={coneRadius}
        thickness={1}
        color={"skyblue"}
        opacity={0.2}
      />
      <lineSegments geometry={stackLineBuffer}>
        <lineBasicMaterial attach="material" color="white" />
      </lineSegments>
      <lineSegments geometry={interStackLineBuffer}>
        <lineBasicMaterial color="white" transparent opacity={0.2} />
      </lineSegments>
      <Scene />
    </>
  );
}
