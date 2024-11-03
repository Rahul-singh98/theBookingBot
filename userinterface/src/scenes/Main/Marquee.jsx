import React from "react";
import Image1 from "@/assets/images/c1.png";
import Image2 from "@/assets/images/c2.png";
import Image3 from "@/assets/images/c3.png";
import Image4 from "@/assets/images/c4.png";
import Image5 from "@/assets/images/c5.png";
import Image6 from "@/assets/images/c6.png";

const MarqueeSection = () => {
  const images = [Image1, Image2, Image3, Image4, Image5, Image6];

  const marqueeStyle = {
    width: "100%",
    overflow: "hidden",
    backgroundColor: "#FFFFFF", // White background
    padding: "1rem 0",
    position: "relative",
  };

  const marqueeContentStyle = {
    display: "flex",
    animation: "marquee 20s linear infinite", // Adjust speed here
    whiteSpace: "nowrap",
  };

  const keyframes = `
    @keyframes marquee {
      0% {
        transform: translateX(0);
      }
      100% {
        transform: translateX(-50%); // Move left by half the width of the content
      }
    }
  `;

  // Create a style tag for keyframes
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = keyframes;
  document.head.appendChild(styleSheet);

  return (
    <section style={marqueeStyle}>
      <div style={marqueeContentStyle}>
        {/* First set of images */}
        {images.map((img, idx) => (
          <img
            key={idx}
            src={img}
            className="inline-block"
            alt={`client-logo-${idx + 1}`}
            style={{ margin: "0 16px" }}
          />
        ))}
        {/* Second set of images (clone) */}
        {images.map((img, idx) => (
          <img
            key={`clone-${idx}`}
            src={img}
            className="inline-block"
            alt={`client-logo-${idx + 1}`}
            style={{ margin: "0 16px" }}
          />
        ))}
      </div>
    </section>
  );
};

export default MarqueeSection;
