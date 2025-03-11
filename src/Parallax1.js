import React, { useEffect, useRef, useState } from "react";
import { ParallaxProvider } from "react-scroll-parallax";
import Block from "./Block";

const Parallax1 = ({ blocks }) => {
  const sectionRefs = useRef([]);

  const handleNavigationClick = (index) => {
    sectionRefs.current[index].scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };
  //
  return (
    <main>
      <ParallaxProvider>
        <nav>
          <ul className="parallax-nav">
            {blocks.map((_, index) => (
              <li key={index} onClick={() => handleNavigationClick(index)}>
                {index + 1}
              </li>
            ))}
          </ul>
        </nav>
        <header>
          {blocks.map((block, index) => (
            <div
              key={index}
              className="block-container"
              ref={(el) => (sectionRefs.current[index] = el)}
            >
              <Block
                texture={block.texture}
                glitch={block.glitch}
                subject={block.subject}
                text={block.text}
                charLimit={block.charLimit}
              />
            </div>
          ))}
        </header>
      </ParallaxProvider>
    </main>
  );
};

export default Parallax1;
