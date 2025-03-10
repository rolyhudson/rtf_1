import { useControls } from "leva";

export const StackControls = () => {
  return useControls({
    maxPts: { value: 9, min: 2, max: 200 },
    minPts: { value: 4, min: 2, max: 200 },
    nStacks: { value: 9, min: 1, max: 50, step: 1 },
    stackDim: { value: 4, min: 2, max: 10 },
    coneHeight: { value: 100, min: 2, max: 100 },
    coneRadius: { value: 30, min: 2, max: 100 },
    particleSpeed: { value: 0.02, min: 0.001, max: 0.2 },
  });
};
