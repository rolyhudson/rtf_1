import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useMemo, useRef, useEffect } from "react";
import CameraController from "./CameraController";
import Emitter from "./Emitter";
import * as THREE from "three";

const SingleParticleFlow = ({ emitterWidth, emitterHeight, startX }) => {
  const points = useRef();

  const particleSpeed = useMemo(() => {
    const s = 0.2 + Math.random() * 1.4;
    //console.log("speed value:", s);
    return s;
  }, []);

  // Length of the visualization area (x-axis)
  const visualizationLength = 20;

  //set original X and Y
  const originalY = useMemo(() => {
    return (Math.random() - 0.5) * emitterHeight;
  }, [emitterHeight]);

  const originalZ = useMemo(() => {
    return (Math.random() - 0.5) * emitterWidth;
  }, [emitterWidth]);

  const veerOffX = useMemo(() => {
    const x = Math.random() * visualizationLength;

    return x;
  }, [visualizationLength]);

  const veerOffAngle = useMemo(() => {
    // Convert degrees to radians for a 5-degree increment
    const incrementInRadians = 15 * (Math.PI / 180);
    // Determine the number of increments between -45 and +45 degrees (inclusive)
    const increments = 45 / 15;
    // Generate a random integer between -increments and +increments
    const randomInt =
      Math.floor(Math.random() * (2 * increments + 1)) - increments;
    // Calculate the angle in radians
    const randomVeerOffAngle = randomInt * incrementInRadians;

    return randomVeerOffAngle;
  }, []);

  // Generate initial particle positions and speeds
  const particlesData = useMemo(() => {
    const nParticles = 500;
    const positions = new Float32Array(nParticles * 3); // 30 particles in the trail
    const speeds = new Float32Array(nParticles); // 30 particles in the trail
    for (let i = 0; i < nParticles; i++) {
      const x = startX + i * 0.01; // Slightly offset each particle in X axis to create a trail effect

      positions.set([x, originalY, originalZ], i * 3);
      speeds[i] = particleSpeed;
    }

    return { positions, speeds };
  }, [startX, originalY, originalZ, particleSpeed]);

  // Shader code updated for a single particle
  const vertexShader = `
    uniform float uSpeed;
    uniform float uOriginalY;
    uniform float uOriginalX;
    uniform float uVeerOffX; 
    uniform float uVeerOffAngle;
    
    uniform float uTime;
    
    varying vec3 vPosition;
    
    void main() {
      vPosition = position;
      
      // Calculate new x position based on time and speed
      vec3 pos = position;

      pos.x += uSpeed * uTime;  
      //set x in the range
      pos.x = mod(pos.x, ${visualizationLength.toFixed(1)}) + ${startX.toFixed(
    1
  )};
      // Check if the trail should veer off  
      if (pos.x > uVeerOffX) {   
        float deltax = pos.x - uVeerOffX;
        pos.y += deltax * tan(uVeerOffAngle); // Update y position based on the angle  
      }

      float epsilon = 0.01; // A small value to account for floating-point precision  
      if (abs(pos.x - ${startX.toFixed(1)}) < epsilon) {  
        pos.y = uOriginalY;  
      } 

      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      float baseSize = 15.0;
      gl_PointSize = baseSize * (1.0 - pos.x / ${visualizationLength.toFixed(
        1
      )});
      gl_Position = projectionMatrix * mvPosition;
    }
  `;

  const fragmentShader = `
    varying vec3 vPosition;
    
    void main() {
      // Calculate alpha based on the particle's x position to fade out as they move  
      float alpha = (vPosition.x - ${startX.toFixed(
        1
      )}) / ${visualizationLength.toFixed(1)}; 
      // Fade particles as they move right
      alpha = clamp(alpha, 0.0, 1.0); // Ensure alpha is between 0 and 1  
  
      // Interpolate between two colors based on alpha  
      vec3 startColor = vec3(1, 1, 0);
      vec3 endColor = vec3(1, 1, 1);  
      vec3 color = mix(startColor, endColor, alpha);  
      
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
      uVeerOffX: { value: veerOffX },
      uOriginalY: { value: originalY },
      uOriginalZ: { value: originalZ },
      uVeerOffAngle: { value: veerOffAngle },
      uSpeed: { value: particleSpeed },
    }),
    [veerOffX, veerOffAngle, originalY, originalZ, particleSpeed]
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

// Custom hook to create and configure the camera
function useCamera(fov, aspect, near, far, position, lookAt) {
  // Memoize the camera to prevent it from being recreated on every render
  const camera = useMemo(() => {
    const cam = new THREE.PerspectiveCamera(fov, aspect, near, far);
    cam.position.set(...position);
    cam.lookAt(...lookAt);
    return cam;
  }, [fov, aspect, near, far, position, lookAt]);

  useEffect(() => {
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };

    window.addEventListener("resize", handleResize);

    // Call this function on cleanup when the component unmounts
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [camera]); // camera is stable and won't change on every render

  return camera;
}

const ParticlesScene = () => {
  // Define camera properties
  const fov = 60;
  const aspect = window.innerWidth / window.innerHeight; // Ensure this updates on window resize
  const near = 0.1;
  const far = 1000;
  const position = [10, 0, 5];
  const lookAt = [0, 0, 0];

  // Create the camera using our custom hook
  const camera = useCamera(fov, aspect, near, far, position, lookAt);

  const emitterWidth = 1.5;
  const emitterHeight = 4;
  const startX = 0;
  const particlesArray = new Array(25).fill(null);
  return (
    <div className="w-full h-screen bg-black">
      <Canvas camera={camera}>
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
