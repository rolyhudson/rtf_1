import { ParallaxBanner } from "react-scroll-parallax";
import HighlightedText from "./HighlightedText";

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
      <HighlightedText text={text} maxChar={charLimit} divName={"text-div"} />
      <HighlightedText
        text={"futures"}
        maxChar={charLimit}
        divName={"title-div"}
      />
    </ParallaxBanner>
  );
};

export default Block;
