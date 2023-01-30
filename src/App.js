import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Lines from "./Lines";
import ThreeContent from "./Render1";

export default function App() {
  return (
    <div className="App">
      <div>Lines Mesh</div>
      <Canvas camera={{ position: [0, 10, 5] }}>
        {/* <Lines />
        <OrbitControls /> */}
        <ThreeContent />
      </Canvas>
    </div>
  );
}
