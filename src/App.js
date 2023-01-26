import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Lines from "./Lines";

export default function App() {
  return (
    <div className="App">
      <div>Lines Mesh</div>
      <Canvas>
        <Lines />
        <OrbitControls />
      </Canvas>
    </div>
  );
}
