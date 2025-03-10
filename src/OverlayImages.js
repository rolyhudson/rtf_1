import React from "react";
import { useLocomotiveScroll } from "react-locomotive-scroll";

const OverlayImages = ({ imageUrls }) => {
  const containerStyle = {
    position: "relative",
    width: "100%",
    height: "100vh", // Adjust height as needed
  };

  const imageStyle = (url, opacity) => ({
    backgroundImage: `url(${url})`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    opacity: opacity,
  });

  return (
    <div data-scroll-section style={containerStyle}>
      <div
        data-scroll
        data-scroll-speed="1"
        data-scroll-position="top"
        style={imageStyle(imageUrls[0], 1)}
      ></div>
      <div
        data-scroll
        data-scroll-speed="1.5"
        data-scroll-position="top"
        style={imageStyle(imageUrls[1], 0.5)}
      ></div>
      <div
        data-scroll
        data-scroll-speed="2"
        data-scroll-position="top"
        style={imageStyle(imageUrls[2], 0.3)}
      ></div>
    </div>
    // <div style={containerStyle}>
    //   <div style={imageStyle(imageUrls[0], 1)}></div>
    //   <div style={imageStyle(imageUrls[1], 0.7)}></div>
    //   <div style={imageStyle(imageUrls[2], 0.5)}></div>
    //   {/* You can add more images here */}
    // </div>
  );
};

export default OverlayImages;
