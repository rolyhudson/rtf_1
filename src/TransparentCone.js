import React, { useRef, useEffect, useMemo } from "react";
import {
  BufferGeometry,
  Float32BufferAttribute,
  MeshBasicMaterial,
  Mesh,
  Matrix4,
  DoubleSide,
  ShaderMaterial,
  Color,
} from "three";
import { extend, useFrame } from "@react-three/fiber";

// Extend THREE with the ShaderMaterial
extend({ ShaderMaterial });
/***************************************************/
export default function TransparentCone({
  coneHeight,
  coneRadius,
  thickness,
  color,
  opacity,
}) {
  const meshRef = useRef();
  // Vertex shader
  const vertexShader = `  
attribute vec3 center;  
varying vec3 vCenter;  
void main() {  
  vCenter = center;  
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );  
}  
`;

  // Fragment shader
  const fragmentShader = `  
    uniform float thickness;  
    uniform vec3 color;  
    uniform float opacity;  
    varying vec3 vCenter;  
    void main() {  
      vec3 afwidth = fwidth( vCenter.xyz );  
      vec3 edge3 = smoothstep( ( thickness - 1.0 ) * afwidth, thickness * afwidth, vCenter.xyz );  
      float edge = 1.0 - min( min( edge3.x, edge3.y ), edge3.z );  
      gl_FragColor.rgb = mix(vec3(0.4, 0.4, 0.5), color, gl_FrontFacing ? 1.0 : 0.0);  
      gl_FragColor.a = edge * opacity;  
    }  
  `;

  const material = useMemo(
    () =>
      new ShaderMaterial({
        uniforms: {
          thickness: { value: thickness },
          color: { value: new Color(color) },
          opacity: { value: opacity },
        },
        vertexShader,
        fragmentShader,
        side: DoubleSide,
        alphaToCoverage: true, // only works when WebGLRenderer's "antialias" is set to "true"
      }),
    [thickness, color, opacity]
  );

  useEffect(() => {
    // Create an array to hold the vertices of the cone
    const vertices = [];
    const centers = [];
    const radialSegments = 32;

    // Generate vertices for the sides of the cone
    for (let i = 0; i < radialSegments; i++) {
      const theta = (i / radialSegments) * Math.PI * 2;
      const nextTheta = ((i + 1) / radialSegments) * Math.PI * 2;

      const x = coneHeight;
      const y1 = coneRadius * Math.cos(theta);
      const z1 = coneRadius * Math.sin(theta);
      const y2 = coneRadius * Math.cos(nextTheta);
      const z2 = coneRadius * Math.sin(nextTheta);

      // Tip of the cone
      vertices.push(0, 0, 0);
      centers.push(1, 0, 0);
      // First base vertex
      vertices.push(x, y1, z1);
      centers.push(0, 1, 0);
      // Second base vertex
      vertices.push(x, y2, z2);
      centers.push(0, 0, 1);
    }

    // Create the geometry and set the vertices
    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new Float32BufferAttribute(vertices, 3));
    geometry.setAttribute("center", new Float32BufferAttribute(centers, 3));
    geometry.computeVertexNormals(); // Ensure normals are computed for lighting

    // Rotate the geometry to align the cone's axis along the x-axis
    // const rotationMatrix = new Matrix4().makeRotationZ(Math.PI / 2);
    // geometry.applyMatrix4(rotationMatrix);

    // Translate the geometry to move the tip to the origin (0, 0, 0)
    // const translationMatrix = new Matrix4().makeTranslation(
    //   coneHeight / 2,
    //   0,
    //   0
    // );
    // geometry.applyMatrix4(translationMatrix);

    // Assign the geometry to the mesh
    if (meshRef.current) {
      meshRef.current.geometry = geometry;
    }
  }, [coneHeight, coneRadius]);

  return <mesh ref={meshRef} material={material}></mesh>;
}
