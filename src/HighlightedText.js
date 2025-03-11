import React, { useEffect, useRef } from "react";

const HighlightedText = ({ text, maxChar, divName }) => {
  const textContainerRef = useRef(null);

  useEffect(() => {
    const wrapWordsInSpans = (words, maxChar) => {
      const lines = [];
      let currentLine = "";

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

      return lines.map((line) => `<span>${line}</span>`).join("<br>");
    };

    const container = textContainerRef.current;
    if (!container) return;

    const words = text.split(" ");
    container.innerHTML = wrapWordsInSpans(words, maxChar);
  }, [text, maxChar]);

  return <div className={divName} ref={textContainerRef}></div>;
};

export default HighlightedText;
