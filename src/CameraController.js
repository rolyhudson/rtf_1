import React, { useRef, useEffect } from "react";
import { useThree } from "@react-three/fiber";

const CameraController = ({ lookAtPosition }) => {
  const { camera } = useThree();
  const lookAtRef = useRef(lookAtPosition);
  useEffect(() => {
    // Check if the lookAtPosition has changed
    if (JSON.stringify(lookAtPosition) !== JSON.stringify(lookAtRef.current)) {
      lookAtRef.current = lookAtPosition;
      // If so, update the camera's lookAt
      camera.lookAt(...lookAtPosition);
      camera.updateProjectionMatrix();
    }
  }, [camera, lookAtPosition]);

  return null;
};

export default CameraController;
