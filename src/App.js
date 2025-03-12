import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import StackCloudPage from "./StackCloudPage";
import "./App.css";
import ParticleScene from "./ParticleScene";
import ParticleFlow from "./ParticleFlow";
import Parallax1 from "./Parallax1";

import texture from "./img/texture.png";
import glitch from "./img/glitch.png";
import subject from "./img/subject.png";
import texture_1 from "./img/texture_1.png";
import glitch_1 from "./img/glitch_1.png";
import subject_1 from "./img/subject_1.png";

const blocks = [
  {
    type: "block",
    props: {
      texture: texture,
      glitch: glitch,
      subject: subject,
      text: "resides in the realm between the possible and impossible",
      charLimit: 30,
    },
  },
  {
    type: "block",
    props: {
      texture: texture_1,
      glitch: glitch_1,
      subject: subject_1,
      text: "we are an experimental design studio that summons the unknown to awaken something new",
      charLimit: 30,
    },
  },
  {
    type: "block",
    props: {
      texture: texture,
      glitch: glitch_1,
      subject: subject,
      text: "activate the users senses by blending the analog and digital worlds, curating experiences that transcend the expected",
      charLimit: 30,
    },
  },
  { type: "stackCloudPage", props: {} },
];

// Fisher-Yates (Knuth) Shuffle Algorithm
const shuffleArray = (array) => {
  let shuffledArray = array.slice(); // Create a copy of the array
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};

export default function App() {
  const [shuffledBlocks, setShuffledBlocks] = useState([]);

  useEffect(() => {
    // Shuffle blocks on component mount
    setShuffledBlocks(shuffleArray(blocks));
  }, [blocks]);

  return (
    <Router>
      <nav className="horizontal-nav">
        <ul>
          <li>
            <Link to="/rtf_1">futures</Link>
          </li>
          <li>
            <Link to="/seq_01">seq_01</Link>
          </li>
          <li>
            <Link to="/seq_02">seq_02</Link>
          </li>
          <li>
            <Link to="/f_cone">f_cone</Link>
          </li>
          <li>
            <Link to="/p_flow">p_flow</Link>
          </li>
        </ul>
      </nav>
      <Routes>
        <Route path="/rtf_1" element={<ParticleScene />} />
        <Route path="/seq_01" element={<Parallax1 blocks={blocks} />} />
        <Route path="/seq_02" element={<Parallax1 blocks={shuffledBlocks} />} />
        <Route path="/f_cone" element={<StackCloudPage />} />
        <Route path="/p_flow" element={<ParticleFlow />} />
      </Routes>
    </Router>
  );
}
