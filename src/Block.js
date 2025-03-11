import { ParallaxBanner } from "react-scroll-parallax";
import HighlightedText from "./HighlightedText";

const wrapWordsInSpans = (sentence, maxChar) => {
  const words = sentence.split(" ");
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

const Block = ({ glitch, texture, subject, title, text, charLimit }) => {
  return (
    <ParallaxBanner
      className="banner"
      layers={[
        { image: subject, speed: -20 },
        { image: glitch, speed: 10 },
        { image: texture, speed: 30 },
      ]}
    >
      <HighlightedText text={text} maxChar={charLimit} divName="text-div" />
      <HighlightedText text="futures" maxChar={charLimit} divName="title-div" />
    </ParallaxBanner>
  );
};

export default Block;
