import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Lines from "./Lines";
import Particles from "./Particles";
import ThreeContent from "./Render1";
import BoxParticles from "./BoxParticles";
import BoxController from "./BoxController";
import StackCloud from "./StackCloud";

function StackCloudPage() {
  return (
    <div className="App">
      <Canvas
        camera={{ position: [100, 0, 75] }}
        style={{ background: "black" }}
      >
        <StackCloud />
        <OrbitControls target={[50, 0, 0]} />
      </Canvas>
    </div>
  );
}

function LinesPage() {
  return (
    <div className="App">
      <Canvas camera={{ position: [100, 0, 75] }}>
        <Lines />
        <OrbitControls target={[50, 0, 0]} />
      </Canvas>
    </div>
  );
}

function BoxControllerPage() {
  return (
    <div className="App">
      <Canvas camera={{ position: [100, 0, 75] }}>
        <BoxController />
        <OrbitControls target={[50, 0, 0]} />
      </Canvas>
    </div>
  );
}

function TexturePage() {
  return (
    <div className="App">
      <Canvas>
        <ThreeContent />
        <OrbitControls />
      </Canvas>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <nav className="horizontal-nav">
        <ul>
          <li>
            <Link to="/stackcloud">StackCloud</Link>
          </li>
          <li>
            <Link to="/lines">Lines</Link>
          </li>
          <li>
            <Link to="/boxcontroller">BoxController</Link>
          </li>
          <li>
            <Link to="/texture">TexturePage</Link>
          </li>
        </ul>
      </nav>
      <Routes>
        <Route path="/stackcloud" element={<StackCloudPage />} />
        <Route path="/lines" element={<LinesPage />} />
        <Route path="/boxcontroller" element={<BoxControllerPage />} />
        <Route path="/texture" element={<TexturePage />} />
        <Route path="/" element={<div>futures</div>} />
      </Routes>
    </Router>
  );
}
