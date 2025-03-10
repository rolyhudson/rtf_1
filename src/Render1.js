import { OrbitControls, Plane, useHelper, useTexture } from "@react-three/drei";
import { useControls } from "leva";
import { useEffect, useRef } from "react";
import {
  BufferAttribute,
  LinearEncoding,
  Mesh,
  PointLight,
  PointLightHelper,
  Vector2,
} from "three";
import "./App.css";
function Terrain() {
  const terrainTextures = useTexture({
    map: "/textures/aerial_rocks_01_diff_1k.jpg",
    displacementMap: "/textures/aerial_rocks_01_disp_1k.jpg",
    aoMap: "/textures/aerial_rocks_01_ao_1k.jpg",
    roughnessMap: "/textures/aerial_rocks_01_rough_1k.jpg",
    normalMap: "/textures/aerial_rocks_01_nor_gl_1k.jpg",
  });
  const { displacementScale, aoMapIntensity, roughness, normalScale } =
    useControls({
      displacementScale: {
        value: 1,
        min: -2,
        max: 2,
      },
      aoMapIntensity: {
        value: 1,
        min: 0,
        max: 10,
      },
      roughness: {
        value: 1,
        min: 0,
        max: 1,
      },
      normalScale: [1, 1],
    });
  const mesh = useRef();
  useEffect(() => {
    mesh.current.geometry.setAttribute(
      "uv2",
      new BufferAttribute(mesh.current.geometry.attributes.uv.array, 2)
    );
  });
  return (
    <Plane args={[10, 10, 128, 128]} rotation-x={-Math.PI / 2} ref={mesh}>
      <meshStandardMaterial
        {...terrainTextures}
        normalMap-encoding={LinearEncoding}
        transparent
        displacementScale={displacementScale}
        aoMapIntensity={aoMapIntensity}
        roughness={roughness}
        normalScale={new Vector2(normalScale[0], normalScale[1])}
      />
    </Plane>
  );
}
function ThreeContent() {
  const lightRef = useRef();
  useHelper(lightRef, PointLightHelper, 1, "red");
  return (
    <>
      <ambientLight />
      <pointLight ref={lightRef} position={[5, 5, 0]} intensity={4} />
      <OrbitControls />
      <Terrain />
    </>
  );
}
export default ThreeContent;
