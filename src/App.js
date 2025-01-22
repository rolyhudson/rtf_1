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
      <Canvas
        camera={{ position: [100, 0, 75] }}
        style={{ background: "black" }}
      >
        {/* <BoxController /> */}
        <StackCloud />
        <OrbitControls target={[50, 0, 0]} />
        {/* <ThreeContent /> */}
      </Canvas>
    </div>
  );
}
