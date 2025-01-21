import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Lines from "./Lines";
import Particles from "./Particles";
import ThreeContent from "./Render1";
import BoxParticles from "./BoxParticles";
import BoxController from "./BoxController";
import StackCloud from "./StackCloud";

export default function App() {
  return (
    <div className="App">
      <Canvas camera={{ position: [0, 10, 5] }}>
        {/* <BoxController /> */}
        <StackCloud />
        <OrbitControls />
        {/* <ThreeContent /> */}
      </Canvas>
    </div>
  );
}
