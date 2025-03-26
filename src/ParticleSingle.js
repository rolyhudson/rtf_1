import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import Emitter from "./Emitter";

const SingleParticleFlow = ({ emitterWidth, emitterHeight, startX }) => {
  const points = useRef();
  const veerOffX = Math.random() * 4 + 4; // X position at which the particle starts to veer off
  const veerOffAngle = Math.PI / 6; // 45 degrees in radians
  const particleSpeed = 0.2 + Math.random() * 1.4;

  // Length of the visualization area (x-axis)
  const visualizationLength = 8;
  // Generate initial particle positions and speeds
  const particlesData = useMemo(() => {
    const positions = new Float32Array(300 * 3); // 30 particles in the trail
    const speeds = new Float32Array(300); // 30 particles in the trail
    const y = (Math.random() - 0.5) * emitterHeight;
    const z = (Math.random() - 0.5) * emitterWidth;
    for (let i = 0; i < 300; i++) {
      const x = startX + i * 0.01; // Slightly offset each particle in X axis to create a trail effect

      positions.set([x, y, z], i * 3);
      speeds[i] = particleSpeed;
    }

    return { positions, speeds };
  }, [emitterHeight, emitterWidth, startX, particleSpeed]);

  // Shader code updated for a single particle
  const vertexShader = `
    attribute float speed;
    uniform float uTime;
    
    varying vec3 vPosition;
    
    void main() {
      vPosition = position;
      
      // Calculate new x position based on time and speed
      vec3 pos = position;
      pos.x = mod(position.x + speed * uTime, ${visualizationLength.toFixed(
        1
      )}) + ${startX.toFixed(1)};
      
      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_PointSize = 10.0 * (1.0 - pos.x / ${visualizationLength.toFixed(1)});
      gl_Position = projectionMatrix * mvPosition;
    }
  `;

  const fragmentShader = `
    varying vec3 vPosition;
    
    void main() {
      // Fade particles as they move right
      float alpha = 4.0*(vPosition.x - ${startX.toFixed(
        1
      )}) / ${visualizationLength.toFixed(1)};
      vec3 color = mix(vec3(0.1, 0.4, 1.0), vec3(0.5, 0.8, 1.0), alpha);
      
      // Create circular particles
      float strength = distance(gl_PointCoord, vec2(0.5));
      strength = 1.0 - strength;
      strength = pow(strength, 3.0);
      
      gl_FragColor = vec4(color, alpha * strength);
    }
  `;

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0.0 },
    }),
    []
  );

  useFrame((state) => {
    const { clock } = state;
    if (points.current) {
      points.current.material.uniforms.uTime.value = clock.elapsedTime;
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlesData.positions.length / 3}
          array={particlesData.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-speed"
          count={particlesData.speeds.length}
          array={particlesData.speeds}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
      />
    </points>
  );
};

const ParticlesScene = () => {
  const emitterWidth = 1.5;
  const emitterHeight = 4;
  const startX = 0;
  const particlesArray = new Array(100).fill(null);
  return (
    <div className="w-full h-screen bg-black">
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        {particlesArray.map((_, index) => (
          <SingleParticleFlow
            key={index}
            emitterWidth={emitterWidth}
            emitterHeight={emitterHeight}
            startX={startX}
          />
        ))}
        <OrbitControls enableZoom={true} enablePan={true} />
        <Emitter
          emitterWidth={emitterWidth}
          emitterHeight={emitterHeight}
          startX={startX}
        />
      </Canvas>
    </div>
  );
};

export default ParticlesScene;
