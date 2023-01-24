import { Canvas } from "@react-three/fiber";
import { coords } from "./capMarkers";
import { OrbitControls } from "@react-three/drei";
import {
  BufferAttribute,
  BufferGeometry,
  Float32BufferAttribute,
  Matrix4,
} from "three";

export default function App() {
  const bufferGeo = new BufferGeometry();
  bufferGeo.setAttribute("position", new Float32BufferAttribute(coords, 3));

  bufferGeo.computeBoundingSphere();
  let center = bufferGeo.boundingSphere.center;
  bufferGeo.applyMatrix4(new Matrix4().makeRotationX(-Math.PI / 2));
  bufferGeo.translate(-center.x, -center.y, -center.z);
  return (
    <div className="App">
      <Canvas
        camera={{
          fov: 35,
          position: [35438, 0, 35438],
          far: 71000,
          near: 1,
          aspect: window.innerWidth / window.innerHeight,
        }}
      >
        <lineSegments visible geometry={bufferGeo}>
          <lineBasicMaterial attach="material" color="black" />
        </lineSegments>

        <OrbitControls />
      </Canvas>
    </div>
  );
}
