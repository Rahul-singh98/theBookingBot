
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
//       <section className="marquee w-full overflow-hidden relative bg-black py-4">
//         <div className="marquee-content flex animate-marquee whitespace-nowrap">
//           {images.map((img, idx) => (
//             <img key={idx} src={img} className="inline-block mx-4" alt={client-logo-${idx + 1}} />
//           ))}
//         </div>
//       </section>
//     );
//   };
  
//   export default MarqueeSection;
  

import React from 'react';
import Image1 from '@/assets/images/c1.png';
import Image2 from '@/assets/images/c2.png';
import Image3 from '@/assets/images/c3.png';
import Image4 from '@/assets/images/c4.png';
import Image5 from '@/assets/images/c5.png';
import Image6 from '@/assets/images/c6.png';

const MarqueeSection = () => {
    const images = [Image1, Image2, Image3, Image4, Image5, Image6];
  
    return (
      <section className="marquee w-full overflow-hidden relative bg-black py-4"style={{ backgroundColor: '#000000' }}>
        <div className="marquee-content flex animate-marquee whitespace-nowrap">
          {images.map((img, idx) => (
            <img key={idx} src={img} className="inline-block mx-4" alt={`client-logo-${idx + 1}`} />
          ))}
        </div>
      </section>
    );
};

export default MarqueeSection;
