import { useMemo } from "react";
const Emitter = ({ emitterWidth, emitterHeight, startX }) => {
  // Create simple rectangle vertices (2D in the XY plane)
  const rectangleVertices = useMemo(() => {
    const halfHeight = emitterHeight / 2;
    const halfWidth = emitterWidth / 2;
    // Create 4 vertices for the rectangle
    return [
      [startX, -halfHeight, -halfWidth], // Bottom left
      [startX, -halfHeight, +halfWidth], // Bottom right
      [startX, halfHeight, +halfWidth], // Top right
      [startX, halfHeight, -halfWidth], // Top left
    ];
  }, []);

  // Create indices for the lines of the rectangle
  const rectangleEdges = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 0],
  ];

  return (
    <group>
      {rectangleEdges.map((edge, idx) => (
        <line key={idx}>
          <bufferGeometry>
            <float32BufferAttribute
              attach="attributes-position"
              array={
                new Float32Array([
                  ...rectangleVertices[edge[0]],
                  ...rectangleVertices[edge[1]],
                ])
              }
              count={2}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#4080ff" linewidth={1} />
        </line>
      ))}
    </group>
  );
};

export default Emitter;
