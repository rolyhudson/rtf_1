import React, { createContext, useContext, useState } from "react";

// Create a context to store points data
const PointContext = createContext();

export const PointProvider = ({ children }) => {
  const [points, setPoints] = useState([]);

  return (
    <PointContext.Provider value={{ points, setPoints }}>
      {children}
    </PointContext.Provider>
  );
};

export const usePoints = () => useContext(PointContext);
