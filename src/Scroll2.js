import { LocomotiveScrollProvider } from "react-locomotive-scroll";
import { useRef } from "react";
import backgroundImage1 from "./img/TestBG1.jpg";
import backgroundImage2 from "./img/TestBG2.jpg";
import backgroundImage3 from "./img/TestBG3.jpg";
import Block from "./Block";
import OverlayImages from "./OverlayImages";

const Scroll2 = () => {
  const containerRef = useRef(null);
  return (
    <LocomotiveScrollProvider
      options={{ smooth: true }}
      watch={[]} // Dependencies to watch for updates
      containerRef={containerRef}
    >
      <div className="scroll" ref={containerRef} data-scroll-container>
        <OverlayImages
          imageUrls={[backgroundImage1, backgroundImage2, backgroundImage3]}
        />
        {/* <Block imageUrl={backgroundImage1} />
        <Block imageUrl={backgroundImage2} /> */}
        {/* <div data-scroll-section>
          <h1 data-scroll data-scroll-speed="3" data-scroll-position="top">
            <img
              src={backgroundImage1}
              alt="Description of Image"
              width="100%"
            />
            Locomotive Scroll in React
          </h1>

          <div data-scroll data-scroll-speed="1" data-scroll-position="center">
            <img
              src={backgroundImage2}
              alt="Description of Image"
              width="100%"
            />
            <p>This is some additional scroll content.</p>
          </div>

          <div data-scroll data-scroll-speed="2" data-scroll-position="bottom">
            <p>This is some additional scroll content.</p>
          </div>

          <div data-scroll data-scroll-speed="-1" data-scroll-position="top">
            <p>This content moves in the opposite direction.</p>
          </div>
        </div> */}
      </div>
    </LocomotiveScrollProvider>
  );
};

export default Scroll2;
