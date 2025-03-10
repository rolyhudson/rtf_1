import React, { useEffect, useRef } from "react";

const HighlightedText = ({ text, maxChar, divName }) => {
  const textContainerRef = useRef(null);
  useEffect(() => {
    // Function to wrap words in a span
    const wrapWordsInSpans = () => {
      const container = textContainerRef.current;
      if (!container) return;
      const words = container.innerText.split(" ");
      let currentLine = "";
      const lines = [];

      words.forEach((word) => {
        if ((currentLine + word).length > maxChar) {
          lines.push(currentLine.trim());
          currentLine = "";
        }
        currentLine += `${word} `;
      });

      if (currentLine.trim()) {
        lines.push(currentLine.trim());
      }

      container.innerHTML = lines
        .map((line) => `<span>${line}</span>`)
        .join("<br>");
    };

    // Call the function to wrap words in spans
    wrapWordsInSpans();
  }, []);

  return (
    <div className={divName}>
      <div className="highlighted-text" ref={textContainerRef}>
        {text}
      </div>
    </div>
  );
};

export default HighlightedText;
