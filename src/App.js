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
import LandingPage from "./LandingPage";
import LocoScroll from "./LocoScroll";
import Scroll2 from "./Scroll2";
import Parallax from "./Parallax";

import texture from "./img/texture.png";
import glitch from "./img/glitch.png";
import subject from "./img/subject.png";
import texture_1 from "./img/texture_1.png";
import glitch_1 from "./img/glitch_1.png";
import subject_1 from "./img/subject_1.png";

const blocks = [
  {
    texture: texture,
    glitch: glitch,
    subject: subject,
    text: "resides in the realm between the possible and impossible",
    charLimit: 30,
  },
  {
    texture: texture_1,
    glitch: glitch_1,
    subject: subject_1,
    text: "we are an experimental design studio that summons the unknown to awaken something new",
    charLimit: 30,
  },
  {
    texture: texture,
    glitch: glitch_1,
    subject: subject,
    text: "activate the users senses by blending the analog and digital worlds, curating experiences that transcend the expected",
    charLimit: 30,
  },
];

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
          <li>
            <Link to="/scroll">LocoScroll</Link>
          </li>
          <li>
            <Link to="/scroll2">Scroll2</Link>
          </li>
          <li>
            <Link to="/scroll3">Scroll3</Link>
          </li>
        </ul>
      </nav>
      <Routes>
        <Route path="/stackcloud" element={<StackCloudPage />} />
        <Route path="/lines" element={<LinesPage />} />
        <Route path="/boxcontroller" element={<BoxControllerPage />} />
        <Route path="/texture" element={<TexturePage />} />
        <Route path="/rtf_1/" element={<LandingPage />} />
        <Route path="/scroll" element={<LocoScroll />} />
        <Route path="/scroll2" element={<Scroll2 />} />
        <Route path="/scroll3" element={<Parallax blocks={blocks} />} />
      </Routes>
    </Router>
  );
}
