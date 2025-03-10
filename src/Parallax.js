import React, { useEffect, useRef, useState } from "react";
import { ParallaxProvider } from "react-scroll-parallax";
import Block from "./Block";

const Parallax = ({ blocks }) => {
  const containerRef = useRef(null);
  const sectionRefs = useRef([]);
  const [largestElement, setLargestElement] = useState(null);
  const [isManualScroll, setIsManualScroll] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (isManualScroll) return;

        let largestInView = null;

        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const element = entry.target;
            const rect = element.getBoundingClientRect();
            const size = rect.width * rect.height;

            if (!largestInView || size > largestInView.size) {
              largestInView = { element, size };
            }
          }
        });

        if (largestInView) {
          setLargestElement(largestInView.element);
        }
      },
      {
        root: container,
        threshold: 0.5, // Adjust as needed
      }
    );

    const items = container.querySelectorAll(".block-container");
    items.forEach((item) => observer.observe(item));

    return () => {
      items.forEach((item) => observer.unobserve(item));
    };
  }, [isManualScroll]);

  useEffect(() => {
    if (largestElement && !isManualScroll) {
      largestElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [largestElement, isManualScroll]);

  const handleNavigationClick = (index) => {
    setIsManualScroll(true);
    sectionRefs.current[index].scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    setTimeout(() => {
      setIsManualScroll(false);
    }, 1000); // Wait for the scroll to finish
  };
  //
  return (
    <main ref={containerRef} style={{ overflowY: "scroll", height: "100vh" }}>
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

export default Parallax;
