import StackCloud from "./StackCloud";
import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Leva } from "leva";
export default function StackCloudPage() {
  return (
    <div className="App">
      <Canvas
        camera={{ position: [100, 0, 75] }}
        style={{ background: "black" }}
      >
        <StackCloud />
        <OrbitControls target={[50, 0, 0]} />
      </Canvas>
      <div className="leva-container">
        <Leva fill collapsed />
      </div>
    </div>
  );
}
