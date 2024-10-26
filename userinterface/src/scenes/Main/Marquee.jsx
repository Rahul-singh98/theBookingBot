

// import React from 'react';
// import Image1 from '@/assets/images/c1.png';
// import Image2 from '@/assets/images/c2.png';
// import Image3 from '@/assets/images/c3.png';
// import Image4 from '@/assets/images/c4.png';
// import Image5 from '@/assets/images/c5.png';
// import Image6 from '@/assets/images/c6.png';

// const MarqueeSection = () => {
//     const images = [Image1, Image2, Image3, Image4, Image5, Image6];
  
//     return (
//       <section className="marquee w-full overflow-hidden relative bg-black py-4"style={{ backgroundColor: '#000000' }}>
//         <div className="marquee-content flex animate-marquee whitespace-nowrap">
//           {images.map((img, idx) => (
//             <img key={idx} src={img} className="inline-block mx-4" alt={`client-logo-${idx + 1}`} />
//           ))}
//         </div>
//       </section>
//     );
// };

// export default MarqueeSection;

import React from 'react';
import Image1 from '@/assets/images/c1.png';
import Image2 from '@/assets/images/c2.png';
import Image3 from '@/assets/images/c3.png';
import Image4 from '@/assets/images/c4.png';
import Image5 from '@/assets/images/c5.png';
import Image6 from '@/assets/images/c6.png';

const MarqueeSection = () => {
  const images = [Image1, Image2, Image3, Image4, Image5, Image6];

  const marqueeStyle = {
    width: '100%',
    overflow: 'hidden',
    backgroundColor: '#FFFFFF', // White background
    padding: '1rem 0',
    position: 'relative',
  };

  const marqueeContentStyle = {
    display: 'flex',
    animation: 'marquee 20s linear infinite', // Adjust speed here
    whiteSpace: 'nowrap',
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
          <img key={idx} src={img} className="inline-block" alt={`client-logo-${idx + 1}`} style={{ margin: '0 16px' }} />
        ))}
        {/* Second set of images (clone) */}
        {images.map((img, idx) => (
          <img key={`clone-${idx}`} src={img} className="inline-block" alt={`client-logo-${idx + 1}`} style={{ margin: '0 16px' }} />
        ))}
      </div>
    </section>
  );
};

export default MarqueeSection;


// import React, { useState, useEffect } from 'react';
// import Image1 from '@/assets/images/c1.png';
// import Image2 from '@/assets/images/c2.png';
// import Image3 from '@/assets/images/c3.png';
// import Image4 from '@/assets/images/c4.png';
// import Image5 from '@/assets/images/c5.png';
// import Image6 from '@/assets/images/c6.png';

// const MarqueeSection = () => {
//   const [currentIndex, setCurrentIndex] = useState(0);
  
//   // Use the imported images in the array
//   const images = [Image1, Image2, Image3, Image4, Image5, Image6];

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
//     }, 3000);

//     return () => clearInterval(timer);
//   }, []);

//   return (
//     <div className="w-full bg-black py-4 overflow-hidden">
//       <div className="flex items-center justify-start gap-8 animate-[scroll_20s_linear_infinite]">
//         {/* Duplicate the images array to create a seamless loop */}
//         {[...images, ...images].map((img, idx) => (
//           <div
//             key={idx}
//             className="flex-shrink-0 transition-transform duration-300 hover:scale-110"
//           >
//             <img
//               src={img}
//               alt={`Client Logo ${(idx % images.length) + 1}`}
//               className="h-20 w-auto object-contain"
//             />
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default MarqueeSection;
