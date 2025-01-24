import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";

/***************************************************/

function TextComponent(props) {
  // This reference gives us direct access to the THREE.Mesh object
  const ref = useRef();
  // Hold state for hovered and clicked events
  const [hovered, hover] = useState(false);
  const [clicked, click] = useState(false);
  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame((state, delta) => (ref.current.rotation.x += delta));
  // Return the view, these are regular Threejs elements expressed in JSX
  return (
    <Text
      {...props}
      ref={ref}
      scale={clicked ? 1.5 : 1}
      color={hovered ? "hotpink" : "orange"}
      onClick={(event) => click(!clicked)}
      onPointerOver={(event) => (event.stopPropagation(), hover(true))}
      onPointerOut={(event) => hover(false)}
    >
      futures
    </Text>
  );
}

export default function LandingPage() {
  //useEffect(() => {}, []);

  return (
    <div className="App">
      <Canvas>
        <TextComponent position={[1.2, 0, 0]} />
        <OrbitControls />
      </Canvas>
    </div>
  );
}
