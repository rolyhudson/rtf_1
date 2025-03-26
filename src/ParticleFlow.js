import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import Emitter from "./Emitter";

const ParticlesFlow = (props) => {
  const { count = 2000 } = props;
  const points = useRef();

  // Emitter configuration
  const emitterWidth = 1.5; // Width of emitter (x-axis)
  const emitterHeight = 4; // Height of emitter (y-axis)

  // Starting point for the emitter (left side)
  const startX = 0;

  // Length of the visualization area (x-axis)
  const visualizationLength = 8;

  // Generate particles position
  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Random position within emitter bounds
      const x = 0;
      const y = (Math.random() - 0.5) * emitterHeight;
      const z = (Math.random() - 0.5) * emitterWidth;

      positions.set([x, y, z], i * 3);
    }

    return positions;
  }, [count]);

  // Generate particles speed
  const particlesSpeeds = useMemo(() => {
    const speeds = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Random speed between 0.2 and 0.6
      speeds[i] = 0.2 + Math.random() * 0.2;
    }

    return speeds;
  }, [count]);

  // Custom shader material
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
      gl_PointSize = 4.0 * (1.0 - pos.x / ${visualizationLength.toFixed(1)});
      gl_Position = projectionMatrix * mvPosition;
    }
  `;

  const fragmentShader = `
    varying vec3 vPosition;
    
    void main() {
      // Fade particles as they move right
      float alpha = 1.0 - (vPosition.x - ${startX.toFixed(
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
      uTime: {
        value: 0.0,
      },
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
    <>
      {/* Particles */}
      <points ref={points}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particlesPosition.length / 3}
            array={particlesPosition}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-speed"
            count={particlesSpeeds.length}
            array={particlesSpeeds}
            itemSize={1}
          />
        </bufferGeometry>
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      <Emitter
        emitterWidth={emitterWidth}
        emitterHeight={emitterHeight}
        startX={startX}
      />
    </>
  );
};

const ParticlesScene = () => {
  return (
    <div className="w-full h-screen bg-black">
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <ParticlesFlow count={100} />
        <OrbitControls enableZoom={true} enablePan={true} />
      </Canvas>
    </div>
  );
};

export default ParticlesScene;
