import { useRef, useState, useMemo, useEffect } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

const Line = ({ curve, width, color, speed, delay, maxPoints }) => {
  const material = useRef(null);
  const geometry = useRef(null);
  const [points, setPoints] = useState([]);
  const [active, setActive] = useState(false);
  const [currentPoint, setCurrentPoint] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Pre-calculate all points along the curve
  const allPoints = useMemo(() => {
    const totalPoints = 1000; // High resolution for smooth curve
    const calculatedPoints = [];
    for (let i = 0; i <= totalPoints; i++) {
      calculatedPoints.push(curve.getPoint(i / totalPoints));
    }
    return calculatedPoints;
  }, [curve]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setActive(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  useFrame((_, delta) => {
    if (!active) return;

    setElapsedTime((prev) => prev + delta);

    // Update points based on elapsed time and speed
    const newPointIndex = Math.min(
      Math.floor(elapsedTime * speed * 100),
      allPoints.length - 1
    );

    if (newPointIndex > currentPoint) {
      setCurrentPoint(newPointIndex);
      // Add points up to the current index, but limit to maxPoints
      const newPoints = allPoints.slice(0, newPointIndex + 1);

      // If we exceed maxPoints, remove older points
      const startIndex = Math.max(0, newPoints.length - maxPoints);
      const trimmedPoints = newPoints.slice(startIndex);

      setPoints(trimmedPoints);

      // Update the geometry
      if (geometry.current) {
        const positions = new Float32Array(trimmedPoints.length * 3);
        trimmedPoints.forEach((point, i) => {
          positions[i * 3] = point.x;
          positions[i * 3 + 1] = point.y;
          positions[i * 3 + 2] = point.z;
        });

        geometry.current.setAttribute(
          "position",
          new THREE.BufferAttribute(positions, 3)
        );

        geometry.current.computeBoundingSphere();
      }
    }
  });

  return (
    <line>
      <bufferGeometry ref={geometry} attach="geometry" />
      <lineBasicMaterial
        ref={material}
        color={color}
        linewidth={width}
        linecap="round"
        linejoin="round"
      />
    </line>
  );
};

const generateConicCurve = () => {
  // Random direction
  const theta = Math.random() * Math.PI * 2; // Random angle around the circle
  const phi = (Math.random() * Math.PI) / 3 + Math.PI / 6; // Random angle from the vertical (limited to a cone)

  // Convert spherical to Cartesian for direction
  const dirX = Math.sin(phi) * Math.cos(theta);
  const dirY = Math.sin(phi) * Math.sin(theta);
  const dirZ = Math.cos(phi);

  // Control points for the curve
  const start = new THREE.Vector3(0, 0, 0);
  const end = new THREE.Vector3(
    dirX * (10 + Math.random() * 10),
    dirY * (10 + Math.random() * 10),
    dirZ * (10 + Math.random() * 10)
  );

  // Add some curvature
  const midPoint1 = new THREE.Vector3(
    dirX * 3 + (Math.random() - 0.5) * 2,
    dirY * 3 + (Math.random() - 0.5) * 2,
    dirZ * 3 + (Math.random() - 0.5) * 2
  );

  const midPoint2 = new THREE.Vector3(
    dirX * 7 + (Math.random() - 0.5) * 4,
    dirY * 7 + (Math.random() - 0.5) * 4,
    dirZ * 7 + (Math.random() - 0.5) * 4
  );

  // Create a cubic Bezier curve
  const curve = new THREE.CubicBezierCurve3(start, midPoint1, midPoint2, end);

  return curve;
};

const ConicLines = () => {
  // Generate lines with random properties
  const lines = useMemo(() => {
    const lineCount = 40;
    return Array.from({ length: lineCount }, (_, i) => {
      // Generate a curve for this line
      const curve = generateConicCurve();

      // Random width between 1 and 5
      const width = Math.random() * 4 + 1;

      // Random color from a palette
      const colors = [
        "#ff3366",
        "#33ccff",
        "#ffcc33",
        "#33ff99",
        "#ff99cc",
        "#99ccff",
        "#ff6633",
        "#66ff33",
        "#cc33ff",
      ];
      const color = colors[Math.floor(Math.random() * colors.length)];

      // Random speed and delay
      const speed = Math.random() * 2 + 0.5;
      const delay = Math.random() * 5000; // Delay up to 5 seconds

      // Max points to keep (for performance)
      const maxPoints = Math.floor(Math.random() * 50) + 50;

      return { curve, width, color, speed, delay, maxPoints };
    });
  }, []);

  return (
    <div className="App h-screen w-full">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <group>
          {lines.map((line, index) => (
            <Line key={index} {...line} />
          ))}
        </group>
        <OrbitControls />
      </Canvas>
    </div>
  );
};

export default ConicLines;
