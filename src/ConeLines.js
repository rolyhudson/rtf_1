import React, { useRef, useEffect } from "react";
import { BufferGeometry, Float32BufferAttribute } from "three";

/***************************************************/

export default function ConeLines({ coneHeight, coneRadius }) {
  const linesRef = useRef();

  useEffect(() => {
    // Create an array to hold the vertices of the lines
    const vertices = [];
    const radialSegments = 16;
    // The tip of the cone is at (0, height / 2, 0) after translation
    const tip = [0, 0, 0];

    for (let i = 0; i <= radialSegments; i++) {
      const theta = (i / radialSegments) * Math.PI * 2;
      const y = coneRadius * Math.cos(theta);
      const z = coneRadius * Math.sin(theta);
      const x = coneHeight;

      // Push the tip vertex and the base vertex to create a line
      vertices.push(...tip, x, y, z);

      // Create the geometry and set the vertices
      const geometry = new BufferGeometry();
      geometry.setAttribute(
        "position",
        new Float32BufferAttribute(vertices, 3)
      );
      //geometry.applyMatrix4(new Matrix4().makeRotationX(-Math.PI / 2));
      // Assign the geometry to the lines mesh
      linesRef.current.geometry = geometry;
    }
  }, [coneHeight, coneRadius]);

  return (
    <lineSegments ref={linesRef}>
      <lineBasicMaterial color="cyan" transparent opacity={0.5} />
    </lineSegments>
  );
}
