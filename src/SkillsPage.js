import React, { useRef, useState, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import { SingleParticleFlow } from "./ParticleSingle";

function TextComponent(props) {
  const ref = useRef();
  const [hovered, hover] = useState(false);
  const [clicked, click] = useState(false);

  // Subscribe this component to the render-loop, rotate the mesh every frame
  //useFrame((state, delta) => (ref.current.rotation.x += delta));

  return (
    <Text
      {...props}
      ref={ref}
      scale={clicked ? 1.5 : 1}
      color={hovered ? "lightblue" : "white"}
      anchorX="right"
      onClick={(event) => click(!clicked)}
      onPointerOver={(event) => (event.stopPropagation(), hover(true))}
      onPointerOut={(event) => hover(false)}
    >
      {props.children}
    </Text>
  );
}

export default function SkillsPage() {
  // Full list of skills
  const skills = [
    "Urban Planning",
    "Landscape Architecture",
    "Interior Design",
    "Sustainable Design",
    "Fine Arts",
    "Digital Art",
    "Performance Art",
    "Multimedia Art",
    "Conceptual Art",
    "Marketing",
    "Graphic Design",
    "User Experience (UX) Design",
    "Corporate Identity",
    "Strategic Communication",
    "Artificial Intelligence",
    "Cybersecurity",
    "Software Engineering",
    "Machine Learning",
    "Quantum Computing",
    "Statistical Analysis",
    "Business Intelligence",
    "Machine Learning",
    "Data Visualization",
    "Predictive Analytics",
    "Mechanical Engineering",
    "Electrical Engineering",
    "Aerospace Engineering",
    "Biomedical Engineering",
    "Environmental Engineering",
    "Advanced Manufacturing",
    "3D Printing",
    "Rapid Prototyping",
    "Industrial Design",
    "Materials Science",
    "Future Studies",
    "Design Futures",
    "Critical Design",
    "Experimental Design",
    "Emerging Technologies",
    "Narrative Design",
    "Transmedia Storytelling",
    "Interactive Storytelling",
    "Digital Storytelling",
    "Content Strategy",
    "Graphic Design",
    "Motion Graphics",
    "Information Design",
    "Illustration",
    "User Interface (UI) Design",
    "Cloud Computing",
    "Network Architecture",
    "Distributed Systems",
    "Internet of Things (IoT)",
    "Blockchain Technology",
  ];
  const [randomSkills, setRandomSkills] = useState([]);
  const refreshInterval = 1500; //

  // Function to get random skills
  const getRandomSkills = () => {
    const shuffled = [...skills].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 9);
  };

  // Create stable particle positions
  const particlePositions = useMemo(() => {
    const verticalSpacing = 0.5;
    return new Array(9)
      .fill(null)
      .map((_, skillIndex) => (skillIndex - 4) * verticalSpacing);
  }, []); // Empty dependency array ensures this is created only once

  // Initial skills and periodic refresh
  useEffect(() => {
    // Set initial skills
    setRandomSkills(getRandomSkills());

    // Set up interval to refresh skills
    const intervalId = setInterval(() => {
      setRandomSkills(getRandomSkills());
    }, refreshInterval);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  // Stable array of particle flows
  const particlesArray = useMemo(() => new Array(5).fill(null), []);

  return (
    <div className="App h-screen w-full">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />

        {randomSkills.map((skill, skillIndex) => {
          const y = particlePositions[skillIndex];

          return (
            <React.Fragment key={skill}>
              {particlesArray.map((_, particleIndex) => (
                <SingleParticleFlow
                  key={`${skillIndex}-${particleIndex}`}
                  emitterWidth={0}
                  emitterHeight={y}
                  startY={y}
                  startX={0.3}
                />
              ))}
              <TextComponent position={[0, y, 0]} fontSize={0.2}>
                {skill}
              </TextComponent>
            </React.Fragment>
          );
        })}

        <OrbitControls />
      </Canvas>
    </div>
  );
}
