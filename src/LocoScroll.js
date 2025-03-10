import React, { useEffect, useRef } from "react";
import locomotiveScroll from "locomotive-scroll";
import backgroundImage from "./img/TestBG1.jpg";

const LocoScroll = () => {
  const scrollRef = useRef(null);

  useEffect(() => {
    // Initialize locomotive scroll
    const scroll = new locomotiveScroll({
      el: scrollRef.current,
      smooth: true,
      lerp: 0.1, // adjust easing as needed
      multiplier: 1, // adjust speed as needed
    });

    return () => {
      // Cleanup locomotive scroll on component unmount
      if (scroll) scroll.destroy();
    };
  }, []);

  return (
    <div className="scroll" ref={scrollRef} data-scroll-container>
      <div data-scroll-section>
        <h1 data-scroll data-scroll-speed="3" data-scroll-position="top">
          Locomotive Scroll in React
        </h1>

        <div data-scroll data-scroll-speed="1" data-scroll-position="center">
          {/* <img src={backgroundImage} alt="Description of Image" width="100%" /> */}
          <p>This is some additional scroll content.</p>
        </div>

        <div data-scroll data-scroll-speed="2" data-scroll-position="bottom">
          <p>This is some additional scroll content.</p>
        </div>

        <div data-scroll data-scroll-speed="-1" data-scroll-position="top">
          <p>This content moves in the opposite direction.</p>
        </div>
      </div>
    </div>
  );
};

export default LocoScroll;
