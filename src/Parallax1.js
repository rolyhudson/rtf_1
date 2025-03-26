import React, { useRef } from "react";
import { ParallaxProvider } from "react-scroll-parallax";
import Block from "./Block";
import StackCloudPage from "./StackCloudPage";
import ParticlesScene from "./ParticleSingle";

const componentMapping = {
  block: Block,
  stackCloudPage: StackCloudPage,
  pFlow: ParticlesScene,
  //anotherComponent: AnotherComponent, // Example of another component
};

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
          {blocks.map((block, index) => {
            const Component = componentMapping[block.type];

            return (
              <div
                key={index}
                className="block-container"
                ref={(el) => (sectionRefs.current[index] = el)}
              >
                {Component && <Component {...block.props} />}
              </div>
            );
          })}
        </header>
      </ParallaxProvider>
    </main>
  );
};

export default Parallax1;
